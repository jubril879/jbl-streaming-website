"use client"

import { Play, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroSection({ onGetStarted }) {
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-background via-background/50 to-background pt-16">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "url(/placeholder.svg?height=1080&width=1920&query=cinematic-movie-hero)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 text-balance">Your Entertainment Hub</h1>
          <p className="text-lg md:text-xl text-foreground/70 mb-8 text-balance">
            Discover thousands of movies and shows. Watch anytime, anywhere.
          </p>

          <div className="flex items-center gap-4">
            <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-white px-8" onClick={onGetStarted}>
              <Play size={20} />
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="gap-2 px-8 bg-transparent">
              <Info size={20} />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
