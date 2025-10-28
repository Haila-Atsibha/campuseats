"use client";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/order", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading orders...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-lg shadow space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">Order #{order.id}</span>
                <span
                  className={`px-2 py-1 rounded text-white font-semibold ${
                    order.status === "PENDING"
                      ? "bg-gray-400"
                      : order.status === "PREPARING"
                      ? "bg-yellow-500"
                      : order.status === "READY"
                      ? "bg-blue-500"
                      : "bg-green-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div>
                {order.items.map((item) => (
                  <p key={item.id}>
                    {item.food.name} x {item.quantity} - $
                    {item.price.toFixed(2)}
                  </p>
                ))}
              </div>

              <div className="flex justify-between font-bold mt-2">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
