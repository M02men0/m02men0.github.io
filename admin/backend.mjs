import {maxPhotoBytes, maxRequestBytes, photoExtension, photoFolder, projectContent, renderPortfolio, validateProjects} from './projects.mjs';

const sessionName = '__Host-portfolio_session';
const stateName = '__Host-portfolio_oauth';
const utf8 = new TextEncoder();
const decoder = new TextDecoder();

class RequestError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const security = {
  'Cache-Control': 'no-store',
  'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' blob: https://raw.githubusercontent.com; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex'
};
const json = (value, status = 200) => Response.json(value, {status, headers: security});

function redirect(path, cookies = []) {
  const headers = new Headers({...security, Location: path});
  for (const cookie of cookies) headers.append('Set-Cookie', cookie);
  return new Response(null, {status: 303, headers});
}

function cookie(name, value, age) {
  return `${name}=${value}; Path=/; Max-Age=${age}; HttpOnly; Secure; SameSite=Lax`;
}

function readCookie(request, name) {
  return (request.headers.get('Cookie') || '').split(';').map(part => part.trim())
    .find(part => part.startsWith(name + '='))?.slice(name.length + 1);
}

function encode(bytes) {
  // Chunk the conversion to stay below the argument limit for uploaded images.
  let binary = '';
  for (let i = 0; i < bytes.length; i += 8192) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  }
  return btoa(binary);
}
const decode = base64 => Uint8Array.from(atob(base64), char => char.charCodeAt(0));
const url64 = bytes => encode(bytes).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
const fromUrl64 = value => decode(value.replaceAll('-', '+').replaceAll('_', '/'));
const random = () => url64(crypto.getRandomValues(new Uint8Array(32)));

async function sessionKey(env) {
  const bytes = decode(env.SESSION_KEY || '');
  if (bytes.length !== 32) throw new Error('Invalid session key');
  return crypto.subtle.importKey('raw', bytes, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

async function seal(value, name, env) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const bytes = await crypto.subtle.encrypt(
    {name: 'AES-GCM', iv, additionalData: utf8.encode(name)},
    await sessionKey(env),
    utf8.encode(JSON.stringify(value))
  );
  return url64(iv) + '.' + url64(new Uint8Array(bytes));
}

async function unseal(request, name, env) {
  const value = readCookie(request, name);
  if (!value) return null;
  try {
    const [iv, data] = value.split('.').map(fromUrl64);
    const bytes = await crypto.subtle.decrypt(
      {name: 'AES-GCM', iv, additionalData: utf8.encode(name)}, await sessionKey(env), data
    );
    const result = JSON.parse(decoder.decode(bytes));
    return result.expires > Date.now() ? result : null;
  } catch {
    return null;
  }
}

async function startLogin(origin, env) {
  const state = random();
  const verifier = random();
  const challenge = url64(new Uint8Array(await crypto.subtle.digest('SHA-256', utf8.encode(verifier))));
  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.search = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID, state, redirect_uri: origin + '/api/portfolio/callback',
    code_challenge: challenge, code_challenge_method: 'S256'
  });
  const proof = await seal({state, verifier, expires: Date.now() + 600_000}, stateName, env);
  return redirect(authorize.href, [cookie(stateName, proof, 600)]);
}

async function github(path, token, method = 'GET', body) {
  const headers = new Headers({
    Authorization: 'Bearer ' + token,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'Moemen-Portfolio-Editor'
  });
  if (body) headers.set('Content-Type', 'application/json');
  const response = await fetch('https://api.github.com' + path, {
    headers, method, body: body && JSON.stringify(body), redirect: 'error'
  });
  if (!response.ok) {
    if (response.status === 401) throw new RequestError(401, 'Your GitHub session expired. Sign in again.');
    if ([409, 422].includes(response.status)) {
      throw new RequestError(409, 'GitHub rejected the update. Reload before trying again.');
    }
    if (response.status === 403 || response.status === 404) {
      throw new RequestError(403, 'GitHub denied access. Check the app installation and repository permissions.');
    }
    throw new RequestError(502, 'GitHub is temporarily unavailable.');
  }
  return response.json();
}

async function finishLogin(request, url, env) {
  const removeState = cookie(stateName, '', 0);
  const proof = await unseal(request, stateName, env);
  const code = url.searchParams.get('code');
  if (!proof || !code || proof.state !== url.searchParams.get('state')) {
    return redirect('/admin/?auth=retry', [removeState]);
  }
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST', redirect: 'error', headers: {Accept: 'application/json'},
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET,
        code, code_verifier: proof.verifier, redirect_uri: url.origin + '/api/portfolio/callback'
      })
    });
    const {access_token: token, expires_in: lifetime} = await response.json();
    if (!response.ok || !token) return redirect('/admin/?auth=retry', [removeState]);
    const user = await github('/user', token);
    if (String(user.id) !== env.GITHUB_OWNER_ID) {
      return redirect('/admin/?auth=denied', [removeState, cookie(sessionName, '', 0)]);
    }
    const age = Math.min(3600, Number(lifetime) || 3600);
    const session = await seal({id: String(user.id), token, expires: Date.now() + age * 1000}, sessionName, env);
    return redirect('/admin/', [removeState, cookie(sessionName, session, age)]);
  } catch {
    return redirect('/admin/?auth=retry', [removeState]);
  }
}

function repository(env, token) {
  const base = '/repos/' + env.GITHUB_REPOSITORY;
  const branch = encodeURIComponent(env.GITHUB_BRANCH);
  return {
    getHead: async () => (await github(base + '/git/ref/heads/' + branch, token)).object.sha,
    async read(path, sha) {
      const result = await github(base + '/contents/' + path + '?ref=' + sha, token);
      return decoder.decode(decode(result.content));
    },
    async publish(baseSha, files) {
      const parent = await github(base + '/git/commits/' + baseSha, token);
      const tree = await github(base + '/git/trees', token, 'POST', {base_tree: parent.tree.sha, tree: files});
      const commit = await github(base + '/git/commits', token, 'POST', {
        message: 'Update portfolio projects', tree: tree.sha, parents: [baseSha]
      });
      await github(base + '/git/refs/heads/' + branch, token, 'PATCH', {sha: commit.sha, force: false});
      return commit.sha;
    },
    async blob(bytes) {
      return (await github(base + '/git/blobs', token, 'POST', {content: encode(bytes), encoding: 'base64'})).sha;
    }
  };
}

async function readForm(request) {
  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.startsWith('multipart/form-data;') || !request.body) {
    throw new RequestError(400, 'Expected a multipart project update.');
  }
  if (Number(request.headers.get('Content-Length')) > maxRequestBytes) {
    throw new RequestError(413, 'Reduce the size of your photos or publish them in smaller batches.');
  }
  let size = 0;
  const limited = request.body.pipeThrough(new TransformStream({
    transform(chunk, controller) {
      size += chunk.byteLength;
      if (size > maxRequestBytes) controller.error(new RequestError(413, 'Reduce the size of your photos or publish them in smaller batches.'));
      else controller.enqueue(chunk);
    }
  }));
  try {
    return await new Response(limited, {headers: {'Content-Type': contentType}}).formData();
  } catch (err) {
    if (err instanceof RequestError) throw err;
    throw new RequestError(400, 'The upload could not be read.');
  }
}

async function publish(request, repo) {
  const form = await readForm(request);
  const revision = form.get('revision');
  if (!/^[a-f0-9]{40}$/.test(revision || '') || revision !== await repo.getHead()) {
    throw new RequestError(409, 'The portfolio has changed. Reload the editor before publishing.');
  }
  const [source, index] = await Promise.all([repo.read(projectContent, revision), repo.read('index.html', revision)]);
  const currentPaths = new Set(JSON.parse(source).flatMap(project => project.photos.map(photo => photo.path)));
  const uploaded = new Map();
  const files = [];
  let total = 0;
  for (const [key, file] of form) {
    if (key === 'projects' || key === 'revision') continue;
    const id = key.replace(/^photo:/, '');
    if (!/^photo:[a-f0-9-]{36}$/.test(key) || uploaded.has(id) ||
      typeof file === 'string' || !file.size || file.size > maxPhotoBytes) {
      throw new RequestError(400, 'Upload JPEG, PNG or WebP photos up to 4 MB each.');
    }
    total += file.size;
    if (total > maxPhotoBytes) throw new RequestError(413, 'Reduce the size of your photos or publish them in smaller batches.');
    const bytes = new Uint8Array(await file.arrayBuffer());
    const extension = photoExtension(bytes);
    if (!extension) throw new RequestError(400, 'Use a JPEG, PNG or WebP photo.');
    uploaded.set(id, {path: photoFolder + crypto.randomUUID() + '.' + extension, bytes});
  }
  let projects;
  try {
    const paths = new Map([...uploaded].map(([id, value]) => [id, value.path]));
    projects = validateProjects(JSON.parse(form.get('projects')), currentPaths, paths);
  } catch (err) {
    throw new RequestError(400, err instanceof TypeError ? err.message : 'The project data could not be read.');
  }
  const retained = new Set(projects.flatMap(project => project.photos.map(photo => photo.path)));
  const nextSource = JSON.stringify(projects, null, 2) + '\n';
  const nextIndex = renderPortfolio(index, projects);
  if (source === nextSource && index === nextIndex) return json({revision, projects, published: false});

  for (const {path, bytes} of uploaded.values()) {
    if (retained.has(path)) files.push({path, type: 'blob', mode: '100644', sha: await repo.blob(bytes)});
  }
  for (const path of currentPaths) {
    if (path.startsWith(photoFolder) && !retained.has(path)) files.push({path, type: 'blob', mode: '100644', sha: null});
  }
  files.push(
    {path: projectContent, type: 'blob', mode: '100644', content: nextSource},
    {path: 'index.html', type: 'blob', mode: '100644', content: nextIndex}
  );
  return json({revision: await repo.publish(revision, files), projects, published: true});
}

function configured(env) {
  return Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET && env.SESSION_KEY);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      const {pathname} = url;
      if (url.origin !== env.EDITOR_ORIGIN) {
        return json({error: 'Open the production portfolio editor to sign in.', editorUrl: env.EDITOR_ORIGIN + '/admin/'}, 421);
      }
      if (request.method === 'POST' && request.headers.get('Origin') !== url.origin) {
        throw new RequestError(403, 'Open the editor directly before changing the portfolio.');
      }
      if (!configured(env)) {
        throw new RequestError(503, 'The editor is waiting for GitHub sign-in to be configured.');
      }
      if (pathname === '/api/portfolio/login' && request.method === 'GET') return await startLogin(url.origin, env);
      if (pathname === '/api/portfolio/callback' && request.method === 'GET') return await finishLogin(request, url, env);
      if (pathname === '/api/portfolio/logout' && request.method === 'POST') return redirect('/admin/', [cookie(sessionName, '', 0)]);
      if (pathname === '/api/portfolio/projects') {
        const session = await unseal(request, sessionName, env);
        if (!session || session.id !== env.GITHUB_OWNER_ID) throw new RequestError(401, 'Sign in with GitHub to edit.');
        const repo = repository(env, session.token);
        if (request.method === 'GET') {
          const revision = await repo.getHead();
          return json({revision, projects: JSON.parse(await repo.read(projectContent, revision))});
        }
        if (request.method === 'POST') return await publish(request, repo);
      }
      return json({error: 'Page not found.'}, 404);
    } catch (err) {
      if (err instanceof RequestError) return json({error: err.message}, err.status);
      return json({error: 'The portfolio editor could not complete this request.'}, 500);
    }
  }
};
