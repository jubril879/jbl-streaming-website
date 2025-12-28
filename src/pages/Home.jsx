import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navigation from "../components/Navigation"
import HeroSection from "../components/HeroSection"
import MovieCarousel from "../components/MovieCarousel"
import AuthModal from "../components/AuthModal"
import Footer from "../components/Footer"
import { moviesAPI } from "../lib/api"

export default function Home({ isAuthenticated, onLogin, onLogout }) {
  const navigate = useNavigate()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState("login")
  const [adminMovies, setAdminMovies] = useState([])
  const [adminMoviesByGenre, setAdminMoviesByGenre] = useState({})

  useEffect(() => {
    // Load movies from API
    const loadMovies = async () => {
      try {
        const apiMovies = await moviesAPI.getAll()
        setAdminMovies(apiMovies)

        // Group movies by genre
        const grouped = apiMovies.reduce((acc, movie) => {
          if (!acc[movie.genre]) {
            acc[movie.genre] = []
          }
          acc[movie.genre].push(movie)
          return acc
        }, {})
        setAdminMoviesByGenre(grouped)
      } catch (err) {
        console.error("Failed to load movies:", err)
        setAdminMovies([])
        setAdminMoviesByGenre({})
      }
    }

    loadMovies()
  }, [])

  const handleAuthClick = (mode) => {
    setAuthMode(mode)
    setShowAuth(true)
  }

  const handleAuthSuccess = (userData) => {
    onLogin(userData)
    setShowAuth(false)
    // Redirect admins to admin page, regular users stay on home
    if (userData.role === "admin") {
      navigate("/admin")
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation isAuthenticated={isAuthenticated} onAuthClick={handleAuthClick} onLogout={onLogout} />
      <HeroSection onGetStarted={() => handleAuthClick("signup")} isAuthenticated={isAuthenticated} />

      {/* Admin Added Movies by Genre */}
      {Object.keys(adminMoviesByGenre).length > 0 && (
        <section className="relative py-8 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6">Admin Added Movies</h2>
            {Object.entries(adminMoviesByGenre).map(([genre, movies]) => (
              <div key={genre} className="mb-8">
                <h3 className="text-2xl font-semibold text-foreground mb-4">{genre}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  {movies.map((movie) => (
                    <div
                      key={movie._id}
                      className="group relative cursor-pointer"
                      onClick={() => navigate(`/watch/${movie._id}`)}
                    >
                      <div className="relative w-full aspect-[2/3] bg-secondary rounded-lg overflow-hidden">
                        <img
                          src={movie.poster || `https://via.placeholder.com/200x300?text=${encodeURIComponent(movie.title)}`}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/80 group-hover:bg-black/60 transition flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100">
                          <h3 className="text-white font-bold mb-2">{movie.title}</h3>
                          <div className="flex items-center gap-2 mb-3 text-sm text-foreground/80">
                            <span>⭐ {movie.rating}</span>
                            <span>{movie.year}</span>
                            <span>{movie.genre}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <AuthModal isOpen={showAuth} mode={authMode} onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />
      <Footer />
    </main>
  )
}
