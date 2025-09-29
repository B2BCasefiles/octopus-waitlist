import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { VideoShowcase } from "@/components/video-showcase"
import { ComparisonTable } from "@/components/comparison-table"
// import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover z-0"
          loading="lazy"
        >
          <source 
            src="https://vuobclcngoqsjkownwzb.supabase.co/storage/v1/object/public/Showcase%20Videos/PROMO_1.mp4" 
            type="video/mp4" 
          />
        </video>
        
        {/* Video-friendly gradient with darker top and purple accent at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/40 to-purple-900/80 z-10"></div>
        
        {/* Hero content on top of video */}
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Hero />
        </div>
      </section>
      <VideoShowcase />
      <ComparisonTable />
      {/* <Footer /> */}
    </main>
  )
}
