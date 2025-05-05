"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Pencil, Github, Twitter } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { BASE_URL } from "@/constants/constants"
export default function UserProfile() {
  const { user } = useAuth()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        
        const data = await response.json()
        setFormData({
          name: data.name || "",
          phone: data.phoneNumber || "",
          email: data.email || "",
          password: "••••••••••"
        })
      } catch (err) {
        setError(err.message)
      }
    }

    if (user?.id) {
      fetchUserData()
    }
  }, [user])

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          phoneNumber: formData.phone,
          email: formData.email,
          password: formData.password === "••••••••••" ? undefined : formData.password
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update profile')
      }

      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleDeleteAccount = () => {
    setShowConfirmModal(true)
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 border-r">
        <nav className="py-8 px-6">
          <ul className="space-y-2">
            <li>
              <Link href="/user" className="block py-2 text-[#8B2615] font-medium">
                My Profile
              </Link>
            </li>
            <li>
              <Link href="/user/reservations" className="block py-2 text-gray-400 hover:text-gray-600">
                My Reservations
              </Link>
            </li>
            <li>
              <Link href="/user/reviews" className="block py-2 text-gray-400 hover:text-gray-600">
                My Reviews
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="max-w-2xl">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium">Name:</label>
              <div className="w-96 relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full p-3 border rounded-md pr-10"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Pencil className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium">Phone Number:</label>
              <div className="w-96 relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full p-3 border rounded-md pr-10"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Pencil className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium">Email Address:</label>
              <div className="w-96 relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full p-3 border border-blue-400 rounded-md pr-10"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Pencil className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium">Password:</label>
              <div className="w-96 relative">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="w-full p-3 border rounded-md pr-10"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Pencil className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center">{success}</div>}
            <button onClick={handleUpdate} className="w-full py-3 bg-[#8B2615] text-white rounded-md font-medium">
              Update
            </button>

            <button
              onClick={handleDeleteAccount}
              className="w-full py-3 border border-gray-300 text-gray-600 rounded-md font-medium"
            >
              Delete my Account
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <ConfirmModal
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => {
            // Handle account deletion logic here
            setShowConfirmModal(false)
          }}
        />
      )}

      <footer className="text-center py-4 text-sm text-gray-600 border-t absolute bottom-0 w-full">
        <div>(C) 2025 Maverick, Inc</div>
        <div className="flex justify-center gap-4 mt-2">
          <Github size={16} />
          <Twitter size={16} />
        </div>
      </footer>
    </div>
  )
}

function ConfirmModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full border border-blue-400">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#8B2615]">Confirm?</h2>
          <button onClick={onClose} className="text-gray-500">
            <XIcon />
          </button>
        </div>
        <p className="mb-6">Warning Message</p>
        <div className="flex gap-4 justify-center">
          <button onClick={onConfirm} className="px-6 py-2 bg-[#8B2615] text-white rounded-md font-medium">
            Yes
          </button>
          <button onClick={onClose} className="px-6 py-2 bg-[#8B2615] text-white rounded-md font-medium">
            No
          </button>
        </div>
      </div>
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
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
}
