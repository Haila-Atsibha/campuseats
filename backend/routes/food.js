import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import pkg from "../generated/prisma/index.js"
const { PrismaClient } = pkg

const prisma = new PrismaClient()
const router = express.Router()

// ✅ Create food (only for owners)
router.post("/create", authMiddleware(["CAFE_OWNER"]), async (req, res) => {
  const { name, description, price, imageUrl } = req.body
  const userId = req.userId

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || user.role !== "CAFE_OWNER") {
      return res.status(403).json({ error: "Only café owners can add foods" })
    }

    const food = await prisma.food.create({
      data: { name, description, price: parseFloat(price), imageUrl, ownerId: userId },
    })

    res.status(201).json(food)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to create food" })
  }
})

// ✅ Get foods of the logged-in owner
router.get("/myfoods",  authMiddleware(), async (req, res) => {
  const userId = req.userId
  try {
    const foods = await prisma.food.findMany({ where: { ownerId: userId } })
    res.json(foods)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to fetch foods" })
  }
})

// ✅ Update a food item
router.put("/update/:id",  authMiddleware(), async (req, res) => {
  const { id } = req.params
  const { name, description, price, imageUrl } = req.body
  const userId = req.userId

  try {
    const food = await prisma.food.findUnique({ where: { id: parseInt(id) } })
    if (!food || food.ownerId !== userId) {
      return res.status(403).json({ error: "Not authorized" })
    }

    const updatedFood = await prisma.food.update({
      where: { id: parseInt(id) },
      data: { name, description, price: parseFloat(price), imageUrl },
    })

    res.json(updatedFood)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to update food" })
  }
})

// ✅ Delete a food item
router.delete("/delete/:id",  authMiddleware(), async (req, res) => {
  const { id } = req.params
  const userId = req.userId

  try {
    const food = await prisma.food.findUnique({ where: { id: parseInt(id) } })
    if (!food || food.ownerId !== userId) {
      return res.status(403).json({ error: "Not authorized" })
    }

    await prisma.food.delete({ where: { id: parseInt(id) } })
    res.json({ message: "Food deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to delete food" })
  }
})
// ✅ Get all foods (for students to browse)
router.get("/all", async (req, res) => {
  try {
    const foods = await prisma.food.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    res.json(foods)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to fetch foods" })
  }
})


export default router
