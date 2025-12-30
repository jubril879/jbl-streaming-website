import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navigation from "../components/Navigation"
import HeroSection from "../components/HeroSection"
import MovieCarousel from "../components/MovieCarousel"
import AuthModal from "../components/AuthModal"
import Footer from "../components/Footer"
import { moviesAPI } from "../lib/api"

export default function Home({ isAuthenticated, onLogin, onLogout, userRole }) {
  const navigate = useNavigate()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState("login")
  const [allMovies, setAllMovies] = useState([])
  const [moviesByGenre, setMoviesByGenre] = useState({})
  const [loadingMovies, setLoadingMovies] = useState(false)

  useEffect(() => {
    const loadMovies = async () => {
      setLoadingMovies(true)
      try {
        const apiMovies = await moviesAPI.getAll()
        setAllMovies(apiMovies || [])

        const grouped = (apiMovies || []).reduce((acc, movie) => {
          if (!acc[movie.genre]) {
            acc[movie.genre] = []
          }
          acc[movie.genre].push(movie)
          return acc
        }, {})
        setMoviesByGenre(grouped)
      } catch (err) {
        console.error("Failed to load movies:", err)
        setAllMovies([])
        setMoviesByGenre({})
      } finally {
        setLoadingMovies(false)
      }
    }

    loadMovies()
    
    const refreshInterval = setInterval(loadMovies, 5000)
    return () => clearInterval(refreshInterval)
  }, [])

  const handleAuthClick = (mode) => {
    setAuthMode(mode)
    setShowAuth(true)
  }

  const handleAuthSuccess = (userData) => {
    onLogin(userData)
    setShowAuth(false)
    if (userData.role === "admin") {
      navigate("/admin")
    }
  }

  const getNewReleases = () => {
    return allMovies.slice(0, 6).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  const getTopRated = () => {
    return [...allMovies].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6)
  }

  const MovieCard = ({ movie, onClick }) => (
    <div
      className="group relative cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative w-full aspect-[2/3] bg-secondary overflow-hidden">
        <img
          src={movie.poster || movie.image || `https://via.placeholder.com/200x300?text=${encodeURIComponent(movie.title)}`}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/200x300?text=${encodeURIComponent(movie.title)}`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
          <div className="flex items-start justify-between">
            <span className="px-3 py-1 rounded-full bg-primary/90 text-white text-xs font-bold">{movie.genre}</span>
            <span className="px-2 py-1 rounded bg-yellow-500/90 text-black text-xs font-bold flex items-center gap-1">
              ⭐ {(movie.rating || 0).toFixed(1)}
            </span>
          </div>
          <div>
            <h3 className="text-white font-bold mb-2 text-sm line-clamp-2">{movie.title}</h3>
            <p className="text-foreground/80 text-xs mb-3">{movie.year}</p>
            <button className="w-full py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold text-sm transition-colors">
              ▶ Watch Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-background">
      <Navigation isAuthenticated={isAuthenticated} onAuthClick={handleAuthClick} onLogout={onLogout} userRole={userRole} />
      <HeroSection onGetStarted={() => handleAuthClick("signup")} isAuthenticated={isAuthenticated} />

      {/* Content Sections */}
      <div className="relative bg-gradient-to-b from-background to-background/80">
        {/* New Releases Section */}
        {allMovies.length > 0 && (
          <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-border/20">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-bold text-foreground">New Releases</h2>
                  <p className="text-foreground/60 mt-2">Latest movies added to CinemaHub</p>
                </div>
                <button
                  onClick={() => navigate("/browse")}
                  className="px-6 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition font-semibold"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {getNewReleases().map((movie) => (
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                    onClick={() => navigate(`/watch/${movie._id}`)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Top Rated Section */}
        {allMovies.length > 0 && (
          <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-border/20">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-foreground mb-8">Top Rated</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {getTopRated().map((movie) => (
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                    onClick={() => navigate(`/watch/${movie._id}`)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Movies by Genre */}
        {Object.keys(moviesByGenre).length > 0 && (
          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-foreground mb-12">Browse by Genre</h2>
              {Object.entries(moviesByGenre)
                .sort((a, b) => b[1].length - a[1].length)
                .map(([genre, movies]) => (
                  <div key={genre} className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-semibold text-foreground">{genre}</h3>
                      <span className="text-foreground/60 text-sm">{movies.length} titles</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                      {movies.slice(0, 12).map((movie) => (
                        <MovieCard
                          key={movie._id}
                          movie={movie}
                          onClick={() => navigate(`/watch/${movie._id}`)}
                        />
                      ))}
                    </div>
                    {movies.length > 12 && (
                      <button
                        onClick={() => navigate("/browse")}
                        className="mt-6 px-6 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition font-semibold"
                      >
                        View All {movies.length} in {genre}
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {allMovies.length === 0 && !loadingMovies && (
          <section className="py-20 px-4 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-foreground mb-4">No Movies Yet</h3>
              <p className="text-foreground/70 mb-6">Content is coming soon! Check back later for amazing movies.</p>
              {!isAuthenticated && (
                <button
                  onClick={() => handleAuthClick("signup")}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  Get Started
                </button>
              )}
            </div>
          </section>
        )}

        {/* Loading State */}
        {loadingMovies && (
          <section className="py-20 px-4 text-center">
            <p className="text-foreground/70">Loading movies...</p>
          </section>
        )}
      </div>

      <AuthModal isOpen={showAuth} mode={authMode} onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />
      <Footer />
    </main>
  )
}
