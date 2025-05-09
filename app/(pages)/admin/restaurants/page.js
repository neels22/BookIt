"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { BASE_URL } from "@/constants/constants"
export default function AdminRestaurants() {
  const { user, isLoggedIn } = useAuth()
  const [restaurants, setRestaurants] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoggedIn) {
      fetchPendingRestaurants()
    }
  }, [isLoggedIn])

  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  }

  const fetchPendingRestaurants = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/restaurants/pending`, {
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in again to view pending restaurants')
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setRestaurants(data)
      setError(null)
    } catch (error) {
      console.error("Error fetching pending restaurants:", error)
      setError('Failed to fetch pending restaurants')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/restaurants/${id}/approve`, {
        method: 'PUT',
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in again to approve restaurants')
          return
        }
        throw new Error(`Failed to approve restaurant: ${response.status}`)
      }

      // Remove the approved restaurant from the list
      setRestaurants(restaurants.filter(restaurant => restaurant.id !== id))
    } catch (error) {
      console.error("Error approving restaurant:", error)
      setError('Failed to approve restaurant')
    }
  }

  const handleReject = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/restaurants/${id}/reject`, {
        method: 'PUT',
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in again to reject restaurants')
          return
        }
        throw new Error(`Failed to reject restaurant: ${response.status}`)
      }

      // Remove the rejected restaurant from the list
      setRestaurants(restaurants.filter(restaurant => restaurant.id !== id))
    } catch (error) {
      console.error("Error rejecting restaurant:", error)
      setError('Failed to reject restaurant')
    }
  }

  if (!isLoggedIn) {
    return <div className="flex min-h-screen items-center justify-center">
      <p>Please sign in to access the admin dashboard</p>
    </div>
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
          <Link href="/admin/restaurants" className="flex items-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-r-lg shadow-md">
            <span className="mr-2">🍽️</span> Restaurants
          </Link>
          <Link href="/admin/remove" className="flex items-center px-6 py-4 hover:bg-indigo-700/50 transition-colors duration-200">
            <span className="mr-2">🗑️</span> Delete Restaurant
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">Pending Restaurant Requests</h1>

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
              <p className="text-gray-600 text-lg">No pending restaurant requests</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              {/* Table header */}
              <div className="grid grid-cols-4 gap-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-4">
                <div className="font-semibold">Name</div>
                <div className="font-semibold">Location</div>
                <div className="font-semibold">Status</div>
                <div className="font-semibold">Action</div>
              </div>

              {/* Table rows */}
              {restaurants.map((restaurant) => (
                <div 
                  key={restaurant.id} 
                  className="grid grid-cols-4 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="font-medium text-gray-800">{restaurant.name}</div>
                  <div className="text-gray-600">{`${restaurant.address.city}, ${restaurant.address.state}`}</div>
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                      {restaurant.approvalStatus}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(restaurant.id)}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(restaurant.id)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      Reject
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

