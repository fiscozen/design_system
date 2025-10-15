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

### Storybook Tests
The project uses [Storybook Test](https://storybook.js.org/docs/writing-tests) for component testing with:
- **Interaction tests** - User behavior simulation with play functions
- **Accessibility tests** - WCAG compliance checks with @storybook/addon-a11y

```bash
# Start Storybook dev server
pnpm storybook

# Run all Storybook tests (from root)
pnpm test:storybook

# Run tests in watch mode (recommended for development)
pnpm test:storybook:watch

# Run tests with coverage report
pnpm test:storybook:coverage

# Run tests with Vitest UI
pnpm test:storybook:ui
```

**Alternative (from apps/storybook directory):**
```bash
cd apps/storybook

pnpm test:storybook           # Run once
pnpm test:storybook:watch     # Watch mode
pnpm test:storybook:coverage  # With coverage
```