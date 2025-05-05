"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, Calendar, Clock } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { BASE_URL } from "@/constants/constants"
export default function UserReviews() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [restaurants, setRestaurants] = useState({})
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeletedModal, setShowDeletedModal] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    if (user?.id) {
      fetchReviews()
    }
  }, [user])

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/${user.id}/reviews`, {
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in again to view your reviews')
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Log the response for debugging
      console.log('API Response:', data)
      
      // Check if data is an array
      if (!Array.isArray(data)) {
        console.error('API response is not an array:', data)
        setError('Invalid response format from server')
        setReviews([])
        return
      }
      
      setReviews(data)
      setError(null)
      
      // Fetch restaurant details for each unique restaurantID
      const uniqueRestaurantIds = [...new Set(data.map(r => r.restaurantID))]
      const restaurantDetails = {}
      
      try {
        await Promise.all(uniqueRestaurantIds.map(async (id) => {
          const response = await fetch(`${BASE_URL}/restaurants/${id}`, {
            headers: getAuthHeaders()
          })
          if (!response.ok) {
            throw new Error(`Failed to fetch restaurant details: ${response.status}`)
          }
          const restaurant = await response.json()
          restaurantDetails[id] = {
            name: restaurant.name,
            cuisine: restaurant.cuisine,
            address: `${restaurant.street}, ${restaurant.city}, ${restaurant.state} ${restaurant.zipCode}`
          }
        }))
      } catch (error) {
        console.error("Error fetching restaurant details:", error)
      }
      
      setRestaurants(restaurantDetails)
    } catch (error) {
      console.error("Error fetching reviews:", error)
      setError('Failed to fetch reviews')
      setReviews([])
    }
  }

  const handleDeleteClick = (review) => {
    setSelectedReview(review)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${BASE_URL}/reviews/${selectedReview.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in again to delete your review')
          return
        }
        throw new Error(`Failed to delete review: ${response.status}`)
      }

      // Remove the deleted review from the state
      setReviews(reviews.filter(review => review.id !== selectedReview.id))
      setShowDeleteModal(false)
      setShowDeletedModal(true)
    } catch (error) {
      console.error("Error deleting review:", error)
      setError('Failed to delete review')
    }
  }

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr)
    return {
      date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  }

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl)
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 border-r">
        <nav className="py-8 px-6">
          <ul className="space-y-2">
            <li>
              <Link href="/user" className="block py-2 text-gray-400 hover:text-gray-600">
                My Profile
              </Link>
            </li>
            <li>
              <Link href="/user/reservations" className="block py-2 text-gray-400 hover:text-gray-600">
                My Reservations
              </Link>
            </li>
            <li>
              <Link href="/user/reviews" className="block py-2 text-[#8B2615] font-medium">
                My Reviews
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">My Reviews</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {Array.isArray(reviews) && reviews.length > 0 ? (
            reviews.map((review) => {
              const { date } = formatDateTime(review.date)
              const restaurant = restaurants[review.restaurantID]
              
              return (
                <div key={review.id} className="border rounded-lg p-6 max-w-3xl">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-2">{restaurant?.name || 'Loading...'}</h2>
                      {restaurant?.cuisine && (
                        <p className="text-gray-600 text-sm mb-2">{restaurant.cuisine} Cuisine</p>
                      )}
                      {restaurant?.address && (
                        <p className="text-gray-600 text-sm mb-4">{restaurant.address}</p>
                      )}
                      <div className="flex items-center gap-2 mb-4">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-gray-700 mb-4">{review.comments}</p>
                      {review.photos && review.photos.length > 0 && (
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                          {review.photos.map((photo, index) => (
                            <div
                              key={index}
                              className="flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => handleImageClick(photo)}
                            >
                              <Image
                                src={photo}
                                alt={`Review photo ${index + 1}`}
                                width={100}
                                height={100}
                                className="rounded-lg object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{date}</span>
                      </div>
                    </div>

                    <div className="ml-4">
                      <button
                        onClick={() => handleDeleteClick(review)}
                        className="border border-[#8B2615] text-[#8B2615] px-4 py-2 rounded-md hover:bg-[#8B2615] hover:text-white transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-gray-500 text-center py-8">
              {error ? 'Failed to load reviews' : 'No reviews found'}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#8B2615]">Confirm Delete Review</h2>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-500">
                <XIcon />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">Are you sure you want to delete your review for:</p>
              <h3 className="text-xl font-bold mt-2">{restaurants[selectedReview.restaurantID]?.name || 'Restaurant'}</h3>
            </div>

            <div className="flex justify-end gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="text-[#8B2615] font-medium">
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-[#8B2615] text-white px-6 py-2 rounded-md font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Modal */}
      {showDeletedModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#8B2615] flex items-center">
                <CheckIcon className="mr-2" /> Review Deleted
              </h2>
              <button onClick={() => setShowDeletedModal(false)} className="text-gray-500">
                <XIcon />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">Your review has been successfully deleted.</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowDeletedModal(false)}
                className="bg-[#8B2615] text-white px-6 py-2 rounded-md font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <XIcon />
            </button>
            <Image
              src={selectedImage}
              alt="Review photo"
              width={800}
              height={600}
              className="object-contain max-h-full rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function CheckIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
