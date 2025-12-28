import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navigation from "../components/Navigation"
import VideoPlayer from "../components/VideoPlayer"
import Footer from "../components/Footer"
import { ArrowLeft } from "lucide-react"
import { userAPI } from "../lib/api"

export default function Watch({ isAuthenticated, currentUser }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=ddcc93bd`)
        const data = await response.json()
        if (data.Response === "True") {
          setMovie(data)
        } else {
          setError(data.Error)
        }
      } catch (err) {
        setError("Failed to fetch movie details")
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [id])

  useEffect(() => {
    if (isAuthenticated && currentUser && movie) {
      const addToHistory = async () => {
        try {
          await userAPI.addToWatchHistory(id, movie.Title, movie.Poster)
        } catch (error) {
          console.error("Failed to add to watch history:", error)
        }
      }

      addToHistory()
    }
  }, [id, isAuthenticated, currentUser, movie])

  return (
    <main className="min-h-screen bg-background">
      <Navigation isAuthenticated={isAuthenticated} />

      <div className="pt-20 px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-foreground/70 hover:text-foreground mb-4"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-foreground/70">Loading movie details...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-foreground/70">Error: {error}</p>
          </div>
        ) : movie ? (
          <div className="max-w-6xl mx-auto">
            <div className="mt-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">{movie.Title}</h1>
              <div className="flex items-center gap-4 text-foreground/70 mb-6">
                <span>⭐ {movie.imdbRating}</span>
                <span>{movie.Year}</span>
                <span>{movie.Genre}</span>
                <span>{movie.Runtime}</span>
              </div>
              <p className="text-foreground/80 text-lg">{movie.Plot}</p>
              <img src={movie.Poster} alt={movie.Title} className="w-full h-96 object-cover rounded-lg mt-6" />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/70">Movie not found</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
