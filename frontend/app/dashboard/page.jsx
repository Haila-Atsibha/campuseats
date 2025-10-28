"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentDashboard() {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCafes() {
      try {
        const res = await fetch("http://localhost:5000/api/cafe");
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Expected array but got:", data);
          setError("Failed to fetch cafés");
          setLoading(false);
          return;
        }

        setCafes(data);
      } catch (err) {
        console.error("Failed to fetch cafés:", err);
        setError("Failed to fetch cafés");
      } finally {
        setLoading(false);
      }
    }

    fetchCafes();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-pink-500">
              <span className="text-xl font-bold text-white">CE</span>
            </div>
            <span className="text-xl font-bold text-gray-800">CampusEats</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/profile">
              <button className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100">
                Profile
              </button>
            </Link>
            <Link href="/orders">
              <button className="rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 font-semibold text-white hover:opacity-90">
                My Orders
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          Welcome to CampusEats 🎓
        </h1>
        <p className="text-gray-600 mb-10 text-center">
          Order from your favorite campus cafés and restaurants — quick, easy, and delicious.
        </p>

        {loading ? (
          <p className="text-gray-500">Loading cafés...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : cafes.length === 0 ? (
          <p className="text-gray-500">No cafés available at the moment.</p>
        ) : (
          <div className="grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cafes.map((cafe) => (
              <div
                key={cafe.id}
                className="rounded-2xl border bg-white p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-2">{cafe.name}</h2>
                {cafe.description && (
                  <p className="text-gray-500 mb-4">{cafe.description}</p>
                )}
                <Link
                  href={`/cafes/${cafe.id}`}
                  className="inline-block rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 font-semibold text-white hover:opacity-90"
                >
                  View Menu →
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6">
        <div className="container mx-auto text-center text-sm text-gray-500">
          &copy; 2025 CampusEats. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
