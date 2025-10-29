"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CafeMenuPage() {
  const { id } = useParams();
  const [foods, setFoods] = useState([]);
  const [cafe, setCafe] = useState(null);
  const [message, setMessage] = useState("");
  const [addingItem, setAddingItem] = useState(null);

  // Fetch menu for this café
  useEffect(() => {
  async function fetchMenu() {
    try {
      const res = await fetch(`http://localhost:5000/api/cafe/${id}`);
      if (!res.ok) throw new Error("Failed to load menu");
      const data = await res.json();
      console.log("Fetched cafe data:", data); // <-- log here
      setCafe(data);
      setFoods(data.foods || []);
    } catch (error) {
      console.error("Failed to fetch menu:", error);
    }
  }
  fetchMenu();
}, [id]);


  // Add to Cart Handler
  async function handleAddToCart(foodId) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add items to your cart.");
      return;
    }

    setAddingItem(foodId);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ foodId, quantity: 1 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add to cart");

      setMessage("✅ Added to cart!");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to add to cart");
    } finally {
      setAddingItem(null);
    }
  }

  if (!cafe) return <div className="p-6 text-center">Loading menu...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">{cafe.name}</h1>
      <p className="text-gray-600 mb-6">{cafe.email}</p>

      {message && (
        <div
          className={`mb-4 text-center text-sm font-semibold ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {foods.map((food) => (
  <div key={food.id} className="bg-white shadow rounded-xl p-4 flex flex-col justify-between">
    <img
  src={food.imageUrl || "/fallback.jpg"}
  alt={food.name}
  className="w-full h-48 object-cover rounded-lg mb-3"
/>


    <div>
      <h2 className="text-lg font-semibold text-gray-800">{food.name}</h2>
      <p className="text-gray-600 text-sm mb-2">{food.description}</p>
    </div>

    <div className="flex justify-between items-center mt-3">
      <span className="font-semibold text-orange-600">${food.price}</span>
      <button
        onClick={() => handleAddToCart(food.id)}
        disabled={addingItem === food.id}
        className="rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 px-3 py-1 text-sm text-white hover:opacity-90 disabled:opacity-60"
      >
        {addingItem === food.id ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  </div>
))}

      </div>
    </div>
  );
}
