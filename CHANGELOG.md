# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

- Refreshing or opening a project or unit page directly from its link now shows the page instead of a 404 error. (BEA-91)
- The projects section on the home page is now displayed in a card even when projects exist, and the two home page sections are clearly spaced apart. (BEA-90)

### Security

---

## [0.4.0] - 2026-10-14

Fourth release of BearMiniPainting.

### Added

- You can now attach notes to each miniature to keep track of your ideas, with markdown display and a 1500-character limit (BEA-83).

- You can now rename a project directly from its page, the same way you rename a unit, so fixing a typo takes seconds (BEA-68).

- The "Almost there!" section now lists the remaining tasks of each miniature, so you know exactly what is left to finish (BEA-84).

### Changed

- The "Almost there!" section is now highlighted at the top of the home page with an inspiring eco message, so you stay motivated to finish what you started (BEA-64).

- The "Almost there!" section now shows your miniatures from 65% completion instead of 75%, so you can track your advanced units sooner (BEA-85).

### Deprecated

### Removed

### Fixed

- Importing a backup now also rejects files containing duplicate project ids or units attached to the wrong project, so your restored data is always consistent (BEA-59).

- Notifications no longer collide with each other when several appear at once, so each can be closed individually (BEA-54).

- Adding a unit now shows an error message instead of a false success message when the project cannot be found, so you know the unit is not visible yet (BEA-52).

### Security

---
## [0.3.0] - 2026-09-25

Third release of BearMiniPainting.

### Added

- The home page now shows an "Almost there!" section with your most advanced unfinished miniatures (75% and above, up to 3), so you know what to finish before starting something new (BEA-48).
- A global navigation bar is now displayed on every page, giving quick access to Settings, About and the Changelog from anywhere in the app (BEA-60, BEA-61, BEA-62).
- New Settings page to save all your painting data as a backup file and restore it later, with a clear warning before anything is replaced (BEA-46).
- The unit form now shows a clear error message right away when the unit code contains invalid characters (BEA-22).

### Changed

- The home page now displays projects as cards sorted by progress, so you see your most advanced projects first (BEA-47).
- Importing a backup now checks the file and explains what is wrong (duplicate codes, unknown projects) before replacing any data (BEA-50).

### Fixed

### Security

---

## [0.2.0] - 2026-09-18

Second release of BearMiniPainting.

### Added
- New "About" page presenting the project description and its features, reachable from the footer (BEA-39).
- Rename a unit after its creation via inline editing on the unit details page (BEA-38).
- Toggle to show/hide completed (DONE) todos on the unit details page, persisted as a global UI preference (BEA-30).
- New home page layout with a right sidebar for adding projects, and a floating button that opens it as a modal on mobile (BEA-31).
- Projects are now sorted by completion rate (highest first), then by name, on the home page (BEA-31).
- Deploy MiniPaint to GitHub Pages (BEA-25).
- CI workflow running typecheck, lint, test and build on every pull request to `main` (BEA-40).
- Global footer on every page showing the app version (`MiniPaint X.Y.Z`) with a link to the changelog on GitHub (BEA-42).
- Sticky footer layout: the footer stays at the bottom of the viewport even when a page has little content (BEA-42).

### Changed
- Improved modal overlays: backgrounds are now blurred for better focus.
- Cleaner navigation: removed redundant back buttons on the unit page (breadcrumbs already cover navigation).

### Fixed
- Application now loads correctly in both local and GitHub Pages environments.
- Deploy workflow now runs the linter with the correct `npm run lint` script (BEA-40).

---

## [0.1.0] - 2026-09-08

First MVP release of BearMiniPainting, a minimalist miniature painting tracker.

### Added
- Create a project with a unique code (BEA-5).
- Project details page with units list and completion rate (BEA-8).
- Create a unit within a project via modal form (BEA-14).
- Unit details page with default painting steps (BEA-19).
- Toggle a todo's status between done and undone (BEA-23).
- Add custom todos to a unit (BEA-15).
- Delete a todo from a unit (BEA-29).
- Delete a project, including its units and todos (BEA-7).
- Delete a unit, including its todos (BEA-16).
- Reorder unit todos via drag and drop (BEA-24).
- Centralized dependency injection for use cases (BEA-17).
- Toast notifications for success and error feedback.

### Fixed
- Prevent project creation without a name (BEA-18).
- Standardize default todos ordering (BEA-35).

### Changed
- Unified table behavior: only the title is clickable to navigate to a unit.
- Improved project page layout (BEA-32).
- Updated completion rate bar and badge colors (BEA-26).
- Project refresh after adding a unit now goes through the store (BEA-7 follow-up).

---

## Template for future releases

## [X.Y.Z] - YYYY-MM-DD

### Added
-

### Changed
-

### Deprecated
-

### Removed
-

### Fixed
-

### Security
-
