"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/constants/constants";
const AddTablesPage = () => {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    restaurantId: "",
    count: 1,
    seats: 4,
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BASE_URL}/manager/restaurants/restaurants-by-manager/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch restaurants");
        }

        const data = await response.json();
        setRestaurants(data);
        if (data.length > 0) {
          setForm((f) => ({ ...f, restaurantId: data[0].id }));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && user.role === "ROLE_MANAGER") {
      fetchRestaurants();
    }
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/manager/tables/${form.restaurantId}/add-tables`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            numberOfTables: Number(form.count),
            tableSize: Number(form.seats),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add tables");
      }

      setSuccess("Tables added successfully!");
      setTimeout(() => {
        router.push("/manager/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  // ⏳ Wait for auth check to finish
  if (authLoading) {
    return <div className="text-slate-500">Checking authentication...</div>;
  }

  // 🔒 Protect route from non-logged-in or non-manager users
  if (!isLoggedIn || user?.role !== "ROLE_MANAGER") {
    return (
      <div className="text-red-600 text-lg font-semibold">
        Please log in as a manager to access this page.
      </div>
    );
  }

  if (loading) {
    return <div className="text-slate-500">Loading restaurants...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Add Tables</h1>
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      <form className="bg-white rounded-xl p-8 max-w-xl" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Restaurant</label>
          <select
            name="restaurantId"
            value={form.restaurantId}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Number of Tables to Add</label>
          <input
            type="number"
            name="count"
            min={1}
            value={form.count}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Table Size (Seats)</label>
          <select
            name="seats"
            value={form.seats}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            {[2, 4, 6, 8].map((n) => (
              <option key={n} value={n}>
                {n} Seats
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md px-6 py-2 border border-slate-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-rose-700 hover:bg-rose-800 rounded-md px-6 py-2 text-white"
          >
            Add Tables
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTablesPage;