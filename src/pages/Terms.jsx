import Navigation from "../components/Navigation"
import Footer from "../components/Footer"

export default function Terms() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-8 px-4 max-w-4xl mx-auto pb-16">
        <h1 className="text-3xl font-extrabold text-foreground mb-4">Terms of Service</h1>
        <p className="text-foreground/70 leading-relaxed text-lg">These demo Terms are placeholders. In production you'd include terms covering accounts, payment, content ownership, liability, and more.</p>
      </div>
      <Footer />
    </main>
  )
}
