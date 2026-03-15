// import mammoth from "mammoth";

// export async function parseResume(file) {

//   if (!file) {
//     throw new Error("No file uploaded");
//   }

//   // PDF
//   if (file.mimetype === "application/pdf") {

//     const pdfModule = await import("pdf-parse");
//     const pdfParse = pdfModule.default || pdfModule;

//     const data = await pdfParse(file.buffer);

//     return data.text;
//   }

//   // DOCX
//   if (
//     file.mimetype ===
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
//     file.mimetype.includes("word")
//   ) {

//     const result = await mammoth.extractRawText({
//       buffer: file.buffer
//     });

//     return result.value;
//   }

//   return file.buffer.toString();
// }
// backend/src/services/resumeParser.js
import pdf from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

export async function parseResume(file) {

  if (!file) {
    throw new Error("No file uploaded");
  }

  // PDF
  if (file.mimetype === "application/pdf") {

    const data = await pdf(file.buffer);

    return data.text;
  }

  // DOCX
  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype.includes("word")
  ) {

    const result = await mammoth.extractRawText({
      buffer: file.buffer
    });

    return result.value;
  }

  return file.buffer.toString();
}