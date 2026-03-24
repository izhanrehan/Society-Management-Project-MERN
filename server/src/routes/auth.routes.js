import express from "express";
import SocietyAdmin from "../models/SocietyAdmin.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const admin = await SocietyAdmin.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!admin) {
      return res.status(401).json({ error: "Admin not found" });
    }

    if (admin.password !== password) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token,
      userId: admin._id,
      name: admin.name,
    });
  } catch (error) {
    console.error("Auth login error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;