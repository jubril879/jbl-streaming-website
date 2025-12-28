import { useState } from "react"
import { Mail, Lock, Shield, Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function AdminLogin({ onLogin }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: "", password: "", adminCode: "" })
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const user = users.find((u) => u.email === formData.email && u.password === formData.password)

      if (user && user.role === "admin" && formData.adminCode === "ADMIN123") {
        onLogin(user)
        // Small delay to ensure state updates before navigation
        setTimeout(() => {
          navigate("/admin")
        }, 100)
        setError("")
      } else if (user && user.role !== "admin") {
        setError("Access denied: Admin privileges required")
      } else if (user && formData.adminCode !== "ADMIN123") {
        setError("Invalid admin code")
      } else {
        setError("Invalid email or password")
      }
      setIsLoading(false)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-600 rounded-full">
                <Shield className="text-white" size={32} />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2">Admin Access</h2>
            <p className="text-gray-400 text-sm">Enter your credentials to access the admin dashboard</p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-sm font-medium animate-pulse mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
              <Mail className="absolute left-4 top-11 text-red-400 group-focus-within:text-red-300 transition" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Enter admin email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl border border-gray-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition placeholder:text-gray-400"
              />
            </div>

            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <Lock className="absolute left-4 top-11 text-red-400 group-focus-within:text-red-300 transition" size={20} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-11 text-gray-400 hover:text-gray-300 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter admin password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-12 py-3.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl border border-gray-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition placeholder:text-gray-400"
              />
            </div>

            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Admin Code</label>
              <Shield className="absolute left-4 top-11 text-red-400 group-focus-within:text-red-300 transition" size={20} />
              <input
                type="text"
                name="adminCode"
                placeholder="Enter admin code"
                value={formData.adminCode}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl border border-gray-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold rounded-xl transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-red-500/30 mt-2"
            >
              {isLoading ? "Authenticating..." : "Access Admin Dashboard"}
            </button>
          </form>

          <div className="pt-6 border-t border-gray-700">
            <p className="text-center text-gray-500 text-xs">Demo Admin Credentials:</p>
            <div className="text-center text-gray-400 text-xs mt-2 space-y-1">
              <p><span className="text-red-400 font-semibold">Email:</span> <span className="text-red-400 font-semibold">admin@cinemahub.com</span></p>
              <p><span className="text-red-400 font-semibold">Password:</span> <span className="text-red-400 font-semibold">admin123</span></p>
              <p><span className="text-red-400 font-semibold">Admin Code:</span> <span className="text-red-400 font-semibold">ADMIN123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
