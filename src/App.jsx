import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import Home from "./pages/Home"
import Browse from "./pages/Browse"
import Watch from "./pages/Watch"
import Profile from "./pages/Profile"
import Admin from "./pages/Admin"
import Trending from "./pages/Trending"
import Settings from "./pages/Settings"
import RegisterAdmin from "./components/RegisterAdmin"
import AdminLoginPage from "./pages/AdminLoginPage"
import About from "./pages/About"
import Careers from "./pages/Careers"
import Press from "./pages/Press"
import HelpCenter from "./pages/HelpCenter"
import Contact from "./pages/Contact"
import FAQ from "./pages/FAQ"
import Privacy from "./pages/Privacy"
import Terms from "./pages/Terms"
import Cookies from "./pages/Cookies"
import SocialTwitter from "./pages/SocialTwitter"
import SocialInstagram from "./pages/SocialInstagram"
import forgotpasswordmoal from "./components/ForgotPasswordModal"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState("user")
  const [authToken, setAuthToken] = useState(null)

  useEffect(() => {
    try {
      // Check if user has active session with backend (cookie-based)
      fetchUserData()
    } catch (error) {
      console.error("Error initializing app:", error)
    }
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        credentials: "include",
      })
      if (response.ok) {
        const userData = await response.json()
        setCurrentUser(userData)
        setIsAuthenticated(true)
        setUserRole(userData.role || "user")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const handleLogin = (userData) => {
    const user = userData.user || userData
    setCurrentUser(user)
    setIsAuthenticated(true)
    setUserRole(user.role || "user")
  }

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint to clear cookie
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Error during logout:", error)
    }
    setCurrentUser(null)
    setIsAuthenticated(false)
    setUserRole("user")
    setAuthToken(null)
  }

  const handleUpdateUser = (updates) => {
    if (!currentUser) return
    const updated = { ...currentUser, ...updates }
    setCurrentUser(updated)
  }

  const handleDeleteAccount = () => {
    if (!currentUser) return
    handleLogout()
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Home isAuthenticated={isAuthenticated} onLogin={handleLogin} onLogout={handleLogout} userRole={userRole} />}
        />
        <Route path="/browse" element={<Browse isAuthenticated={isAuthenticated} onLogin={handleLogin} userRole={userRole} />} />
        <Route path="/trending" element={<Trending isAuthenticated={isAuthenticated} onLogin={handleLogin} userRole={userRole} />} />
        <Route path="/watch/:id" element={<Watch isAuthenticated={isAuthenticated} currentUser={currentUser} userRole={userRole} />} />
        <Route
          path="/profile"
          element={<Profile isAuthenticated={isAuthenticated} currentUser={currentUser} onLogout={handleLogout} userRole={userRole} />}
        />
        <Route path="/settings" element={<Settings isAuthenticated={isAuthenticated} currentUser={currentUser} onUpdateUser={handleUpdateUser} onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} userRole={userRole} />} />
        <Route path="/register-admin" element={<RegisterAdmin />} />
        <Route path="/admin-login" element={<AdminLoginPage onLogin={handleLogin} />} />
        
        <Route path="/admin" element={<Admin isAuthenticated={isAuthenticated} userRole={userRole} authToken={authToken} />} />
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/press" element={<Press />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/social-twitter" element={<SocialTwitter />} />
        <Route path="/social-instagram" element={<SocialInstagram />} />
      </Routes>
    </Router>
  )
}

export default App
