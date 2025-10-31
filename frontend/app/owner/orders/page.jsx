"use client";
import { useEffect, useState } from "react";

export default function OwnerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);

  // ✅ Get token on mount
  useEffect(() => {
    const stored = localStorage.getItem("token");
    setToken(stored);
  }, []);

  // ✅ Fetch orders
  useEffect(() => {
    if (!token) return;

    async function fetchOrders() {
      try {
        const res = await fetch("http://localhost:5000/api/owner-orders/my-cafe-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [token]);

  // ✅ Mark order as READY
  const markReady = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/order-status/ready/${orderId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to mark order as ready");

      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? { ...o, status: updated.status } : o))
      );
    } catch (err) {
      console.error(err);
      alert("Error marking order as ready");
    }
  };

  // ✅ Undo READY status
  const undoReady = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/order-status/undo/${orderId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to undo ready");

      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? { ...o, status: updated.status } : o))
      );
    } catch (err) {
      console.error(err);
      alert("Error undoing order status");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading orders...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">☕ Café Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">No orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const total = order.items?.reduce(
              (sum, i) => sum + i.food.price * i.quantity,
              0
            );
            return (
              <div
                key={order.id}
                className={`bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition ${
                  order.status === "READY"
                    ? "border-green-300"
                    : order.status === "PREPARING"
                    ? "border-yellow-300"
                    : ""
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold text-lg text-gray-800">
                    Order #{order.id}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : order.status === "READY"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-2">
                  From: <span className="font-medium">{order.student.name}</span> (
                  {order.student.email})
                </p>

                <ul className="divide-y divide-gray-200 mb-3">
                  {order.items.map((item) => (
                    <li key={item.id} className="py-2 flex justify-between text-gray-700">
                      <span>{item.food.name}</span>
                      <span>
                        ${item.food.price} × {item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="text-right font-semibold text-gray-800 mb-3">
                  Total: ${total.toFixed(2)}
                </p>

                {/* ✅ Action Buttons */}
                <div className="flex justify-end gap-2">
                  {order.status !== "READY" ? (
                    <button
                      onClick={() => markReady(order.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      Mark as Ready
                    </button>
                  ) : (
                    <button
                      onClick={() => undoReady(order.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      Undo Ready
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
