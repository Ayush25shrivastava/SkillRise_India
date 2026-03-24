import * as pdf from 'pdf-parse';
console.log('PDF object:', pdf);
console.log('Keys:', Object.keys(pdf));
if (typeof pdf === 'function') console.log('It is a function');
if (pdf.default) console.log('It has a default export');
