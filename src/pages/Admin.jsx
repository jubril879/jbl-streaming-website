import { useState, useEffect } from "react"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import { Upload, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { moviesAPI } from "../lib/api"

export default function Admin({ isAuthenticated, userRole }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    rating: "",
    year: new Date().getFullYear(),
    description: "",
  })
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check localStorage to get the most current user data
    const currentUserStr = localStorage.getItem("currentUser")
    const role = currentUserStr ? JSON.parse(currentUserStr).role : userRole
    
    if (!isAuthenticated || role !== "admin") {
      navigate("/admin-login")
    }
  }, [isAuthenticated, userRole, navigate])

  // Fetch movies on mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const fetchedMovies = await moviesAPI.getAll()
        setMovies(fetchedMovies || [])
      } catch (err) {
        console.error("Failed to fetch movies:", err)
      }
    }

    if (isAuthenticated && userRole === "admin") {
      fetchMovies()
    }
  }, [isAuthenticated, userRole])

  if (!isAuthenticated || userRole !== "admin") {
    const currentUserStr = localStorage.getItem("currentUser")
    const role = currentUserStr ? JSON.parse(currentUserStr).role : userRole
    if (role !== "admin") {
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const newMovie = {
        title: formData.title,
        genre: formData.genre,
        rating: Number.parseFloat(formData.rating),
        year: formData.year,
        description: formData.description,
        image: "/placeholder.svg"
      }

      const createdMovie = await moviesAPI.create(newMovie)
      setMovies([...movies, createdMovie])
      setFormData({ title: "", genre: "", rating: "", year: new Date().getFullYear(), description: "" })
    } catch (err) {
      setError(err.message || "Failed to upload movie")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await moviesAPI.delete(id)
      setMovies(movies.filter((m) => m._id !== id))
    } catch (err) {
      setError(err.message || "Failed to delete movie")
      console.error(err)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation isAuthenticated={isAuthenticated} />

      <div className="pt-24 px-4 max-w-6xl mx-auto pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-foreground">Admin Dashboard</h1>
            <p className="text-foreground/60 mt-1">Manage uploads and view the library</p>
          </div>
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 text-white text-sm font-semibold">Admin</span>
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-sm">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-secondary rounded-2xl p-6 shadow border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2"><Upload size={20} /> Upload New Movie</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Movie Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-background text-foreground rounded-lg border border-border focus:border-primary outline-none"
                />
                <input
                  type="text"
                  name="genre"
                  placeholder="Genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-background text-foreground rounded-lg border border-border focus:border-primary outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="rating"
                    placeholder="Rating"
                    value={formData.rating}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    step="0.1"
                    required
                    className="w-full px-4 py-2 bg-background text-foreground rounded-lg border border-border focus:border-primary outline-none"
                  />
                  <input
                    type="number"
                    name="year"
                    placeholder="Year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-background text-foreground rounded-lg border border-border focus:border-primary outline-none"
                  />
                </div>
                <textarea
                  name="description"
                  placeholder="Short description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 bg-background text-foreground rounded-lg border border-border focus:border-primary outline-none resize-none"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white font-semibold rounded-xl shadow hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Uploading..." : "Upload Movie"}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-secondary rounded-2xl p-6 shadow border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">Uploaded Movies</h2>

              {movies.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {movies.map((movie) => (
                    <div key={movie._id} className="bg-background/10 rounded-lg overflow-hidden relative">
                      <button
                        onClick={() => handleDelete(movie._id)}
                        className="absolute top-3 right-3 p-2 bg-red-600/90 text-white rounded-lg z-10 hover:scale-105 transition"
                      >
                        <X size={16} />
                      </button>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{movie.title}</h3>
                        <p className="text-foreground/70 text-sm mb-3">{movie.description}</p>
                        <div className="flex items-center justify-between text-sm text-foreground/60">
                          <span className="px-2 py-1 bg-background/20 rounded">{movie.genre}</span>
                          <div className="flex items-center gap-4">
                            <span>⭐ {movie.rating}</span>
                            <span>{movie.year}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-foreground/70">No movies uploaded yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
