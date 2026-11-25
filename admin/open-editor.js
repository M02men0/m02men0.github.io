async function showEditorLink() {
  const status = document.querySelector('#availability');
  try {
    const response = await fetch('config.json', { cache: 'no-store' });
    if (!response.ok) throw new Error();
    const {editorUrl} = await response.json();
    if (!editorUrl) {
      status.textContent = 'The editor is waiting for GitHub sign-in to be configured.';
      return;
    }
    const url = new URL(editorUrl);
    if (url.protocol !== 'https:') throw new Error();
    const link = document.querySelector('#editor');
    link.href = url.href;
    link.hidden = false;
    status.textContent = 'Sign in with GitHub to manage your projects.';
  } catch {
    status.textContent = 'The editor link is temporarily unavailable.';
  }
}
showEditorLink();
