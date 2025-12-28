import Navigation from "../components/Navigation"
import Footer from "../components/Footer"

export default function Cookies() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-8 px-4 max-w-4xl mx-auto pb-16">
        <h1 className="text-3xl font-extrabold text-foreground mb-4">Cookie Policy</h1>
        <p className="text-foreground/70 leading-relaxed text-lg">This demo uses minimal local storage; in production you'd disclose cookie usage, analytics, and how to opt out.</p>
      </div>
      <Footer />
    </main>
  )
}
