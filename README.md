# Desktab website

Official, static, bilingual (English / Turkish) website for **Desktab**, a native Windows application that turns real folders into desktop-style workspaces.

This repository contains **only the public website**. It does not contain the Desktab application source code.

- Site: <https://nevzatius.github.io/desktab-site/>
- Microsoft Store: <https://apps.microsoft.com/detail/9P05F9J6TJ1R> (Free available; Pro purchasing not available yet)
- Privacy Policy: <https://nevzatius.github.io/desktab-site/privacy/>
- Support: <https://nevzatius.github.io/desktab-site/support/>

## Structure

```
docs/                     <- published by GitHub Pages
  index.html              English home        /
  tr/index.html           Turkish home        /tr/
  privacy/index.html      Privacy (EN)        /privacy/
  privacy/tr/index.html   Privacy (TR)        /privacy/tr/
  support/index.html      Support (EN)        /support/
  support/tr/index.html   Support (TR)        /support/tr/
  assets/styles.css       the only stylesheet
  assets/images/          favicon and social preview image
  404.html, robots.txt, sitemap.xml, .nojekyll
.github/ISSUE_TEMPLATE/   public bug-report and feedback forms
scripts/set-contact-email.ps1   changes the contact email everywhere
```

No framework, no build step, no JavaScript, no external requests (system fonts only), no cookies, no analytics.

All internal links are **relative**, so the site works under the project path `/desktab-site/`, under a custom domain, and from a local preview. Only `<link rel="canonical">`, `hreflang`, Open Graph URLs, `sitemap.xml` and `404.html` use the absolute `https://nevzatius.github.io/desktab-site/` address; if the site moves to a custom domain, replace that prefix in those places.

## Screenshots

`docs/assets/images/app-{main,nav,dark}-{en,tr}.png` are real captures of a pre-release build of the Desktab app (English and Turkish interface), taken with demo files: all folder and file names are made up and the images are abstract gradients. The test/QA badge was removed from the capture build. Show only features that are part of Free (two workspaces, light/dark, static image background); do not add screenshots of Pro-only features until Pro is released. `og-image.png` is the social preview image.

## Contact email

The public contact address is shown on the Support pages (EN/TR) and in the Privacy Policy (EN/TR, sections 8, 10 and 13), as `mailto:` links. To change it everywhere at once:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\set-contact-email.ps1 -Old old@example.com -New new@example.com
git diff
```

Review the diff and commit. The address is plain text in the HTML (no JavaScript), so it can be harvested by spam bots, and once pushed it remains in the public git history.

## Preview locally

Any static file server works. With Python:

```powershell
python -m http.server 8080 --directory docs
```

Then open <http://localhost:8080/>. (Opening the files directly with `file://` works for pages but not for folder links such as `privacy/`, which need a server to resolve `index.html`.)

## Deploy with GitHub Pages

1. Repository **Settings → Pages**.
2. **Build and deployment → Source: Deploy from a branch**.
3. **Branch: `main`**, folder **`/docs`**, then **Save**.
4. Wait for the deployment to finish (Actions tab shows "pages build and deployment"), then open the site URL. Enable **Enforce HTTPS** if it is not already on.
5. Enable **Issues** (Settings → General → Features), since the Support page points to them.

## Add another language (for example German, Russian or Polish)

1. Copy `docs/tr/index.html` to `docs/<code>/index.html` and the privacy and support pages to `docs/privacy/<code>/` and `docs/support/<code>/`.
2. Translate the content, set `<html lang="<code>">`, `og:locale`, and the language switcher.
3. Add the new URLs as `hreflang` alternates on **every** page of the other languages, and in `sitemap.xml`.
4. Have the Privacy Policy translation reviewed by a native speaker before publishing; do not publish machine-translated legal text.

## Content rules

- Desktab Free is available at the verified Microsoft Store URL above. Keep that URL as the only download destination on the home and Support pages.
- Do not display a Pro price until it is final. Pro remains **planned, unreleased** and unavailable to purchase until it actually ships.
- The Privacy Policy must be re-checked against the application whenever the application's data handling changes.
- No analytics, trackers, or third-party embeds.
