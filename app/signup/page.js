"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Github, Twitter } from "lucide-react"
import { BASE_URL } from "@/constants/constants"
export default function Signup() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("ROLE_CUSTOMER")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data?.message || "Signup failed. Try again.")
        return
      }

      // Success
      router.push("/login")
    } catch (err) {
      setError("Network error. Try again.")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Tabs */}
          <div className="flex justify-center text-3xl font-bold mb-12">
            <Link href="/login" className="text-gray-300 hover:text-gray-400">
              Sign In
            </Link>
            <span className="mx-4 text-gray-300">|</span>
            <h1 className="text-[#8B2615]">Sign Up</h1>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                className="w-full px-4 py-3 border rounded-md outline-none"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="ROLE_CUSTOMER">Customer</option>
                <option value="ROLE_MANAGER">Manager</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border rounded-md outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>



            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-blue-400 rounded-md outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="flex items-center bg-gray-100 rounded-md">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-transparent outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400"
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="flex items-center bg-gray-100 rounded-md">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-transparent outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-gray-400"
                >
                  {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && <div className="text-red-600 text-sm text-center">{error}</div>}

            <button type="submit" className="w-full bg-[#8B2615] text-white py-3 rounded-md font-medium">
              Sign Up
            </button>

            {/* <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div> */}

            {/* <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-md font-medium"
            >
              <GoogleIcon className="h-5 w-5" />
              <span>Sign In with Google</span>
            </button> */}
          </form>
        </div>
      </div>

      <footer className="text-center py-4 text-sm text-gray-600 border-t">
        <div>(C) 2025 Maverick, Inc</div>
        <div className="flex justify-center gap-4 mt-2">
          <Github size={16} />
          <Twitter size={16} />
        </div>
      </footer>
    </div>
  )
}

// function GoogleIcon({ className }) {
//   return (
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
//       {/* same Google path elements as before */}
//     </svg>
//   )
// }