import express from "express";
import pkg from "../generated/prisma/index.js";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const router = express.Router();

// ✅ Get all cafes (owners)
router.get("/", async (req, res) => {
  try {
    const cafes = await prisma.user.findMany({
      where: { role: "CAFE_OWNER" },
      select: {
        id: true,
        name: true,
        email: true,
        foods: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
          },
        },
      },
    });

    res.json(cafes);
  } catch (err) {
    console.error("Error fetching cafes:", err);
    res.status(500).json({ error: "Failed to fetch cafes" });
  }
});

// ✅ Get a single cafe (owner) and their foods
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const cafe = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        foods: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!cafe) {
      return res.status(404).json({ error: "Cafe not found" });
    }

    res.json(cafe);
  } catch (err) {
    console.error("Error fetching cafe:", err);
    res.status(500).json({ error: "Failed to fetch cafe" });
  }
});



export default router;
