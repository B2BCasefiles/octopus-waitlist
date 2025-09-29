import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import Script from "next/script"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "OctopusClips - Professional Video Editing Without Professional Prices",
  description:
    "Custom typography, cinematic color grading, and frame-perfect animation for your video content. Premium results, indie budget.",
    generator: 'v0.app',
  icons: {
    icon: 'https://vuobclcngoqsjkownwzb.supabase.co/storage/v1/object/public/Showcase%20Videos/LOGO.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} antialiased dark`}>
      <body className="bg-background text-foreground font-sans min-h-screen">
        {children}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}
