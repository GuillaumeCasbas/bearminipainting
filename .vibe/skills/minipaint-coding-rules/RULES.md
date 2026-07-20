# MiniPaint Coding Rules
*Single source of truth for code reviews and quality checks.*

---

## 📦 General Rules
| Rule | Description | Example ✅ | Example ❌ |
|------|-------------|------------|------------|
| **English Only** | All code, comments, and error messages **must be in English**. | `throw new Error("Code must be unique")` | `throw new Error("Le code doit être unique")` |
| **No Hardcoded IDs** | Never hardcode IDs (use UUIDs or constants). | `crypto.randomUUID()` | `id: "1"` (hardcoded) |
| **No `any` Type** | TypeScript: **No `any` type** allowed. | `unknown` or explicit types | `let x: any` |
| **Immutable by Default** | Prefer `readonly` and `const`. | `public readonly id: string` | `let id: string` (mutable) |
| **YAGNI** | You Aren't Gonna Need It: only add code that serves current functionality or tests. Never add speculative features. | Add code only when needed | Adding unused imports, methods, or abstractions "for later" |

---

## 🏗️ Architecture Rules
| Rule | Description |
|------|-------------|
| **Hexagonal Compliance** | Core (entities/usecases/ports) **must not depend** on Adapters or UI. |
| **Ports First** | All external dependencies (e.g., `localStorage`) **must** go through ports (interfaces). |
| **No Direct Imports** | Adapters **cannot import** from UI, and vice versa. |
| **Dependency Injection** | Use cases **must** receive dependencies (e.g., repositories) via constructor. |

---

## 📁 File Structure Rules
| Path | Allowed Content | Forbidden |
|------|------------------|-----------|
| `src/core/` | Entities, use cases, ports. | React, Zustand, `localStorage`. |
| `src/adapters/` | Infrastructure (e.g., `LocalStorageRepository`). | Business logic. |
| `src/ui/` | React components, Zustand stores. | Direct calls to `localStorage`. |
| `tests/` | Test files only. | Source code. |

---

## 🏷️ Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| **Files** | `kebab-case.ts` | `create-projet.usecase.ts` |
| **Classes** | `PascalCase` | `class Projet {}` |
| **Interfaces** | `PascalCase` (prefix `I` optional) | `ProjetRepository` |
| **Functions** | `camelCase` | `getCompletionRate()` |
| **Variables** | `camelCase` | `const projectCode = "NMS"` |
| **Constants** | `UPPER_SNAKE_CASE` | `DEFAULT_TODOS = [...]` |
| **Tests** | `[file].test.ts` | `create-projet.usecase.test.ts` |

---

## 📝 Git Rules
### **Branches**
| Type | Format | Example |
|------|--------|---------|
| **Feature** | `linear/[issue-id]-description` | `linear/1-create-projet` |
| **Bugfix** | `fix/[issue-id]-description` | `fix/5-unique-code-validation` |
| **Refactor** | `refactor/[scope]` | `refactor/core-entities` |
| **Main** | `main` | Only for production-ready code. |

### **Commits**
| Type | Format | Example |
|------|--------|---------|
| **Feature** | `feat: [Linear #X] description` | `feat: [Linear #1] add Projet entity` |
| **Bugfix** | `fix: [Linear #X] description` | `fix: [Linear #5] validate unique code` |
| **Refactor** | `refactor: [scope] description` | `refactor: core move Todo to constants` |
| **Test** | `test: [Linear #X] description` | `test: [Linear #1] add Projet tests` |
| **Docs** | `docs: description` | `docs: update CONTEXT.md with new use case` |
| **Chore** | `chore: description` | `chore: add .gitignore` |

---

## 🧪 Testing Rules
| Rule | Description |
|------|-------------|
| **TDD for Core** | Core layer **must** be 100% TDD. |
| **Test Coverage** | Minimum **80%** for Core, **70%** for Adapters. |
| **Mocking** | Use **manual mocks** (no external libraries). |
| **Test Files** | Must match source file path (e.g., `src/core/usecases/XXX` → `tests/core/usecases/XXX.test.ts`). |

---

## 🔍 Code Quality Rules
| Check | Tool/Method | Description |
|-------|-------------|-------------|
| **Unused Variables** | `typescript-eslint/no-unused-vars` | All variables must be used. |
| **Dead Code** | `madge` or manual review | No unreachable code. |
| **Circular Dependencies** | `madge --circular` | No circular imports between files. |
| **Type Safety** | TypeScript `--strict` | All types must be explicit. |
| **Complexity** | `eslint-plugin-sonarjs` | Functions must not exceed **10 cyclomatic complexity**. |
| **Duplicated Code** | Manual review | No copy-paste (DRY principle). |

---

## 🎫 PR Reviewer Rules
| Check | Description | Example |
|-------|-------------|---------|
| **Conventional Commits** | All commits in the PR **must** follow the format above. | ❌ `fixed bug` → ✅ `fix: [Linear #5] validate unique code` |
| **Branch Naming** | Branch name **must** match the format. | ❌ `my-feature` → ✅ `linear/1-create-projet` |
| **File Structure** | Files **must** be in the correct directory. | ❌ `src/Projet.ts` → ✅ `src/core/entities/Projet.ts` |
| **Naming Conventions** | All names **must** follow `RULES.md`. | ❌ `get_projet()` → ✅ `getProjet()` |
| **No Direct Imports** | Adapters **must not** import from UI, and vice versa. | ❌ `import { Projet } from ../../ui/stores` |
| **Named Exports** | Use **named exports** (no default exports). | ❌ `export default class` → ✅ `export class` |
| **CONTEXT.md Compliance** | Code **must** respect all rules in `CONTEXT.md`. | Ex: Uniqueness of codes, completion rate calculation. |
| **Dependency Injection** | Use cases **must** receive dependencies via constructor. | ❌ `new ProjetRepository()` inside use case → ✅ `constructor(private repo: ProjetRepository)` |

---

## 🛑 Blocking Criteria
The PR **MUST NOT** be merged if:
- [ ] **Any rule in `RULES.md` is violated**.
- [ ] **Tests are failing**.
- [ ] **Code coverage is below the minimum**.
- [ ] **Linear task is not linked**.
- [ ] **PR description is incomplete**.
- [ ] **Code Quality Agent reports issues**.
