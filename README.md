# DESIGN SYSTEM

## Development
### Node.js
In order to ensure the same version of Node.js runtime is used by the developers we encourage the usage of [nvm](https://github.com/nvm-sh/nvm). Windows users can look at [nvm-windows](https://github.com/coreybutler/nvm-windows).

In order to install the correct version of Node.js run
```
nvm install
nvm use
```
inside the project directory.

### NPM client
We handle dependencies with `pnpm`. Please refer to its [documentation](https://pnpm.io/it/installation) in order to install it in the local development machine.

### Dependency installation
Run `pnpm install`.

**Note**: Playwright browsers (Chromium) will be installed automatically via postinstall script. This is necessary for running Storybook interaction tests.

### Running tasks
Our task runner of choice is [nx](https://nx.dev/).
In order to run tasks you can, for example
```
npx nx run @fiscozen/storybook:storybook // run the "storybook" task on @fiscozen/storybook package
npx nx run-many -t build // executes the "build" task on all projects
npx run affected:test // execute the "test" task only on packages that are affected in this branch vs main, and on all dependent packages
```
Please refer to Nx documentation for full usage explanation.

## Testing

This project uses a two-tier testing strategy for industry-standard quality:

| Layer | Tool | Purpose |
|-------|------|---------|
| **Unit Tests** | Vitest + Vue Test Utils | Props, events, ARIA attributes, internal logic |
| **Component Tests** | Storybook Play Functions | User interactions, keyboard navigation, visual states |

📖 **See [TESTING.md](./TESTING.md) for comprehensive testing documentation, patterns, and best practices.**

### Quick Start

```bash
# Unit tests (from package directory)
cd packages/button
pnpm test                     # Run once
pnpm test -- --watch          # Watch mode
pnpm test -- --coverage       # With coverage

# Storybook interaction tests (from root)
pnpm test:storybook           # Run once
pnpm test:storybook:watch     # Watch mode (recommended for development)
pnpm test:storybook:coverage  # With coverage
pnpm test:storybook:ui        # Interactive UI

# Run all tests across packages
npx nx run-many -t test       # All unit tests
npx nx affected -t test       # Only affected packages
```

### Test Coverage Requirements

- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%