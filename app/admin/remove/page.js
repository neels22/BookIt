"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { BASE_URL } from "@/constants/constants"

export default function AdminAllRestaurants() {
  const { isLoggedIn } = useAuth()
  const [restaurants, setRestaurants] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllRestaurants()
    }
  }, [isLoggedIn])

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
    Accept: '*/*',
  })

  const fetchAllRestaurants = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/restaurants`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) throw new Error(`Failed to fetch restaurants. Status: ${response.status}`)

      const data = await response.json()
      setRestaurants(data)
    } catch (err) {
      console.error(err)
      setError("Failed to load restaurants.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this restaurant?")
    if (!confirmDelete) return

    try {
      const response = await fetch(`${BASE_URL}/admin/restaurants/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok) throw new Error(`Delete failed with status ${response.status}`)

      setRestaurants(restaurants.filter(r => r.id !== id))
      alert("Restaurant deleted successfully.")
    } catch (err) {
      console.error("Error deleting restaurant:", err)
      setError("Failed to delete restaurant.")
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Please sign in to access the admin dashboard</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#1a1a1a] text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-medium">Admin</h1>
        </div>

        <nav className="flex-1">
          <Link href="/admin" className="flex items-center px-6 py-4 hover:bg-gray-800">
            Dashboard
          </Link>
          <Link href="/admin/restaurants" className="flex items-center px-6 py-4  hover:bg-gray-800">
            Restaurants
          </Link>
          <Link href="/admin/remove" className="flex items-center px-6 py-4 bg-[#b8a8a8] text-black">
            Delete Restaurant
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">All Approved Restaurants</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-8">No restaurants found</div>
          ) : (
            <div className="bg-gray-200 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 bg-gray-600 text-white p-4">
                <div className="font-medium">Name</div>
                <div className="font-medium">Location</div>
                <div className="font-medium">Cuisine</div>
                <div className="font-medium">Action</div>
              </div>

              {/* Table Rows */}
              {restaurants.map(restaurant => (
                <div key={restaurant.id} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-300">
                  <div>{restaurant.name}</div>
                  <div>{restaurant.address?.fullAddress || "N/A"}</div>
                  <div>{restaurant.cuisine}</div>
                  <div>
                    <button
                      onClick={() => handleDelete(restaurant.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
