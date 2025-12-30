import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navigation from "../components/Navigation"
import VideoPlayer from "../components/VideoPlayer"
import Footer from "../components/Footer"
import { ArrowLeft, Star, Calendar, Clock, Film } from "lucide-react"
import { userAPI, moviesAPI } from "../lib/api"

export default function Watch({ isAuthenticated, currentUser, userRole }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true)
        const data = await moviesAPI.getById(id)
        if (data && !data.message) {
          setMovie(data)
        } else {
          setError(data.message || "Movie not found")
        }
      } catch (err) {
        setError("Failed to fetch movie details")
        console.error(err)
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
          await userAPI.addToWatchHistory(id, movie.title, movie.poster)
        } catch (error) {
          console.error("Failed to add to watch history:", error)
        }
      }

      addToHistory()
    }
  }, [id, isAuthenticated, currentUser, movie])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation isAuthenticated={isAuthenticated} userRole={userRole} />

      <div className="pt-24 px-4 max-w-7xl mx-auto pb-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-foreground/60 hover:text-primary transition mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Browse</span>
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-foreground/60">Loading movie details...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-secondary/30 rounded-3xl border border-border">
            <div className="text-red-500 mb-4 text-5xl">⚠️</div>
            <h2 className="text-2xl font-bold mb-2">Oops!</h2>
            <p className="text-foreground/60 mb-8">{error}</p>
            <button 
              onClick={() => navigate('/browse')}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              Back to Browse
            </button>
          </div>
        ) : movie ? (
          <div className="space-y-8">
            {/* Video Player Section */}
            <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-border">
              <VideoPlayer 
                videoUrl={movie.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"} 
                title={movie.title}
              />
            </div>

            {/* Movie Info Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">{movie.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/20 font-bold">
                      <Star size={16} fill="currentColor" />
                      {(movie.rating || 0).toFixed(1)}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20 font-bold">
                      <Film size={16} />
                      {movie.genre}
                    </div>
                    <div className="flex items-center gap-1.5 text-foreground/60">
                      <Calendar size={16} />
                      {movie.year}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-secondary/30 rounded-2xl border border-border/50">
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Description</h3>
                  <p className="text-foreground/70 leading-relaxed text-lg">
                    {movie.description || "No description available for this movie."}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <div className="rounded-2xl overflow-hidden border border-border shadow-lg aspect-[2/3]">
                    <img 
                      src={movie.poster || movie.image || `https://via.placeholder.com/400x600?text=${encodeURIComponent(movie.title)}`} 
                      alt={movie.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/400x600?text=${encodeURIComponent(movie.title)}`
                      }}
                    />
                  </div>
                  
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <p className="text-xs text-center text-foreground/50 uppercase tracking-widest font-bold">Now Playing on CinemaHub</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-foreground/70 text-xl">Movie not found</p>
            <button 
              onClick={() => navigate('/browse')}
              className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              Back to Browse
            </button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
