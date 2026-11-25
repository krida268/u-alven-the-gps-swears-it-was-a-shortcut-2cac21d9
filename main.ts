import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// The GPS's own excuse for sending the driver down the wrong road:
// smug, defensive, blaming the map — with a fresh, specific detail.
const ENTRY =
  "That cul-de-sac was a shortcut on my map, so I drove in like I owned it — the map has never apologised to me, and neither will I.";

function resolveTarget(argv: string[]): string {
  const arg = argv[2] ?? "/output/entry.txt";
  if (arg.endsWith("/")) return join(arg, "entry.txt");
  // A path naming an existing directory is treated as the output folder.
  if (existsSync(arg) && statSync(arg).isDirectory()) {
    return join(arg, "entry.txt");
  }
  return arg;
}

function main(): void {
  const target = resolveTarget(process.argv);
  if (ENTRY.length < 1 || ENTRY.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${ENTRY.length}`);
  }
  if (ENTRY.trim().length === 0 || ENTRY.includes("\n")) {
    throw new Error("entry must be a single non-blank line");
  }
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, ENTRY, "utf8");
  console.log(`wrote ${target} (${ENTRY.length} characters)`);
}

main();
