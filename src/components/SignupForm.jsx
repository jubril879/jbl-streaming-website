import { useState } from "react"
import { Mail, Lock, User, Eye, EyeOff, CheckCircle } from "lucide-react"
import { authAPI } from "../lib/api"
import WelcomeModal from "./WelcomeModal"

export default function SignupForm({ onSuccess }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [welcomeUserName, setWelcomeUserName] = useState("")

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
        setWelcomeUserName(result.user.name)
        setShowWelcomeModal(true)
        setTimeout(() => {
          onSuccess(result.user)
          setError("")
        }, 2000)
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
    <>
      <WelcomeModal 
        isOpen={showWelcomeModal} 
        onClose={() => setShowWelcomeModal(false)}
        userName={welcomeUserName}
        type="signup"
      />
      <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 text-xs font-semibold text-white shadow-md">CinemaHub</span>
        </div>
        <h2 className="text-3xl font-extrabold text-foreground mb-2">Join CinemaHub</h2>
        <p className="text-foreground/60 text-sm">Create your account and start streaming</p>
      </div>

      {error && <div className="p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-sm font-medium animate-pulse">{error}</div>}

      <div className="group">
        <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition" size={20} />
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full pl-12 pr-4 py-3.5 bg-background/50 hover:bg-background/70 text-foreground rounded-xl border border-border/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition placeholder:text-foreground/40"
          />
        </div>
      </div>

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
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full pl-12 pr-12 py-3.5 bg-background/50 hover:bg-background/70 text-foreground rounded-xl border border-border/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition placeholder:text-foreground/40"
          />
        </div>
      </div>

      <div className="group">
        <label className="block text-sm font-semibold text-foreground mb-2">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition" size={20} />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition z-10"
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
            className="w-full pl-12 pr-12 py-3.5 bg-background/50 hover:bg-background/70 text-foreground rounded-xl border border-border/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition placeholder:text-foreground/40"
          />
        </div>
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
    </>
  )
}
