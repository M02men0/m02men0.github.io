# Portfolio editor

GitHub Pages serves the public portfolio from `main`. The owner signs in to a separate Worker, which accepts only GitHub account ID `98442887` (M02men0). A GitHub App user token gives the Worker access to the selected repository for each signed-in session. The Worker keeps the token in an encrypted, HttpOnly cookie.

## Activate the editor

1. Sign in to Cloudflare and enable a `workers.dev` subdomain if prompted. From the repository root, run `npx wrangler login`, then `npx wrangler deploy --config admin/wrangler.toml`. Record the HTTPS Worker URL Wrangler prints. The editor needs its GitHub credentials to sign in.
2. In [GitHub App settings](https://github.com/settings/apps/new), create a private GitHub App. Set the homepage to the Worker URL and the callback URL to that same URL followed by `/auth/callback`. Enable expiration of user authorization tokens. Leave webhooks and device flow disabled. Grant **Repository permissions → Contents → Read and write**. Metadata read access is added automatically. Keep installation limited to your account and install the app on **only** `M02men0/m02men0.github.io`.
3. Copy the GitHub App's **Client ID** (distinct from App ID) and generate a **Client secret** in the app settings. From the repository root run the following commands and enter the values when prompted. Keep the secret out of the repository and chat.

   ```sh
   npx wrangler secret put GITHUB_CLIENT_ID --config admin/wrangler.toml
   npx wrangler secret put GITHUB_CLIENT_SECRET --config admin/wrangler.toml
   openssl rand -base64 32 | npx wrangler secret put SESSION_KEY --config admin/wrangler.toml
   ```

4. Set `editorUrl` in [admin/config.json](config.json) to the HTTPS Worker URL and commit it to `main`. Once Pages deploys, visit [the portfolio editor](https://m02men0.github.io/admin/) and sign in as M02men0. You should see the current projects. If you sign in with a different GitHub account, the editor denies access.

## Edit and publish

Select, add, or remove a project. You can change its categories, write a description, add JPEG/PNG/WebP photos, and set whether it appears on the site. Enter alt text for each photo. You can review the edits in the editor before publishing. New projects start hidden. Hidden projects and their photos remain public in the repository if committed there.

**Publish changes** updates `content/projects.json`, project cards in `index.html`, and uploaded photos in one commit. GitHub Pages then deploys the new version. If the branch moved, the editor rejects the save and keeps your changes on screen. Copy unsaved changes you want to keep before reloading.

Uploads are limited to 5 MB per photo and 15 MB total per publish. Removing an uploaded photo deletes its file from the current branch if no other project uses it. Git history retains prior versions. Existing portfolio images outside the upload folder can still be referenced by previous commits or other pages.

## Verify locally

Run `node --test admin/worker.test.mjs` from the repository root. The checks simulate GitHub OAuth and repository operations. They require no credentials.
