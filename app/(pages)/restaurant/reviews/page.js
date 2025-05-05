"use client"

import { useState, useRef } from "react"
import { X, Camera, Plus } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import { BASE_URL } from "@/constants/constants"
export default function ReviewModal({ isOpen, onClose, restaurantName = "Restaurant", restaurantId, onReviewSubmitted }) {
  const { user } = useAuth()
  const [rating, setRating] = useState(4)
  const [reviewText, setReviewText] = useState("")
  const [media, setMedia] = useState([]) // base64 strings
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setMedia((prev) => [...prev, ev.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleAddImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      setError(null)

      const reviewData = {
        restaurantID: restaurantId,
        customerID: user.id,
        rating: rating,
        comments: reviewText,
        date: new Date().toISOString()
      }

      const formData = new FormData()
      // Add image files (convert base64 to Blob)
      if (media.length > 0) {
        media.forEach((photo, index) => {
          const byteString = atob(photo.split(',')[1]);
          const mimeString = photo.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });
          formData.append("images", blob, `photo${index}.jpg`);
        });
      }
      // Add the request JSON as a Blob
      const jsonBlob = new Blob([JSON.stringify(reviewData)], { type: "application/json" })
      formData.append("request", jsonBlob)

      const response = await fetch(`${BASE_URL}/reviews/standalone`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to submit review')
      }

      // Clear form
      setRating(4)
      setReviewText("")
      setMedia([])
      onReviewSubmitted && onReviewSubmitted()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg relative">
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          disabled={submitting}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">{restaurantName}</h2>

          <div className="flex items-center mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                key={star} 
                onClick={() => setRating(star)} 
                className="focus:outline-none"
                disabled={submitting}
              >
                <StarIcon
                  className={`h-6 w-6 ${star <= rating ? "text-red-500 fill-current" : "text-red-500 fill-none stroke-current"}`}
                />
              </button>
            ))}
            <span className="text-sm text-gray-500 ml-2">Stars</span>
          </div>

          <div className="mb-6">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
              className="w-full border rounded-md p-2 h-24"
              disabled={submitting}
            />
          </div>
{/* 
          <div className="mb-6">
            <label className="block text-base font-medium mb-2">Photos</label>
            <div className="flex items-center gap-2 flex-wrap">
              {media.map((src, index) => (
                <div key={index} className="border rounded-md w-20 h-20 overflow-hidden">
                  <Image
                    src={src}
                    alt="Review media"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <button 
                type="button"
                className="border rounded-md w-20 h-20 flex items-center justify-center text-gray-400"
                disabled={submitting}
                onClick={handleAddImageClick}
              >
                <Plus className="h-8 w-8" />
              </button>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
                disabled={submitting}
              />
            </div>
          </div> */}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button 
              onClick={handleSubmit}
              disabled={submitting}
              className={`bg-[#8B2615] text-white px-6 py-2 rounded ${
                submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#a13425]'
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
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

