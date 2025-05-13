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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white flex flex-col shadow-lg">
        <div className="p-6 border-b border-indigo-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">Admin Panel</h1>
        </div>

        <nav className="flex-1 py-4">
          <Link href="/admin" className="flex items-center px-6 py-4 hover:bg-indigo-700/50 transition-colors duration-200">
            <span className="mr-2">📊</span> Dashboard
          </Link>
          <Link href="/admin/restaurants" className="flex items-center px-6 py-4 hover:bg-indigo-700/50 transition-colors duration-200">
            <span className="mr-2">🍽️</span> Restaurants
          </Link>
          <Link href="/admin/remove" className="flex items-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-r-lg shadow-md">
            <span className="mr-2">🗑️</span> Delete Restaurant
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">All Approved Restaurants</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-lg text-gray-600">Loading...</div>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-lg border border-gray-100">
              <p className="text-gray-600 text-lg">No restaurants found</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-4">
                <div className="font-semibold">Name</div>
                <div className="font-semibold">Location</div>
                <div className="font-semibold">Cuisine</div>
                <div className="font-semibold">Action</div>
              </div>

              {/* Table Rows */}
              {restaurants.map(restaurant => (
                <div 
                  key={restaurant.id} 
                  className="grid grid-cols-4 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="font-medium text-gray-800">{restaurant.name}</div>
                  <div className="text-gray-600">{restaurant.address?.fullAddress || "N/A"}</div>
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                      {restaurant.cuisine}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => handleDelete(restaurant.id)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-200"
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
