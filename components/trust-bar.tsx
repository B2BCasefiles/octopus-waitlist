export function TrustBar() {
  const logos = ["TikTok", "YouTube", "Instagram", "Twitter", "LinkedIn", "Twitch"]

  return (
    <section className="py-12 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground mb-8">Trusted by creators who care about their brand</p>
        <div className="flex items-center justify-center gap-8 sm:gap-12 opacity-60 hover:opacity-100 transition-opacity duration-500">
          {logos.map((logo) => (
            <div
              key={logo}
              className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
