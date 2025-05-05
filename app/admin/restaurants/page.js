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
          <Link href="/admin/restaurants" className="flex items-center px-6 py-4 bg-[#b8a8a8] text-black">
            Restaurants
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">Pending Restaurant Requests</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-8">No pending restaurant requests</div>
          ) : (
            <div className="bg-gray-200 rounded-lg overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-4 gap-4 bg-gray-600 text-white p-4">
                <div className="font-medium">Name</div>
                <div className="font-medium">Location</div>
                <div className="font-medium">Status</div>
                <div className="font-medium">Action</div>
              </div>

              {/* Table rows */}
              {restaurants.map((restaurant) => (
                <div key={restaurant.id} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-300">
                  <div>{restaurant.name}</div>
                  <div>{`${restaurant.address.city}, ${restaurant.address.state}`}</div>
                  <div>{restaurant.approvalStatus}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(restaurant.id)}
                      className="bg-[#8B2615] text-white px-3 py-1 rounded text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(restaurant.id)}
                      className="bg-[#8B2615] text-white px-3 py-1 rounded text-sm"
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

