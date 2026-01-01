import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import { Search } from "lucide-react"
import { moviesAPI } from "../lib/api"

export default function Browse({ isAuthenticated, onLogin, userRole }) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenres, setSelectedGenres] = useState(["All"])
  const [sortBy, setSortBy] = useState("rating")
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const fetchedMovies = await moviesAPI.getAll()
        setMovies(fetchedMovies || [])
      } catch (err) {
        setError("Failed to fetch movies")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
    
    // Auto-refresh every 3 seconds to stay synced with MongoDB
    const refreshInterval = setInterval(fetchMovies, 3000)
    return () => clearInterval(refreshInterval)
  }, [])

  const allMovies = useMemo(() => movies, [movies])

  const GENRES = useMemo(() => {
    const allGenres = new Set(["All"])
    allMovies.forEach(movie => allGenres.add(movie.genre))
    return Array.from(allGenres)
  }, [allMovies])

  const filteredMovies = useMemo(() => {
    const result = allMovies.filter((movie) => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesGenre = selectedGenres.includes("All") || selectedGenres.includes(movie.genre)
      return matchesSearch && matchesGenre
    })

    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating)
    if (sortBy === "newest") result.sort((a, b) => b.year - a.year)
    if (sortBy === "az") result.sort((a, b) => a.title.localeCompare(b.title))

    return result
  }, [allMovies, searchQuery, selectedGenres, sortBy])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Navigation isAuthenticated={false} onAuthClick={(mode) => navigate("/")} userRole={userRole} />
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Please sign in to continue</h1>
          <button onClick={onLogin} className="mt-8 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90">
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation isAuthenticated={isAuthenticated} userRole={userRole} />
        <div className="pt-8 px-4 max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Browse Movies</h1>
          <div className="text-center py-12">
            <p className="text-foreground/70">Loading movies...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation isAuthenticated={isAuthenticated} userRole={userRole} />
        <div className="pt-8 px-4 max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Browse Movies</h1>
          <div className="text-center py-12">
            <p className="text-foreground/70">Error: {error}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation isAuthenticated={isAuthenticated} userRole={userRole} />

  <div className="pt-8 px-4 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">Browse Movies</h1>

        <div className="mb-8">
          <video
            width="100%"
            height="400"
            controls
            className="rounded-lg"
          >
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" type="video/mp4" />
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" type="video/mp4" />
                <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="mb-8 space-y-10">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={20} aria-hidden />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-3 bg-secondary text-foreground rounded-lg border border-border focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenres(genre === "All" ? ["All"] : [genre])}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedGenres.includes(genre)
                      ? "bg-primary text-white"
                      : "bg-secondary text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-secondary text-foreground border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="rating">Highest Rating</option>
              <option value="newest">Newest First</option>
              <option value="az">A-Z</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-12">
          {filteredMovies.map((movie) => (
            <div
              key={movie._id}
              onClick={() => navigate(`/watch/${movie._id}`)}
              className="group cursor-pointer relative overflow-hidden rounded-lg"
            >
              <img
                src={movie.poster || movie.image || "/placeholder.svg"}
                alt={movie.title}
                className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
                onError={(e) => {
                  e.target.src = "/placeholder.svg"
                }}
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition flex flex-col justify-end p-4">
                <h3 className="text-foreground font-semibold text-lg mb-1">{movie.title}</h3>
                <div className="flex justify-between items-center text-sm text-muted">
                  <span>{movie.genre}</span>
                  <span>⭐ {(movie.rating || 0).toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}
