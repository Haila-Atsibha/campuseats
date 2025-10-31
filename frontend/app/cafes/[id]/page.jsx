"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CafeMenuPage() {
  const { id } = useParams();
  const router = useRouter();
  const [foods, setFoods] = useState([]);
  const [cafe, setCafe] = useState(null);
  const [message, setMessage] = useState("");
  const [addingItem, setAddingItem] = useState(null);
  const [cartCount, setCartCount] = useState(0); // 🔹 Notification count
  const [quantities, setQuantities] = useState({}); // 🔹 Track quantity per food

  // 🔹 Load cart notification count from localStorage
  useEffect(() => {
    const savedCount = localStorage.getItem("cartNotificationCount");
    if (savedCount) setCartCount(parseInt(savedCount, 10));
  }, []);

  // Fetch menu for this café
  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch(`http://localhost:5000/api/cafe/${id}`);
        if (!res.ok) throw new Error("Failed to load menu");
        const data = await res.json();
        setCafe(data);
        setFoods(data.foods || []);
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      }
    }
    fetchMenu();
  }, [id]);

  // 🔹 Handle quantity input change
  function handleQuantityChange(foodId, value) {
    const qty = Math.max(1, parseInt(value) || 1); // prevent 0 or NaN
    setQuantities((prev) => ({ ...prev, [foodId]: qty }));
  }

  // 🔹 Add to Cart Handler
  async function handleAddToCart(foodId) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add items to your cart.");
      router.push("/signin");
      return;
    }

    const quantity = quantities[foodId] || 1; // default = 1

    setAddingItem(foodId);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ foodId, quantity }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add to cart");

      setMessage(`✅ Added ${quantity} item(s) to cart!`);

      // 🔹 Increase and persist notification count
      const newCount = cartCount + quantity;
      setCartCount(newCount);
      localStorage.setItem("cartNotificationCount", newCount);

      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to add to cart");
    } finally {
      setAddingItem(null);
    }
  }

  // 🔹 When Cart page is opened, reset the notification
  function handleCartClick() {
    router.push("/cart");
    setCartCount(0);
    localStorage.removeItem("cartNotificationCount");
  }

  if (!cafe) return <div className="p-6 text-center">Loading menu...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔸 HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <h1
            onClick={() => router.push("/")}
            className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text cursor-pointer"
          >
            CampusEats
          </h1>

          <nav className="flex items-center gap-6 text-gray-700 font-medium relative">
            <button onClick={() => router.push("/")} className="hover:text-orange-500">
              Home
            </button>
            <button onClick={() => router.push("/profile/favorites")} className="hover:text-orange-500">
              Favorites
            </button>
            <button onClick={() => router.push("/orderHistory")} className="hover:text-orange-500">
              Order History
            </button>

            {/* 🔹 Cart with persistent notification */}
            <div className="relative">
              <button onClick={handleCartClick} className="hover:text-orange-500">
                Cart
              </button>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>

            <button onClick={() => router.push("/profile")} className="hover:text-orange-500">
              Profile
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("cartNotificationCount");
                router.push("/signin");
              }}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* 🔸 MENU SECTION */}
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">{cafe.name}</h2>
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
            <div
              key={food.id}
              className="bg-white shadow rounded-xl p-4 flex flex-col justify-between transition hover:shadow-md"
            >
              <img
                src={food.imageUrl || "/fallback.jpg"}
                alt={food.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />

              <div>
                <h3 className="text-lg font-semibold text-gray-800">{food.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{food.description}</p>
              </div>

              <div className="flex justify-between items-center mt-3">
                <span className="font-semibold text-orange-600">${food.price}</span>

                {/* 🔹 Quantity Input */}
                <input
                  type="number"
                  min="1"
                  value={quantities[food.id] || 1}
                  onChange={(e) => handleQuantityChange(food.id, e.target.value)}
                  className="w-16 border border-gray-300 rounded-md px-2 py-1 text-sm text-center"
                />
              </div>

              <button
                onClick={() => handleAddToCart(food.id)}
                disabled={addingItem === food.id}
                className="mt-3 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 px-3 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60"
              >
                {addingItem === food.id ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
