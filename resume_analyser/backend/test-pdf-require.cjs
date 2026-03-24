const { createRequire } = require('module');
const req = createRequire(__filename);
const pdf = req('pdf-parse');
console.log('PDF object:', pdf);
if (typeof pdf === 'function') console.log('It is a function');
if (pdf.PDFParse) console.log('It has PDFParse class');
