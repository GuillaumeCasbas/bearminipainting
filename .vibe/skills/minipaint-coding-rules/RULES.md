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
| **Feature** | `feat/[issue-id]-description` | `feat/BEA-123-create-projet` |
| **Bugfix** | `fix/[issue-id]-description` | `fix/BEA-123-unique-code-validation` |
| **Refactor** | `refactor/[issue-id]-scope` | `refactor/core-entities` |
| **Main** | `main` | Only for production-ready code. |

### **Commits**
| Type | Format | Example |
|------|--------|---------|
| **Feature** | `feat(scope?): description (issue-id)` | `feat: add Projet entity (BEA-123)` |
| **Bugfix** | `fix(scope?): description (issue-id)` | `fix(project): validate unique code (BEA-123)` |
| **Refactor** | `refactor(scope?): description (issue-id)` | `refactor: move Todo to constants (BEA-123)` |
| **Test** | `test(scope?): description (issue-id)` | `test: [Linear #1] add Projet tests (BEA-123)` |
| **Docs** | `docs(scope?): description (issue-id)` | `docs: update CONTEXT.md with new use case (BEA-123)` |
| **Chore** | `chore(scope?): description (issue-id)` | `chore: add .gitignore (BEA-123)` |

---

## 🧪 Testing Rules
| Rule | Description |
|------|-------------|
| **TDD for Core** | Core layer **must** be 100% TDD. |
| **Test Coverage** | Minimum **80%** for Core, **70%** for Adapters. |
| **Mocking** | Use **manual mocks** (no external libraries). |
| **Test Files** | Must match source file path (e.g., `src/core/usecases/XXX` → `tests/core/usecases/XXX.test.ts`). |
| **Dependency Injection in Tests** | **MUST** inject dependencies via interfaces/ports rather than mocking use cases directly. Use mocked repositories to test components with real use case logic. |

---

## 🐞 Bug Fix Methodology (TDD Strict)

### **Principle: Red-Green-Refactor for Bugs**
When fixing a bug, **ALWAYS** follow this strict TDD workflow:

1. **🔴 REPRODUCE**: Write a failing test that reproduces the bug
   - The test **MUST** fail with the exact error message from the bug report
   - Example: If `unit.getCompletionRate is not a function`, write a test calling `unit.getCompletionRate()`
   
2. **✅ FIX**: Write the minimal code to make the test pass
   - Only modify the **source of the bug** (entity, use case, etc.)
   - Do **NOT** modify the test to make it pass
   
3. **🔄 REFACTOR**: Improve the code while keeping tests green
   - Ensure all existing tests still pass
   - Verify the bug is fixed in the application

### **Why This Matters**
- Prevents regression: The test acts as a safeguard
- Documents the expected behavior
- Ensures the fix addresses the root cause

### **Example (BEA-14 Issue)**
**Bug**: `unit.getCompletionRate is not a function` in ProjectDetail component

**Correct Approach:**
```typescript
// 1. ✅ First: Write the failing test in Unit.test.ts
describe("getCompletionRate", () => {
  it("should return 100 when unit has no todos", () => {
    const unit = new Unit("unit-1", "Intercessor", "IA-01", "1");
    // This will fail: getCompletionRate doesn't exist yet
    expect(unit.getCompletionRate()).toBe(100);
  });
});

// 2. ✅ Then: Implement the method in Unit entity
getCompletionRate(): number {
  if (this.todos.length === 0) return 100;
  const doneTodos = this.todos.filter(t => t.status === 'DONE').length;
  return Math.round((doneTodos / this.todos.length) * 100);
}

// 3. ✅ Finally: Verify all tests pass
```

**Incorrect Approach (What NOT to do):**
```typescript
// ❌ NEVER: Implement the fix without a test first
// This leads to untested code and potential regressions
```

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
