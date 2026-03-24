import { PDFParse } from 'pdf-parse';
const pdf = new PDFParse();
console.log('Methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(pdf)));
