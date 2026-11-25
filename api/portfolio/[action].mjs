import backend from '../../admin/backend.mjs';

const config = {
  EDITOR_ORIGIN: process.env.EDITOR_ORIGIN || 'https://lading-page01.vercel.app',
  GITHUB_REPOSITORY: 'M02men0/m02men0.github.io',
  GITHUB_BRANCH: 'main',
  GITHUB_OWNER_ID: '98442887',
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  SESSION_KEY: process.env.SESSION_KEY
};

export default {
  fetch(request) {
    return backend.fetch(request, config);
  }
};
