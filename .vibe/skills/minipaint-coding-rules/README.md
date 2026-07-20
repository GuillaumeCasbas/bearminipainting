# MiniPaint Coding Rules Skill
*For agents: Core Dev, Adapter Dev, Architect, Code Quality, PR Reviewer, UI Dev, QA, PM.*

---

## ⚠️ Important Rule for All Agents
**If there is any doubt or a choice to be made: ALWAYS stop and ask which choice to take.**
- Never make assumptions about ambiguous requirements.
- Always clarify before proceeding.

---

## 📌 Key Principles

### YAGNI (You Aren't Gonna Need It)
**Always apply YAGNI:** Only add code that serves current functionality or tests.
- Do NOT add speculative features
- Do NOT add abstractions "for later"
- Do NOT add unused imports, methods, or classes
- Add code only when you are 100% sure it's needed NOW

---

## 📚 How to Use This Skill
1. **Before Writing Code**:
   - Read `RULES.md` to understand the coding standards.
   - Use the templates in `templates/` to start new files.

2. **While Writing Code**:
   - Refer to `RULES.md` for naming, structure, and architecture.
   - Use the templates to ensure consistency.
   - **Apply YAGNI**: Only write code you need right now.

3. **Before Pushing Code**:
   - Run the checks in `checks/` to verify compliance.
   - Example:
     ```bash
     # Check architecture rules
     node skills/minipaint-coding-rules/checks/architecture.js
     
     # Check naming rules
     node skills/minipaint-coding-rules/checks/naming.js
     ```

4. **During PR Review**:
   - Use the checks to automatically flag violations.
   - Manually verify rules that cannot be automated.

---

## 🔌 Dependencies
This skill relies on:
- TypeScript (for type checking).
- ESLint (for linting).
- Madge (for circular dependency detection).
- Jest (for testing).

Install them with:
```bash
npm install --save-dev typescript eslint madge jest @types/jest
```

---

## 📌 Quick Checklist for Agents
- [ ] Code follows `RULES.md`.
- [ ] No direct imports between layers (Core ⇄ Adapters ⇄ UI).
- [ ] All types are explicit (no `any`).
- [ ] Naming conventions are respected.
- [ ] Git commits/branches follow the conventions.
- [ ] Tests are written first (TDD for Core).

---

## 📁 Structure
```
skills/minipaint-coding-rules/
├── RULES.md               # Coding rules (read before writing code)
├── README.md              # This file
├── checks/
│   ├── architecture.js    # Verify hexagonal architecture compliance
│   ├── naming.js          # Verify naming conventions
│   ├── git.js             # Verify Git conventions
│   └── typescript.js      # Verify TypeScript best practices
└── templates/
    ├── entity.template.ts
    ├── usecase.template.ts
    └── test.template.ts
```
