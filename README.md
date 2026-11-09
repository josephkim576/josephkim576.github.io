# Joseph Y. Kim — Engineering Portfolio

Static site (plain HTML, CSS, JS — no build step) for GitHub Pages.

## Publish in 5 minutes
1. On GitHub, create a **public** repo named `YOUR-USERNAME.github.io` (this gives you `https://YOUR-USERNAME.github.io`). Any other repo name also works and is served at `/REPO-NAME/`.
2. Upload everything in this folder (`index.html`, `style.css`, `script.js`, `.nojekyll`, `assets/`) to the repo root.
3. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `(root)` → Save**.
4. Wait about a minute, then open the URL. Put that URL on your resume header, LinkedIn and email signature.

## Fill in the placeholders
Anything still unfinished shows as a **dashed gold highlight** in `[brackets]`. The browser console also reports how many remain. Search the files for `[` to find them.

| Where | What to change |
|---|---|
| `index.html` | Email (`your.name@purdue.edu`), LinkedIn and GitHub URLs (search `your-handle`), hero stat tile `[##%]`, achievements, project cards, resume bullets, skills, GPA |
| `script.js` → `PROJECTS` | The full case-study pop-up text for each project |
| `assets/headshot.jpg` | Optional portrait (square, ~800px). It appears automatically; if missing, the JK monogram shows |
| `assets/projects/*.jpg` | Optional photos named `hyrobotics.jpg`, `fsae.jpg`, `materials.jpg`, `manufacturing.jpg` (16:9). They overlay the blueprint illustrations automatically |
| `assets/Joseph_Kim_Resume.pdf` | Your real resume PDF. Once present, every "Download resume" button serves it. Without it, the buttons open a one-page print view (Save as PDF) |

## Features
- Recruiter snapshot card: role, school, grad date and contact visible in the first screen
- Light/dark theme (follows system, remembers choice), scroll progress bar, active-section highlighting
- Filterable project cards that open into problem / what I did / result / reflection case studies
- Command palette (`Ctrl/⌘ K` or `/`) to jump to any section or project
- Print stylesheet that turns the resume section into a clean one-page PDF
- Respects reduced-motion, keyboard accessible, responsive down to phone width

## Tips that matter more than the design
- Lead every bullet with a number: time saved, cost cut, parts made, tolerance held.
- 3 well-documented projects beat 7 thin ones. Delete cards you cannot back with detail.
- Add real photos, CAD renders and test plots to each case study. Recruiters scan visuals first.
- Remove any placeholder you do not fill. Never publish with brackets showing.
