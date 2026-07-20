---
name: minipaint-coding-rules
namespace: minipaint
version: 1.0.0
title: MiniPaint Coding Rules
summary: Single source of truth for code reviews and quality checks in the MiniPaint project.
description: |
  This skill provides comprehensive coding rules, templates, and automated checks for the MiniPaint project.
  It ensures consistency across the codebase by defining:
  - Architecture rules (Hexagonal/Clean Architecture)
  - File structure and naming conventions
  - Git conventions (branches, commits)
  - Testing rules (TDD, coverage)
  - Code quality checks

authors:
  - Mistral Vibe <https://www.guillaumecasbas.fr>
license: MIT
tags:
  - coding-standards
  - architecture
  - typescript
  - quality
  - minipaint
---

# MiniPaint Coding Rules Skill

This skill provides all the rules, templates, and checks needed to maintain code quality in the MiniPaint project.

## Usage

All agents working on the MiniPaint project (Core Dev, Adapter Dev, Architect, Code Quality, PR Reviewer, UI Dev, QA, PM) 
**MUST** use this skill to ensure consistency.

### Key Files
- `RULES.md` - Main coding rules document (read this first)
- `README.md` - Usage instructions
- `checks/` - Automated verification scripts
- `templates/` - File templates for new code

### Before Writing Code
1. Read `RULES.md` thoroughly
2. Check existing code for patterns
3. Use templates from `templates/`

### Before Pushing Code
Run all checks:
```bash
node skills/minipaint-coding-rules/checks/architecture.js
node skills/minipaint-coding-rules/checks/naming.js
node skills/minipaint-coding-rules/checks/git.js
```

## Important Rule for All Agents

**If there is any doubt or a choice to be made: ALWAYS stop and ask which choice to take.**
- Never make assumptions about ambiguous requirements
- Always clarify with the user or other agents before proceeding

## Compatibility

This skill is designed for:
- TypeScript projects
- Hexagonal/Clean Architecture patterns
- Frontend applications (React + Zustand)
- TDD workflows

## Version History

- 1.0.0: Initial release with complete rule set and checks
