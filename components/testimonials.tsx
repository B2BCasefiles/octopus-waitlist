export function Testimonials() {
  const testimonials = [
    {
      quote: "Finally, captions that look like my brand. Took me 3 minutes.",
      author: "Alex P., podcaster",
    },
    {
      quote: "Our Shorts went from ignored to addictive.",
      author: "Mae S., editor",
    },
  ]

  const metrics = [
    { value: "2,847+", label: "clips generated in beta" },
    { value: "312%", label: "average engagement increase" },
    { value: "47", label: "countries" },
    { value: "98.5%", label: "satisfaction" },
  ]

  return (
    <section className="py-24 bg-card/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="glass rounded-lg p-8">
              <blockquote className="text-lg text-foreground mb-4">"{testimonial.quote}"</blockquote>
              <cite className="text-brand-gold font-medium">— {testimonial.author}</cite>
            </div>
          ))}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-display font-bold text-brand-gold mb-2">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
