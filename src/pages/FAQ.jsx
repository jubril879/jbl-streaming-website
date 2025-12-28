import Navigation from "../components/Navigation"
import Footer from "../components/Footer"

const FAQ_ITEMS = [
  { q: 'How do I sign up?', a: "Use the Sign Up form in the top nav or modal — it's a demo so the account is stored locally." },
  { q: 'Can I upload videos?', a: 'Not in this demo — uploads would require a backend to store files.' },
  { q: 'How do I change my plan?', a: 'Billing and plans are outside the scope of this demo.' },
]

export default function FAQ() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-8 px-4 max-w-4xl mx-auto pb-16">
        <h1 className="text-3xl font-extrabold text-foreground mb-4">Frequently Asked Questions</h1>
        <div className="space-y-4 mt-4">
          {FAQ_ITEMS.map((it, idx) => (
            <div key={idx} className="bg-secondary rounded-md p-4 border border-border">
              <div className="font-semibold text-foreground mb-1">{it.q}</div>
              <div className="text-foreground/70 text-sm">{it.a}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}
