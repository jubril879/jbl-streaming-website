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
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState("user")
  const [authToken, setAuthToken] = useState(null)

  useEffect(() => {
    try {
      // Removed localStorage usage for user and token
      const user = null
      const token = null
      
      if (user && token) {
        const userData = JSON.parse(user)
        setCurrentUser(userData)
        setIsAuthenticated(true)
        setUserRole(userData.role || "user")
      }
    } catch (error) {
      console.error("Error initializing app:", error)
    }
  }, [])

  const handleLogin = (userData) => {
    setCurrentUser(userData.user || userData)
    setIsAuthenticated(true)
    setUserRole((userData.user || userData).role || "user")
    if (userData.token) setAuthToken(userData.token)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    setUserRole("user")
    setAuthToken(null)
  }

  const handleUpdateUser = (updates) => {
    if (!currentUser) return
    const updated = { ...currentUser, ...updates }
    setCurrentUser(updated)
    // Removed localStorage set for currentUser
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
