export const categories = ['software', 'embedded', 'robotics'];
export const maxPhotoBytes = 4_000_000;
export const maxRequestBytes = 4_400_000;
export const projectContent = 'content/projects.json';
export const photoFolder = 'public/assets/projects/';

const entities = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
export const escapeHtml = value => value.replace(/[&<>"']/g, character => entities[character]);

export function renderPortfolio(html, projects) {
  const start = '<!-- projects:start -->';
  const end = '<!-- projects:end -->';
  const first = html.indexOf(start);
  const last = html.indexOf(end);
  if (first < 0 || last <= first || html.lastIndexOf(start) !== first || html.lastIndexOf(end) !== last) {
    throw new Error('The portfolio project markers are missing or duplicated.');
  }
  const cards = projects.filter(project => project.visible).map(project => {
    const title = escapeHtml(project.title);
    const heading = project.url ? `<a href="${escapeHtml(project.url)}">${title} ↗</a>` : title;
    const photos = project.photos.map(({path, alt}) =>
      `<img loading="lazy" src="${escapeHtml(path)}" alt="${escapeHtml(alt)}">`
    );
    const gallery = photos.length > 1
      ? `<div class="project-gallery" tabindex="0" role="region" aria-label="${title} photos">${photos.join('')}</div>`
      : photos.join('');
    const subtitle = project.subtitle ? `<small>${escapeHtml(project.subtitle)}</small>` : '';
    return `      <article data-area="${project.areas.join(' ')}">${gallery}<div class="cardbody">${subtitle}<h3>${heading}</h3><p>${escapeHtml(project.description)}</p></div></article>`;
  });
  return html.slice(0, first + start.length) + '\n' +
    (cards.length ? cards.join('\n') : '      <p>No projects to show yet.</p>') +
    '\n      ' + html.slice(last);
}

export function photoExtension(bytes) {
  const matches = (offset, signature) => signature.every((byte, index) => bytes[offset + index] === byte);
  if (matches(0, [255, 216, 255])) return 'jpg';
  if (matches(0, [137, 80, 78, 71, 13, 10, 26, 10])) return 'png';
  if (matches(0, [82, 73, 70, 70]) && matches(8, [87, 69, 66, 80])) return 'webp';
  return null;
}

export function validateProjects(input, existingPaths, uploadedPaths) {
  const fail = message => { throw new TypeError(message); };
  const field = (value, max, name, required = false) => {
    if (typeof value !== 'string' || value.length > max || (required && !value.trim())) {
      fail(`Enter a valid ${name} (${max} characters maximum).`);
    }
    return value.trim();
  };
  if (!Array.isArray(input) || input.length > 100) fail('Use at most 100 projects.');
  const ids = new Set();
  return input.map(item => {
    if (!item || typeof item !== 'object') fail('Invalid project.');
    const id = field(item.id, 80, 'project ID', true);
    if (!/^[a-z0-9-]+$/.test(id) || ids.has(id)) fail('Project IDs must be unique.');
    ids.add(id);
    const title = field(item.title, 120, 'title', true);
    const subtitle = field(item.subtitle, 140, 'subtitle');
    const description = field(item.description, 3000, 'description', true);
    const url = field(item.url, 1000, 'link');
    if (url) {
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'https:' || parsed.username || parsed.password) throw new Error();
      } catch {
        fail('Project links must be valid HTTPS URLs.');
      }
    }
    if (typeof item.visible !== 'boolean') fail('Invalid project visibility.');
    if (!Array.isArray(item.areas) || !item.areas.length || !item.areas.every(area => categories.includes(area))) {
      fail('Choose at least one category for each project.');
    }
    if (!Array.isArray(item.photos) || item.photos.length > 12) fail('Use at most 12 photos per project.');
    const photos = item.photos.map(photo => {
      const path = photo && (photo.upload ? uploadedPaths.get(photo.upload) : photo.path);
      if (!path || (!photo.upload && !existingPaths.has(path))) fail('A project photo could not be found.');
      return {path, alt: field(photo.alt, 240, 'photo alt text', true)};
    });
    return {id, title, subtitle, description, url, visible: item.visible, areas: [...new Set(item.areas)], photos};
  });
}
