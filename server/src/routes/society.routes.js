import express from 'express';
import Society from '../models/Society.js';

const router = express.Router();

// GET all societies
router.get('/', async (req, res) => {
  try {
    const societies = await Society.find();
    res.status(200).json(societies);
  } catch (error) {
    console.error('Error fetching societies:', error);
    res.status(500).json({ error: 'Failed to fetch societies' });
  }
});

// GET single society by id
router.get('/:id', async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);

    if (!society) {
      return res.status(404).json({ error: 'Society not found' });
    }

    res.status(200).json(society);
  } catch (error) {
    console.error('Error fetching society:', error);
    res.status(500).json({ error: 'Failed to fetch society' });
  }
});

// CREATE society
router.post('/', async (req, res) => {
  try {
    const society = new Society(req.body);
    await society.save();
    res.status(201).json(society);
  } catch (error) {
    console.error('Error creating society:', error);
    res.status(400).json({ error: error.message });
  }
});

// UPDATE society
router.put('/:id', async (req, res) => {
  try {
    const updatedSociety = await Society.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedSociety) {
      return res.status(404).json({ error: 'Society not found' });
    }

    res.status(200).json(updatedSociety);
  } catch (error) {
    console.error('Error updating society:', error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE society
router.delete('/:id', async (req, res) => {
  try {
    const deletedSociety = await Society.findByIdAndDelete(req.params.id);

    if (!deletedSociety) {
      return res.status(404).json({ error: 'Society not found' });
    }

    res.status(200).json({ message: 'Society deleted successfully' });
  } catch (error) {
    console.error('Error deleting society:', error);
    res.status(500).json({ error: 'Failed to delete society' });
  }
});

export default router;