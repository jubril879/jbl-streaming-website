import { useState } from "react"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { authAPI } from "../lib/api"

export default function LoginForm({ onSuccess }) {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const result = await authAPI.login(formData.email, formData.password)
      
      if (result.user && result.token) {
        // API already stores token, now store user
        localStorage.setItem("currentUser", JSON.stringify(result.user))
        onSuccess(result.user)
        setError("")
      } else {
        setError(result.message || "Login failed")
      }
    } catch (err) {
      setError("Failed to connect to server. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 text-xs font-semibold text-white shadow-md">CinemaHub</span>
        </div>
        <h2 className="text-3xl font-extrabold text-foreground mb-2">Welcome Back</h2>
        <p className="text-foreground/60 text-sm">Sign in to your CinemaHub account</p>
      </div>

      {error && <div className="p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-sm font-medium animate-pulse">{error}</div>}

      <div className="group">
        <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition" size={20} />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full pl-12 pr-4 py-3.5 bg-background/50 hover:bg-background/70 text-foreground rounded-xl border border-border/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition placeholder:text-foreground/40"
          />
        </div>
      </div>

      <div className="group">
        <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition" size={20} />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition z-10"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full pl-12 pr-12 py-3.5 bg-background/50 hover:bg-background/70 text-foreground rounded-xl border border-border/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition placeholder:text-foreground/40"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-bold rounded-xl transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-primary/30 mt-2"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>

      <div className="pt-4 border-t border-border/40">
        <p className="text-center text-foreground/60 text-xs">Demo Accounts:</p>
        <div className="text-center text-foreground/50 text-xs mt-2 space-y-1">
          <p><span className="text-primary font-semibold">User:</span> <span className="text-primary font-semibold">demo@test.com</span> / <span className="text-primary font-semibold">password123</span></p>
          <p><span className="text-yellow-400 font-semibold">Admin:</span> <span className="text-yellow-400 font-semibold">admin@cinemahub.com</span> / <span className="text-yellow-400 font-semibold">admin123</span></p>
        </div>
      </div>
    </form>
  )
}
