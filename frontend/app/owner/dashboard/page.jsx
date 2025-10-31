"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OwnerHomePage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    async function fetchStats() {
      try {
        const res = await fetch("http://localhost:5000/api/owner-orders/my-cafe-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const totalOrders = data.length;
        const totalRevenue = data.reduce(
          (sum, order) =>
            sum +
            order.items.reduce(
              (subtotal, item) => subtotal + item.food.price * item.quantity,
              0
            ),
          0
        );
        const pendingOrders = data.filter((o) => o.status !== "READY" && o.status !== "DELIVERED").length;
        setStats({ totalOrders, totalRevenue, pendingOrders });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [token]);

  if (loading)
    return <div className="p-8 text-center text-gray-600">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔹 Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <h1
            onClick={() => router.push("/owner/home")}
            className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text cursor-pointer"
          >
            CampusEats Owner
          </h1>

          <nav className="flex items-center gap-6 text-gray-700 font-medium">
            <button onClick={() => router.push("/owner/home")} className="hover:text-orange-500">
              Home
            </button>
            <button onClick={() => router.push("/owner/orders")} className="hover:text-orange-500">
              Orders
            </button>
            <button onClick={() => router.push("/owner/menu")} className="hover:text-orange-500">
              Menu
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/signin");
              }}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* 🔹 Dashboard Content */}
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-orange-500">
            <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalOrders}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-pink-500">
            <h3 className="text-gray-500 text-sm font-medium">Pending Orders</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pendingOrders}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Quick Links</h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/owner/orders")}
                className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition"
              >
                View Orders
              </button>
              <button
                onClick={() => router.push("/owner/updateMenu")}
                className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg transition"
              >
                Manage Menu
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Welcome Back!</h3>
            <p className="text-gray-600">
              Keep an eye on new orders, manage your café’s menu, and mark meals as ready when
              they're prepared. This dashboard gives you a quick snapshot of your café’s activity.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
