import { useState, useEffect } from "react"
import { Play, Info } from "lucide-react"
import { moviesAPI } from "../lib/api"
import { useNavigate } from "react-router-dom"

export default function HeroSection({ onGetStarted, isAuthenticated }) {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchHeroMovie = async () => {
      try {
        const movies = await moviesAPI.getAll()
        if (movies && movies.length > 0) {
          // Try to find a featured movie, otherwise take the first one
          const featured = movies.find(m => m.isFeatured) || movies[0]
          setMovie(featured)
        } else {
          setMovie({
            title: "CinemaHub",
            description: "Stream your favorite movies and TV shows in stunning quality",
            poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"
          })
        }
      } catch (err) {
        setMovie({
          title: "CinemaHub",
          description: "Stream your favorite movies and TV shows in stunning quality",
          poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchHeroMovie()
  }, [])

  if (loading) {
    return (
      <div className="relative w-full h-screen bg-background pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleActionClick = () => {
    if (!isAuthenticated) {
      onGetStarted()
    } else if (movie?._id) {
      navigate(`/watch/${movie._id}`)
    }
  }

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />

      <img
        src={movie?.poster || movie?.image || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"}
        alt={movie?.title || "Featured Movie"}
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-60 scale-105 animate-pulse-slow"
        onError={(e) => {
          e.target.src = "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"
        }}
      />

      <div className="relative z-20 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-start">
        <div className="animate-fade-in-up">
          {movie?.genre && (
            <span className="inline-block px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-bold mb-6 tracking-wider uppercase">
              {movie.genre}
            </span>
          )}
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 max-w-3xl leading-none tracking-tight drop-shadow-2xl">
            {movie?.title || "Discover Your Next Favorite"}
          </h1>

          <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl leading-relaxed drop-shadow">
            {movie?.description || movie?.Plot || "Stream thousands of movies and shows. Watch anything, anytime, anywhere."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleActionClick}
              className="flex items-center justify-center gap-3 px-10 py-4 bg-primary hover:bg-primary/90 text-white font-bold text-xl rounded-xl transition-all hover:scale-105 shadow-xl shadow-primary/20"
            >
              <Play size={24} fill="currentColor" />
              {isAuthenticated ? "Start Watching" : "Get Started"}
            </button>

            <button 
              onClick={() => navigate('/browse')}
              className="flex items-center justify-center gap-3 px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xl rounded-xl backdrop-blur-md border border-white/20 transition-all hover:scale-105"
            >
              <Info size={24} />
              Browse More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
