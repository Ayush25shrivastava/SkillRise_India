/**
 * seed_pinecone.js
 * 
 * Seeds all three Pinecone data sources:
 * 
 *  1. job-skill.json    → "job-skills" index  (job_title + skills embedded)
 *  2. govSchemes.json   → "job-skills" index  (namespace: "govt-schemes")
 *                         Each entry = job_title + required_skills + recommended scheme names embedded
 *  3. resume text       → "chat-memory" index  (namespace: "resume:{userId}")
 *                         Harshvardhan's resume is embedded as chunked text
 * 
 * Embedding model: Xenova/bge-small-en-v1.5  →  384 dimensions (matches both Pinecone indexes)
 * Batch size: 100 vectors per upsert to stay within Pinecone free tier limits
 * 
 * Usage:
 *   node seed_pinecone.js
 */

require('dotenv').config();
const { Pinecone } = require('@pinecone-database/pinecone');
const { pipeline } = require('@xenova/transformers');
const fs = require('fs');
const path = require('path');

// ─── Configuration ────────────────────────────────────────────────────────────
const EMBEDDING_MODEL = 'Xenova/bge-small-en-v1.5';
const BATCH_SIZE = 100;  // Pinecone free tier: max 100 vectors per upsert
const DATA_DIR = path.join(__dirname, 'agentic-chatbot', 'data');

const JOB_SKILL_FILE   = path.join(DATA_DIR, 'job-skill.json');
const GOV_SCHEMES_FILE = path.join(DATA_DIR, 'govSchemes.json');

// Hard-coded resume text for Harshvardhan (since PDF was not uploaded to disk)
// Replace this with actual parsed text from pdf-parse if the PDF is available
const HARSHVARDHAN_RESUME_TEXT = `
Name: Harshvardhan
Role: Full Stack Developer / Software Engineer Intern Candidate

Skills: React, Node.js, JavaScript, HTML, CSS, MongoDB, Express.js, REST APIs,
Git, GitHub, TypeScript, Python, Data Structures, Algorithms, Problem Solving,
Agile, Scrum, Team Collaboration, Communication

Projects:
- Agentic Chatbot: Built a LangGraph-based multi-agent chatbot with Pinecone vector search,
  Gemini 2.5-flash and Groq LLM integration, resume parsing, career recommendations, 
  and skill gap analysis. Tech: Node.js, LangChain, Pinecone, MongoDB, React.

- MERN Projects: Multiple full-stack applications using MongoDB, Express, React, Node.js.
  Implemented authentication, RESTful APIs, and responsive UI.

Education:
- B.Tech Computer Science (ongoing)

Experience:
- Personal Projects in Full Stack Development
- Open Source contributions
- Hackathon participant

Career Goals: Software Engineer Intern (SWE Intern), Full Stack Developer role,
targeting companies in Web Development and Software Engineering industry.
`;

// ─── Embedding Generator (singleton pipeline) ─────────────────────────────────
let _embedder = null;
async function getEmbedder() {
  if (!_embedder) {
    console.log('[Embedder] Loading bge-small-en-v1.5 model...');
    _embedder = await pipeline('feature-extraction', EMBEDDING_MODEL, { quantized: true });
    console.log('[Embedder] Model loaded ✓');
  }
  return _embedder;
}

async function embed(text) {
  const embedder = await getEmbedder();
  const output = await embedder(text.trim().substring(0, 2000), { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

// ─── Pinecone Helpers ──────────────────────────────────────────────────────────
async function getPineconeIndex(indexName) {
  const apiKey = process.env.PINECONE_API_KEY;
  if (!apiKey) throw new Error('PINECONE_API_KEY not set in .env');
  const pinecone = new Pinecone({ apiKey });
  return pinecone.index(indexName);
}

async function upsertBatch(index, vectors, namespace) {
  if (!vectors || vectors.length === 0) {
    console.warn('  [Upsert] No vectors to upsert — skipping.');
    return;
  }
  const ns = namespace ? index.namespace(namespace) : index;
  for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
    const batch = vectors.slice(i, i + BATCH_SIZE);
    await ns.upsert({ records: batch });
    console.log(`  [Upsert] ${i + batch.length}/${vectors.length} vectors pushed${namespace ? ` (ns: ${namespace})` : ''}`);
  }
}

// ─── 1. Seed job-skill.json ───────────────────────────────────────────────────
async function seedJobSkills() {
  console.log('\n════════════════════════════════════════');
  console.log('  STEP 1: Seeding job-skill.json → "job-skills" index');
  console.log('════════════════════════════════════════');

  if (!fs.existsSync(JOB_SKILL_FILE)) {
    console.warn(`  [SKIP] File not found: ${JOB_SKILL_FILE}`);
    return;
  }

  const jobs = JSON.parse(fs.readFileSync(JOB_SKILL_FILE, 'utf-8'));
  console.log(`  Loaded ${jobs.length} job entries from job-skill.json`);

  const index = await getPineconeIndex('job-skills');
  const vectors = [];

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    try {
      const skillsList = Array.isArray(job.skills) ? job.skills.join(', ') : '';
      const textToEmbed = `Job Title: ${job.job_title}. Skills: ${skillsList}. Industry: ${job.industry_vertical || 'Tech'}`;
      const vector = await embed(textToEmbed);
      vectors.push({
        id: `jobskill_${i}`,
        values: vector,
        metadata: {
          jobTitle: job.job_title,
          requiredSkills: skillsList,
          industry: job.industry_vertical || 'Tech',
          source: 'job-skill.json'
        }
      });
    } catch (e) {
      console.warn(`  [WARN] Skipping job ${i} (${job.job_title}): ${e.message}`);
    }
    if ((i + 1) % 50 === 0) console.log(`  Embedded ${i + 1}/${jobs.length} jobs...`);
  }

  console.log(`  All ${vectors.length} job embeddings generated. Upserting to Pinecone...`);
  await upsertBatch(index, vectors);
  console.log(`  ✅ job-skill.json seeded: ${vectors.length} vectors in "job-skills" index`);
}

// ─── 2. Seed govSchemes.json ──────────────────────────────────────────────────
async function seedGovSchemes() {
  console.log('\n════════════════════════════════════════');
  console.log('  STEP 2: Seeding govSchemes.json → "job-skills" index (namespace: govt-schemes)');
  console.log('════════════════════════════════════════');

  if (!fs.existsSync(GOV_SCHEMES_FILE)) {
    console.warn(`  [SKIP] File not found: ${GOV_SCHEMES_FILE}`);
    return;
  }

  const schemes = JSON.parse(fs.readFileSync(GOV_SCHEMES_FILE, 'utf-8'));
  console.log(`  Loaded ${schemes.length} entries from govSchemes.json`);

  const index = await getPineconeIndex('job-skills');
  const vectors = [];

  for (let i = 0; i < schemes.length; i++) {
    const entry = schemes[i];
    try {
      const skillsList = Array.isArray(entry.required_skills) ? entry.required_skills.join(', ') : '';
      const schemeNames = Array.isArray(entry.recommended_government_schemes)
        ? entry.recommended_government_schemes.map(s => `${s.name} by ${s.provider}`).join('; ')
        : '';
      const textToEmbed = `Job: ${entry.job_title}. Skills needed: ${skillsList}. Government schemes: ${schemeNames}`;
      const vector = await embed(textToEmbed);
      // Truncate schemes metadata to stay under Pinecone 40KB metadata limit
      const schemesStr = JSON.stringify(entry.recommended_government_schemes || []);
      vectors.push({
        id: `govscheme_${entry.job_id || i}`,
        values: vector,
        metadata: {
          jobId: String(entry.job_id || i),
          jobTitle: entry.job_title,
          requiredSkills: skillsList,
          schemes: schemesStr.substring(0, 2000),  // Pinecone metadata size limit
          source: 'govSchemes.json'
        }
      });
    } catch (e) {
      console.warn(`  [WARN] Skipping scheme entry ${i}: ${e.message}`);
    }
    if ((i + 1) % 50 === 0) console.log(`  Embedded ${i + 1}/${schemes.length} scheme entries...`);
  }

  console.log(`  All ${vectors.length} scheme embeddings generated. Upserting to Pinecone...`);
  await upsertBatch(index, vectors, 'govt-schemes');
  console.log(`  ✅ govSchemes.json seeded: ${vectors.length} vectors in "job-skills/govt-schemes" namespace`);
}

// ─── 3. Seed Resume ────────────────────────────────────────────────────────────
async function seedResume() {
  console.log('\n════════════════════════════════════════');
  console.log('  STEP 3: Seeding Harshvardhan resume → "chat-memory" index (namespace: resume)');
  console.log('════════════════════════════════════════');

  // Try to find and parse the PDF first
  const possiblePaths = [
    path.join(__dirname, 'harshvardhan_resume.pdf'),
    path.join(__dirname, 'agentic-chatbot', 'harshvardhan_resume.pdf'),
    path.join(__dirname, 'uploads', 'harshvardhan_resume.pdf'),
    path.join(__dirname, 'backend', 'uploads', 'harshvardhan_resume.pdf'),
  ];

  let resumeText = HARSHVARDHAN_RESUME_TEXT;
  let source = 'hardcoded_resume_text';

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        const pdfParse = require('pdf-parse');
        const buffer = fs.readFileSync(p);
        const { text } = await pdfParse(buffer);
        resumeText = text;
        source = p;
        console.log(`  Found and parsed PDF: ${p}`);
        break;
      } catch (e) {
        console.warn(`  PDF parse error for ${p}: ${e.message}`);
      }
    }
  }

  if (source === 'hardcoded_resume_text') {
    console.log('  No PDF found. Using hardcoded resume text.');
  }

  // Chunk the resume text into overlapping segments for better retrieval
  const CHUNK_SIZE = 500;   // chars per chunk
  const CHUNK_OVERLAP = 100;
  const chunks = [];

  for (let start = 0; start < resumeText.length; start += (CHUNK_SIZE - CHUNK_OVERLAP)) {
    const chunk = resumeText.substring(start, start + CHUNK_SIZE).trim();
    if (chunk.length > 20) chunks.push(chunk);  // skip tiny chunks
    if (start + CHUNK_SIZE >= resumeText.length) break;
  }

  // Also add a full summary chunk
  chunks.unshift(resumeText.trim().substring(0, 1500));

  console.log(`  Created ${chunks.length} resume chunks for embedding`);

  const index = await getPineconeIndex('chat-memory');
  const vectors = [];

  for (let i = 0; i < chunks.length; i++) {
    const vector = await embed(chunks[i]);
    vectors.push({
      id: `resume_harshvardhan_chunk_${i}`,
      values: vector,
      metadata: {
        userId: 'harshvardhan',
        chunkIndex: i,
        text: chunks[i].substring(0, 500),   // store first 500 chars as preview
        source: source === 'hardcoded_resume_text' ? 'resume_text' : 'resume_pdf',
        type: 'resume'
      }
    });
  }

  console.log(`  ${vectors.length} resume chunk embeddings generated. Upserting to Pinecone...`);
  await upsertBatch(index, vectors, 'resume');
  console.log(`  ✅ Resume seeded: ${vectors.length} chunks in "chat-memory/resume" namespace`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀 Pinecone Seeding Script Started');
  console.log(`   Embedding Model: ${EMBEDDING_MODEL}  (384 dimensions)`);
  console.log(`   Pinecone API Key: ${process.env.PINECONE_API_KEY ? 'Loaded ✓' : 'MISSING ✗'}`);

  const startTime = Date.now();

  try {
    await seedJobSkills();
    await seedGovSchemes();
    await seedResume();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✅ ALL DONE in ${elapsed}s`);
    console.log('\n📊 Summary:');
    console.log('   "job-skills" index   — job roles + skills (default namespace)');
    console.log('   "job-skills" index   — govt schemes (namespace: govt-schemes)');
    console.log('   "chat-memory" index  — resume chunks  (namespace: resume)');
    console.log('\nYou can now test semantic search via the chatbot!');
  } catch (err) {
    console.error('\n❌ Seeding failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  }

  process.exit(0);
}

main();
