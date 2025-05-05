"use client"


import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Mail, Phone, Github, Twitter } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext";
import { BASE_URL } from "@/constants/constants";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [contactMethod, setContactMethod] = useState("email");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: contact,
          password,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Login failed");
        return;
      }

      const data = await res.json();
      // { id, name, email, phoneNumber, role, token }
      login(data);

      // redirect by role
      if (data.role === "ROLE_ADMIN") {
        router.push("/admin");
      } else if (data.role === "ROLE_MANAGER") {
        router.push("/manager");
      } else {
        router.push("/home");
      }
    } catch (e) {
      console.error("Login error:", e);
      setError("Network error");
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center text-3xl font-bold mb-12">
            <h1 className="text-[#8B2615]">Sign In</h1>
            <span className="mx-4 text-gray-300">|</span>
            <Link href="/signup" className="text-gray-300 hover:text-gray-400">
              Sign Up
            </Link>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <div className="flex border rounded-md overflow-hidden">
                <div className="flex">
                  <button
                    type="button"
                    className={`flex items-center justify-center w-12 h-12 ${contactMethod === "phone" ? "bg-gray-100" : "bg-white"}`}
                    onClick={() => setContactMethod("phone")}
                  >
                    <Phone className="h-5 w-5 text-gray-500" />
                  </button>
                  <button
                    type="button"
                    className={`flex items-center justify-center w-12 h-12 ${contactMethod === "email" ? "bg-gray-100" : "bg-white"}`}
                    onClick={() => setContactMethod("email")}
                  >
                    <Mail className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <input
                  type={contactMethod === "email" ? "email" : "tel"}
                  placeholder={contactMethod === "email" ? "Email" : "Phone Number"}
                  className="flex-1 px-4 py-3 outline-none"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center bg-gray-100 rounded-md">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-transparent outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && <div className="text-red-600 text-sm text-center">{error}</div>}

            <button 
              type="submit" 
              className="w-full bg-[#8B2615] text-white py-3 rounded-md font-medium hover:bg-[#7a1f12] transition-colors"
            >
              Sign In
            </button>

            <div className="text-right">
              <Link href="/forgot-password" className="text-[#8B2615] text-sm hover:text-[#7a1f12]">
                Forgot Password?
              </Link>
            </div>

            {/* <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div> */}

            {/* <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
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
//       <path
//         fill="#4285F4"
//         d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//       />
//       <path
//         fill="#34A853"
//         d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//       />
//       <path
//         fill="#FBBC05"
//         d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//       />
//       <path
//         fill="#EA4335"
//         d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//       />
//     </svg>
//   )
// }