"use client"

import { useEffect, useState } from "react"

interface NeonOrbsProps {
  title?: string;
  subtitle?: string;
}

export function NeonOrbs({ 
  title = "QUIT BOOST", 
  subtitle = "A CIÊNCIA DA SUA LIBERDADE" 
}: NeonOrbsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center bg-[#050a18] transition-colors duration-500">
      {/* Top-left orb */}
      <div
        className={`absolute transition-all duration-1000 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
        style={{
          top: "-40%",
          left: "-20%",
          width: "80vw",
          height: "80vw",
          maxWidth: "800px",
          maxHeight: "800px",
        }}
      >
        <div className="w-full h-full rounded-full relative orb-light transition-all duration-500">
          <div className="absolute inset-[-2px] rounded-full beam-spin-8">
            <div className="beam-light" />
          </div>
        </div>
      </div>

      {/* Bottom-center orb */}
      <div
        className={`absolute transition-all duration-1000 ease-out delay-300 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{
          bottom: "-50%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100vw",
          height: "100vw",
          maxWidth: "1000px",
          maxHeight: "1000px",
        }}
      >
        <div className="w-full h-full rounded-full relative orb-light transition-all duration-500">
          <div className="absolute inset-[-2px] rounded-full beam-spin-10-reverse">
            <div className="beam-light" />
          </div>
        </div>
      </div>

      {/* Top-right orb */}
      <div
        className={`absolute transition-all duration-1000 ease-out delay-500 ${
          mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
        }`}
        style={{
          top: "-30%",
          right: "-25%",
          width: "70vw",
          height: "70vw",
          maxWidth: "700px",
          maxHeight: "700px",
        }}
      >
        <div className="w-full h-full rounded-full relative orb-light transition-all duration-500">
          <div className="absolute inset-[-2px] rounded-full beam-spin-6">
            <div className="beam-light" />
          </div>
        </div>
      </div>

      {/* Bottom-right orb */}
      <div
        className={`absolute transition-all duration-1000 ease-out delay-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{
          bottom: "-35%",
          right: "-15%",
          width: "75vw",
          height: "75vw",
          maxWidth: "750px",
          maxHeight: "750px",
        }}
      >
        <div className="w-full h-full rounded-full relative orb-light transition-all duration-500">
          <div className="absolute inset-[-2px] rounded-full beam-spin-7-reverse">
            <div className="beam-light" />
          </div>
        </div>
      </div>

      {/* Center text */}
      <div className="relative z-20 text-center px-4">
        <h1 
          className={`text-6xl md:text-9xl font-extralight tracking-[0.25em] mb-6 text-white transition-all duration-1000 ease-out ${
            mounted 
              ? "opacity-100 translate-y-0 blur-0" 
              : "opacity-0 translate-y-8 blur-sm"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          {title.split(" ").map((word, wi) => (
            <span key={wi} className="inline-block mr-[0.25em] last:mr-0">
               {word.split("").map((char, i) => (
                <span
                  key={i}
                  className={`inline-block transition-all duration-700 ${
                    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${800 + (wi * 500) + (i * 100)}ms` }}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <p 
          className={`text-sm md:text-base font-light tracking-[0.5em] text-white/40 transition-all duration-1000 ease-out ${
            mounted 
              ? "opacity-100 translate-y-0 blur-0" 
              : "opacity-0 translate-y-4 blur-sm"
          }`}
          style={{ transitionDelay: "1800ms" }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  )
}
