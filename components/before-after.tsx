"use client"

import { useState } from "react"

const reelData = [
  {
    creator: "Alex P., podcaster",
    metric: "+212% watch-through rate",
    before: "/generic-video-caption.jpg",
    after: "/branded-video-caption.jpg",
  },
  {
    creator: "Mae S., editor",
    metric: "+156% engagement",
    before: "/plain-video.jpg",
    after: "/cinematic-graded-video.jpg",
  },
  {
    creator: "Jordan K., creator",
    metric: "+89% completion rate",
    before: "/basic-animation.jpg",
    after: "/professional-animation.jpg",
  },
  {
    creator: "Sam R., influencer",
    metric: "+234% shares",
    before: "/standard-format.jpg",
    after: "/multi-platform-optimized.jpg",
  },
  {
    creator: "Taylor M., brand",
    metric: "+178% brand recall",
    before: "/generic-branding.jpg",
    after: "/custom-brand-identity.jpg",
  },
  {
    creator: "Casey L., startup",
    metric: "+145% conversions",
    before: "/amateur-video.jpg",
    after: "/placeholder.svg?height=200&width=300",
  },
]

export function BeforeAfter() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-24 bg-card/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-foreground mb-4 text-balance">
            See the difference
          </h2>
          <p className="text-xl text-muted-foreground text-pretty">Real results from real creators</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reelData.map((reel, index) => (
            <div
              key={index}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                <img
                  src={hoveredIndex === index ? reel.after : reel.before}
                  alt={`${reel.creator} result`}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="glass rounded-lg p-3">
                    <p className="text-sm font-medium text-foreground">{reel.creator}</p>
                    <p className="text-xs text-brand-gold">{reel.metric}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
