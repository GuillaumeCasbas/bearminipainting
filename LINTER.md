# MiniPaint - Linter & Code Formatting Guide

> **Status**: To be implemented in a future session
> **Priority**: High (recommended for code quality)

---

## 📋 Overview

This document outlines the recommended setup for **linting** and **code formatting** in the MiniPaint project (TypeScript + React + Clean Architecture).

### Why?
- **Consistency**: Ensure all contributors follow the same code style
- **Quality**: Catch errors and anti-patterns early
- **Automation**: Reduce manual review time for styling issues
- **Maintainability**: Improve long-term code health

---

## 🎯 Step-by-Step Implementation Plan

### Phase 1: ESLint (Priority: ⭐⭐⭐⭐⭐)

#### 1. Install Dependencies

```bash
npm install --save-dev \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-plugin-react \
  eslint-plugin-react-hooks
```

#### 2. Create `.eslintrc.json`

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react", "react-hooks"],
  "extends": ["airbnb-typescript"],
  "parserOptions": {
    "project": "./tsconfig.json",
    "ecmaFeatures": { "jsx": true }
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "rules": {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "import/prefer-default-export": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/function-component-definition": ["error", { "namedComponents": "arrow-function" }],
    "lines-between-class-members": ["error", "always"],
    "import/order": ["error", { "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"] }]
  },
  "ignorePatterns": ["node_modules", "dist", "*.js", "coverage"]
}
```

#### 3. Add npm Scripts

In `package.json`:
```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix"
  }
}
```

#### 4. Test Configuration

```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

---

### Phase 2: Prettier (Priority: ⭐⭐⭐⭐)

#### 1. Install Prettier

```bash
npm install --save-dev prettier
```

#### 2. Create `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

#### 3. Create `.prettierignore`

```
node_modules
dist
coverage
*.min.js
package-lock.json
```

#### 4. Integrate with ESLint

```bash
npm install --save-dev eslint-config-prettier eslint-plugin-prettier
```

Update `.eslintrc.json`:
```json
{
  "extends": [
    "airbnb-typescript",
    "plugin:prettier/recommended"
  ]
}
```

---

### Phase 3: Git Hooks (Priority: ⭐⭐⭐)

#### 1. Install Husky & lint-staged

```bash
npm install --save-dev husky lint-staged
```

#### 2. Enable Husky

```bash
npx husky install
```

#### 3. Add Pre-commit Hook

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

#### 4. Configure `lint-staged`

In `package.json`:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

Now, **ESLint** and **Prettier** will run automatically on every commit!

---

### Phase 4: VS Code Integration (Optional)

#### 1. Install Extensions
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

#### 2. Add to `.vscode/settings.json`

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["typescript", "typescriptreact"],
  "prettier.documentSelectors": ["**/*.ts", "**/*.tsx"]
}
```

---

## 📊 Expected Benefits

| Metric | Before | After |
|--------|--------|-------|
| Code Review Time | High | Reduced by ~30% |
| Style Issues | Frequent | Zero |
| Code Consistency | Variable | 100% |
| Bug Detection | Manual | Automatic |

---

## 🔄 Migration Strategy

### For Existing Codebase

1. **Run ESLint first** (without --fix):
   ```bash
   npm run lint
   ```

2. **Fix issues incrementally** (per file/directory):
   ```bash
   npm run lint:fix
   ```

3. **Add Prettier formatting**:
   ```bash
   npx prettier --write src/
   ```

4. **Commit formatting changes** as a separate PR

---

## 📝 Project-Specific Rules

### MiniPaint Conventions (to enforce via ESLint)

| Rule | Configuration | Purpose |
|------|--------------|---------|
| `import/order` | Groups: builtin, external, internal | Clean imports |
| `lines-between-class-members` | Always | Readability |
| `@typescript-eslint/explicit-function-return-type` | Warn | Type safety |
| `@typescript-eslint/no-explicit-any` | Warn | Avoid `any` type |
| `react/function-component-definition` | Arrow functions | Consistency |

---

## 🚀 Quick Start

For immediate implementation:

```bash
# Phase 1: ESLint only
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks

# Create .eslintrc.json (see above)
# Add scripts to package.json
npm run lint

# Phase 2: Add Prettier later
```

---

## 📚 References

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Prettier Documentation](https://prettier.io/docs/en/index.html)
- [Airbnb TypeScript Style Guide](https://github.com/iamturns/eslint-config-airbnb-typescript)

---

> **Note**: This setup aligns with MiniPaint's **Clean Architecture** principles and **TDD workflow**. Linting ensures code quality before tests, and Prettier ensures consistent formatting across all layers (Core, Adapters, UI).
