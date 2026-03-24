import express from "express";
import Event from "../models/Event.js";
import Society from "../models/Society.js";
import mongoose from "mongoose";

const router = express.Router();

// ==========================================
// 1. Static & Filter Routes (Sab se Pehle)
// ==========================================

// Get All Upcoming Events
router.get("/filter/upcoming", async (req, res) => {
  console.log("GET /filter/upcoming hit");
  try {
    const events = await Event.find({ status: "upcoming" });
    res.json(events);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get All Ended Events
router.get("/filter/ended", async (req, res) => {
  try {
    const events = await Event.find({ status: "ended" });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Events
router.get("/", async (req, res) => {
  console.log("GET /events hit");
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// 2. Society Specific Routes (Bich Mein)
// ==========================================

// Get Events by Society
router.get("/society/:societyId", async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.params.societyId });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Upcoming Events by Society
router.get("/society/:societyId/upcoming", async (req, res) => {
  try {
    const events = await Event.find({
      organizer: req.params.societyId,
      status: "upcoming",
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Ended Events by Society
router.get("/society/:societyId/ended", async (req, res) => {
  try {
    const events = await Event.find({
      organizer: req.params.societyId,
      status: "ended",
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// 3. Dynamic ID Specific Routes (Sab se Aakhir Mein)
// ==========================================

// Create Event
router.post("/", async (req, res) => {
  try {
    const { organizer } = req.body;

    if (!mongoose.Types.ObjectId.isValid(organizer)) {
      return res.status(400).json({ error: "Invalid organizer ID" });
    }

    const societyExists = await Society.findById(organizer);
    if (!societyExists) {
      return res.status(404).json({ error: "Organizer (Society) not found" });
    }

    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Single Event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Event
router.put("/:id", async (req, res) => {
  try {
    const { organizer } = req.body;

    if (organizer && !mongoose.Types.ObjectId.isValid(organizer)) {
      return res.status(400).json({ error: "Invalid organizer ID" });
    }

    if (organizer) {
      const societyExists = await Society.findById(organizer);
      if (!societyExists) {
        return res.status(404).json({ error: "Organizer (Society) not found" });
      }
    }

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Event
router.delete("/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;