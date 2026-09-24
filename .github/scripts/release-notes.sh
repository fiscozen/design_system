#!/usr/bin/env bash
# Prints the CHANGELOG entry a changesets tag refers to, as the body of a GitHub release.
set -euo pipefail

tag=$1
package=${tag%@*}
version=${tag##*@}

package_dir=""
for manifest in packages/*/package.json; do
  if [ "$(jq -r .name "$manifest")" = "$package" ]; then
    package_dir=$(dirname "$manifest")
  fi
done

if [ -z "$package_dir" ]; then
  echo "no workspace package is named $package" >&2
  exit 1
fi

changelog="$package_dir/CHANGELOG.md"

# A package released before its first changeset has no CHANGELOG: an empty body is
# the honest description of it.
if [ ! -f "$changelog" ]; then
  exit 0
fi

awk -v heading="## $version" '
  $0 == heading { inside = 1; next }
  inside && /^## / { exit }
  inside { print }
' "$changelog"
