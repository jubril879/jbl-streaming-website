import { X } from "lucide-react"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"

export default function AuthModal({ isOpen, mode, onClose, onSuccess }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md my-8">
        {/* Colorful animated gradient background */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="auth-gradient-bg" />
        </div>

        <div className="relative bg-gradient-to-br from-secondary/80 to-background/90 rounded-2xl shadow-2xl border border-primary/10 overflow-hidden max-h-[90vh] flex flex-col">
         
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/6 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/6 rounded-full blur-3xl pointer-events-none" />

      
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-background/40 hover:bg-primary hover:text-white text-foreground rounded-full transition duration-200 z-20 hover:scale-110 shadow-md border border-border/50"
            title="Close"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>

        
          <div className="p-8 relative z-10 overflow-y-auto max-h-[calc(90vh-2rem)]">
            {mode === "login" ? <LoginForm onSuccess={onSuccess} /> : <SignupForm onSuccess={onSuccess} />}
          </div>
        </div>
      </div>
    </div>
  )
}
