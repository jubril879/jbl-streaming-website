import Navigation from "../components/Navigation"
import Footer from "../components/Footer"

export default function SocialInstagram() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-8 px-4 max-w-4xl mx-auto pb-16">
        <h1 className="text-3xl font-extrabold text-foreground mb-4">Follow us on Instagram</h1>
        <p className="text-foreground/70 leading-relaxed text-lg">This page would link to our Instagram profile in production — for now it explains how we share visuals and updates.</p>
      </div>
      <Footer />
    </main>
  )
}
