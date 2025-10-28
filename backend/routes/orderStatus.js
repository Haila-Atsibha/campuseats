import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import pkg from "../generated/prisma/index.js";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const router = express.Router();

// ✅ Update order status (for café owners)
router.put("/update-status/:orderId",  authMiddleware(), async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body; // expected: "PREPARING", "READY", "DELIVERED"
  const userId = req.userId;

  // Validate status
  const validStatuses = ["PENDING", "PREPARING", "READY", "DELIVERED"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid order status" });
  }

  try {
    // Find the order and make sure the user owns the cafe
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: { cafe: true }
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if the logged-in user is the owner of the cafe
    if (order.cafe.ownerId !== userId) {
      return res.status(403).json({ error: "Only the café owner can update this order" });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status }
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

export default router;
