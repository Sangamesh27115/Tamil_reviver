import express from "express";
import Word from "../models/Word.js";
import { authenticateToken, requireAdmin, requireTeacherOrAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get random words for games
router.get("/random", async (req, res) => {
  try {
    const { count = 10, domain, period, difficulty } = req.query;
    
    const filters = {};
    if (domain && domain !== 'All') filters.domain = domain;
    if (period && period !== 'All') filters.period = period;
    if (difficulty) filters.difficulty = difficulty;

    const words = await Word.getRandomWords(parseInt(count), filters);
    res.status(200).json({ words });
  } catch (error) {
    console.log("Error getting random words", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Search words
router.get("/search", async (req, res) => {
  try {
    const { q, domain, period, difficulty } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const filters = {};
    if (domain && domain !== 'All') filters.domain = domain;
    if (period && period !== 'All') filters.period = period;
    if (difficulty) filters.difficulty = difficulty;

    const words = await Word.searchWords(q, filters);
    res.status(200).json({ words });
  } catch (error) {
    console.log("Error searching words", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all words with filtering and pagination
router.get("/", async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      domain, 
      period, 
      difficulty, 
      search,
      isActive = true 
    } = req.query;

    // Build query
    let query = {};
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (domain) query.domain = domain;
    if (period) query.period = period;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { word: { $regex: search, $options: 'i' } },
        { meaning_ta: { $regex: search, $options: 'i' } },
        { meaning_en: { $regex: search, $options: 'i' } }
      ];
    }

    const words = await Word.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Word.countDocuments(query);

    res.json({
      words,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.log("Error fetching words:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get word by ID
router.get("/:id", async (req, res) => {
  try {
    const word = await Word.findById(req.params.id);
    
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    res.json(word);

  } catch (error) {
    console.log("Error fetching word:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add new word (admin only - you can add role check later)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      word,
      meaning_ta,
      meaning_en,
      domain,
      period,
      modern_equivalent,
      status,
      notes,
      difficulty
    } = req.body;

    // Validate required fields
    if (!word || !meaning_ta || !meaning_en || !domain || !period || !modern_equivalent || !status) {
      return res.status(400).json({ 
        message: 'Missing required fields: word, meaning_ta, meaning_en, domain, period, modern_equivalent, status' 
      });
    }

    // Check if word already exists
    const existingWord = await Word.findOne({ word });
    if (existingWord) {
      return res.status(400).json({ message: 'Word already exists' });
    }

    const newWord = new Word({
      word,
      meaning_ta,
      meaning_en,
      domain,
      period,
      modern_equivalent,
      status,
      notes,
      difficulty: difficulty || 'Medium',
      addedBy: req.user._id
    });

    await newWord.save();

    res.status(201).json(newWord);

  } catch (error) {
    console.log("Error creating word:", error);
    console.log("Error details:", error.message);
    console.log("Error stack:", error.stack);
    res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Update word
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const word = await Word.findById(req.params.id);
    
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    const updatedWord = await Word.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedWord);

  } catch (error) {
    console.log("Error updating word:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete word (soft delete)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const word = await Word.findById(req.params.id);
    
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    // Soft delete by setting isActive to false
    word.isActive = false;
    await word.save();

    res.json({ message: 'Word deleted successfully' });

  } catch (error) {
    console.log("Error deleting word:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Bulk import words from JSON
router.post("/bulk-import", authenticateToken, async (req, res) => {
  try {
    const { words } = req.body;

    if (!Array.isArray(words)) {
      return res.status(400).json({ message: 'Words must be an array' });
    }

    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const wordData of words) {
      try {
        // Check if word already exists
        const existingWord = await Word.findOne({ word: wordData.word });
        if (existingWord) {
          results.failed++;
          results.errors.push(`Word "${wordData.word}" already exists`);
          continue;
        }

        const newWord = new Word({
          word: wordData.word,
          meaning_ta: wordData.meaning_ta,
          meaning_en: wordData.meaning_en,
          domain: wordData.domain,
          period: wordData.period,
          modern_equivalent: wordData.modern_equivalent,
          status: wordData.status,
          notes: wordData.notes,
          difficulty: wordData.difficulty || 'Medium'
        });

        await newWord.save();
        results.success++;

      } catch (error) {
        results.failed++;
        results.errors.push(`Error importing "${wordData.word}": ${error.message}`);
      }
    }

    res.json({
      message: `Import completed. ${results.success} words imported successfully, ${results.failed} failed.`,
      results
    });

  } catch (error) {
    console.log("Error bulk importing words:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get word statistics
router.get("/stats/overview", async (req, res) => {
  try {
    const stats = await Word.aggregate([
      {
        $group: {
          _id: null,
          totalWords: { $sum: 1 },
          activeWords: {
            $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] }
          },
          inactiveWords: {
            $sum: { $cond: [{ $eq: ["$isActive", false] }, 1, 0] }
          }
        }
      }
    ]);

    const domainStats = await Word.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$domain", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const periodStats = await Word.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$period", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const difficultyStats = await Word.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$difficulty", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      overview: stats[0] || { totalWords: 0, activeWords: 0, inactiveWords: 0 },
      domainStats,
      periodStats,
      difficultyStats
    });

  } catch (error) {
    console.log("Error fetching word statistics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

