"use client";
import { useEffect, useState } from "react";

export default function OwnerFoodsPage() {
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", imageUrl: "" });
  const token = localStorage.getItem("token");

  const fetchFoods = async () => {
    const res = await fetch("http://localhost:5000/api/food/myfoods", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setFoods(data);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/api/food/create", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setForm({ name: "", description: "", price: "", imageUrl: "" });
    fetchFoods();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/food/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchFoods();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Foods</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-1"
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-1"
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-1"
        />
        <input
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          className="border p-1"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
          Add Food
        </button>
      </form>

      <ul className="space-y-2">
        {foods.map((food) => (
          <li key={food.id} className="border p-2 flex justify-between">
            <div>{food.name} - ${food.price}</div>
            <button onClick={() => handleDelete(food.id)} className="text-red-500">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
