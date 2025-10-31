import express from "express";
import pkg from "../generated/prisma/index.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const router = express.Router();

/**
 * ✅ Public: Get all cafes (for customers to browse)
 */
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
            imageUrl: true,
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

/**
 * ✅ Public: Get a single cafe (for customer menu page)
 */
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

    if (!cafe) return res.status(404).json({ error: "Cafe not found" });
    res.json(cafe);
  } catch (err) {
    console.error("Error fetching cafe:", err);
    res.status(500).json({ error: "Failed to fetch cafe" });
  }
});

/**
 * 🔒 Private: Get logged-in cafe owner's own menu (for UpdateMenuPage)
 */
router.get("/menu/me", authMiddleware(), async (req, res) => {
  try {
    const ownerId = req.userId; // from token

    const cafe = await prisma.user.findUnique({
      where: { id: ownerId },
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

    if (!cafe) return res.status(404).json({ error: "Cafe not found" });
    res.json(cafe.foods);
  } catch (err) {
    console.error("Error fetching cafe menu:", err);
    res.status(500).json({ error: "Failed to fetch cafe menu" });
  }
});

export default router;
