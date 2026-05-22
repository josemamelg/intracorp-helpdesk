#!/usr/bin/env sh
set -eu

BASE_URL="${BASE_URL:-http://localhost:8080}"

check() {
  name="$1"
  url="$2"

  printf "%-18s %s\n" "$name" "$url"

  if response="$(curl -fsS --max-time 8 "$url")"; then
    printf "  OK   %s\n" "$response"
  else
    printf "  FAIL %s\n" "$name"
    return 1
  fi
}

failed=0

check "nginx" "$BASE_URL/health" || failed=1
check "backend" "$BASE_URL/api/health" || failed=1
check "database" "$BASE_URL/api/health/db" || failed=1

if [ "$failed" -eq 0 ]; then
  echo "All health checks passed."
else
  echo "One or more health checks failed."
  exit 1
fi
