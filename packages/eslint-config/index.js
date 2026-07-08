/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // Guard the shared `breakpoints` singleton from `@fiscozen/style`.
    // It is imported by ~13 design-system packages, so a module-scope mutation
    // (`breakpoints.md = '1200px'`) changes behaviour for all of them. Use a
    // local copy instead — `useBreakpoints({ ...breakpoints, <key>: '<value>' })`
    // — or a dedicated token such as the shared `desktop` breakpoint.
    //
    // Best-effort speed-bump, NOT a hard guarantee. This is an esquery AST-shape
    // match with no scope/import-binding resolution, so it only catches the
    // idiomatic forms `breakpoints.<key> =` and `breakpoints['<key>'] =` where the
    // object is literally named `breakpoints`. Known blind spots (code review is
    // the real backstop for these):
    //   - aliased import — `import { breakpoints as bp }; bp.md = '...'`
    //   - `Object.assign(breakpoints, { md: '...' })` (a CallExpression, not an
    //     AssignmentExpression)
    // It may also false-positive on an unrelated local named `breakpoints`
    // (e.g. `const breakpoints = ref(...)`); rename such a local to sidestep it.
    'no-restricted-syntax': [
      'error',
      {
        selector:
          "AssignmentExpression[left.type='MemberExpression'][left.object.name='breakpoints']",
        message:
          'Do not mutate the shared `breakpoints` singleton from @fiscozen/style (it is read by ~13 packages). Use a local spread copy — useBreakpoints({ ...breakpoints, <key>: "<value>" }) — or a dedicated breakpoint token (e.g. `desktop`).'
      }
    ]
  }
}
