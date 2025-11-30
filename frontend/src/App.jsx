import React, { useEffect, useState } from "react";
import "./index.css"; // Tailwind CSS

export default function App() {
  const API = "http://localhost:3000/items";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(API);
      setItems(await res.json());
    } catch (err) {
      console.error("Failed to load items:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    if (!form.name || !form.description) return alert("All fields required");

    try {
      if (editingId) {
        await fetch(`${API}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setForm({ name: "", description: "" });
      setEditingId(null);
      load();
    } catch (err) {
      console.error("Error saving item:", err);
    }
  }

  function editItem(item) {
    setForm({ name: item.name, description: item.description });
    setEditingId(item._id);
  }

  async function deleteItem(id) {
    if (!confirm("Delete item?")) return;
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-blue-600 shadow-md py-4 px-6">
        <h1 className="text-white text-2xl font-bold">CRUD Dashboard</h1>
      </nav>

      <main className="flex-1 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-4xl bg-white shadow-lg p-8 rounded-2xl">
          {/* Form */}
          <form onSubmit={submit} className="space-y-4 mb-8">
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Item Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {editingId ? "Update Item" : "Add Item"}
            </button>
          </form>
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-400 italic">No items yet. Add one above!</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((item) => (
                <li
                  key={item._id}
                  className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 mt-2">{item.description}</p>
                  </div>
                  <div className="flex mt-4 space-x-2">
                    <button
                      onClick={() => editItem(item)}
                      className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem(item._id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}