# wRVU Counter

Static progressive web app for logging radiology exams and tracking professional-component work RVUs.

- **Version:** 1.0.0
- **Data:** CMS CY2026 Medicare PFS RVU file, October release (RVU26D, `PPRRVU2026_Oct_nonQPP`, released 08/26/2026). 712 codes + 5 combos.

Hosted from the `main` branch root:

https://thenuts1.github.io/wrvu-counter/

All URLs are relative, so the app works at that path. Serve over HTTPS with no auth wall. The manifest should be `application/manifest+json` (or `application/json`). An empty `.nojekyll` file keeps GitHub Pages from running Jekyll.

## Install

- **iPhone:** open in Safari, then Share → Add to Home Screen.
- **Android:** Chrome menu → Install app / Add to Home screen.

Exam data stays on the device (IndexedDB, with a localStorage fallback). Back up from Settings regularly; nothing syncs between devices.

## Updating

Change the files, then bump `VERSION` in `sw.js` so installed phones fetch the new cache.
