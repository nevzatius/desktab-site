# Desktab website

Official, static, bilingual (English / Turkish) website for **Desktab**, a native Windows application that turns real folders into desktop-style workspaces.

This repository contains **only the public website**. It does not contain the Desktab application source code.

- Site: <https://nevzatius.github.io/desktab-site/> (after GitHub Pages is enabled)
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
```

No framework, no build step, no JavaScript, no external requests (system fonts only), no cookies, no analytics.

All internal links are **relative**, so the site works under the project path `/desktab-site/`, under a custom domain, and from a local preview. Only `<link rel="canonical">`, `hreflang`, Open Graph URLs, `sitemap.xml` and `404.html` use the absolute `https://nevzatius.github.io/desktab-site/` address; if the site moves to a custom domain, replace that prefix in those places.

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

- Do not state that Desktab is downloadable until a real Microsoft Store URL is confirmed. Then add that URL (and only that) to the home pages and the Support page.
- Do not display a Pro price until it is final.
- The Privacy Policy must be re-checked against the application whenever the application's data handling changes.
- No analytics, trackers, or third-party embeds.
