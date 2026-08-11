import { useState, useEffect } from 'react'
import cloudImg from '../assets/image.png'

export default function CloudEffect() {
  const [processedImg, setProcessedImg] = useState(null)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      const w = canvas.width
      const h = canvas.height

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const lightness = (max + min) / 2

        const pixelIndex = i / 4
        const xPercent = (pixelIndex % w) / w
        const yPercent = Math.floor(pixelIndex / w) / h

        if (lightness < 60) {
          data[i + 3] = 0
        } else if (lightness < 90) {
          data[i + 3] = Math.round(data[i + 3] * (lightness - 60) / 30)
        }

        if ((xPercent > 0.393 && xPercent < 0.617 && yPercent > 0.002 && yPercent < 0.082 && lightness > 70) ||
           (xPercent > 0.886 && xPercent < 0.997 && yPercent > 0.004 && yPercent < 0.134 && lightness > 70) ||
           (xPercent > 0.172 && xPercent < 0.835 && yPercent > 0.047 && yPercent < 0.783 && lightness > 70) ||
           (xPercent > 0.395 && xPercent < 0.630 && yPercent > -0.013 && yPercent < 0.017 && lightness > 70) ||
           (xPercent > 0.893 && xPercent < 1.000 && yPercent > -0.003 && yPercent < 0.027 && lightness > 70)) {
           data[i + 3] = 0
         }
      }

      ctx.putImageData(imageData, 0, 0)
      setProcessedImg(canvas.toDataURL('image/png'))
    }
    img.src = cloudImg
  }, [])

  if (!processedImg) return null

  return (
    <div
      className="cloud-effect"
      style={{ backgroundImage: `url(${processedImg})` }}
      aria-hidden="true"
    />
  )
}
