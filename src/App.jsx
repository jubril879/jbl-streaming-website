import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import Home from "./pages/Home"
import Browse from "./pages/Browse"
import Watch from "./pages/Watch"
import Profile from "./pages/Profile"
import Admin from "./pages/Admin"
import AdminDashboard from "../components/admin-dashboard"
import Settings from "./pages/Settings"
import RegisterAdmin from "./components/RegisterAdmin"
import AdminLoginPage from "./pages/AdminLoginPage"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState("user")

  useEffect(() => {
    try {
      // Check if user is logged in (token exists and currentUser is stored)
      const user = localStorage.getItem("currentUser")
      const token = localStorage.getItem("authToken")
      
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
    setCurrentUser(userData)
    setIsAuthenticated(true)
    setUserRole(userData.role || "user")
    // currentUser and authToken are already stored by the backend API
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    setUserRole("user")
    localStorage.removeItem("currentUser")
    localStorage.removeItem("authToken")
  }

  const handleUpdateUser = (updates) => {
    if (!currentUser) return
    const updated = { ...currentUser, ...updates }
    setCurrentUser(updated)
    localStorage.setItem("currentUser", JSON.stringify(updated))
  }

  const handleDeleteAccount = () => {
    if (!currentUser) return
    // Logout will be handled by Settings.jsx calling backend
    handleLogout()
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Home isAuthenticated={isAuthenticated} onLogin={handleLogin} onLogout={handleLogout} />}
        />
        <Route path="/browse" element={<Browse isAuthenticated={isAuthenticated} onLogin={handleLogin} />} />
        <Route path="/watch/:id" element={<Watch isAuthenticated={isAuthenticated} currentUser={currentUser} />} />
        <Route
          path="/profile"
          element={<Profile isAuthenticated={isAuthenticated} currentUser={currentUser} onLogout={handleLogout} />}
        />
        <Route path="/settings" element={<Settings isAuthenticated={isAuthenticated} currentUser={currentUser} onUpdateUser={handleUpdateUser} onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} />} />
        <Route path="/register-admin" element={<RegisterAdmin />} />
        <Route path="/admin-login" element={<AdminLoginPage onLogin={handleLogin} />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin" element={<Admin isAuthenticated={isAuthenticated} userRole={userRole} />} />
      </Routes>
    </Router>
  )
}

export default App
