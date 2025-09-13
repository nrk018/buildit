"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
}

export function ParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const createParticle = (x: number, y: number): Particle => ({
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 0,
      maxLife: Math.random() * 100 + 50,
    })

    const updateParticles = () => {
      // Add new particles randomly
      if (Math.random() < 0.1) {
        particlesRef.current.push(createParticle(Math.random() * canvas.width, Math.random() * canvas.height))
      }

      // Update existing particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life++

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        return particle.life < particle.maxLife
      })

      // Keep particle count reasonable
      if (particlesRef.current.length > 50) {
        particlesRef.current = particlesRef.current.slice(-50)
      }
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        const alpha = 1 - particle.life / particle.maxLife
        ctx.fillStyle = `rgba(0, 255, 255, ${alpha * 0.5})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2)
        ctx.fill()

        // Draw connections between nearby particles
        particlesRef.current.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            const connectionAlpha = (1 - distance / 100) * alpha * 0.2
            ctx.strokeStyle = `rgba(0, 255, 255, ${connectionAlpha})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      })
    }

    const animate = () => {
      updateParticles()
      drawParticles()
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ mixBlendMode: "screen" }} />
}
