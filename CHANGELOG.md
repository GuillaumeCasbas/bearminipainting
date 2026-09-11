# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- Deploy MiniPaint to GitHub Pages via GitHub Actions (BEA-25).

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
