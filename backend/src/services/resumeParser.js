import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export async function parseResume(file) {
  const buffer = file.buffer;
  const data = await pdf(buffer);
  return data.text;
}
