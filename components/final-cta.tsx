import { Button } from "@/components/ui/button"

export function FinalCTA() {
  return (
    <section className="py-24 gradient-aurora relative overflow-hidden grain">
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-foreground mb-4 text-balance">
          Premium results, indie budget.
        </h2>
        <p className="text-xl text-muted-foreground mb-8 text-pretty">
          Professional customization without professional prices.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-brand-gold hover:bg-brand-gold/90 text-background font-semibold text-lg px-8 py-3 animate-pulse-glow">
            Get Founder Access – $10
          </Button>
          <Button
            variant="outline"
            className="border-foreground text-foreground hover:bg-foreground hover:text-background text-lg px-8 py-3 bg-transparent"
          >
            Join Free Waitlist
          </Button>
        </div>
      </div>
    </section>
  )
}
