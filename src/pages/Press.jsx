import Navigation from "../components/Navigation"
import Footer from "../components/Footer"

export default function Press() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-8 px-4 max-w-4xl mx-auto pb-16">
        <h1 className="text-3xl font-extrabold text-foreground mb-4">Press & Media</h1>
        <p className="text-foreground/70 leading-relaxed text-lg">
          Media resources and press information for CinemaHub. This demo contains placeholder content for press assets.
        </p>
      </div>
      <Footer />
    </main>
  )
}
