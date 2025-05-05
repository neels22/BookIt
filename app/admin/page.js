"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"

import { BASE_URL } from "@/constants/constants"

export default function AdminDashboard() {
  const { user, isLoggedIn } = useAuth()
  const [dashboardData, setDashboardData] = useState({
    totalRestaurants: 0,
    pendingApprovals: 0,
    totalBookingsLastMonth: 0
  })
  const [bookingStats, setBookingStats] = useState([])
  const [popularSlots, setPopularSlots] = useState({})
  const [monthlyStats, setMonthlyStats] = useState([])
  const [restaurantNames, setRestaurantNames] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isLoggedIn || !user?.token) return

      try {
        // Fetch main dashboard data
        const dashboardResponse = await fetch(`${BASE_URL}/admin/restaurants/dashboard`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        })
        const dashboardData = await dashboardResponse.json()
        setDashboardData(dashboardData)

        // Fetch booking stats
        const bookingStatsResponse = await fetch(`${BASE_URL}/booking-stats`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        })
        const bookingStatsData = await bookingStatsResponse.json()
        setBookingStats(bookingStatsData)

        // Fetch popular slots
        const popularSlotsResponse = await fetch(`${BASE_URL}/booking-stats/analytics/popular-slots`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        })
        const popularSlotsData = await popularSlotsResponse.json()
        setPopularSlots(popularSlotsData)

        // Fetch monthly stats
        const monthlyStatsResponse = await fetch(`${BASE_URL}/booking-stats/analytics/monthly`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        })
        const monthlyStatsData = await monthlyStatsResponse.json()
        setMonthlyStats(monthlyStatsData)

        // Fetch restaurant names for each ID
        const names = {}
        for (const stat of bookingStatsData) {
          try {
            const restaurantResponse = await fetch(`${BASE_URL}/restaurants/${stat.restaurantID}`, {
              headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
              }
            })
            if (restaurantResponse.ok) {
              const restaurantData = await restaurantResponse.json()
              names[stat.restaurantID] = restaurantData.name
            }
          } catch (err) {
            console.error(`Failed to fetch restaurant name for ID ${stat.restaurantID}:`, err)
            names[stat.restaurantID] = "Unknown Restaurant"
          }
        }
        setRestaurantNames(names)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [isLoggedIn, user])

  if (!isLoggedIn) {
    return <div className="flex min-h-screen items-center justify-center">
      <p>Please sign in to access the admin dashboard</p>
    </div>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
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
          <Link href="/admin" className="flex items-center px-6 py-4 bg-[#b8a8a8] text-black">
            Dashboard
          </Link>
          <Link href="/admin/restaurants" className="flex items-center px-6 py-4 hover:bg-gray-800">
            Restaurants
          </Link>
          <Link href="/admin/remove" className="flex items-center px-6 py-4  hover:bg-gray-800">
            Delete Restaurant
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">DASHBOARD</h1>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4 text-center">Total Restaurants</h2>
              <p className="text-5xl font-bold text-center">{dashboardData.totalRestaurants}</p>
            </div>

            <div className="bg-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4 text-center">Pending Approvals</h2>
              <p className="text-5xl font-bold text-center">{dashboardData.pendingApprovals}</p>
            </div>

            <div className="bg-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4 text-center">Total Bookings</h2>
              <p className="text-5xl font-bold text-center">{monthlyStats[0]?.totalBookings || 0}</p>
            </div>

            <div className="bg-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4 text-center">Cancellations</h2>
              <p className="text-5xl font-bold text-center">{monthlyStats[0]?.totalCancellations || 0}</p>
            </div>
          </div>

          {/* Restaurant-wise Stats */}
          <div className="mb-12">
            <h2 className="text-2xl font-medium mb-6">Restaurant Performance</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bookings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cancellations</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookingStats.map((stat) => (
                    <tr key={stat.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {restaurantNames[stat.restaurantID] || "Loading..."}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.totalBookings}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.totalCancellations}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stat.totalBookings > 0 
                          ? `${Math.round(((stat.totalBookings - stat.totalCancellations) / stat.totalBookings) * 100)}%`
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Monthly Reservations</h3>
              <div className="h-64">
                <MonthlyReservationsChart data={monthlyStats} />
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Popular Time Slots</h3>
              <div className="h-64">
                <PopularTimeSlotsChart data={popularSlots} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MonthlyReservationsChart({ data }) {
  // Ensure data is an array and has the correct structure
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Transform the data if needed
  const chartData = data.map(stat => ({
    month: stat.month || stat._id?.split('-')[1] || 'Unknown',
    totalBookings: stat.totalBookings || 0,
    totalCancellations: stat.totalCancellations || 0
  }));

  const maxValue = Math.max(...chartData.map(stat => stat.totalBookings));
  const height = 200; // Fixed height for the chart

  return (
    <div className="h-full">
      <div className="flex h-full items-end space-x-2">
        {chartData.map((stat, index) => {
          const barHeight = (stat.totalBookings / maxValue) * height;
          const cancellationHeight = (stat.totalCancellations / maxValue) * height;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center">
                <div 
                  className="w-8 bg-blue-500 rounded-t"
                  style={{ height: `${barHeight}px` }}
                />
                <div 
                  className="w-8 bg-red-500 rounded-t"
                  style={{ height: `${cancellationHeight}px` }}
                />
              </div>
              <div className="text-xs mt-2">{stat.month}</div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 mr-1"></div>
          <span>Bookings</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 mr-1"></div>
          <span>Cancellations</span>
        </div>
      </div>
    </div>
  );
}

function PopularTimeSlotsChart({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const timeSlots = Object.keys(data);
  const values = Object.values(data);
  const maxValue = Math.max(...values);
  const height = 200; // Fixed height for the chart

  return (
    <div className="h-full">
      <div className="flex h-full items-end space-x-2">
        {timeSlots.map((time, index) => {
          const barHeight = (values[index] / maxValue) * height;
          
          return (
            <div key={time} className="flex-1 flex flex-col items-center">
              <div 
                className="w-8 bg-green-500 rounded-t"
                style={{ height: `${barHeight}px` }}
              />
              <div className="text-xs mt-2">{time}</div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center mt-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 mr-1"></div>
          <span>Bookings</span>
        </div>
      </div>
    </div>
  );
}

