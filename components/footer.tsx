import Link from 'next/link'

export function Footer() {
  return (
    <footer className="py-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-xl font-display font-bold text-foreground mb-4">
              <img 
                src="https://vuobclcngoqsjkownwzb.supabase.co/storage/v1/object/public/Showcase%20Videos/LOGO.png" 
                alt="OctopusClips Logo"
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground">The AI clipper that respects your brand.</p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-foreground transition-colors block">
                  Pricing
                </Link>
              </li>
              <li>
                <a href="#gallery" className="hover:text-foreground transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#roadmap" className="hover:text-foreground transition-colors">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/signin" className="hover:text-foreground transition-colors block">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors block">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="#api" className="hover:text-foreground transition-colors">
                  API Docs
                </a>
              </li>
              <li>
                <a href="#changelog" className="hover:text-foreground transition-colors">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#about" className="hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors block">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors block">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © 2025 OctopusClips. Built with care for creators.
        </div>
      </div>
    </footer>
  )
}
