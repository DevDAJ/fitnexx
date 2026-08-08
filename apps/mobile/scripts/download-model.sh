#!/usr/bin/env bash
# Fetches the bundled on-device workout-suggestion model.
# The GGUF is large (~400MB) so it is kept out of git (see .gitignore) and
# fetched on install; bundle it via require() in assets/models.
set -euo pipefail

MODEL_URL="https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf"
DEST="apps/mobile/assets/models/qwen2.5-0.5b-instruct-q4_k_m.gguf"
MIN_BYTES=300000000

size_of() {
  stat -f%z "$1" 2>/dev/null || stat -c%s "$1" 2>/dev/null || echo 0
}

if [ -f "$DEST" ] && [ "$(size_of "$DEST")" -ge "$MIN_BYTES" ]; then
  echo "model already present"
  exit 0
fi

TMP="$DEST.tmp.$$"
trap 'rm -f "$TMP"' EXIT

echo "downloading $MODEL_URL -> $DEST"
curl -L --fail --progress-bar "$MODEL_URL" -o "$TMP"
if [ "$(size_of "$TMP")" -lt "$MIN_BYTES" ]; then
  echo "download too small, aborting" >&2
  exit 1
fi
mv "$TMP" "$DEST"
echo "done ($(size_of "$DEST") bytes)"
