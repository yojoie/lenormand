import { useEffect, useRef } from 'react'

export default function StarryBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const context = canvas.getContext('2d')
    if (!context) return undefined

    let animationId = 0
    let meteorClock = 0
    let stars = []
    let meteors = []
    const meteorPalettes = [
      { head: 'rgba(255,255,255,0.98)', mid: 'rgba(132,196,255,0.82)', tail: 'rgba(132,196,255,0)' },
      { head: 'rgba(255,255,255,0.98)', mid: 'rgba(59,130,246,0.8)', tail: 'rgba(59,130,246,0)' },
      { head: 'rgba(255,244,255,0.98)', mid: 'rgba(201,143,255,0.8)', tail: 'rgba(201,143,255,0)' },
      { head: 'rgba(255,244,255,0.98)', mid: 'rgba(168,85,247,0.76)', tail: 'rgba(168,85,247,0)' },
    ]
    let pointer = {
      x: null,
      y: null,
      radius: 240,
    }

    const resizeCanvas = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * ratio
      canvas.height = window.innerHeight * ratio
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`

      const amount = Math.min(420, Math.floor(window.innerWidth / 3.4))
      stars = Array.from({ length: amount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        offsetX: 0,
        offsetY: 0,
        driftX: (Math.random() - 0.5) * 0.18,
        driftY: (Math.random() - 0.5) * 0.18,
        size: Math.random() * 1.9 + 0.6,
        alpha: Math.random() * 0.7 + 0.24,
        delta: (Math.random() - 0.5) * 0.014,
        speed: Math.random() * 0.32 + 0.08,
        pulse: Math.random() * Math.PI * 2,
        tint: meteorPalettes[Math.floor(Math.random() * meteorPalettes.length)],
      }))
    }

    const updatePointer = (clientX, clientY) => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      pointer = {
        ...pointer,
        x: clientX * ratio,
        y: clientY * ratio,
      }
    }

    const handlePointerMove = (event) => {
      updatePointer(event.clientX, event.clientY)
    }

    const handleTouchMove = (event) => {
      if (!event.touches[0]) return
      updatePointer(event.touches[0].clientX, event.touches[0].clientY)
    }

    const handlePointerLeave = () => {
      pointer = {
        ...pointer,
        x: null,
        y: null,
      }
    }

    const renderFrame = () => {
      context.fillStyle = '#000000'
      context.fillRect(0, 0, canvas.width, canvas.height)

      const skyGlow = context.createRadialGradient(canvas.width * 0.5, canvas.height * 0.18, 0, canvas.width * 0.5, canvas.height * 0.18, canvas.height * 0.85)
      skyGlow.addColorStop(0, 'rgba(255,255,255,0.028)')
      skyGlow.addColorStop(0.18, 'rgba(106,152,255,0.04)')
      skyGlow.addColorStop(0.38, 'rgba(96,74,170,0.06)')
      skyGlow.addColorStop(0.6, 'rgba(255,182,88,0.03)')
      skyGlow.addColorStop(1, 'rgba(0,0,0,0)')
      context.fillStyle = skyGlow
      context.fillRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        star.alpha += star.delta
        if (star.alpha > 1 || star.alpha < 0.15) {
          star.delta *= -1
        }
        star.pulse += 0.02

        if (pointer.x !== null && pointer.y !== null) {
          const dx = pointer.x - star.x
          const dy = pointer.y - star.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < pointer.radius) {
            const force = (pointer.radius - distance) / pointer.radius
            const tangentX = -dy / (distance || 1)
            const tangentY = dx / (distance || 1)
            star.driftX += (dx / (distance || 1)) * force * 0.035 + tangentX * force * 0.03
            star.driftY += (dy / (distance || 1)) * force * 0.035 + tangentY * force * 0.03
          }
        }

        star.driftX *= 0.985
        star.driftY *= 0.985
        star.offsetX += star.driftX * star.speed
        star.offsetY += star.driftY * star.speed
        star.offsetX *= 0.96
        star.offsetY *= 0.96
        const renderX = star.x + star.offsetX
        const renderY = star.y + star.offsetY

        const glow = pointer.x !== null ? Math.max(0, 1 - Math.hypot(renderX - pointer.x, renderY - pointer.y) / pointer.radius) : 0
        const shimmer = (Math.sin(star.pulse) + 1) * 0.5

        context.beginPath()
        context.arc(renderX, renderY, star.size * 4 + glow * 10, 0, Math.PI * 2)
        context.fillStyle = star.tint.mid.replace(/0\.\d+\)/, `${0.022 + glow * 0.09})`)
        context.fill()

        context.beginPath()
        context.arc(renderX, renderY, star.size + shimmer * 0.8 + glow * 1.8, 0, Math.PI * 2)
        context.fillStyle = star.tint.head.replace(/0\.\d+\)/, `${Math.min(0.98, star.alpha + shimmer * 0.22 + glow * 0.4)})`)
        context.fill()
      })

      meteorClock += 1
      if (meteorClock > 46 && Math.random() > 0.88) {
        meteorClock = 0
        const burst = Math.random() > 0.72 ? 2 : 1
        for (let index = 0; index < burst; index += 1) {
          const palette = meteorPalettes[Math.floor(Math.random() * meteorPalettes.length)]
          meteors.push({
            x: Math.random() * canvas.width * 0.82,
            y: Math.random() * canvas.height * 0.42,
            vx: 13 + Math.random() * 14,
            vy: 5 + Math.random() * 7,
            width: 1.6 + Math.random() * 1.8,
            tailLength: 4.5 + Math.random() * 3.2,
            palette,
          })
        }
      }

      meteors = meteors.filter(
        meteor =>
          meteor.x - meteor.vx * meteor.tailLength < canvas.width + 160 &&
          meteor.y - meteor.vy * meteor.tailLength < canvas.height + 160
      )
      meteors.forEach((meteor) => {
        const tail = context.createLinearGradient(meteor.x, meteor.y, meteor.x - meteor.vx * meteor.tailLength, meteor.y - meteor.vy * meteor.tailLength)
        tail.addColorStop(0, meteor.palette.head)
        tail.addColorStop(0.42, meteor.palette.mid)
        tail.addColorStop(1, meteor.palette.tail)

        context.beginPath()
        context.moveTo(meteor.x, meteor.y)
        context.lineTo(meteor.x - meteor.vx * meteor.tailLength, meteor.y - meteor.vy * meteor.tailLength)
        context.strokeStyle = tail
        context.lineWidth = meteor.width
        context.stroke()

        context.beginPath()
        context.arc(meteor.x, meteor.y, meteor.width * 1.2, 0, Math.PI * 2)
        context.fillStyle = meteor.palette.head
        context.fill()

        meteor.x += meteor.vx
        meteor.y += meteor.vy
      })

      animationId = window.requestAnimationFrame(renderFrame)
    }

    resizeCanvas()
    renderFrame()
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      window.cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])


  return <canvas ref={canvasRef} className="starry-canvas" aria-hidden="true" />
}
