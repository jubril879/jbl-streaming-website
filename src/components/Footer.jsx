export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2 text-foreground/70 text-sm">
              <li>
                <a href="#" className="hover:text-foreground transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Press
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2 text-foreground/70 text-sm">
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-foreground/70 text-sm">
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Follow</h3>
            <ul className="space-y-2 text-foreground/70 text-sm">
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8">
          <p className="text-center text-foreground/60 text-sm">&copy; 2025 CinemaHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
