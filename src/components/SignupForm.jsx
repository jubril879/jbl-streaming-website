import { useState } from "react"
import { Mail, Lock, User, Eye, EyeOff, CheckCircle } from "lucide-react"
import { authAPI } from "../lib/api"

export default function SignupForm({ onSuccess }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const result = await authAPI.register(formData.name, formData.email, formData.password)

      if (result.user && result.token) {
        localStorage.setItem("currentUser", JSON.stringify(result.user))
        onSuccess(result.user)

        try {
          const { sendWelcomeEmail } = await import("../lib/email")
          await sendWelcomeEmail(result.user)
          console.log("Welcome email sent")
        } catch (emailErr) {
          console.warn("Failed to send welcome email:", emailErr)
        }

        setError("")
      } else {
        setError(result.message || "Failed to create account")
      }
    } catch (err) {
      setError(err.message || "Failed to create account")
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
        <h2 className="text-3xl font-extrabold text-foreground mb-2">Join CinemaHub</h2>
        <p className="text-foreground/60 text-sm">Create your account and start streaming</p>
      </div>

      {error && <div className="p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-sm font-medium animate-pulse">{error}</div>}

      <div className="relative group">
        <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
        <User className="absolute left-2 top-3/4 transform -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition" size={20} />
        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full pl-20 pr-4 py-3.5 bg-background/50 hover:bg-background/70 text-foreground rounded-xl border border-border/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition placeholder:text-foreground/40"
        />
      </div>

      <div className="relative group">
        <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
        <Mail className="absolute left-2 top-3/4 transform -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition" size={20} />
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full pl-20 pr-4 py-3.5 bg-background/50 hover:bg-background/70 text-foreground rounded-xl border border-border/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition placeholder:text-foreground/40"
        />
      </div>

      <div className="relative group">
        <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
        <Lock className="absolute left-2 top-3/4 transform -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition" size={20} />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-3/4 transform -translate-y-1/2 text-foreground/50 hover:text-foreground transition"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Create a strong password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full pl-20 pr-20 py-3.5 bg-background/50 hover:bg-background/70 text-foreground rounded-xl border border-border/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition placeholder:text-foreground/40"
        />
      </div>

      <div className="relative group">
        <label className="block text-sm font-semibold text-foreground mb-2">Confirm Password</label>
        <Lock className="absolute left-2 top-3/4 transform -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition" size={20} />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-4 top-3/4 transform -translate-y-1/2 text-foreground/50 hover:text-foreground transition"
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full pl-20 pr-20 py-3.5 bg-background/50 hover:bg-background/70 text-foreground rounded-xl border border-border/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition placeholder:text-foreground/40"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-bold rounded-xl transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-primary/30 mt-2"
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>

      <div className="pt-4 border-t border-border/40">
        <p className="text-center text-foreground/60 text-xs flex items-center justify-center gap-2">
          <CheckCircle size={16} className="text-primary" /> Secure account creation
        </p>
      </div>
    </form>
  )
}
