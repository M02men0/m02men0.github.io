# Portfolio editor

The editor runs at [lading-page01.vercel.app/admin/](https://lading-page01.vercel.app/admin/) on the same Vercel project as the public portfolio. The GitHub Pages copy of `/admin/` links to Vercel. The editor accepts only GitHub account ID `98442887` (M02men0). A GitHub App user token lets the editor write to the repository during your session. The token is stored in an encrypted, HttpOnly cookie.

## Turn on sign-in

1. In [GitHub App settings](https://github.com/settings/apps/new), create a private GitHub App. If you already created an app for the portfolio editor, update that app. Set the homepage to `https://lading-page01.vercel.app/admin/` and the callback URL to `https://lading-page01.vercel.app/api/portfolio/callback`. Enable expiration of user authorization tokens. Leave webhooks and device flow disabled. Grant **Repository permissions → Contents → Read and write**. Keep installation limited to your account and install the app on **only** `M02men0/m02men0.github.io`.
2. In the [Vercel project environment settings](https://vercel.com/moemens-projects-30d10e90/lading-page01/settings/environment-variables), add the following variables to **Production**. Use the GitHub App's Client ID and a Client secret from the app settings. Generate the session key locally with `openssl rand -base64 32`. Store all three values in Vercel.

   | Name | Value |
   | --- | --- |
   | `GITHUB_CLIENT_ID` | The GitHub App's Client ID |
   | `GITHUB_CLIENT_SECRET` | The GitHub App's Client secret |
   | `SESSION_KEY` | Base64-encoded random 32-byte key |

3. Deploy the Production branch with the new environment variables. Then [open the editor](https://lading-page01.vercel.app/admin/) and sign in as M02men0.

If you move the editor to a different canonical domain, set the optional `EDITOR_ORIGIN` Production variable to that origin (HTTPS, with no trailing slash or path). Update the GitHub App homepage and callback URL and the GitHub Pages fallback link in `admin/index.html`.

## Edit and publish

Select, add, or remove a project. You can change its categories, rewrite the description, add JPEG/PNG/WebP photos, and set whether it appears on the site. Enter alt text for each photo. New projects start hidden. Hidden projects and their photos remain public in the repository if committed there.

**Publish changes** saves project data, the generated portfolio cards and photo changes in one commit to `main`. The connected deployments pick up that commit. If someone has changed the branch since you opened the editor, the editor rejects the save and keeps your changes on screen. Copy unsaved changes you want to keep before reloading.

Vercel's Functions limit the total request to 4.5 MB. The editor allows up to 4 MB of photos per publish and checks the size of the project data and upload together. If needed, compress your photos or publish them in batches. Removing an uploaded photo also removes its file from the current branch if no other project uses it. Git history retains prior versions.

## Verify locally

Run `node --test admin/backend.test.mjs` for the backend tests with simulated GitHub responses. Run `npm run build` to verify the public portfolio and editor pages both build. These checks require no credentials.
