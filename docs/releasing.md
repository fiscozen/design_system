# Releasing

Releases follow the Changesets **Version PR** pattern, and publishing to npm uses **trusted
publishing** (OIDC): no npm token exists anywhere, in the repo or on a laptop. Everything runs
in `.github/workflows/release.yml` on every push to `main`.

| Job | Runs when | Credential |
|---|---|---|
| `plan` | every push to `main` | `GITHUB_TOKEN`: opens or updates the Version PR |
| `publish` | no changeset is pending and some version on `main` is not on npm | OIDC token, issued only after an approval on the `npm` environment |
| `tag` | after `publish`, or when there was nothing to publish | `GITHUB_TOKEN`: pushes tags, opens GitHub releases |

## The loop

1. **A feature PR merges into `main` carrying a `.changeset/*.md`.** The `plan` job runs
   `changeset version` on the `changeset-release/main` branch and opens (or updates) a PR
   titled *chore: version packages*, with the version bumps and CHANGELOG entries.
2. **You merge the Version PR** when you want to release. The diff shows exactly which
   package goes to which version.
3. **The merge commit has no changesets left.** `plan` asks the registry which versions are
   missing (`changeset publish-plan`) and, if any, `publish` waits for a reviewer of the
   `npm` environment. On approval it builds the workspace and runs `changeset publish`.
   npm attaches provenance to every version.
4. **`tag` tags the published versions** and opens a GitHub release per tag, with the
   CHANGELOG entry as body.

## What this means when you work here

- **Every published change needs a changeset.** A version bump without one is a release that
  never happens.
- **Never run `changeset version` or `changeset publish` locally.** Both are CI's job. Every
  package is set to *Require two-factor authentication and disallow tokens*, so npm refuses
  any publish that doesn't come from the workflow, except an interactive 2FA publish by a
  maintainer. That path is for a package's first version only (see below).
- **Preview a release with `pnpm release:check:pending`.** It follows the same cascade
  rules as changesets: internal dependencies get a patch, and so does a package whose peer
  range the new version leaves.

## Adding a new package

npm can only attach a trusted publisher to a package that already exists. So the first
version of a new package is published by hand, and every later one comes from CI.

1. Merge the package and its Version PR as usual. The `publish` job **fails** and names the
   new package: it has no trusted publisher, so npm refuses the OIDC token. Packages in
   later publish chunks, its dependents among them, are not published either.
2. From an up-to-date `main`, a maintainer publishes it once with 2FA. Use `pnpm publish`,
   not `npm publish`: only pnpm rewrites the `workspace:` ranges.
   ```bash
   pnpm install && pnpm nx run @fiscozen/<name>:build
   cd packages/<name> && pnpm publish --access public
   ```
3. Attach the trusted publisher, with direct publish enabled. `--allow-publish` needs a
   recent npm; 11.20.0, the version the `publish` job pins, has it:
   ```bash
   npm trust github @fiscozen/<name> --repo fiscozen/design_system \
     --file release.yml --env npm --allow-publish
   ```
4. Close the token path: `npm access set mfa=publish @fiscozen/<name>`. That is *Require
   two-factor authentication and disallow tokens* on the package's settings page.
5. Re-run the failed `publish` job. The versions already on npm are skipped.

## Constraints that hold this up

- **The trusted publisher must match exactly**: repository `fiscozen/design_system`, workflow
  `release.yml`, environment `npm`. Renaming the workflow file or the environment breaks
  every publish.
- **Direct publish is opt-in.** Trusted publisher configurations created after 3 September
  2026 are stage-only unless `--allow-publish` is set (or *Publish* is ticked on the package's
  settings page). Without it, `npm publish` is rejected.
- **`repository.url` must name this repo.** npm checks it against the provenance and rejects
  a mismatch with a 422. `pnpm check:package-metadata` guards it in pre-push.
- **The `npm` environment needs a required reviewer and the `FONTAWESOME_PACKAGE_TOKEN`
  secret.** The `publish` job reads the secret from the environment, and the full install
  it runs cannot fetch the Font Awesome kit without it.
- **GitHub-hosted runners only.** Trusted publishing does not accept self-hosted runners.
- **npm >= 11.5.1, Node >= 22.14.** The `publish` job installs a pinned npm 11 over the one
  Node 22 ships. `.nvmrc` pins Node.
- **pnpm stays on 10.** `changeset publish` calls `pnpm publish`, which pnpm 10 hands to the
  npm CLI, and the npm CLI is what performs the OIDC exchange. pnpm 11 publishes natively,
  so re-verify OIDC before upgrading.
- **`changesets/action` v2 and `@changesets/cli` v3 go together.** The action checks the
  resolved CLI major and fails the job on a mismatch.
- **`changeset-release/main` must stay unprotected**, and *Settings → Actions → General →
  Allow GitHub Actions to create and approve pull requests* must be on. The `plan` job pushes
  to that branch and opens the PR itself.
- **A Version PR gets no GitHub Actions checks.** PRs opened with `GITHUB_TOKEN` do not
  trigger workflow runs. A required check on `main` would block it until the PR is opened
  with a GitHub App token instead.
- **An empty changeset on `main` blocks publishing.** It counts as pending, but
  `changeset version` produces no bump from it, so no Version PR appears and `publish` never
  runs. Delete the file.
