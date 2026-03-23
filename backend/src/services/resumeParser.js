import pdf from "pdf-parse";

export async function parseResume(file) {
  const buffer = file.buffer;
  const data = await pdf(buffer);
  return data.text;
}
