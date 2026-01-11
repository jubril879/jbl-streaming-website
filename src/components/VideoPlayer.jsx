import { useState, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from "lucide-react"

export default function VideoPlayer({ movieId, title, poster, videoUrl }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const handleMute = () => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen()
    }
  }

  const formatTime = (time) => {
    if (!time) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden group">
      <video
        ref={videoRef}
        src={videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"}
        className="w-full aspect-video object-cover"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        poster={poster}
        autoPlay
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1 bg-foreground/20 rounded-full cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-foreground/70 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handlePlayPause} className="p-2 hover:bg-white/20 rounded-full transition">
              {isPlaying ? (
                <Pause size={24} className="text-white" />
              ) : (
                <Play size={24} className="text-white" fill="currentColor" />
              )}
            </button>

            <div className="flex items-center gap-2">
              <button onClick={handleMute} className="p-2 hover:bg-white/20 rounded-full transition">
                {isMuted ? <VolumeX size={20} className="text-white" /> : <Volume2 size={20} className="text-white" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-foreground/20 rounded-full cursor-pointer accent-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/20 rounded-full transition">
              <Settings size={20} className="text-white" />
            </button>
            <button onClick={handleFullscreen} className="p-2 hover:bg-white/20 rounded-full transition">
              <Maximize size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
