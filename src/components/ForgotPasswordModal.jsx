import { useState } from "react"
import { Mail, X, ArrowLeft, CheckCircle } from "lucide-react"
import { authAPI } from "../lib/api"

export default function ForgotPasswordModal({ isOpen, onClose, onCodeSent }) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      await authAPI.forgotPassword(email)
      setSuccess(true)
      setTimeout(() => {
        onCodeSent(email)
        onClose()
      }, 2000)
    } catch (err) {
      setError(err.message || "Failed to send reset code")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary rounded-2xl p-6 w-full max-w-md shadow-2xl border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Forgot Password</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background/20 rounded-lg transition"
          >
            <X size={20} className="text-foreground/60" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center py-8">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Code Sent!</h3>
            <p className="text-foreground/60 text-sm">
              Check your email for the reset code
            </p>
          </div>
        ) : (
          <>
            <p className="text-foreground/60 text-sm mb-6">
              Enter your email address and we'll send you a reset code.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="group">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-background/50 hover:bg-background/70 text-foreground rounded-xl border border-border/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition placeholder:text-foreground/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-bold rounded-xl transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-primary/30"
              >
                {isLoading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
