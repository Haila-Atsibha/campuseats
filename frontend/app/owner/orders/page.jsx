"use client";
import { useEffect, useState } from "react";

export default function OwnerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    const res = await fetch("http://localhost:5000/api/owner/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    await fetch(`http://localhost:5000/api/order-status/update-status/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="border p-3 rounded">
            <div className="mb-2">Order #{order.id} – Total: ${order.total}</div>
            <ul className="mb-2">
              {order.items.map((item) => (
                <li key={item.id}>{item.food.name} x {item.quantity}</li>
              ))}
            </ul>
            <div className="flex gap-2">
              {["PENDING", "PREPARING", "READY", "DELIVERED"].map((status) => (
                <button
                  key={status}
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => updateStatus(order.id, status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
