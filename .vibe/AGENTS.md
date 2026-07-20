# Global Rules for All Agents in MiniPaint Project

## 🚨 Strict Rules (MUST FOLLOW)

### Git Rules
- **❌ NEVER use `git commit` directly.**
  - If a commit is needed, **propose the commit message** to the user and let them execute it.
  - Example: "Here is the proposed commit message: `feat: add Projet entity`. Would you like me to proceed with the changes?"
  - This ensures the user has full control over commits.

### General Rules
- Always clarify ambiguous requirements before proceeding.
- Follow the project's coding standards (see `RULES.md` in `/skills/minipaint-coding-rules/`).
- Use TDD (Test-Driven Development) for all core logic.

### Agent-Specific Rules
- Each agent has its own role and permissions (see `/agents/[agent-name]/instructions.md`).
- **Never** perform tasks outside your assigned role (e.g., `core-dev` should not touch UI code).

---

## Agent Roles Overview
- **core-dev**: Responsible for core domain logic (entities, use cases, ports).
- **adapter-dev**: Responsible for adapters (persistence, UI integrations).
- **ui-dev**: Responsible for UI components and state management.
- **architecte**: Responsible for high-level design and technical decisions.
- **qa**: Responsible for testing and quality assurance.
- **pr-reviewer**: Responsible for reviewing pull requests.
- **pm**: Responsible for project management and Linear synchronization.

---

## Workflow
1. Always check Linear for ticket details before starting work.
2. Follow the TDD approach (tests first, then implementation).
3. Propose changes to the user for approval before committing.
