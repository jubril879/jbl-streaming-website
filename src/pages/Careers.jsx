import Navigation from "../components/Navigation"
import Footer from "../components/Footer"

export default function Careers() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-8 px-4 max-w-4xl mx-auto pb-16">
        <h1 className="text-3xl font-extrabold text-foreground mb-4">Careers</h1>
        <p className="text-foreground/70 leading-relaxed text-lg">
          We're always looking for talented people to join the team. This demo repo doesn't actually accept
          applications, but in a full app we'd list openings and application instructions here.
        </p>
      </div>
      <Footer />
    </main>
  )
}
