import mongoose from "mongoose";
import dotenv from "dotenv/config";
import Word from "../modules/word.js";
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
    const sampleData = JSON.parse(fs.readFileSync(sampleDataPath, "utf8"));

    // Clear existing words (optional - remove this if you want to keep existing data)
    await Word.deleteMany({});
    console.log("Cleared existing words");

    // Insert sample words
    const insertedWords = await Word.insertMany(sampleData.words);
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

