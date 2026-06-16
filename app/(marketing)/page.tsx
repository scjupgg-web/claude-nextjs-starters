import { Hero } from "@/components/sections/hero"
import { Features } from "@/components/sections/features"
import { Stats } from "@/components/sections/stats"
import { CTA } from "@/components/sections/cta"

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <CTA />
    </>
  )
}
