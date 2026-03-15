const fs = require('fs');
const path = require('path');
const { generateEmbedding } = require('../memory/vectorMemory');

async function processFile(filename) {
  console.log(`Processing ${filename}...`);
  const filePath = path.join(__dirname, filename);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  let totalProcessed = 0;

  async function processNode(node) {
    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) {
        if (typeof node[i] === 'object' && node[i] !== null) {
          // It's an array of objects (like courses.json/govSchemes.json)
          const textToEmbed = JSON.stringify(node[i]);
          const embedding = await generateEmbedding(textToEmbed);
          node[i].embedding = embedding;
          totalProcessed++;
        } else if (typeof node[i] === 'string') {
          // If it's a string, we might just leave it or wrap it
          // Wait, if it's string, we can't easily attach an embedding property without changing structure.
          // Let's just not attach embeddings to primitive strings directly, or convert them.
          // Let's skip primitive strings for now so we don't break existing parsing.
        }
      }
    } else if (typeof node === 'object' && node !== null) {
      // It's an object of categories (like skillRoadmap.json or top level of courses.json)
      for (const [key, value] of Object.entries(node)) {
        if (Array.isArray(value)) {
          await processNode(value);
        } else if (typeof value === 'object') {
           // Create embedding for the entire object (like skill phases for a role)
           const textToEmbed = JSON.stringify(value);
           const embedding = await generateEmbedding(textToEmbed);
           value.embedding = embedding;
           totalProcessed++;
           // We might also recursively traverse
           await processNode(value);
        }
      }
    }
  }

  await processNode(data);

  const outFilename = filename.replace('.json', '_embedded.json');
  const outPath = path.join(__dirname, outFilename);
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log(`Saved embedded data to ${outFilename}. Processed ${totalProcessed} items.`);
}

async function main() {
  try {
    const files = ['courses.json', 'govSchemes.json', 'skillRoadmap.json'];
    for (const file of files) {
      if (fs.existsSync(path.join(__dirname, file))) {
        await processFile(file);
      } else {
        console.warn(`File ${file} not found. Skipping.`);
      }
    }
    console.log("All dataset embeddings generated and stored successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error generating embeddings:", error);
    process.exit(1);
  }
}

main();
