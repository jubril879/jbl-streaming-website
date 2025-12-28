import { useState, useEffect } from "react"
import { Play, Info } from "lucide-react"

export default function HeroSection({ onGetStarted, isAuthenticated }) {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://www.omdbapi.com/?s=movie&apikey=ddcc93bd")
        const data = await response.json()
        if (data.Response === "True" && data.Search.length > 0) {
          setMovie(data.Search[0]) // Use the first movie for hero
        } else {
          // Use fallback movie data if API fails
          setMovie({
            Title: "CinemaHub",
            Plot: "Stream your favorite movies and TV shows in stunning quality"
          })
        }
      } catch (err) {
        // Use fallback movie data on error
        setMovie({
          Title: "CinemaHub",
          Plot: "Stream your favorite movies and TV shows in stunning quality"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  if (loading) {
    return (
      <div className="relative w-full h-screen bg-gradient-to-b from-background via-background/80 to-background pt-20 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!movie) {
    return null
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-background via-background/80 to-background pt-20">
      <div className="absolute inset-0 bg-black/40 z-10" />

      <img
        src={movie?.Poster || "/placeholder.svg"}
        alt={movie?.Title || "Featured Movie"}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="relative z-20 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-start">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 max-w-2xl leading-tight">
          {movie?.Title || "Discover Your Next Favorite"}
        </h1>

        <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-xl">
          {movie?.Plot || "Stream thousands of movies and shows. Watch anything, anytime, anywhere."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          {!isAuthenticated ? (
            <button
              onClick={onGetStarted}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-lg transition"
            >
              <Play size={24} fill="currentColor" />
              Get Started
            </button>
          ) : (
            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-lg transition">
              <Play size={24} fill="currentColor" />
              Start Watching
            </button>
          )}

          <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold text-lg rounded-lg transition">
            <Info size={24} />
            More Info
          </button>
        </div>
      </div>
    </div>
  )
}
