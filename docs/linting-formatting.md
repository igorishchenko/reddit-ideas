# ESLint & Prettier Setup Guide

This guide explains the ESLint and Prettier configuration for the Reddit Ideas SaaS application.

## 🚀 Overview

The project is configured with:

- **ESLint** for code linting and error detection
- **Prettier** for code formatting
- **TypeScript** support with strict rules
- **Next.js** specific configurations
- **VS Code** integration for seamless development

## 📦 Installed Packages

### ESLint Packages

- `eslint` - Core ESLint functionality
- `@typescript-eslint/parser` - TypeScript parser for ESLint
- `@typescript-eslint/eslint-plugin` - TypeScript-specific rules
- `eslint-config-prettier` - Disables ESLint rules that conflict with Prettier
- `eslint-plugin-prettier` - Runs Prettier as an ESLint rule

### Prettier Package

- `prettier` - Code formatter

## 🔧 Configuration Files

### ESLint Configuration (`eslint.config.js`)

- Uses modern flat config format
- TypeScript support with strict rules
- Prettier integration
- Next.js/React specific rules
- Custom ignore patterns

### Prettier Configuration (`.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### Prettier Ignore (`.prettierignore`)

- Ignores build directories
- Ignores node_modules
- Ignores generated files
- Ignores environment files

## 📜 Available Scripts

### Linting Scripts

```bash
# Check for linting errors
npm run lint

# Fix auto-fixable linting errors
npm run lint:fix
```

### Formatting Scripts

```bash
# Format all files
npm run format

# Check if files are formatted correctly
npm run format:check
```

### Type Checking

```bash
# Run TypeScript type checking
npm run type-check
```

### Combined Checks

```bash
# Run all checks (type-check + lint + format-check)
npm run check-all
```

## 🎯 ESLint Rules

### TypeScript Rules

- `@typescript-eslint/no-unused-vars` - Warns about unused variables
- `@typescript-eslint/no-explicit-any` - Warns about `any` type usage
- `@typescript-eslint/prefer-const` - Enforces `const` over `let`
- `@typescript-eslint/no-var-requires` - Prevents `require()` in TypeScript

### General Rules

- `no-console` - Warns about console statements
- `no-debugger` - Errors on debugger statements
- `prefer-const` - Enforces const declarations
- `no-var` - Prevents var declarations

### Prettier Integration

- `prettier/prettier` - Runs Prettier formatting as ESLint rule

## 🎨 Prettier Configuration

### Key Settings

- **Semicolons**: Always use semicolons
- **Quotes**: Single quotes for strings
- **Line Width**: 80 characters maximum
- **Indentation**: 2 spaces
- **Trailing Commas**: ES5 compatible
- **Arrow Functions**: Avoid parentheses when possible

### File Support

- JavaScript/TypeScript
- JSX/TSX
- JSON
- Markdown
- CSS/SCSS

## 🔌 VS Code Integration

### Settings (`.vscode/settings.json`)

- **Format on Save**: Automatically formats files when saving
- **ESLint Auto-fix**: Automatically fixes ESLint errors on save
- **Import Organization**: Automatically organizes imports
- **TypeScript**: Enhanced TypeScript support

### Recommended Extensions (`.vscode/extensions.json`)

- **Prettier** - Code formatter
- **ESLint** - JavaScript/TypeScript linter
- **Tailwind CSS** - Tailwind CSS IntelliSense
- **TypeScript** - Enhanced TypeScript support
- **Auto Rename Tag** - Automatically rename paired HTML/JSX tags
- **Path IntelliSense** - Autocomplete file paths

## 🚀 Usage Examples

### Running Linting

```bash
# Check all files
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Check specific file
npx eslint src/app/page.tsx
```

### Running Formatting

```bash
# Format all files
npm run format

# Check formatting
npm run format:check

# Format specific file
npx prettier --write src/app/page.tsx
```

### Pre-commit Hooks (Optional)

You can add pre-commit hooks using husky:

```bash
npm install --save-dev husky lint-staged
npx husky init
```

Add to `.husky/pre-commit`:

```bash
npx lint-staged
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

## 🔍 Troubleshooting

### Common Issues

1. **ESLint not working**
   - Check if ESLint extension is installed in VS Code
   - Restart VS Code after installing extensions
   - Check if `eslint.config.js` is in project root

2. **Prettier not formatting**
   - Check if Prettier extension is installed
   - Verify `.prettierrc` configuration
   - Check if file is in `.prettierignore`

3. **TypeScript errors**
   - Run `npm run type-check` to see detailed errors
   - Check `tsconfig.json` configuration
   - Ensure all dependencies are installed

4. **Conflicting rules**
   - ESLint and Prettier are configured to work together
   - If conflicts occur, check `eslint-config-prettier` is included

### Debug Commands

```bash
# Check ESLint version and config
npx eslint --print-config src/app/page.tsx

# Check Prettier version and config
npx prettier --check src/app/page.tsx

# Check TypeScript config
npx tsc --showConfig
```

## 📊 CI/CD Integration

### GitHub Actions

Add to your workflow:

```yaml
- name: Run linting
  run: npm run lint

- name: Check formatting
  run: npm run format:check

- name: Type check
  run: npm run type-check
```

### Pre-commit Checks

```bash
# Run all checks before committing
npm run check-all
```

## 🎯 Best Practices

### Code Style

1. **Use TypeScript** - Avoid `any` types
2. **Consistent Formatting** - Let Prettier handle formatting
3. **Meaningful Names** - Use descriptive variable and function names
4. **Small Functions** - Keep functions focused and small
5. **Error Handling** - Always handle errors appropriately

### Development Workflow

1. **Format on Save** - Enable in VS Code settings
2. **Fix Linting Issues** - Address ESLint warnings/errors
3. **Type Safety** - Use TypeScript features effectively
4. **Regular Checks** - Run `npm run check-all` regularly

## 📚 Additional Resources

- [ESLint Documentation](https://eslint.org/docs/)
- [Prettier Documentation](https://prettier.io/docs/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Next.js ESLint Config](https://nextjs.org/docs/app/building-your-application/configuring/eslint)

---

## 🎉 Summary

The project now has:

- ✅ **ESLint** configured with TypeScript support
- ✅ **Prettier** configured for consistent formatting
- ✅ **VS Code** integration for seamless development
- ✅ **npm scripts** for easy command execution
- ✅ **Comprehensive documentation** for team collaboration

Happy coding! 🚀
