import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, X, Search, User, LogOut } from "lucide-react"

export default function Navigation({ isAuthenticated, onAuthClick, onLogout, userRole }) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    onLogout?.()
    navigate("/")
  }

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-lg border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CH</span>
            </div>
            <span className="hidden sm:inline text-xl font-bold text-foreground">CinemaHub</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/browse" className="text-sm text-foreground/70 hover:text-foreground transition">
              Browse
            </Link>
            <Link to="/trending" className="text-sm text-foreground/70 hover:text-foreground transition">
              Trending
            </Link>
            {isAuthenticated && userRole === "admin" && (
              <Link to="/admin" className="text-sm text-primary font-bold hover:text-primary/80 transition">
                Admin
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 hover:bg-secondary rounded-lg transition">
              <Search size={20} className="text-foreground" />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/profile">
                  <button className="px-4 py-2 bg-transparent border border-border text-foreground rounded-lg hover:bg-secondary transition flex items-center gap-2">
                    <User size={16} />
                    Profile
                  </button>
                </Link>
                <button onClick={handleLogout} className="p-2 hover:bg-secondary rounded-lg transition">
                  <LogOut size={20} className="text-foreground" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAuthClick?.("login")}
                  className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onAuthClick?.("signup")}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                >
                  Subscribe
                </button>
              </div>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} className="text-foreground" /> : <Menu size={24} className="text-foreground" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/browse" className="block px-4 py-2 text-foreground/70 hover:text-foreground">
              Browse
            </Link>
            <Link to="/trending" className="block px-4 py-2 text-foreground/70 hover:text-foreground">
              Trending
            </Link>
            {isAuthenticated && userRole === "admin" && (
              <Link to="/admin" className="block px-4 py-2 text-primary font-bold hover:text-primary/80">
                Admin
              </Link>
            )}
            <div className="flex gap-2 px-4 pt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary transition"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onAuthClick?.("login")}
                    className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onAuthClick?.("signup")}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                  >
                    Subscribe
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
