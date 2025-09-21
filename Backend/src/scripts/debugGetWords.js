import dotenv from 'dotenv/config';
import { connectDB } from '../lib/db.js';
import Word from '../models/Word.js';

async function run() {
  await connectDB(process.env.MONGO_URL);

  const filters = { isActive: true };
  const requestedCount = 3;

  console.log('DEBUG: CountDocuments with filters', filters);
  const totalMatching = await Word.countDocuments(filters);
  console.log('DEBUG: totalMatching =', totalMatching);

  console.log(`DEBUG: Running Word.getRandomWords(${requestedCount}, ${JSON.stringify(filters)})`);
  const words = await Word.getRandomWords(requestedCount, filters);
  console.log('DEBUG: getRandomWords returned count=', words.length);
  console.log('DEBUG: ids=', words.map(w => w._id ? w._id.toString() : w._id));
  console.log('DEBUG: docs=', words);

  // Also run a plain find to compare
  const plainFind = await Word.find(filters).limit(requestedCount).lean();
  console.log('DEBUG: plain find result count=', plainFind.length);
  console.log('DEBUG: plain ids=', plainFind.map(w => w._id.toString()));

  process.exit(0);
}

run().catch(err => { console.error('DEBUG ERROR', err); process.exit(1); });