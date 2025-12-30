import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2 text-foreground/70 text-sm">
              <li>
                <Link to="/about" className="hover:text-foreground transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-foreground transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press" className="hover:text-foreground transition">
                  Press
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2 text-foreground/70 text-sm">
              <li>
                <Link to="/help-center" className="hover:text-foreground transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-foreground transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-foreground/70 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-foreground transition">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-foreground transition">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-foreground transition">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Follow</h3>
            <ul className="space-y-2 text-foreground/70 text-sm">
              <li>
                <Link to="/social-twitter" className="hover:text-foreground transition">
                  Twitter
                </Link>
              </li>
              <li>
                <Link to="/social-instagram" className="hover:text-foreground transition">
                  Instagram
                </Link>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">
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
