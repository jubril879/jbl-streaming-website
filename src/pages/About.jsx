import Navigation from "../components/Navigation"
import Footer from "../components/Footer"

export default function About() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-8 px-4 max-w-4xl mx-auto pb-16">
        <h1 className="text-3xl font-extrabold text-foreground mb-4">About CinemaHub</h1>
        <p className="text-foreground/70 text-lg leading-relaxed">
          CinemaHub is a lightweight demo streaming platform — made for showcasing UI and interaction patterns.
          Our mission is to provide a beautiful experience for browsing and enjoying videos.
        </p>
      </div>
      <Footer />
    </main>
  )
}
