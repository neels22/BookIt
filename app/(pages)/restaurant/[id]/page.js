"use client"

import { useState, useEffect } from "react"
import { Search, User, Calendar, Clock, MapPin, Mail, Phone, ChevronDown, Github, Twitter, X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import ReviewModal from "../reviews/page"
import { useParams, useRouter } from "next/navigation"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useAuth } from "@/context/AuthContext"
import { BASE_URL } from "@/constants/constants"
export default function RestaurantDetails() {
  const { user } = useAuth()
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reservationSuccess, setReservationSuccess] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const params = useParams()
  const router = useRouter()

  // Reservation form state
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState(null)
  const [selectedPeople, setSelectedPeople] = useState(2)
  const [showPeopleDropdown, setShowPeopleDropdown] = useState(false)
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)

  // Available times
  const [availableTimes, setAvailableTimes] = useState([])

  // People options
  const peopleOptions = Array.from({ length: 10 }, (_, i) => i + 1)

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const fetchRestaurantDetails = async () => {
    try {
      const response = await fetch(`${BASE_URL}/restaurants/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch restaurant details')
      }
      const data = await response.json()
      setRestaurant(data)
      await fetchAvailableTimes(selectedDate)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableTimes = async (date) => {
    try {
      // Format date to YYYY-MM-DD
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      
      const searchResponse = await fetch(
        `${BASE_URL}/restaurants/${params.id}/available-times?date=${formattedDate}&people=${selectedPeople}`
      )
      if (!searchResponse.ok) {
        throw new Error('Failed to fetch available times')
      }
      const availableTimes = await searchResponse.json()
      // Take only the first 20 times
      const limitedTimes = availableTimes.slice(0, 40)
      setAvailableTimes(limitedTimes)
      if (limitedTimes.length > 0) {
        setSelectedTime(limitedTimes[0])
      }
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(null), 3000)
    }
  }

  useEffect(() => {
    fetchRestaurantDetails()
  }, [params.id])

  // Add effect to fetch available times when date or number of people changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimes(selectedDate)
    }
  }, [selectedDate, selectedPeople])

  const handleReservation = async () => {
    try {
      console.log('Selected Time:', selectedTime) // Debug log
      
      // Combine date and time
      const [hours, minutes] = selectedTime.split(":")
      console.log('Split Time:', { hours, minutes }) // Debug log
      
      const reservationDate = new Date(selectedDate)
      console.log('Before setting time:', reservationDate) // Debug log
      
      // Set the time directly in 24-hour format
      reservationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      console.log('After setting time:', reservationDate) // Debug log

      function formatLocalDateTime(date) {
        const pad = (n) => n.toString().padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
      
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      }
      
      const localDateTime = formatLocalDateTime(reservationDate);
    
      // Create the query parameters
      const queryParams = new URLSearchParams({
        restaurantId: params.id,
        dateTime: localDateTime,
        people: selectedPeople.toString()
      }).toString()

      console.log('Final query params:', queryParams) // Debug log
      
      // Navigate to booking page with query parameters
      router.push(`/booking?${queryParams}`)
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl)
  }

  const nextPhoto = () => {
    if (restaurant?.photos) {
      setCurrentPhotoIndex((prev) => 
        prev === restaurant.photos.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevPhoto = () => {
    if (restaurant?.photos) {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? restaurant.photos.length - 1 : prev - 1
      )
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              </div>
              <div className="md:col-span-1">
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="text-red-500">Error: {error}</div>
        </main>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-1 container mx-auto px-4 py-6">
          <div>Restaurant not found</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 container mx-auto px-4 py-0">
        {/* Main Photo Gallery Banner */}
        <div className="w-full h-64 md:h-80 bg-gray-100 overflow-hidden relative group">
          {restaurant?.photos && restaurant.photos.length > 0 ? (
            <>
              <div 
                className="flex h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentPhotoIndex * 100}%)` }}
              >
                {restaurant.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="w-full h-full flex-shrink-0 cursor-pointer"
                    onClick={() => handleImageClick(photo)}
                  >
                    {photo ? (
                      <Image
                        src={photo}
                        alt={`${restaurant.name} photo ${index + 1}`}
                        width={1200}
                        height={800}
                        className="w-full h-full object-cover"
                        priority={index === 0}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              {restaurant.photos.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      prevPhoto()
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      nextPhoto()
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  {/* Photo Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {restaurant.photos.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentPhotoIndex(index)
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentPhotoIndex === index 
                            ? 'bg-white w-4' 
                            : 'bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No photos available</span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold">{restaurant.name}</h1>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="flex items-center">
                <div className="flex text-red-500">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.floor(restaurant.avgRating) ? 'fill-current' : 'stroke-current fill-none'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">({restaurant.avgRating.toFixed(1)})</span>
              </div>

              <div className="flex items-center gap-1 text-sm">
                <CircleIcon className="h-4 w-4" />
                <span>{restaurant.totalReviews} reviews</span>
              </div>

              <div className="flex items-center gap-1 text-sm">
                <DollarIcon className="h-4 w-4" />
                <span>{restaurant.costRating === 1 ? '$' : restaurant.costRating === 2 ? '$$' : '$$$'}</span>
              </div>

              <div className="flex items-center gap-1 text-sm">
                <ForkKnifeIcon className="h-4 w-4" />
                <span>{restaurant.cuisine}</span>
              </div>
            </div>

            <div className="text-sm mt-2">Booked {restaurant.bookedToday} times today</div>

            <div className="mt-6 border-t pt-4">
              <h2 className="text-lg font-medium text-red-500">About</h2>
              <p className="mt-2 text-sm">
                {restaurant.description}
              </p>
            </div>

            <div className="mt-4 grid gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                <span className="font-medium">Call:</span>
                <span>{restaurant.contact}</span>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-red-500">Reviews</h2>
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded text-sm"
                  onClick={() => setIsReviewModalOpen(true)}
                >
                  Write a Review
                </button>
              </div>

              {restaurant.reviews.map((review) => (
                <div key={review.id} className="mt-4 border-b pb-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{review.customerName}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex text-red-500 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'stroke-current fill-none'}`} 
                      />
                    ))}
                  </div>

                  {review.comments && (
                    <p className="mt-2 text-sm">{review.comments}</p>
                  )}

                  {review.photos && review.photos.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {review.photos.map((photo, index) => (
                        <div key={index} className="w-20 h-20 rounded overflow-hidden">
                          <Image
                            src={photo}
                            alt={`Review photo ${index + 1}`}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="border rounded-md p-4">
              <h2 className="text-xl font-medium text-red-500 text-center mb-4">Reserve a Table</h2>

              <div className="grid gap-4">
                {/* People Selector */}
                <div className="relative">
                  <button
                    className="w-full flex items-center border rounded overflow-hidden p-2"
                    onClick={() => setShowPeopleDropdown(!showPeopleDropdown)}
                  >
                    <User className="ml-2 h-4 w-4 text-gray-500" />
                    <span className="px-2">{selectedPeople} People</span>
                    <ChevronDown className="ml-auto mr-2 h-4 w-4" />
                  </button>
                  
                  {showPeopleDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                      {peopleOptions.map((num) => (
                        <button
                          key={num}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            setSelectedPeople(num)
                            setShowPeopleDropdown(false)
                          }}
                        >
                          {num} {num === 1 ? 'Person' : 'People'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Date Picker */}
                <div className="relative">
                  <DatePicker
                    selected={selectedDate}
                    onChange={date => {
                      setSelectedDate(date)
                      setSelectedTime(null) // Reset selected time when date changes
                    }}
                    minDate={new Date()}
                    className="w-full p-2 border rounded"
                    dateFormat="MMMM d, yyyy"
                    customInput={
                      <button className="w-full flex items-center">
                        <Calendar className="ml-2 h-4 w-4 text-gray-500" />
                        <span className="px-2">
                          {selectedDate.toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </button>
                    }
                  />
                </div>

                {/* Time Selector */}
                <div className="relative">
                  <button
                    className="w-full flex items-center border rounded overflow-hidden p-2"
                    onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                  >
                    <Clock className="ml-2 h-4 w-4 text-gray-500" />
                    <span className="px-2">{selectedTime ? selectedTime : 'Select Time'}</span>
                    <ChevronDown className="ml-auto mr-2 h-4 w-4" />
                  </button>
                  {showTimeDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {availableTimes.length > 0 ? (
                        availableTimes.map((time) => (
                          <button
                            key={time}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedTime === time ? 'bg-gray-200 font-semibold' : ''}`}
                            onClick={() => {
                              setSelectedTime(time);
                              setShowTimeDropdown(false);
                            }}
                          >
                            {time}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500">No available times</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Reserve Button */}
                <button
                  onClick={handleReservation}
                  className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  Reserve Now
                </button>

                {/* Success/Error Messages */}
                {reservationSuccess && (
                  <div className="text-green-500 text-center text-sm">
                    Reservation successful!
                  </div>
                )}
                {error && (
                  <div className="text-red-500 text-center text-sm">
                    {error}
                  </div>
                )}
              </div>
            </div>

            <div className="border rounded-md p-4 mt-6">
              <div className="flex items-center gap-2 text-red-500 mb-4">
                <MapPin className="h-4 w-4" />
                <h3 className="font-medium">Address Details</h3>
              </div>

              <div className="text-sm mb-4">
                <p>{restaurant.street}</p>
                <p>{restaurant.city}, {restaurant.state} {restaurant.zipCode}</p>
              </div>

              <div className="bg-gray-100 rounded-md overflow-hidden h-48 relative">
                <iframe
                  src={restaurant.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

          
        </div>
      </main>

      <footer className="text-center py-4 text-sm text-gray-600 border-t mt-8">
        <div>(C) 2025 Maverick, Inc</div>
        <div className="flex justify-center gap-4 mt-2">
          <Github size={16} />
          <Twitter size={16} />
        </div>
      </footer>

      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        restaurantName={restaurant.name}
        restaurantId={params.id}
        onReviewSubmitted={fetchRestaurantDetails}
      />

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
              <X className="h-6 w-6" />
            </button>
            <Image
              src={selectedImage}
              alt="Restaurant photo"
              width={1200}
              height={800}
              className="object-contain max-h-full rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function CircleIcon(props) {
  return (
    <svg
      {...props}
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
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

function DollarIcon(props) {
  return (
    <svg
      {...props}
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
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function ForkKnifeIcon(props) {
  return (
    <svg
      {...props}
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
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  )
}

