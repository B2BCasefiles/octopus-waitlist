import { Check, X } from "lucide-react"

const features = [
  {
    feature: "AI-Powered Clip Generation",
    octopus: true,
    opus: true,
  },
  {
    feature: "Custom Branding",
    octopus: true,
    opus: false,
  },
  {
    feature: "Batch Processing",
    octopus: true,
    opus: true,
  },
  {
    feature: "Advanced Analytics",
    octopus: true,
    opus: false,
  },
  {
    feature: "Multi-Language Support",
    octopus: true,
    opus: false,
  },
  {
    feature: "API Access",
    octopus: true,
    opus: false,
  },
  {
    feature: "White-Label Solution",
    octopus: true,
    opus: false,
  },
  {
    feature: "24/7 Support",
    octopus: true,
    opus: false,
  },
  {
    feature: "Unlimited Exports",
    octopus: true,
    opus: false,
  },
  {
    feature: "Team Collaboration",
    octopus: true,
    opus: true,
  },
]

export function ComparisonTable() {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-purple-900/20 to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose OctopusClips?</h2>
          <p className="text-xl text-white/80">See how we compare to the competition</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
          <div className="grid grid-cols-3 gap-0">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Features</h3>
            </div>
            <div className="p-6 border-b border-l border-white/10 bg-pink-500/10">
              <h3 className="text-lg font-semibold text-white text-center">OctopusClips</h3>
            </div>
            <div className="p-6 border-b border-l border-white/10">
              <h3 className="text-lg font-semibold text-white text-center">Opus Clips</h3>
            </div>

            {/* Feature Rows */}
            {features.map((item, index) => (
              <>
                <div key={`feature-${index}`} className="p-4 border-b border-white/5">
                  <span className="text-white/90">{item.feature}</span>
                </div>
                <div
                  key={`octopus-${index}`}
                  className="p-4 border-b border-l border-white/5 bg-pink-500/5 text-center"
                >
                  {item.octopus ? (
                    <Check className="w-5 h-5 text-green-400 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-red-400 mx-auto" />
                  )}
                </div>
                <div key={`opus-${index}`} className="p-4 border-b border-l border-white/5 text-center">
                  {item.opus ? (
                    <Check className="w-5 h-5 text-green-400 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-red-400 mx-auto" />
                  )}
                </div>
              </>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full transition-colors">
            Start Your Free Trial
          </button>
        </div>
      </div>
    </section>
  )
}
