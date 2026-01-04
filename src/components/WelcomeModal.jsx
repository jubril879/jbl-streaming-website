import { useState, useEffect } from "react"
import { CheckCircle, X } from "lucide-react"

export default function WelcomeModal({ isOpen, onClose, userName, type = "login" }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  if (!isOpen && !isVisible) return null

  const isLogin = type === "login"
  const title = isLogin ? "Welcome Back!" : "Welcome to CinemaHub"
  const message = isLogin 
    ? `Great to see you again, ${userName}! Ready to explore amazing content?`
    : `Hello ${userName}! Your account has been created successfully. Start streaming now!`
  const gradient = isLogin 
    ? "from-blue-500 to-purple-600"
    : "from-pink-500 to-purple-600"

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        backgroundColor: isVisible ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0)",
      }}
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-md mx-4 transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Modal */}
        <div className="bg-gradient-to-br from-background via-background to-background/80 border border-border/50 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
          {/* Header Gradient */}
          <div className={`h-32 bg-gradient-to-r ${gradient} relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-full animate-bounce">
                <CheckCircle className="text-white" size={40} />
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition text-white"
          >
            <X size={20} />
          </button>

          {/* Content */}
          <div className="px-8 py-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-3 mt-2">
              {title}
            </h2>
            <p className="text-foreground/70 text-base leading-relaxed mb-6">
              {message}
            </p>

            {/* Decorative Elements */}
            <div className="flex justify-center gap-2 mb-8">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full"></div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleClose}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Started
            </button>
          </div>

          {/* Bottom decorative bar */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500"></div>
        </div>
      </div>
    </div>
  )
}
