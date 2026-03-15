const fs = require('fs');
const path = require('path');
const { Pinecone } = require("@pinecone-database/pinecone");
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { generateEmbedding } = require('../memory/vectorMemory');

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.index(process.env.PINECONE_INDEX_NAME || 'chat-memory');

function flattenDataset(filename, data) {
  let records = [];

  function processNode(node) {
    if (Array.isArray(node)) {
      for (const item of node) {
        if (typeof item === 'object' && item !== null) {
          records.push({
            type: filename.replace('.json', ''),
            content: JSON.stringify(item),
            rawObject: item
          });
        }
      }
    } else if (typeof node === 'object' && node !== null) {
      for (const [key, value] of Object.entries(node)) {
        if (Array.isArray(value)) {
          processNode(value);
        } else if (typeof value === 'object') {
          records.push({
            type: filename.replace('.json', ''),
            content: JSON.stringify(value),
            rawObject: value,
            metadata: { category: key }
          });
          processNode(value);
        }
      }
    }
  }

  processNode(data);
  return records;
}

async function processFile(filename) {
  console.log(`Processing ${filename} specifically for Pinecone Semantic Search...`);
  const filePath = path.join(__dirname, filename);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  const records = flattenDataset(filename, data);
  console.log(`Extracted ${records.length} items from ${filename}`);

  let totalUpserted = 0;
  
  for (let i = 0; i < records.length; i++) {
    const item = records[i];
    
    // We expect generateDatasetEmbeddings was already run or we run it now
    let vector = item.rawObject.embedding;
    
    if (!vector) {
      vector = await generateEmbedding(item.content);
    }
    
    if (!vector || vector.length === 0) continue;

    // Build the pinecone record
    const recordId = `${item.type}_${Date.now()}_${i}`;
    const pRecord = {
      id: recordId,
      values: vector,
      metadata: {
        type: "dataset_" + item.type,
        content: item.content,
        timestamp: Date.now()
      }
    };
    
    if (item.metadata?.category) {
      pRecord.metadata.category = item.metadata.category;
    }

    try {
      await index.upsert({ records: [pRecord] });
      totalUpserted++;
    } catch (err) {
      console.error(`Failed to upsert to Pinecone for ${filename}:`, err);
    }
  }

  console.log(`Saved ${totalUpserted} embedded items from ${filename} to Pinecone index.`);
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
    console.log("All datasets embedded into Pinecone permanently globally successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error generating/upserting vector embeddings:", error);
    process.exit(1);
  }
}

main();
