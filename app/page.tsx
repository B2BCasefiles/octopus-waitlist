import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { VideoShowcase } from "@/components/video-showcase"
import { ComparisonTable } from "@/components/comparison-table"
// import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <VideoShowcase />
      <ComparisonTable />
      {/* <Footer /> */}
    </main>
  )
}
