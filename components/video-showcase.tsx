"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

const videos = [
  {
    url: "https://vuobclcngoqsjkownwzb.supabase.co/storage/v1/object/public/Showcase%20Videos/PROMO_1.mp4",
    title: "Promo Video 1",
  },
  {
    url: "https://vuobclcngoqsjkownwzb.supabase.co/storage/v1/object/public/Showcase%20Videos/PROMO_2.mp4",
    title: "Promo Video 2",
  },
  {
    url: "https://vuobclcngoqsjkownwzb.supabase.co/storage/v1/object/public/Showcase%20Videos/PROMO_3.mp4",
    title: "Promo Video 3",
  },
]

export function VideoShowcase() {
  const [currentVideo, setCurrentVideo] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length)
    setIsPlaying(false)
  }

  const prevVideo = () => {
    setCurrentVideo((prev) => (prev - 1 + videos.length) % videos.length)
    setIsPlaying(false)
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load()
      // Auto play the video when switched
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play()
          setIsPlaying(true)
        }
      }, 100) // Small delay to ensure video is loaded
    }
  }, [currentVideo])

  return (
    <section id="videos" className="py-20 bg-gradient-to-b from-black to-purple-900/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">See OctopusClips in Action</h2>
          <p className="text-xl text-white/80">Watch how our AI transforms your content into engaging clips</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Muted indicator */}
          <div className="mb-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/50 rounded-full border border-purple-700">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-purple-200">This video's audio is muted for the showcase</span>
            </div>
          </div>
          
          {/* Video Container */}
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              preload="metadata"
              muted
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            >
              <source src={videos[currentVideo].url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Play/Pause Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
              <Button
                onClick={togglePlay}
                size="lg"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 rounded-full w-16 h-16"
              >
                {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-1" />}
              </Button>
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            onClick={prevVideo}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-0 rounded-full w-12 h-12"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </Button>

          <Button
            onClick={nextVideo}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-0 rounded-full w-12 h-12"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </Button>

          {/* Video Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentVideo(index)
                  setIsPlaying(false)
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentVideo ? "bg-pink-500 scale-125" : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
