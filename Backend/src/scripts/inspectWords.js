import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Word from '../models/Word.js';
import { connectDB } from '../lib/db.js';

async function inspect() {
  await connectDB(process.env.MONGO_URL);
  const total = await Word.countDocuments();
  const active = await Word.countDocuments({ isActive: true });
  const docs = await Word.find({ isActive: true }).limit(10).lean();
  console.log('total:', total, 'active:', active);
  console.log('docs sample:', docs);
  process.exit(0);
}
inspect().catch(err => { console.error(err); process.exit(1); });
