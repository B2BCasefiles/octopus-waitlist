"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "How is this different from Opus Clip?",
    answer: "We support custom fonts, LUTs, fine-grain animation, and a creator-first UX—for a one-time founder price.",
  },
  {
    question: "Do I need editing experience?",
    answer: "No. Choose style, preview, export. That's it.",
  },
  {
    question: "Can I use my brand font?",
    answer: "Yes. Upload TTF/OTF and save as a reusable brand kit.",
  },
  {
    question: "What about color grading?",
    answer: "Upload .cube LUTs or use our cinematic presets with realtime preview.",
  },
  {
    question: "Is the $10 a subscription?",
    answer: "No. It's a one-time founder price with 1,500 credits and lifetime 20% off future packs.",
  },
  {
    question: "Will the price increase?",
    answer: "Yes—founder pricing is limited. Early supporters are locked for life.",
  },
  {
    question: "Refunds?",
    answer: "7-day no-questions-asked refund on founder access.",
  },
  {
    question: "Do you support teams?",
    answer: "Team workspaces and API are in the next milestone. Founder users get early access.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-foreground mb-4 text-balance">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="glass rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-card/20 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium text-foreground">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
