# Agent Rules for MiniPaint

This file overrides the `ours-dev` skill (`.vibe/skills/ours-dev/SKILL.md`) on the
points below. When a rule here conflicts with the skill, **this file wins**.

---

## ours-dev — Workflow Overrides

### Delivery (Git, GitHub, Linear)

- Manage Linear and GitHub through their MCP servers.
- **Never push a commit to `main`.** Only push to a feature branch.
- When the feature is finished:
  1. Push the feature branch.
  2. Create or update the corresponding pull request via the GitHub MCP server.
  3. Keep the Linear issue in sync via the Linear MCP server.

### Changelog

- **Every agent must keep `CHANGELOG.md` up to date as development progresses.**
- Add each notable change to the `## [Unreleased]` section, under the matching
  category (`Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`),
  following the [Keep a Changelog](https://keepachangelog.com/) format already
  used in the file.
- Reference the related Linear ticket (e.g. `(BEA-40)`) at the end of each entry.
- Do not wait for a release: the `[Unreleased]` section is the working log.
