# BOLO – Music, Live TV, Movies, News & Dream Hub

One installable app by Kutullo Angel Media. All files live in one folder (no sub-folders), so they upload straight to GitHub.

## 1. Put the app online (GitHub Pages)
1. On github.com create a new repository (Public).
2. **Add file > Upload files**. Select ALL the files from this folder (including `.nojekyll`) and tap **Commit changes**.
3. **Settings > Pages > Deploy from a branch > main / (root) > Save**.
4. After about a minute your app is live at `https://YOURNAME.github.io/REPOSITORY/`.
5. Open the link on your phone in Chrome and tap **Install BOLO**. On iPhone: Safari > Share > Add to Home Screen.

## 2. Switch on BOLO Insider (movie chat) safely
The secret Groq key is NOT stored in this app. It lives in a free Cloudflare Worker (`worker.js`).
1. console.groq.com > API Keys: create a NEW key.
2. dash.cloudflare.com > Workers & Pages > Create > Create Worker. Name it `bolo-insider`, Deploy, then **Edit code**, paste everything from `worker.js`, Deploy.
3. Worker > Settings > Variables and Secrets:
   - Secret `GROQ_API_KEY` = your new key
   - Text `ALLOWED_ORIGIN` = `https://YOURNAME.github.io`
4. Copy the worker address (ends in `workers.dev`). On GitHub open `movies.html`, find `const GROQ_PROXY_URL = '';`, paste the address between the quotes, Commit.

## 3. Protect your YouTube key
Google Cloud Console > Credentials > your key > Application restrictions: Websites > add `https://YOURNAME.github.io/*`. API restrictions: YouTube Data API v3 only.

## Updating
Upload the changed file with the same name. If an old version still shows, change `bolo-v2` to `bolo-v3` in `sw.js` and commit.
