import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// 五个汉字的大小、倾斜和错位保持不规则排布
const CHARACTERS = [
  { char: '雷', size: 1.4, tilt: -14, offsetX: -18, offsetY: 16, delay: 0 },
  { char: '诺', size: 1.16, tilt: 10, offsetX: 4, offsetY: -14, delay: 0.14 },
  { char: '曼', size: 1.34, tilt: -6, offsetX: 22, offsetY: 10, delay: 0.28 },
  { char: '占', size: 1.06, tilt: 7, offsetX: 2, offsetY: -6, delay: 0.42 },
  { char: '卜', size: 1.2, tilt: 13, offsetX: 14, offsetY: 8, delay: 0.56 },
]

// 在字面区域内生成很多白色小问号，并统一向上漂浮
const createQuestionParticles = (width, height, count = 34) =>
  Array.from({ length: count }, (_, index) => ({
    id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2, 6)}`,
    x: width * (0.14 + Math.random() * 0.72),
    y: height * (0.2 + Math.random() * 0.62),
    driftX: (Math.random() - 0.5) * 34,
    driftY: -(56 + Math.random() * 92),
    rotate: (Math.random() - 0.5) * 24,
    scale: 0.55 + Math.random() * 0.8,
    size: 8 + Math.random() * 10,
    delay: index * 0.02,
    duration: 1.55 + Math.random() * 0.75,
  }))

const liquidFloatVariants = {
  initial: {
    y: 0,
    x: 0,
    rotate: 0,
    scale: 1,
  },
  animate: custom => ({
    y: [custom.offsetY, custom.offsetY - 10, custom.offsetY + 3, custom.offsetY - 6, custom.offsetY],
    x: [custom.offsetX, custom.offsetX + 3, custom.offsetX - 2, custom.offsetX + 1, custom.offsetX],
    rotate: [custom.tilt, custom.tilt + 2, custom.tilt - 1, custom.tilt + 1, custom.tilt],
    scale: [custom.size, custom.size * 1.02, custom.size * 0.995, custom.size],
    transition: {
      duration: 5.8,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: custom.delay,
    },
  }),
}

function FloatingChar({ data }) {
  const [isDissolving, setIsDissolving] = useState(false)
  const [particles, setParticles] = useState([])
  const charRef = useRef(null)
  const timerRef = useRef(null)

  const triggerDissolve = useCallback(() => {
    if (!charRef.current || isDissolving) return

    const rect = charRef.current.getBoundingClientRect()
    setParticles(createQuestionParticles(rect.width, rect.height))
    setIsDissolving(true)

    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setIsDissolving(false)
      setParticles([])
    }, 2300)
  }, [isDissolving])

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const fontSize = 72 * data.size

  return (
    <motion.span className="floating-char-wrapper" custom={data} variants={liquidFloatVariants} initial="initial" animate="animate">
      <span
        ref={charRef}
        className={`floating-char${isDissolving ? ' is-dissolving' : ''}`}
        onMouseEnter={triggerDissolve}
        style={{
          fontSize: `${fontSize}px`,
          cursor: 'default',
        }}
      >
        <motion.span
          className="floating-char__inner"
          data-char={data.char}
          animate={
            isDissolving
              ? {
                opacity: [1, 0.62, 0],
                filter: ['blur(0px)', 'blur(3px)', 'blur(11px)'],
                scale: [1, 1.02, 0.96],
              }
              : {
                opacity: 1,
                filter: 'blur(0px)',
                scale: 1,
              }
          }
          transition={{
            duration: isDissolving ? 1.08 : 0.4,
            ease: 'easeOut',
          }}
        >
          {data.char}
        </motion.span>

        <AnimatePresence>
          {isDissolving && (
            <span className="floating-char__particles" aria-hidden="true">
              {particles.map(particle => (
                <motion.span
                  key={particle.id}
                  className="floating-char__particle"
                  initial={{
                    opacity: 0,
                    x: particle.x,
                    y: particle.y,
                    scale: particle.scale * 0.72,
                    rotate: particle.rotate,
                  }}
                  animate={{
                    opacity: [0, 1, 0.92, 0],
                    x: [particle.x, particle.x + particle.driftX],
                    y: [particle.y, particle.y + particle.driftY],
                    scale: [particle.scale * 0.72, particle.scale, particle.scale * 0.88],
                    rotate: [particle.rotate, particle.rotate + (particle.driftX > 0 ? 18 : -18)],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: particle.duration,
                    ease: [0.22, 0.61, 0.36, 1],
                    delay: particle.delay,
                  }}
                  style={{
                    fontSize: `${particle.size}px`,
                  }}
                >
                  ?
                </motion.span>
              ))}
            </span>
          )}
        </AnimatePresence>
      </span>
    </motion.span>
  )
}

export default function FloatingTitle() {
  return (
    <div className="floating-title">
      <div className="floating-title__container">
        {CHARACTERS.map((charData, index) => (
          <FloatingChar key={index} data={charData} />
        ))}
      </div>
    </div>
  )
}
