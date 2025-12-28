"use client"

import { useState, useEffect } from "react"
import { Star, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { moviesAPI } from "../lib/api"

const DEFAULT_MOVIES = [
  { _id: 1, title: "Cosmic Adventure", rating: 8.5, year: 2024, genre: "Sci-Fi", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
  { _id: 2, title: "Silent Echo", rating: 7.8, year: 2024, genre: "Drama", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
  { _id: 3, title: "Rising Storm", rating: 8.2, year: 2024, genre: "Action", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
  { _id: 4, title: "Digital Dreams", rating: 7.9, year: 2024, genre: "Thriller", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
  { _id: 5, title: "Neon Lights", rating: 8.4, year: 2024, genre: "Sci-Fi", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
  { _id: 6, title: "Lost Horizon", rating: 8.1, year: 2024, genre: "Adventure", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
]

export default function MovieCarousel({ title, isAuthenticated, onWatchClick }) {
  const [hoveredId, setHoveredId] = useState(null)
  const [movies, setMovies] = useState(DEFAULT_MOVIES)
  const [loading, setLoading] = useState(true)

  // Fetch movies from backend
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const fetchedMovies = await moviesAPI.getAll()
        if (fetchedMovies && fetchedMovies.length > 0) {
          setMovies(fetchedMovies)
        } else {
          setMovies(DEFAULT_MOVIES)
        }
      } catch (err) {
        console.error("Failed to fetch movies:", err)
        setMovies(DEFAULT_MOVIES)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  return (
    <section className="relative py-8 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground mb-6">{title}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <div
              key={movie._id}
              className="group relative cursor-pointer"
              onMouseEnter={() => setHoveredId(movie._id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative w-full aspect-[2/3] bg-secondary rounded-lg overflow-hidden">
                <img
                  src={movie.image || `https://via.placeholder.com/200x300?text=${encodeURIComponent(movie.title)}`}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {hoveredId === movie._id && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold mb-2">{movie.title}</h3>
                    <div className="flex items-center gap-2 mb-3 text-sm text-foreground/80">
                      <Star size={16} className="text-primary fill-primary" />
                      <span>{movie.rating}</span>
                      <span>{movie.year}</span>
                      <span>{movie.genre}</span>
                    </div>
                    <Button
                      size="sm"
                      className="gap-2 bg-primary hover:bg-primary/90"
                      onClick={() => (isAuthenticated ? null : onWatchClick())}
                    >
                      <Play size={16} />
                      Watch
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
