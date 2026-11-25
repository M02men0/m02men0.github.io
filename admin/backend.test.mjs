import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import backend from './backend.mjs';
import {renderPortfolio} from './projects.mjs';

const currentSource = readFileSync(new URL('../content/projects.json', import.meta.url), 'utf8');
const currentIndex = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const fixture = ['Test quadcopter', 'Test tracker'].map((title, id) => ({
  id: 'project-' + id, title, subtitle: '', description: 'Sample description.',
  url: '', visible: true, areas: ['robotics'], photos: []
}));
const source = JSON.stringify(fixture, null, 2) + '\n';
const index = renderPortfolio(currentIndex, fixture);
const env = {
  EDITOR_ORIGIN: 'https://editor.example.com',
  GITHUB_REPOSITORY: 'M02men0/m02men0.github.io',
  GITHUB_BRANCH: 'main',
  GITHUB_OWNER_ID: '98442887',
  GITHUB_CLIENT_ID: 'test-client',
  GITHUB_CLIENT_SECRET: 'test-secret',
  SESSION_KEY: Buffer.alloc(32, 3).toString('base64')
};
const origin = 'https://editor.example.com';
const revision = 'a'.repeat(40);
const nextRevision = 'b'.repeat(40);

const invoke = (path, init) => backend.fetch(new Request(origin + path, init), env);
const extractCookie = (response, name) => response.headers.getSetCookie()
  .find(value => value.startsWith(name + '='))?.split(';')[0];

async function oauth() {
  const response = await invoke('/api/portfolio/login');
  assert.equal(response.status, 303);
  assert.match(response.headers.getSetCookie()[0], /HttpOnly; Secure; SameSite=Lax/);
  const target = new URL(response.headers.get('Location'));
  assert.equal(target.host, 'github.com');
  assert.equal(target.searchParams.get('code_challenge_method'), 'S256');
  assert.equal(target.searchParams.get('redirect_uri'), origin + '/api/portfolio/callback');
  const proof = extractCookie(response, '__Host-portfolio_oauth');
  return state => invoke('/api/portfolio/callback?code=test-code&state=' + (state || target.searchParams.get('state')),
    {headers: {Cookie: proof}});
}

test('the published cards match the project data', () => {
  assert.equal(renderPortfolio(currentIndex, JSON.parse(currentSource)), currentIndex);
});

test('only the production origin can use the editor and sign-in requires configuration', async () => {
  const request = new Request(origin + '/api/portfolio/projects');
  const wrongOrigin = await backend.fetch(request, {...env, EDITOR_ORIGIN: 'https://production.example.com'});
  assert.equal(wrongOrigin.status, 421);
  assert.equal((await wrongOrigin.json()).editorUrl, 'https://production.example.com/admin/');
  assert.equal((await backend.fetch(request, {...env, SESSION_KEY: undefined})).status, 503);
});

test('login and publishing enforce account ownership, origin, revision, and atomic writes', async t => {
  let account = 123;
  let exchanges = 0;
  let head = revision;
  let trees = [];
  t.mock.method(globalThis, 'fetch', async (input, init = {}) => {
    const url = new URL(input);
    const reply = data => Response.json(data);
    if (url.hostname === 'github.com') {
      assert.equal(url.pathname, '/login/oauth/access_token');
      assert.ok(init.body.get('code_verifier'));
      exchanges++;
      return reply({access_token: 'server-only-token', expires_in: 28800});
    }
    assert.equal(url.hostname, 'api.github.com');
    assert.equal(init.headers.get('Authorization'), 'Bearer server-only-token');
    if (url.pathname === '/user') return reply({id: account});
    if (url.pathname.endsWith('/git/ref/heads/main')) return reply({object: {sha: head}});
    if (url.pathname.includes('/contents/')) {
      const content = url.pathname.endsWith('index.html') ? index : source;
      return reply({content: Buffer.from(content).toString('base64')});
    }
    if (url.pathname.endsWith('/git/blobs')) return reply({sha: 'uploaded-photo'});
    if (url.pathname.endsWith('/git/commits/' + revision)) return reply({tree: {sha: 'base-tree'}});
    if (url.pathname.endsWith('/git/trees')) {
      trees.push(JSON.parse(init.body));
      return reply({sha: 'next-tree'});
    }
    if (url.pathname.endsWith('/git/commits')) {
      assert.deepEqual(JSON.parse(init.body).parents, [revision]);
      return reply({sha: nextRevision});
    }
    if (url.pathname.endsWith('/git/refs/heads/main')) {
      assert.deepEqual(JSON.parse(init.body), {sha: nextRevision, force: false});
      head = nextRevision;
      return reply({});
    }
    throw new Error('Unexpected GitHub call ' + url.pathname);
  });

  const missing = await invoke('/api/portfolio/projects');
  assert.equal(missing.status, 401);
  assert.equal((await invoke('/api/portfolio/projects', {method: 'POST', headers: {Origin: origin}})).status, 401);

  const denied = await oauth();
  assert.equal((await denied('wrong-state')).headers.get('Location'), '/admin/?auth=retry');
  assert.equal(exchanges, 0);
  assert.equal((await denied()).headers.get('Location'), '/admin/?auth=denied');
  account = Number(env.GITHUB_OWNER_ID);
  const allowed = await oauth();
  const authorized = await allowed();
  assert.equal(authorized.headers.get('Location'), '/admin/');
  const cookie = extractCookie(authorized, '__Host-portfolio_session');
  assert.ok(cookie && !cookie.includes('server-only-token'));
  assert.equal((await invoke('/api/portfolio/projects', {headers: {Cookie: cookie + 'tampered'}})).status, 401);

  const existing = await invoke('/api/portfolio/projects', {headers: {Cookie: cookie}});
  assert.equal(existing.status, 200);
  const {projects} = await existing.json();
  assert.deepEqual(projects, fixture);

  const publish = (body, referer = origin) =>
    invoke('/api/portfolio/projects', {method: 'POST', headers: {Cookie: cookie, Origin: referer}, body});
  const form = new FormData();
  form.set('revision', revision);
  projects[0].visible = false;
  projects[1].title = '<img src=x onerror=alert(1)>';
  const upload = '261d5f68-937b-493e-a1e2-930228d9cc61';
  projects[1].photos.push({upload, alt: 'Test image'});
  form.set('projects', JSON.stringify(projects));
  form.append('photo:' + upload, new Blob([new Uint8Array([255, 216, 255, 224])]), 'photo.jpg');

  assert.equal((await publish(form, 'https://elsewhere.example')).status, 403);
  const oversized = new FormData();
  oversized.set('revision', revision);
  oversized.set('projects', JSON.stringify(projects));
  oversized.append('photo:' + upload, new Blob([new Uint8Array(4_400_000)]), 'large.jpg');
  assert.equal((await publish(oversized)).status, 413);
  const saved = await publish(form);
  assert.equal(saved.status, 200);
  assert.equal((await saved.json()).revision, nextRevision);
  assert.equal(trees.length, 1);
  const entries = trees[0].tree;
  const html = entries.find(file => file.path === 'index.html').content;
  const photo = entries.find(file => file.sha === 'uploaded-photo');
  assert.match(photo.path, /^public\/assets\/projects\/.*\.jpg$/);
  assert.ok(html.includes(photo.path) && html.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(!html.includes('Test quadcopter'));
  assert.equal((await publish(form)).status, 409);
  assert.equal(trees.length, 1);
});
