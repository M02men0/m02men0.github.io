import {maxPhotoBytes, maxRequestBytes} from '../projects.mjs';

const get = selector => document.querySelector(selector);
const workspace = get('#workspace');
const controls = get('#workspace-controls');
const status = get('#status');
const list = get('#list');
const details = get('#details');
const repositoryAssets = 'https://raw.githubusercontent.com/M02men0/m02men0.github.io/';
const pending = new Map();
let revision;
let projects = [];
let currentId;
let dirty = false;

function setDirty(value) {
  dirty = value;
  get('#publish').disabled = !dirty;
  if (dirty) status.textContent = 'You have unpublished changes.';
}

function renderList() {
  list.replaceChildren();
  for (const project of projects) {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = (project.title || 'Untitled project') + (project.visible ? '' : ' · Hidden');
    if (project.id === currentId) button.setAttribute('aria-current', 'true');
    button.addEventListener('click', () => renderProject(project.id));
    item.append(button);
    list.append(item);
  }
  get('#add-project').disabled = projects.length >= 100;
}

function discardUpload(id) {
  const upload = pending.get(id);
  if (!upload) return;
  URL.revokeObjectURL(upload.url);
  pending.delete(id);
}

function renderPhotos(project) {
  const panel = get('#photos');
  panel.replaceChildren();
  for (const [index, photo] of project.photos.entries()) {
    const row = document.createElement('div');
    row.className = 'photo';
    const image = document.createElement('img');
    image.src = photo.upload ? pending.get(photo.upload).url : new URL(photo.path, repositoryAssets + revision + '/').href;
    image.alt = '';
    const label = document.createElement('label');
    label.textContent = 'Alt text';
    const alt = document.createElement('input');
    alt.value = photo.alt;
    alt.maxLength = 240;
    alt.required = true;
    alt.addEventListener('input', () => {
      photo.alt = alt.value;
      setDirty(true);
    });
    label.append(alt);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Remove photo';
    remove.setAttribute('aria-label', 'Remove photo ' + (index + 1));
    remove.addEventListener('click', () => {
      project.photos.splice(index, 1);
      discardUpload(photo.upload);
      renderPhotos(project);
      setDirty(true);
      get('#files').focus();
    });
    row.append(image, label, remove);
    panel.append(row);
  }
}

function renderProject(id) {
  const project = projects.find(item => item.id === id);
  currentId = project?.id;
  renderList();
  if (!project) {
    details.textContent = 'Select a project or add a new one.';
    return;
  }
  details.replaceChildren(get('#fields').content.cloneNode(true));
  for (const name of ['title', 'subtitle', 'description', 'url']) {
    const input = details.querySelector(`[name="${name}"]`);
    input.value = project[name];
    input.addEventListener('input', () => {
      project[name] = input.value;
      setDirty(true);
      if (name === 'title') renderList();
    });
  }
  const visible = get('[name="visible"]');
  visible.checked = project.visible;
  visible.addEventListener('change', () => {
    project.visible = visible.checked;
    renderList();
    setDirty(true);
  });
  for (const input of details.querySelectorAll('[name="areas"]')) {
    input.checked = project.areas.includes(input.value);
    input.addEventListener('change', () => {
      project.areas = [...details.querySelectorAll('[name="areas"]:checked')].map(field => field.value);
      setDirty(true);
    });
  }
  get('[data-remove]').addEventListener('click', () => {
    if (!window.confirm('Remove this project from the portfolio on the next publish?')) return;
    for (const photo of project.photos) discardUpload(photo.upload);
    projects = projects.filter(item => item !== project);
    renderProject(projects[0]?.id);
    setDirty(true);
    get('#add-project').focus();
  });
  get('#files').addEventListener('change', event => {
    const input = event.currentTarget;
    const files = [...input.files];
    input.value = '';
    const size = [...pending.values()].reduce((total, entry) => total + entry.file.size, 0);
    if (project.photos.length + files.length > 12) {
      status.textContent = 'Use at most 12 photos per project.';
      return;
    }
    if (files.some(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
      !file.size || file.size > maxPhotoBytes)) {
      status.textContent = 'Choose JPEG, PNG or WebP photos up to 4 MB each.';
      return;
    }
    if (size + files.reduce((total, file) => total + file.size, 0) > maxPhotoBytes) {
      status.textContent = 'Upload up to 4 MB of photos per publish.';
      return;
    }
    for (const file of files) {
      const upload = crypto.randomUUID();
      pending.set(upload, {file, url: URL.createObjectURL(file)});
      project.photos.push({upload, alt: ''});
    }
    renderPhotos(project);
    setDirty(true);
  });
  renderPhotos(project);
}

async function load() {
  try {
    const response = await fetch('/api/portfolio/projects');
    const productionEditor = get('#production-editor');
    if (response.status === 404 && location.hostname.endsWith('.github.io')) {
      productionEditor.hidden = false;
      status.textContent = 'Manage your projects on the Vercel deployment.';
      return;
    }
    if (response.status === 421) {
      const {editorUrl} = await response.json();
      productionEditor.href = editorUrl;
      productionEditor.hidden = false;
      status.textContent = 'Open the production editor to sign in.';
      return;
    }
    if (response.status === 401) {
      get('#sign-in').hidden = false;
      const problem = new URLSearchParams(location.search).get('auth');
      status.textContent = problem === 'denied' ? 'This GitHub account is not authorized to edit.' :
        problem === 'retry' ? 'GitHub sign-in did not complete. Try again.' : 'Sign in to manage your portfolio.';
      return;
    }
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    ({revision, projects} = data);
    workspace.hidden = false;
    get('#sign-out').hidden = false;
    setDirty(false);
    renderProject(projects[0]?.id);
    status.textContent = 'Select a project to edit, or add a new one.';
  } catch (error) {
    status.textContent = error.message || 'The editor could not load.';
  }
}

get('#add-project').addEventListener('click', () => {
  const project = {
    id: crypto.randomUUID(), title: '', subtitle: '', description: '', url: '',
    visible: false, areas: [], photos: []
  };
  projects.push(project);
  renderProject(project.id);
  setDirty(true);
  get('[name="title"]').focus();
});

workspace.addEventListener('submit', async event => {
  event.preventDefault();
  if (!dirty) return;
  const incomplete = projects.find(project => !project.title.trim() || !project.description.trim() ||
    !project.areas.length || project.photos.some(photo => !photo.alt.trim()));
  if (incomplete) {
    renderProject(incomplete.id);
    status.textContent = 'Each project needs a title, description, category and alt text for every photo.';
    return;
  }
  const payload = JSON.stringify(projects);
  const photoBytes = [...pending.values()].reduce((total, {file}) => total + file.size, 0);
  // Leave room for multipart boundaries, file headers, and the revision field.
  const estimatedBytes = new Blob([payload]).size + photoBytes + pending.size * 2048 + 2048;
  if (estimatedBytes > maxRequestBytes) {
    status.textContent = 'Reduce the size of your photos or publish them in smaller batches.';
    return;
  }
  const form = new FormData();
  form.set('revision', revision);
  form.set('projects', payload);
  for (const [id, {file}] of pending) form.append('photo:' + id, file);
  controls.disabled = true;
  status.textContent = 'Publishing to GitHub…';
  try {
    const response = await fetch('/api/portfolio/projects', {method: 'POST', body: form});
    if (response.status === 413) throw new Error('The upload is too large. Publish fewer photos at a time.');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    ({revision, projects} = data);
    for (const id of pending.keys()) discardUpload(id);
    setDirty(false);
    renderProject(currentId);
    status.textContent = data.published ? 'Saved to GitHub. The portfolio will update after deployment.' : 'No changes to publish.';
  } catch (error) {
    status.textContent = error.message || 'Publishing failed. Your edits are still open.';
  } finally {
    controls.disabled = false;
  }
});

window.addEventListener('beforeunload', event => {
  if (dirty) event.preventDefault();
});
load();
