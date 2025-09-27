'use client'

import { useEffect, useState } from 'react'

export function AnimatedBackgroundEnhanced() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 dark:from-gray-950 dark:via-blue-950/30 dark:to-purple-950/40" />

      {/* Animated Gradient Mesh */}
      <div className={cn(
        "absolute inset-0 opacity-30 dark:opacity-20",
        mounted && "animate-gradient-shift"
      )}>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-bl from-green-500/20 via-blue-500/20 to-purple-500/20 blur-3xl" />
      </div>

      {/* Animated Blobs */}
      <div className={mounted ? "opacity-100" : "opacity-0"}>
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-400 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-0 -right-40 w-80 h-80 bg-purple-400 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-400 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        <div className="absolute bottom-0 right-20 w-80 h-80 bg-green-400 dark:bg-green-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-6000" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {mounted && [...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 20}s`
            }}
          >
            <div className={cn(
              "w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full",
              "shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            )} />
          </div>
        ))}
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 dark:opacity-10" />

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <svg className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence type="turbulence" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}