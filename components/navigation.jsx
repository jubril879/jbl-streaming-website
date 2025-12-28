"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navigation({ isAuthenticated, onAuthClick }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-lg border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CH</span>
            </div>
            <span className="hidden sm:inline text-xl font-bold text-foreground">CinemaHub</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/browse" className="text-sm text-foreground/70 hover:text-foreground transition">
              Browse
            </Link>
            <Link href="/trending" className="text-sm text-foreground/70 hover:text-foreground transition">
              Trending
            </Link>
            <Link href="/my-list" className="text-sm text-foreground/70 hover:text-foreground transition">
              My List
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 hover:bg-secondary rounded-lg transition">
              <Search size={20} className="text-foreground" />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <User size={16} />
                    Profile
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => onAuthClick("login")}>
                  Sign In
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => onAuthClick("signup")}>
                  Subscribe
                </Button>
              </div>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} className="text-foreground" /> : <Menu size={24} className="text-foreground" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/browse" className="block px-4 py-2 text-foreground/70 hover:text-foreground">
              Browse
            </Link>
            <Link href="/trending" className="block px-4 py-2 text-foreground/70 hover:text-foreground">
              Trending
            </Link>
            <Link href="/my-list" className="block px-4 py-2 text-foreground/70 hover:text-foreground">
              My List
            </Link>
            <div className="flex gap-2 px-4 pt-2">
              <Button variant="outline" size="sm" onClick={() => onAuthClick("login")} className="flex-1">
                Sign In
              </Button>
              <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90" onClick={() => onAuthClick("signup")}>
                Subscribe
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
