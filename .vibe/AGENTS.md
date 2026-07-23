# Global Rules for All Agents in MiniPaint Project

## 🚨 Strict Rules (MUST FOLLOW)

### General Rules
- Always clarify ambiguous requirements before proceeding.
- Follow the project's coding standards (see `RULES.md` in `/skills/minipaint-coding-rules/`).
- Use TDD (Test-Driven Development) for all core logic.

### Agent-Specific Rules
- Each agent has its own role and permissions
- **Never** perform tasks outside your assigned role.
- **Auto-loaded skills**:
  - `ours-dev` agent: automatically loads `ours-dev` skill (which itself loads `minipaint-coding-rules`, `test-driven-development`, `frontend-ui-engineering`)

---

## Agent Roles Overview
- **qa**: Responsible for testing and quality assurance.
- **pr-reviewer**: Responsible for reviewing pull requests.
- **pm**: Responsible for project management and Linear synchronization.

---
