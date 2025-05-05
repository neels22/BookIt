"use client"

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Star, Calendar, User, Clock, X, Check } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { BASE_URL } from '@/constants/constants'


export default function BookingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [confirmationLoading, setConfirmationLoading] = useState(false)
  const [confirmationSuccess, setConfirmationSuccess] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showCancelledModal, setShowCancelledModal] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const didCreate = useRef(false)

  useEffect(() => {
    let isMounted = true

    // Don't even try until we have a logged-in user
    if (!user?.id) return

    // Only ever run once
    if (didCreate.current) return
    didCreate.current = true

    const createBooking = async () => {
      try {
        const restaurantId = searchParams.get('restaurantId')
        const dateTime     = searchParams.get('dateTime')
        const people       = searchParams.get('people')

        if (!restaurantId || !dateTime || !people) {
          throw new Error('Missing required parameters')
        }

        const res = await fetch(
          `${BASE_URL}/bookings/create?restaurantId=${restaurantId}&userId=${user.id}&dateTime=${dateTime}&people=${people}`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        )

        if (!res.ok) {
          const errorData = await res.json();
          if (res.status === 400 && errorData.message?.includes('not available')) {
            throw new Error('TIME_SLOT_UNAVAILABLE');
          }
          throw new Error(errorData.message || 'Failed to create booking');
        }

        const data = await res.json()
        if (isMounted) setBooking(data)
      } catch (err) {
        if (isMounted) setError(err.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    createBooking()

    return () => {
      isMounted = true
    }
  }, [searchParams, user?.id])



  const handleConfirmBooking = async () => {
    try {
      setConfirmationLoading(true)
      setError(null)

      const response = await fetch(
        `${BASE_URL}/bookings/${booking.id}/confirm?type=EMAIL`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to confirm booking')
      }

      const confirmedBooking = await response.json()
      setBooking(confirmedBooking)
      setConfirmationSuccess(true)

      // Redirect to home page after 2 seconds
      setTimeout(() => {
        router.push('/home')
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setConfirmationLoading(false)
    }
  }

  const handleCancelClick = () => {
    setShowCancelModal(true)
  }

  const handleCancelConfirm = async () => {
    try {
      setCancelLoading(true)
      const response = await fetch(
        `${BASE_URL}/bookings/${booking.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to cancel booking')
      }

      setShowCancelModal(false)
      setShowCancelledModal(true)

      // Redirect to home page after 2 seconds
      setTimeout(() => {
        router.push('/home')
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setCancelLoading(false)
    }
  }

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr)
    
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">

            <div className="space-y-4">

              <h1>Please Login for Booking</h1> 

            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    const isTimeSlotUnavailable = error === 'TIME_SLOT_UNAVAILABLE';
    
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-2xl mx-auto">
          <div className={`${isTimeSlotUnavailable ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-6`}>
            <div className="flex items-center gap-2 mb-4">
              <X className={`h-6 w-6 ${isTimeSlotUnavailable ? 'text-red-500' : 'text-yellow-500'}`} />
              <h2 className={`text-xl font-semibold ${isTimeSlotUnavailable ? 'text-red-700' : 'text-yellow-700'}`}>
                {isTimeSlotUnavailable ? 'Time Slot Unavailable' : 'Booking Cannot be Confirmed'}
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              {isTimeSlotUnavailable 
                ? 'The selected time slot is no longer available. Please choose another time slot.'
                : error}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => router.push(`/restaurant/${searchParams.get('restaurantId')}`)}
                className="bg-[#8B2615] text-white px-6 py-2 rounded-md hover:bg-[#a13425] transition-colors"
              >
                Choose Another Time
              </button>
              <button
                onClick={() => router.push('/home')}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Booking Details</h1>
        
        <div className="bg-white rounded-xl border p-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span>
                {formatDateTime(booking.dateTime).date}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span>
                {formatDateTime(booking.dateTime).time}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              <span>{booking.totalCustomers} People</span>
            </div>

            <div className="pt-4 border-t">
              <div className="text-sm text-gray-500">Booking Status</div>
              <div className={`text-lg font-medium ${
                booking.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {booking.status === 'pending' && (
            <button
              onClick={handleConfirmBooking}
              disabled={confirmationLoading}
              className={`flex-1 bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition-colors ${
                confirmationLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {confirmationLoading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          )}

          {booking.status === 'confirmed' && (
            <button
              onClick={handleCancelClick}
              className="flex-1 border border-[#8B2615] text-[#8B2615] py-3 rounded-md hover:bg-[#8B2615] hover:text-white transition-colors"
            >
              Cancel Booking
            </button>
          )}
        </div>

        {confirmationSuccess && (
          <div className="mt-4 p-4 bg-green-50 text-green-600 rounded-md">
            Booking confirmed successfully! Redirecting to home page...
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#8B2615]">Ask for Cancellation Confirmation</h2>
                <button onClick={() => setShowCancelModal(false)} className="text-gray-500">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex items-center mb-6">
                <div>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span># {booking.totalCustomers}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDateTime(booking.dateTime).date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDateTime(booking.dateTime).time}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setShowCancelModal(false)} 
                  className="text-[#8B2615] font-medium"
                >
                  No
                </button>
                <button
                  onClick={handleCancelConfirm}
                  disabled={cancelLoading}
                  className="bg-[#8B2615] text-white px-6 py-2 rounded-md font-medium"
                >
                  {cancelLoading ? 'Cancelling...' : 'Yes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Success Modal */}
        {showCancelledModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#8B2615] flex items-center">
                  <Check className="mr-2" /> Booking Cancelled
                </h2>
                <button onClick={() => setShowCancelledModal(false)} className="text-gray-500">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex items-center mb-6">
                <div>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span># {booking.totalCustomers}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDateTime(booking.dateTime).date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDateTime(booking.dateTime).time}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center text-gray-600 mb-6">
                Your booking has been cancelled successfully.
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowCancelledModal(false)}
                  className="bg-[#8B2615] text-white px-6 py-2 rounded-md font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}