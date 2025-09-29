import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { VideoShowcase } from "@/components/video-showcase"
import { ComparisonTable } from "@/components/comparison-table"
// import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      {/* Mobile: Video background with hero content overlay positioned lower */}
      <div className="md:hidden relative w-full h-screen overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ 
            objectFit: 'cover',
            height: '100vh',
            maxHeight: '100vh',
            width: '100vw',
            minWidth: '100vw',
            top: 0,
            left: 0
          }}
          loading="lazy"
        >
          <source 
            src="https://vuobclcngoqsjkownwzb.supabase.co/storage/v1/object/public/Showcase%20Videos/PROMO_1.mp4" 
            type="video/mp4" 
          />
        </video>
        
        {/* Video-friendly gradient with darker top and purple accent at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/40 to-purple-900/80 z-10"></div>
        
        {/* Hero content overlay positioned lower with 24px from bottom */}
        <div className="absolute z-20 w-full bottom-[24px] flex justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Hero />
          </div>
        </div>
      </div>
      
      {/* Desktop: Combined layout with video as background */}
      <section className="hidden md:relative md:h-screen md:w-full md:flex md:items-center md:justify-center md:overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover z-0 sm:object-cover"
          style={{ 
            objectFit: 'cover',
            height: '100vh',
            maxHeight: '100vh',
            width: '100vw',
            minWidth: '100vw',
            top: 0,
            left: 0
          }}
          loading="lazy"
        >
          <source 
            src="https://vuobclcngoqsjkownwzb.supabase.co/storage/v1/object/public/Showcase%20Videos/PROMO_1.mp4" 
            type="video/mp4" 
          />
        </video>
        
        {/* Video-friendly gradient with darker top and purple accent at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/40 to-purple-900/80 z-10"></div>
        
        {/* Hero content on top of video - optimized for mobile */}
        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Hero />
        </div>
      </section>
      
      <VideoShowcase />
      <ComparisonTable />
      {/* <Footer /> */}
    </main>
  )
}
