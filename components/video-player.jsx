"use client"

import { useState, useRef } from "react"
import { Play, Pause, Volume2, Maximize } from "lucide-react"

export default function VideoPlayer({ movieTitle, movieId }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef(null)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play()
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100)

      // Save watch history
      const history = JSON.parse(localStorage.getItem("watchHistory") || "[]")
      const existingIndex = history.findIndex((h) => h.id === movieId)
      if (existingIndex > -1) {
        history.splice(existingIndex, 1)
      }
      history.unshift({
        id: movieId,
        title: movieTitle,
        timestamp: new Date().toISOString(),
        progress: videoRef.current.currentTime,
      })
      localStorage.setItem("watchHistory", JSON.stringify(history.slice(0, 20)))
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden group">
      <video
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        className="w-full"
        src="https://www.w3schools.com/html/mov_bbb.mp4"
      />

      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center">
        <button
          onClick={togglePlay}
          className="w-16 h-16 bg-primary/90 hover:bg-primary rounded-full flex items-center justify-center transition"
        >
          {isPlaying ? <Pause size={32} className="text-white" /> : <Play size={32} className="text-white" />}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="mb-4">
          <div className="w-full bg-secondary h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="hover:opacity-80">
              {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
            </button>
            <Volume2 size={20} className="text-white cursor-pointer hover:opacity-80" />
          </div>
          <button className="hover:opacity-80">
            <Maximize size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
