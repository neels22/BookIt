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
        // for (const stat of bookingStatsData) {
        //   try {
        //     const restaurantResponse = await fetch(`${BASE_URL}/restaurants/${stat.restaurantID}`, {
        //       headers: {
        //         'Authorization': `Bearer ${user.token}`,
        //         'Content-Type': 'application/json'
        //       }
        //     })
        //     if (restaurantResponse.ok) {
        //       const restaurantData = await restaurantResponse.json()
        //       names[stat.restaurantID] = restaurantData.name
        //     }
        //   } catch (err) {
        //     console.error(`Failed to fetch restaurant name for ID ${stat.restaurantID}:`, err)
        //     names[stat.restaurantID] = "Unknown Restaurant"
        //   }
        // }
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white flex flex-col shadow-lg">
        <div className="p-6 border-b border-indigo-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">Admin Panel</h1>
        </div>

        <nav className="flex-1 py-4">
          <Link href="/admin" className="flex items-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-r-lg shadow-md">
            <span className="mr-2">📊</span> Dashboard
          </Link>
          <Link href="/admin/restaurants" className="flex items-center px-6 py-4 hover:bg-indigo-700/50 transition-colors duration-200">
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
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dashboard Overview</h1>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-600">Total Restaurants</h2>
              <p className="text-5xl font-bold text-blue-600">{dashboardData.totalRestaurants}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-600">Pending Approvals</h2>
              <p className="text-5xl font-bold text-yellow-500">{dashboardData.pendingApprovals}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-600">Total Bookings</h2>
              <p className="text-5xl font-bold text-green-600">{monthlyStats[0]?.totalBookings || 0}</p>
            </div>

            {/* <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-600">Cancellations</h2>
              <p className="text-5xl font-bold text-red-500">{monthlyStats[0]?.totalCancellations || 0}</p>
            </div> */}
          </div>

          {/* Restaurant-wise Stats */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Restaurant Performance</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Restaurant Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Bookings</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cancellations</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Success Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookingStats
                    .filter(stat => stat.restaurantName !== "inactive")
                    .map((stat) => (
                    <tr key={stat.restaurantName} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {stat.restaurantName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.totalBookings}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.totalCancellations}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          stat.successRate === "N/A" 
                            ? 'bg-gray-100 text-gray-800'
                            : parseInt(stat.successRate) >= 80
                              ? 'bg-green-100 text-green-800'
                              : parseInt(stat.successRate) >= 50
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {stat.successRate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Monthly Reservations</h3>
              <div className="h-64">
                <MonthlyReservationsChart data={monthlyStats} />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Popular Time Slots</h3>
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
      <div className="flex h-full items-end space-x-4">
        {chartData.map((stat, index) => {
          const barHeight = (stat.totalBookings / maxValue) * height;
          const cancellationHeight = (stat.totalCancellations / maxValue) * height;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center">
                <div 
                  className="w-10 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg shadow-md"
                  style={{ height: `${barHeight}px` }}
                />
                <div 
                  className="w-10 bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg shadow-md"
                  style={{ height: `${cancellationHeight}px` }}
                />
              </div>
              <div className="text-sm font-medium mt-2 text-gray-600">{stat.month}</div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-400 rounded mr-2"></div>
          <span className="text-gray-600">Bookings</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-400 rounded mr-2"></div>
          <span className="text-gray-600">Cancellations</span>
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
      <div className="flex h-full items-end space-x-4">
        {timeSlots.map((time, index) => {
          const barHeight = (values[index] / maxValue) * height;
          
          return (
            <div key={time} className="flex-1 flex flex-col items-center">
              <div 
                className="w-10 bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg shadow-md"
                style={{ height: `${barHeight}px` }}
              />
              <div className="text-sm font-medium mt-2 text-gray-600">{time}</div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center mt-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-400 rounded mr-2"></div>
          <span className="text-gray-600">Bookings</span>
        </div>
      </div>
    </div>
  );
}

