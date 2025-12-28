import Navigation from "../components/Navigation"
import Footer from "../components/Footer"

export default function Privacy() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-8 px-4 max-w-4xl mx-auto pb-16">
        <h1 className="text-3xl font-extrabold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-foreground/70 leading-relaxed text-lg">This site is a demo — personal data handling is minimal and stored locally in your browser. For production, you'd include a full privacy policy explaining storage, cookies and third-party services.</p>
      </div>
      <Footer />
    </main>
  )
}
