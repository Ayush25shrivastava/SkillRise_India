// import mammoth from "mammoth";

// export async function parseResume(file) {

//   if (!file) {
//     throw new Error("No file uploaded");
//   }

//   // PDF
//   if (file.mimetype === "application/pdf") {

//     const pdfParse = (await import("pdf-parse")).default;
//     const data = await pdfParse(file.buffer);

//     return data.text;
//   }

//   // DOCX
//   if (
//     file.mimetype ===
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
//     file.mimetype.includes("word")
//   ) {
//     const result = await mammoth.extractRawText({ buffer: file.buffer });
//     return result.value;
//   }

//   return file.buffer.toString();
// }
import { createRequire } from "module";
import mammoth from "mammoth";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export async function parseResume(file) {

  if (!file) {
    throw new Error("No file uploaded");
  }

  // PDF
  if (file.mimetype === "application/pdf") {
    const data = await pdfParse(file.buffer);
    return data.text;
  }

  // DOCX
  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype.includes("word")
  ) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }

  return file.buffer.toString();
}