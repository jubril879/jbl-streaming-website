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
    poster: "",
    videoUrl: "",
    isFeatured: false,
  })
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      select option {
        background-color: #1a1a1a;
        color: #ffffff;
      }
      select option:checked {
        background: linear-gradient(#3d3d5c, #3d3d5c);
        background-color: #3d3d5c !important;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  useEffect(() => {
    // Check localStorage to get the most current user data
    const currentUserStr = localStorage.getItem("currentUser")
    const role = currentUserStr ? JSON.parse(currentUserStr).role : userRole
    
    if (!isAuthenticated || role !== "admin") {
      navigate("/admin-login")
    }
  }, [isAuthenticated, userRole, navigate])

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
      const refreshInterval = setInterval(fetchMovies, 5000)
      return () => clearInterval(refreshInterval)
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
    setSuccess("")

    if (!formData.title || !formData.genre || !formData.rating || !formData.description || !formData.poster || !formData.videoUrl) {
      setError("Please fill in all required fields (including Poster and Video URLs)")
      setIsLoading(false)
      return
    }

    try {
      const newMovie = {
        title: formData.title.trim(),
        genre: formData.genre,
        rating: Number.parseFloat(formData.rating),
        year: Number(formData.year),
        description: formData.description.trim(),
        poster: formData.poster || "https://via.placeholder.com/200x300?text=No+Image",
        videoUrl: formData.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        isFeatured: formData.isFeatured
      }

      const createdMovie = await moviesAPI.create(newMovie)
      setMovies([createdMovie, ...movies])
      setFormData({ 
        title: "", 
        genre: "", 
        rating: "", 
        year: new Date().getFullYear(), 
        description: "",
        poster: "",
        videoUrl: "",
        isFeatured: false
      })
      setSuccess("✅ Movie posted successfully! It's now visible on the main website.")
      setTimeout(() => setSuccess(""), 5000)
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
      <Navigation isAuthenticated={isAuthenticated} userRole={userRole} />

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
        {success && <div className="mb-4 p-3 bg-green-500/20 border border-green-500 text-green-300 rounded-lg text-sm">{success}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-secondary rounded-2xl p-6 shadow border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2"><Upload size={20} /> Post New Movie</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Movie Title *"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-background text-foreground rounded-lg border border-border focus:border-primary outline-none"
                />
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-background text-foreground rounded-lg border border-border focus:border-primary outline-none"
                >
                  <option value="">Select Genre *</option>
                  <option value="Action">Action</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Drama">Drama</option>
                  <option value="Horror">Horror</option>
                  <option value="Romance">Romance</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Animation">Animation</option>
                  <option value="Crime">Crime</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="rating"
                    placeholder="Rating (1-10) *"
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
                  placeholder="Short description (max 300 chars) *"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  maxLength="300"
                  required
                  className="w-full px-4 py-2 bg-background text-foreground rounded-lg border border-border focus:border-primary outline-none resize-none"
                />
                <input
                  type="url"
                  name="poster"
                  placeholder="Poster Image URL *"
                  value={formData.poster}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-background text-foreground rounded-lg border border-border focus:border-primary outline-none text-xs"
                />
                <input
                  type="url"
                  name="videoUrl"
                  placeholder="Video URL *"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-background text-foreground rounded-lg border border-border focus:border-primary outline-none text-xs"
                />

                <div className="flex items-center gap-2 px-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-background"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-medium text-foreground cursor-pointer">
                    Feature this movie on homepage
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white font-semibold rounded-xl shadow hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Posting..." : "Post Movie"}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-secondary rounded-2xl p-6 shadow border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">Posted Movies ({movies.length})</h2>

              {movies.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {movies.map((movie) => (
                    <div key={movie._id} className="group bg-background/20 rounded-lg overflow-hidden relative border border-border/50 hover:border-primary transition">
                      <div className="relative aspect-[2/3] bg-gradient-to-br from-background to-background/50 overflow-hidden">
                        <img
                          src={movie.poster || movie.image || `https://via.placeholder.com/200x300?text=${encodeURIComponent(movie.title)}`}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/200x300?text=${encodeURIComponent(movie.title)}`
                          }}
                        />
                        <button
                          onClick={() => handleDelete(movie._id)}
                          className="absolute top-2 right-2 p-2 bg-red-600/90 hover:bg-red-700 text-white rounded-lg z-10 transition"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-semibold text-foreground line-clamp-1">{movie.title}</h3>
                        <p className="text-foreground/70 text-xs mb-2 line-clamp-2">{movie.description}</p>
                        <div className="flex items-center justify-between text-xs text-foreground/60">
                          <span className="px-2 py-0.5 bg-primary/20 text-primary rounded">{movie.genre}</span>
                          <div className="flex items-center gap-2">
                            <span>⭐ {(movie.rating || 0).toFixed(1)}</span>
                            <span>{movie.year}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-foreground/70">
                  <p>No movies posted yet</p>
                  <p className="text-sm mt-2">Movies you post here will appear on the main website</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
