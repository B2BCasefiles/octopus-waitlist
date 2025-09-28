"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    title: "Your Brand Voice, Visually",
    description:
      "Upload any font file (TTF/OTF) — no preset limitations. Watch your brand personality come alive with typography that matches your voice.",
    stat: "500+ fonts uploaded",
    demo: "/custom-typography-animation.jpg",
  },
  {
    title: "Hollywood Cinema Meets TikTok Viral",
    description:
      "Professional LUT support for cinematic color grading. Turn ordinary clips into scroll-stopping visuals.",
    stat: "3× higher engagement",
    demo: "/before-after-color-grading.jpg",
  },
  {
    title: "Precision Animation, Zero Effort",
    description: "Word-by-word timing and placement so every line lands with impact.",
    stat: "95% completion rate on animated clips",
    demo: "/frame-perfect-text-animation.jpg",
  },
  {
    title: "One Upload, Every Platform",
    description: "Export-ready for TikTok, Instagram, YouTube Shorts—perfect aspect ratios, instantly.",
    stat: "12+ formats supported",
    demo: "/multi-platform-video-formats.jpg",
  },
]

export function Features() {
  const [activeFeature, setActiveFeature] = useState(0)

  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-foreground mb-4 text-balance">
            While others give you presets, we give you control
          </h2>
          <p className="text-xl text-muted-foreground text-pretty">Enterprise features, startup accessibility</p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glass hover:shadow-glow transition-all duration-300 cursor-pointer group"
              onMouseEnter={() => setActiveFeature(index)}
            >
              <CardContent className="p-8">
                {/* Demo Image */}
                <div className="aspect-[4/3] mb-6 rounded-lg overflow-hidden bg-card">
                  <img
                    src={feature.demo || "/placeholder.svg"}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-4 text-pretty">{feature.description}</p>
                <div className="text-sm text-brand-gold font-medium">{feature.stat}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
