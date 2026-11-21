// News front page, one-image entry.
// This program takes the finished picture (entry.png, sitting next to this
// file) and places a copy of it where the grader expects it: entry.png inside
// the output directory. It uses only the Node 22 standard library.

import { copyFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function fail(message) {
  console.error(message);
  process.exit(1);
}

// A real PNG always opens with these eight bytes.
const PNG_HEADER = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const here = dirname(fileURLToPath(import.meta.url));
const picture = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outFile = join(outDir, "entry.png");

let bytes;
try {
  bytes = readFileSync(picture);
} catch {
  fail(`Could not read the front-page image at ${picture}.`);
}

if (!bytes.subarray(0, PNG_HEADER.length).equals(PNG_HEADER)) {
  fail(`The file at ${picture} is not a PNG image: its first eight bytes are not the PNG signature, so it cannot be the front page.`);
}

// The gate takes at most one mebibyte, and an empty file is no picture at all.
const ONE_MEBIBYTE = 1024 * 1024;
if (bytes.length === 0) {
  fail(`The front-page image at ${picture} is empty — there is nothing to copy.`);
}
if (bytes.length > ONE_MEBIBYTE) {
  fail(`The front-page image at ${picture} is ${bytes.length} bytes, past the one-mebibyte limit, so it cannot be used as the entry.`);
}

copyFileSync(picture, outFile);
console.log(`Front page written to ${outFile}.`);
