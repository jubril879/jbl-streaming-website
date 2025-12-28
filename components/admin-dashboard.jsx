"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { moviesAPI } from "@/src/lib/api.js"


export default function AdminDashboard() {
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [title, setTitle] = useState("")
  const [genre, setGenre] = useState("")
  const [rating, setRating] = useState("")
  const [year, setYear] = useState(new Date().getFullYear())
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")

  // Load movies from API on mount
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const apiMovies = await moviesAPI.getAll()
        setMovies(apiMovies)
      } catch (err) {
        console.error("Failed to load movies:", err)
        setMovies([])
      }
    }

    loadMovies()

    // Check if user is authenticated as admin
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null")
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/admin-login")
    }
  }, [navigate])

  // Update movies state
  const updateMovies = (updatedMovies) => {
    setMovies(updatedMovies)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (!title.trim() || !genre || !rating || !description.trim() || !imageUrl.trim() || !videoUrl.trim()) {
      alert("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      const movieData = {
        title: title.trim(),
        genre,
        rating: parseFloat(rating),
        year: parseInt(year),
        description: description.trim(),
        poster: imageUrl.trim(),
        videoUrl: videoUrl.trim(),
      }

      const result = await moviesAPI.create(movieData)

      if (result.message === "Movie created successfully") {
        setMovies([...movies, result.movie])
        setTitle("")
        setGenre("")
        setRating("")
        setYear(new Date().getFullYear())
        setDescription("")
        setImageUrl("")
        setVideoUrl("")
        setSuccess("✅ Movie added successfully!")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        alert("Failed to add movie: " + (result.message || "Unknown error"))
      }
    } catch (error) {
      console.error("Error adding movie:", error)
      alert("Failed to add movie. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        const result = await moviesAPI.delete(id)
        if (result.message === "Movie deleted successfully") {
          const updatedMovies = movies.filter((m) => m._id !== id)
          setMovies(updatedMovies)
          setSuccess("✅ Movie deleted successfully!")
          setTimeout(() => setSuccess(""), 3000)
        } else {
          alert("Failed to delete movie: " + (result.message || "Unknown error"))
        }
      } catch (error) {
        console.error("Error deleting movie:", error)
        alert("Failed to delete movie. Please try again.")
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("authToken")
    navigate("/admin-login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {success && (
          <div className="bg-green-900 border border-green-700 rounded-lg p-4 mb-8 text-green-200">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Movie Form */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6">Add New Movie</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Movie Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    placeholder="Enter movie title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Genre</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    required
                  >
                    <option value="">Select genre</option>
                    <option value="Action">Action</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Animation">Animation</option>
                    <option value="Biography">Biography</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Crime">Crime</option>
                    <option value="Documentary">Documentary</option>
                       <option value="Kdrama">Kdrama</option>
                    <option value="Drama">Drama</option>
                    <option value="Family">Family</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Historical">Historical</option>
                    <option value="Horror">Horror</option>
                    <option value="Kids">Kids</option>
                    <option value="Musical">Musical</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Romance">Romance</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Sport">Sport</option>
                    <option value="Thriller">Thriller</option>
                    <option value="War">War</option>
                    <option value="Western">Western</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Rating (0-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    placeholder="7.5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 resize-none"
                    rows="4"
                    placeholder="Enter movie description"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    placeholder="Enter image URL"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Video URL</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    placeholder="Enter video URL"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  <Upload size={16} />
                  {isLoading ? "Adding..." : "Add Movie"}
                </Button>
              </form>
            </div>
          </div>

          {/* Movies List */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700 bg-gray-700">
                <h2 className="text-xl font-semibold text-white">
                  Movies ({movies.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-700">
                {movies.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-400">
                    <p>No movies added yet. Add one to get started!</p>
                  </div>
                ) : (
                  movies.map((movie) => (
                    <div
                      key={movie._id}
                      className="px-6 py-4 flex items-start justify-between hover:bg-gray-700/50 transition"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg">{movie.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {movie.genre} • ⭐ {movie.rating} • {movie.year}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">{movie.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Added: {new Date(movie.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(movie._id)}
                        className="p-2 hover:bg-red-600/20 rounded-lg transition ml-4"
                      >
                        <X size={20} className="text-red-500" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

