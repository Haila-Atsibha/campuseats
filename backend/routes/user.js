// routes/user.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pkg from "../generated/prisma/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import dotenv from "dotenv";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
dotenv.config();

const router = express.Router();

// ✅ Get current user info
router.get("/me", authMiddleware(), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// ✅ Change password route
router.post("/change-password", authMiddleware(), async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Both old and new passwords are required" });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update in DB
    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update password" });
  }
});

export default router;
