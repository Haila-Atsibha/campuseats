import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import pkg from "../generated/prisma/index.js"
const { PrismaClient } = pkg

const prisma = new PrismaClient()
const router = express.Router()

// Only customers can access this
router.get("/profile", authMiddleware(["CUSTOMER", "CAFE_OWNER"]), async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } })
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
})

export default router
