import { readFileSync } from "fs";

// -------------------------------------------------------------------------------
// Build
// -------------------------------------------------------------------------------
export async function build(target = "dist") {
  await folder(target).delete();
  await shell(`tsc -p ./src/tsconfig.json --outDir ${target}`);
  await folder(target).add("package.json");
  await folder(target).add("readme.md");
  await folder(target).add("license");
  await shell(`cd ${target} && npm pack`);
}
// -------------------------------------------------------------
// Publish
// -------------------------------------------------------------
export async function publish(target = "dist") {
  const { version } = JSON.parse(readFileSync("package.json", "utf8"));
  await shell(
    `cd ${target} && npm publish erfanium-fetch-typebox-${version}.tgz --access=public`
  );
}
