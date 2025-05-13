"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import TableCard from "../components/TableCard";
import { BASE_URL } from "@/constants/constants"; // Ensure this path is correct
const ManageTablesPage = () => {
  const { user, isLoggedIn, loading: authLoading } = useAuth(); // added loading check
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
          setSelectedRestaurantId(data[0].id);
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

  useEffect(() => {
    const fetchTables = async () => {
      if (!selectedRestaurantId) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BASE_URL}/manager/tables/${selectedRestaurantId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tables");
        }

        const data = await response.json();
        setTables(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTables();
  }, [selectedRestaurantId]);

  const handleDeleteTable = async (tableId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/manager/tables/${selectedRestaurantId}/delete-many`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify([tableId]),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete table");
      }

      setTables(tables.filter((table) => table.id !== tableId));
      setSuccessMessage("Table deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateTable = async (tableId, seats) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/manager/tables/${tableId}/update?seats=${seats}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update table");
      }

      setTables(
        tables.map((table) =>
          table.id === tableId ? { ...table, capacity: seats } : table
        )
      );
      setSuccessMessage("Table updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // 🔐 Auth protection
  if (authLoading) {
    return <div className="text-slate-500">Checking authentication...</div>;
  }

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

  if (!restaurants.length) {
    return (
      <div className="text-slate-500">
        No restaurants found. Add one first.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Tables</h1>
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-1">Select Restaurant</label>
        <select
          className="border rounded px-3 py-2"
          value={selectedRestaurantId}
          onChange={(e) => setSelectedRestaurantId(e.target.value)}
        >
          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Tables</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.length === 0 ? (
            <div className="text-slate-400 col-span-full">No tables found.</div>
          ) : (
            tables.map((table) => (
              <TableCard
                key={table.id}
                table={{
                  id: table.id,
                  number: table.tableNumber,
                  seats: table.capacity,
                }}
                onDelete={handleDeleteTable}
                onUpdate={handleUpdateTable}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTablesPage;