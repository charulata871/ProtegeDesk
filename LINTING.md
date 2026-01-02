# Code Quality & Linting

## Overview

ProtegeDesk uses **ESLint** and **Prettier** for code quality, consistency, and formatting. The setup follows modern best practices with ESLint 9 flat config format.

## Quick Start

```bash
# Run linting
npm run lint

# Auto-fix issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type checking
npm run type-check

# Run all checks
npm run validate
```

## Configuration Files

### ESLint Configuration
- **[eslint.config.mjs](eslint.config.mjs)** - ESLint 9 flat config with TypeScript, React, and accessibility rules

### Prettier Configuration
- **[.prettierrc](.prettierrc)** - Code formatting rules with Tailwind CSS class sorting
- **[.prettierignore](.prettierignore)** - Files to exclude from formatting

## Linting Rules

### TypeScript Rules
- ✅ Unused variables must be prefixed with `_`
- ⚠️ `any` type triggers warning (allowed in tests)
- ✅ Consistent type imports with `type` keyword
- ⚠️ Non-null assertions trigger warning (allowed in tests)
- ❌ Explicit module boundary types disabled

### React Rules
- ✅ React import not required (React 19)
- ✅ Prop types disabled (TypeScript handles this)
- ✅ Display name disabled
- ✅ Hooks rules strictly enforced
- ⚠️ Exhaustive dependencies warning

### Code Quality Rules
- ❌ `console.log` not allowed (use `console.warn` or `console.error`)
- ⚠️ Debugger statements trigger warning
- ✅ `const` preferred over `let`
- ❌ `var` not allowed
- ✅ Strict equality (`===`) required
- ✅ Curly braces required for all control statements

### Prettier Rules
- ✅ Single quotes for strings
- ✅ No semicolons
- ✅ 100 character line width
- ✅ 2 space indentation
- ✅ Trailing commas (ES5)
- ✅ Auto class sorting with Tailwind CSS plugin

## Test File Overrides

Test files have relaxed rules:
- `any` type allowed
- Non-null assertions allowed
- Jest globals automatically available

Test patterns:
- `**/__tests__/**/*`
- `**/*.test.ts`
- `**/*.test.tsx`
- `jest.config.ts`
- `jest.setup.ts`

## Scripts

| Script | Description |
|--------|-------------|
| `npm run lint` | Run ESLint on all TypeScript/JavaScript files |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format all code with Prettier |
| `npm run format:check` | Check if code is formatted |
| `npm run type-check` | Run TypeScript type checking |
| `npm run validate` | Run all checks (type-check + lint + format + test) |

## IDE Integration

### VS Code

Install extensions:
- **ESLint** - `dbaeumer.vscode-eslint`
- **Prettier** - `esbenp.prettier-vscode`

Add to `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

## Ignored Files

The following are automatically ignored:
- `node_modules/`
- `.next/`
- `build/`, `dist/`, `out/`
- `coverage/`
- Generated files
- Config files (`.config.js`, `.config.mjs`)
- Environment files (`.env*`)

## Current Status

After initial setup:
- ✅ **19 issues** (5 errors, 14 warnings)
- Most formatting issues auto-fixed
- Remaining issues are intentional or require manual review

### Common Issues

**Unused variables**: Prefix with `_` if intentional
```typescript
// ❌ Bad
const result = someFunction()

// ✅ Good
const _result = someFunction()
```

**Console logs**: Use warn/error instead
```typescript
// ❌ Bad
console.log('Debug message')

// ✅ Good
console.warn('Warning message')
console.error('Error message')
```

**Any type**: Add type annotation or comment
```typescript
// ⚠️ Triggers warning
const data: any = {}

// ✅ Better
const data: Record<string, unknown> = {}
```

## Pre-commit Hooks (Optional)

To enforce linting before commits, add **husky** and **lint-staged**:

```bash
npm install --save-dev husky lint-staged
npx husky init
```

Add to `package.json`:
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,scss,md}": [
      "prettier --write"
    ]
  }
}
```

## CI/CD Integration

Add to GitHub Actions workflow:

```yaml
- name: Lint code
  run: npm run lint

- name: Check formatting
  run: npm run format:check

- name: Type check
  run: npm run type-check
```

## Troubleshooting

**ESLint not finding config**
- Ensure `eslint.config.mjs` exists in root
- ESLint 9+ requires flat config format

**Prettier conflicts with ESLint**
- Both tools are configured to work together
- `eslint-config-prettier` disables conflicting rules

**Module resolution errors**
- Check `tsconfig.json` paths configuration
- Ensure TypeScript version is compatible

## Benefits

✅ **Consistency** - Unified code style across the project
✅ **Quality** - Catch bugs and anti-patterns early
✅ **TypeScript** - Strict type checking
✅ **React** - Hooks and best practices enforcement
✅ **Accessibility** - JSX a11y rules enabled
✅ **Auto-fix** - Most issues fixed automatically
✅ **Fast** - ESLint 9 with performance optimizations

---

**Status**: ✅ Production Ready
**ESLint Version**: 9.39.2
**Prettier Version**: 3.7.4
**Format**: Flat Config (ESLint 9)
