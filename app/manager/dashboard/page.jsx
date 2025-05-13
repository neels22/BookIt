"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import RestaurantCard from "../components/RestaurantCard";
import { BASE_URL } from "@/constants/constants";
const DashboardPage = () => {
  const { user, isLoggedIn, loading } = useAuth(); // include loading for smoother UX
  const [restaurants, setRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingRestaurants(false);
    }
  };

  useEffect(() => {
    if (user?.id && user?.role === "ROLE_MANAGER") {
      fetchRestaurants();
    }
  }, [user?.id]);

  const handleDelete = (deletedRestaurantId) => {
    setRestaurants(restaurants.filter((r) => r.id !== deletedRestaurantId));
    setSuccessMessage("Restaurant deleted successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // ⏳ Show nothing while auth state is loading
  if (loading) {
    return <div className="text-slate-500">Checking authentication...</div>;
  }

  // 🔒 Block if not logged in or not a manager
  if (!isLoggedIn || user?.role !== "ROLE_MANAGER") {
    return (
      <div className="text-red-600 text-lg font-semibold">
        Please log in as a manager to access the dashboard.
      </div>
    );
  }

  // 🌀 Show while fetching data
  if (loadingRestaurants) {
    return <div className="text-slate-500">Loading restaurants...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Restaurants</h1>
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      {restaurants.length === 0 ? (
        <div className="text-slate-500">
          No restaurants yet. Add one to get started!
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {restaurants
            .filter(r => r.status !== "INACTIVE")
            .map((r) => (
            <RestaurantCard
              key={r.id}
              restaurant={{
                id: r.id,
                name: r.name,
                description: r.description,
                image: r.photos[0],
                address: r.address.fullAddress,
                phone: r.contact,
                cuisine: r.cuisine,
                costRating: r.costRating,
                rating: r.avgStarRating,
                status: r.status,
                openingTime: r.openingTime,
                closingTime: r.closingTime,
                approvalStatus: r.approvalStatus,
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;