import Navigation from "../components/Navigation"
import Footer from "../components/Footer"

export default function Contact() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-8 px-4 max-w-4xl mx-auto pb-16">
        <h1 className="text-3xl font-extrabold text-foreground mb-4">Contact Us</h1>
        <p className="text-foreground/70 leading-relaxed text-lg mb-6">Have questions? We'd love to hear from you — send a message to hello@cinemahub.example .</p>

        <div className="bg-secondary/60 rounded-lg p-6 border border-border">
          <label className="block text-sm text-foreground/70 mb-2">Message</label>
          <textarea rows={6} className="w-full p-3 rounded border border-border bg-background/5 text-foreground" placeholder="Write your message..." />

          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 rounded bg-primary text-white">Send</button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
