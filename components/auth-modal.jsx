"use client"
import LoginForm from "@/components/login-form"
import SignupForm from "@/components/signup-form"

export default function AuthModal({ isOpen, mode, onClose, onSuccess }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">{mode === "login" ? "Sign In" : "Create Account"}</h2>
          <button onClick={onClose} className="text-foreground/50 hover:text-foreground">
            ✕
          </button>
        </div>

        {mode === "login" ? <LoginForm onSuccess={onSuccess} /> : <SignupForm onSuccess={onSuccess} />}
      </div>
    </div>
  )
}
