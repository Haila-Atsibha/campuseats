"use client";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // ✅ Fetch cart items on load
  useEffect(() => {
    async function fetchCart() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch cart");

        const data = await res.json();
        setCartItems(data);
        const sum = data.reduce((acc, item) => acc + item.food.price * item.quantity, 0);
        setTotal(sum);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  // ✅ Remove item
  const removeItem = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/cart/remove/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Checkout (create order)
  const checkout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/order/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Checkout failed");
      alert("✅ Order placed successfully!");
      setCartItems([]);
      setTotal(0);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading your cart...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white shadow rounded-lg p-4"
            >
              <div>
                <h2 className="font-semibold text-gray-800">{item.food.name}</h2>
                <p className="text-gray-500 text-sm">{item.food.description}</p>
                <p className="text-orange-600 font-semibold">
                  ${item.food.price} × {item.quantity}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="rounded-lg bg-red-500 px-3 py-1 text-white hover:opacity-90"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6 flex justify-between items-center border-t pt-4">
            <span className="text-xl font-semibold">Total:</span>
            <span className="text-2xl font-bold text-orange-600">${total.toFixed(2)}</span>
          </div>

          <button
            onClick={checkout}
            className="mt-6 w-full rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-3 font-semibold text-white hover:opacity-90"
          >
            Checkout →
          </button>
        </div>
      )}
    </div>
  );
}
