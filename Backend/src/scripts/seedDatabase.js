import mongoose from "mongoose";
import dotenv from "dotenv/config";
import Word from "../models/Word.js";
import { User } from "../models/User.js";
import { connectDB } from "../lib/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedDatabase() {
  try {
    // Connect to database
    await connectDB(process.env.MONGO_URL);
    console.log("Connected to database");

    // Read sample words
    const sampleDataPath = path.join(__dirname, "../data/sampleWords.json");
    if (!fs.existsSync(sampleDataPath)) {
      throw new Error(`Sample data file not found at ${sampleDataPath}`);
    }
    const sampleData = JSON.parse(fs.readFileSync(sampleDataPath, "utf8"));

    // Ensure an admin user exists to set as addedBy
    let admin = await User.findOne({ email: 'admin@local' });
    if (!admin) {
      admin = new User({ username: 'admin', email: 'admin@local', password: 'admin123', role: 'Admin' });
      await admin.save();
      console.log('Created admin user for seeding');
    }

    // Clear existing words (optional - remove this if you want to keep existing data)
    await Word.deleteMany({});
    console.log("Cleared existing words");

    // Insert sample words attaching addedBy
    const wordsToInsert = sampleData.words.map(w => ({ ...w, addedBy: admin._id }));
    const insertedWords = await Word.insertMany(wordsToInsert);
    console.log(`Inserted ${insertedWords.length} words successfully`);

    // Display some statistics
    const totalWords = await Word.countDocuments();
    const domainStats = await Word.aggregate([
      { $group: { _id: "$domain", count: { $sum: 1 } } }
    ]);

    console.log("\nDatabase seeded successfully!");
    console.log(`Total words: ${totalWords}`);
    console.log("\nWords by domain:");
    domainStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} words`);
    });

    process.exit(0);

  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();

