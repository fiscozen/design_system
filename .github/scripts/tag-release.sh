#!/usr/bin/env bash
# Tags the package versions on main and opens a GitHub release for every tag that has
# none. The tag list comes from the workspace manifests, not from what `changeset git-tag`
# just created, so a run that fails halfway can be retried: a tag whose release never
# got created is still reconsidered once the tag itself is on the remote.
set -euo pipefail

# Every publishable package, in the tag form `changeset git-tag` writes. Packages in
# `ignore` of .changeset/config.json are never published, and `changeset git-tag` skips
# them too.
expected_tags() {
  jq -r --slurpfile config .changeset/config.json '
    select(.private != true)
    | select(.name as $name | $config[0].ignore | index($name) | not)
    | "\(.name)@\(.version)"
  ' packages/*/package.json
}

# Absent locally means the remote already carries it, so there is nothing to push.
push_tag() {
  local tag=$1

  if ! git rev-parse -q --verify "refs/tags/$tag" >/dev/null; then
    return 0
  fi

  git push origin "refs/tags/$tag"
}

release_tag() {
  local tag=$1
  local notes

  push_tag "$tag" || return 1

  if gh release view "$tag" >/dev/null 2>&1; then
    echo "release already exists: $tag"
    return 0
  fi

  notes=$(mktemp)
  .github/scripts/release-notes.sh "$tag" >"$notes" || return 1
  gh release create "$tag" --title "$tag" --notes-file "$notes" || return 1
}

pnpm changeset git-tag

# Assigned before the loop: a failure inside `for tag in $(...)` would be discarded and
# leave an empty list, which reads as "nothing to tag".
tags=$(expected_tags)

failed=0
for tag in $tags; do
  if ! release_tag "$tag"; then
    echo "failed to release $tag" >&2
    failed=1
  fi
done

exit "$failed"
