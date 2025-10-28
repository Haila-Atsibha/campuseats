"use client";
import { useEffect, useState } from "react";

export default function OwnerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [newOrderIds, setNewOrderIds] = useState([]); // track newly added orders

  // Get token safely in browser
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  // Fetch orders
  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/owner-orders/my-cafe-orders",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders((prev) => {
          const prevIds = prev.map((o) => o.id);
          const newOrders = data.filter((o) => !prevIds.includes(o.id));
          if (newOrders.length) {
            setNewOrderIds((ids) => [...ids, ...newOrders.map((o) => o.id)]);
            // Remove highlight after 5s
            setTimeout(
              () => setNewOrderIds((ids) => ids.filter((id) => !newOrders.map((o) => o.id).includes(id))),
              5000
            );
          }
          return data || [];
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // auto-refresh
    return () => clearInterval(interval);
  }, [token]);

  // Mark order as READY
  const markReady = async (orderId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/order-status/ready/${orderId}`,
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to mark ready");
      const updatedOrder = await res.json();
      setOrders((prev) =>
        prev.map((o) =>
          o.id === updatedOrder.id
            ? { ...o, status: updatedOrder.status, items: o.items || [] }
            : o
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Undo ready → set status back to PREPARING
  const undoReady = async (orderId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/order-status/undo/${orderId}`,
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to undo ready");
      const updatedOrder = await res.json();
      setOrders((prev) =>
        prev.map((o) =>
          o.id === updatedOrder.id
            ? { ...o, status: updatedOrder.status, items: o.items || [] }
            : o
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return <div className="p-6 text-center text-gray-600">Loading orders...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Owner Dashboard</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`${
                newOrderIds.includes(order.id) ? "bg-yellow-100" : "bg-white"
              } shadow rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center transition`}
            >
              <div className="flex-1">
                <h2 className="font-semibold text-lg mb-1">
                  Order #{order.id} — {order.student?.name}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      order.status === "READY"
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <ul className="pl-4 text-gray-700 space-y-1">
                  {(order.items || []).map((item) => (
                    <li key={item.id}>
                      {item.food?.name || "Unknown"} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:ml-4 mt-3 md:mt-0 space-y-2 md:space-y-0 md:space-x-2">
                {order.status !== "READY" ? (
                  <button
                    onClick={() => markReady(order.id)}
                    className="rounded-lg bg-green-500 px-4 py-2 text-white font-semibold hover:bg-green-600 transition"
                  >
                    Mark as Ready
                  </button>
                ) : (
                  <button
                    onClick={() => undoReady(order.id)}
                    className="rounded-lg bg-yellow-500 px-4 py-2 text-white font-semibold hover:bg-yellow-600 transition"
                  >
                    Undo Ready
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
