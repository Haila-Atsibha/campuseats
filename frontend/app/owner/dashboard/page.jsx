"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function OwnerDashboard() {
  const [cafes, setCafes] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/owner/cafes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCafes(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCafes();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
      <Link href="/owner/foods" className="text-blue-500 underline">
        Manage Foods
      </Link>
      <Link href="/owner/orders" className="text-blue-500 underline ml-4">
        View Orders
      </Link>
      <ul className="mt-4 space-y-2">
        {cafes.map((cafe) => (
          <li key={cafe.id} className="border p-2 rounded">
            {cafe.name} – {cafe.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
