import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import { TrendingUp, Flame, Star, Play } from "lucide-react"
import { moviesAPI } from "../lib/api"

export default function Trending({ isAuthenticated, onLogin, userRole }) {
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const fetchedMovies = await moviesAPI.getAll()
        // Trending logic: sort by rating and filter top rated
        const trendingMovies = (fetchedMovies || [])
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 12)
        
        setMovies(trendingMovies)
      } catch (err) {
        setError("Failed to fetch trending movies")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation isAuthenticated={isAuthenticated} userRole={userRole} />
        <div className="pt-24 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-foreground/60">Loading trending movies...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation isAuthenticated={isAuthenticated} userRole={userRole} />

      {/* Featured Trending Hero */}
      {movies.length > 0 && (
        <div className="relative h-[60vh] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <img 
            src={movies[0].poster || movies[0].image} 
            alt={movies[0].title}
            className="absolute inset-0 w-full h-full object-cover opacity-50 scale-110 blur-sm"
          />
          <div className="relative z-20 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="text-primary animate-pulse" fill="currentColor" size={24} />
              <span className="text-primary font-bold tracking-widest uppercase text-sm">#1 Trending Movie</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 max-w-3xl leading-none">
              {movies[0].title}
            </h1>
            <div className="flex items-center gap-4 mb-8">
              <span className="px-3 py-1 bg-white/10 rounded-full text-white font-bold flex items-center gap-2">
                <Star size={16} className="text-yellow-500" fill="currentColor" />
                {movies[0].rating.toFixed(1)}
              </span>
              <span className="text-white/60 font-medium">{movies[0].genre} • {movies[0].year}</span>
            </div>
            <button 
              onClick={() => navigate(`/watch/${movies[0]._id}`)}
              className="w-fit px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl transition-all hover:scale-105 flex items-center gap-3"
            >
              <Play size={20} fill="currentColor" />
              Watch Now
            </button>
          </div>
        </div>
      )}

      <div className="px-4 max-w-7xl mx-auto pb-16 pt-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-white mb-2">Top Trending Library</h2>
            <div className="h-1.5 w-24 bg-primary rounded-full" />
          </div>
        </div>

        {movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie, index) => (
              <div 
                key={movie._id} 
                className="group relative bg-secondary/30 rounded-2xl overflow-hidden border border-border/50 hover:border-primary transition-all duration-300 hover:-translate-y-2 cursor-pointer shadow-xl"
                onClick={() => navigate(`/watch/${movie._id}`)}
              >
                <div className="relative aspect-[2/3]">
                  <img 
                    src={movie.poster || movie.image || "https://via.placeholder.com/300x450?text=Trending"} 
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 w-10 h-10 bg-primary/90 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {index + 1}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{movie.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded text-xs font-bold border border-yellow-500/20">
                      <Star size={12} fill="currentColor" />
                      {movie.rating.toFixed(1)}
                    </div>
                    <span className="text-xs text-foreground/50">{movie.genre}</span>
                  </div>
                  <button className="w-full mt-4 py-2.5 bg-white/5 hover:bg-primary hover:text-white text-foreground font-semibold rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2">
                    <Play size={16} fill="currentColor" />
                    Watch Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-secondary/20 rounded-3xl border border-dashed border-border">
            <TrendingUp size={48} className="mx-auto text-foreground/20 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No trending movies yet</h3>
            <p className="text-foreground/60">Check back later for the latest hits!</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
