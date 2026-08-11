import { motion } from 'framer-motion'

function toRoman(value) {
  const numerals = [
    ['X', 10],
    ['IX', 9],
    ['V', 5],
    ['IV', 4],
    ['I', 1],
  ]

  let result = ''
  let remaining = value

  numerals.forEach(([symbol, amount]) => {
    while (remaining >= amount) {
      result += symbol
      remaining -= amount
    }
  })

  return result
}

function CardBackVisual({ className = '', tone = 'gold', badgeText = 'LENORMAND', centerContent = null, bottomText = '✦ ✦ ✦ ✦ ✦', children = null, ...props }) {
  return (
    <div className={`card-back-visual card-back-visual--${tone} ${className}`.trim()} {...props}>
      <div className="card-back__frame" />
      <div className="card-back__corner card-back__corner--tl" />
      <div className="card-back__corner card-back__corner--tr" />
      <div className="card-back__corner card-back__corner--bl" />
      <div className="card-back__corner card-back__corner--br" />
      <div className="card-back__badge">{badgeText}</div>
      <div className="card-back__flow card-back__flow--1" />
      <div className="card-back__flow card-back__flow--2" />
      <div className="card-back__flow card-back__flow--3" />
      <div className="card-back__rings">
        <span />
        <span />
        <span />
      </div>
      <div className="card-back__sigil">
        {centerContent ?? <span className="card-back__sigil-star">✦</span>}
        <span className="card-back__sigil-orbit" />
      </div>
      {children}
      <div className="card-back__stars">{bottomText}</div>
    </div>
  )
}

function LineArt({ card }) {
  const stroke = {
    fill: 'none',
    stroke: 'url(#card-line-gradient)',
    strokeWidth: 2.2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    vectorEffect: 'non-scaling-stroke',
  }

  const detailStroke = {
    fill: 'none',
    stroke: 'url(#card-line-gradient-soft)',
    strokeWidth: 1.4,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    vectorEffect: 'non-scaling-stroke',
  }

  const accentStroke = {
    fill: 'none',
    stroke: 'url(#card-line-gradient-bright)',
    strokeWidth: 2.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    vectorEffect: 'non-scaling-stroke',
  }

  switch (card.name) {
    case '骑手':
      return (
        <>
          <path {...detailStroke} d="M31 88c12-8 24-12 36-12 12 0 23 4 34 12" />
          <path {...stroke} d="M28 82c14-18 33-29 52-32 12-2 22 2 33 12" />
          <path {...accentStroke} d="M55 72l14-15 18 3 9 17-10 11H69z" />
          <path {...detailStroke} d="M49 92h18M84 92h22M57 92l-8 18M95 92l11 18" />
        </>
      )
    case '三叶草':
      return (
        <>
          <circle {...accentStroke} cx="58" cy="58" r="16" />
          <circle {...accentStroke} cx="82" cy="58" r="16" />
          <circle {...accentStroke} cx="58" cy="82" r="16" />
          <circle {...accentStroke} cx="82" cy="82" r="16" />
          <path {...detailStroke} d="M70 94c2 12 0 22-8 32" />
        </>
      )
    case '船':
      return (
        <>
          <path {...accentStroke} d="M36 94h56l-7 13H45z" />
          <path {...stroke} d="M62 40v54" />
          <path {...detailStroke} d="M62 44 90 64 62 70zM62 50 38 68l24 4z" />
          <path {...detailStroke} d="M28 108c10-6 20-6 30 0s20 6 30 0 20-6 30 0" />
        </>
      )
    case '房子':
      return (
        <>
          <path {...accentStroke} d="M38 72 70 44l32 28" />
          <path {...stroke} d="M46 70v38h48V70" />
          <path {...detailStroke} d="M62 108V84h16v24M52 80h10M78 80h10" />
        </>
      )
    case '树':
      return (
        <>
          <path {...stroke} d="M70 38v54" />
          <path {...stroke} d="M70 54c-10-16-25-22-35-18M70 58c11-16 26-22 36-18M70 70c-14-10-28-10-42-4M70 72c13-10 27-10 40-3" />
          <path {...stroke} d="M64 92 54 112M70 92v22M76 92l10 20" />
        </>
      )
    case '云':
      return (
        <>
          <path {...stroke} d="M42 82c-10 0-18-8-18-17 0-9 8-17 18-17 3-12 15-20 28-18 9 1 17 8 20 17 11-2 22 5 24 17 1 11-7 21-19 22z" />
          <path {...stroke} d="M44 98h52" />
        </>
      )
    case '蛇':
      return (
        <>
          <path {...stroke} d="M44 46c20-14 48-2 48 18 0 15-16 20-28 25-10 4-16 10-16 18 0 7 6 12 14 12 9 0 16-5 20-12" />
          <path {...stroke} d="M86 42h8l-2 8" />
        </>
      )
    case '棺材':
      return (
        <>
          <path {...stroke} d="M54 38h32l14 26-14 46H54L40 64z" />
          <path {...stroke} d="M70 54v40M58 74h24" />
        </>
      )
    case '花束':
      return (
        <>
          <circle {...stroke} cx="52" cy="54" r="10" />
          <circle {...stroke} cx="72" cy="46" r="10" />
          <circle {...stroke} cx="88" cy="60" r="10" />
          <path {...stroke} d="M52 64c8 10 12 18 18 34M72 56c2 12 2 22 2 42M88 70c-8 10-12 18-18 32" />
          <path {...stroke} d="M58 104c8 6 16 8 24 0" />
        </>
      )
    case '镰刀':
      return (
        <>
          <path {...stroke} d="M84 38c-18 6-32 20-38 38 8-4 15-5 23-4 8 2 14 6 20 13 9-15 8-34-5-47z" />
          <path {...stroke} d="M48 74l-10 34" />
        </>
      )
    case '鞭子':
      return (
        <>
          <path {...stroke} d="M52 38c-10 16-6 31 10 45 14 12 19 24 15 39" />
          <path {...stroke} d="M78 42c-8 12-6 22 6 31 12 9 16 20 13 35" />
          <path {...stroke} d="M44 40h14M72 44h14" />
        </>
      )
    case '鸟':
      return (
        <>
          <path {...stroke} d="M34 74c12-16 28-24 44-24-4 8-4 17 0 26" />
          <path {...stroke} d="M106 74C94 58 78 50 62 50c4 8 4 17 0 26" />
          <path {...stroke} d="M46 86h18M76 86h18" />
        </>
      )
    case '孩子':
      return (
        <>
          <circle {...stroke} cx="70" cy="48" r="12" />
          <path {...stroke} d="M70 60v24M52 74l18 10 18-10M58 110c8-10 14-16 24-18" />
          <circle {...stroke} cx="90" cy="104" r="12" />
        </>
      )
    case '狐狸':
      return (
        <>
          <path {...stroke} d="M42 90c10-24 28-40 52-40l-8 18 16 12-18 10-14 18-8-12H42z" />
          <path {...stroke} d="M64 84l10 8" />
        </>
      )
    case '熊':
      return (
        <>
          <circle {...stroke} cx="70" cy="66" r="28" />
          <circle {...stroke} cx="52" cy="44" r="8" />
          <circle {...stroke} cx="88" cy="44" r="8" />
          <path {...stroke} d="M58 78c8 8 16 8 24 0M60 66h4M76 66h4" />
        </>
      )
    case '星星':
      return (
        <>
          <path {...stroke} d="M70 38 76 60l22 0-18 12 7 22-17-13-18 13 7-22-18-12 22 0z" />
          <path {...stroke} d="M34 48l4 10 10 3-10 4-4 10-4-10-10-4 10-3zM106 92l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" />
        </>
      )
    case '鹳':
      return (
        <>
          <path {...stroke} d="M48 94c8-26 14-44 20-52 10 8 14 20 12 36" />
          <path {...stroke} d="M80 42h20l-18 12" />
          <path {...stroke} d="M52 98h12M84 98h10M58 98l-6 16M90 98l5 16" />
        </>
      )
    case '狗':
      return (
        <>
          <path {...stroke} d="M46 92V66l12-16h18l18 10v32H76l-6-10-6 10z" />
          <path {...stroke} d="M54 58l-8-10M86 62l10-12" />
        </>
      )
    case '塔':
      return (
        <>
          <path {...stroke} d="M56 38h28v72H56z" />
          <path {...stroke} d="M52 48h36M52 60h36M64 74h12M66 110V88h8v22" />
        </>
      )
    case '花园':
      return (
        <>
          <path {...stroke} d="M36 100c10-10 20-16 34-16s24 6 34 16" />
          <path {...stroke} d="M48 98V64h44v34" />
          <path {...stroke} d="M58 64c0-10 6-18 12-24 6 6 12 14 12 24" />
        </>
      )
    case '山':
      return (
        <>
          <path {...stroke} d="M26 104 54 58l16 22 12-16 32 40z" />
          <path {...stroke} d="M54 58l8 10M82 64l8 10" />
        </>
      )
    case '十字路口':
      return (
        <>
          <path {...stroke} d="M70 40v66M70 54l-18-10M70 54l18-10M70 88l-18 14M70 88l18 14" />
          <path {...stroke} d="M52 44h-8M88 44h8M52 102h-8M88 102h8" />
        </>
      )
    case '老鼠':
      return (
        <>
          <path {...stroke} d="M44 84c6-14 18-22 32-22 10 0 19 5 26 14-6 12-17 20-30 20-10 0-20-4-28-12z" />
          <path {...stroke} d="M44 84c-6 2-10 8-12 16M78 72h4M86 72h4" />
        </>
      )
    case '心':
      return (
        <>
          <path {...accentStroke} d="M70 106C52 90 38 78 38 60c0-12 9-20 20-20 7 0 12 3 16 9 4-6 9-9 16-9 11 0 20 8 20 20 0 18-14 30-40 46z" />
          <path {...detailStroke} d="M58 50c2-4 7-8 12-10M84 52c4 3 7 6 8 12" />
        </>
      )
    case '戒指':
      return (
        <>
          <circle {...stroke} cx="70" cy="74" r="24" />
          <path {...stroke} d="M62 46c2-8 8-14 16-16l8 10-10 8" />
        </>
      )
    case '书':
      return (
        <>
          <path {...stroke} d="M40 46h26c8 0 14 4 18 10v52c-4-6-10-10-18-10H40z" />
          <path {...stroke} d="M100 46H74c-8 0-14 4-18 10v52c4-6 10-10 18-10h26z" />
        </>
      )
    case '信':
      return (
        <>
          <path {...stroke} d="M34 52h72v48H34z" />
          <path {...stroke} d="M34 56 70 82l36-26" />
          <path {...stroke} d="M40 96 60 76M100 96 80 76" />
        </>
      )
    case '男人':
      return (
        <>
          <circle {...stroke} cx="70" cy="48" r="14" />
          <path {...stroke} d="M52 106V84c0-12 8-20 18-20s18 8 18 20v22" />
          <path {...stroke} d="M56 74h28" />
        </>
      )
    case '女人':
      return (
        <>
          <circle {...stroke} cx="70" cy="46" r="14" />
          <path {...stroke} d="M70 60 52 108h36z" />
          <path {...stroke} d="M60 78h20" />
        </>
      )
    case '百合':
      return (
        <>
          <path {...stroke} d="M70 42v62" />
          <path {...stroke} d="M70 54c-14 0-24 10-24 24 14 0 24-10 24-24zM70 64c14 0 24 10 24 24-14 0-24-10-24-24z" />
          <path {...stroke} d="M60 104h20" />
        </>
      )
    case '太阳':
      return (
        <>
          <circle {...stroke} cx="70" cy="74" r="22" />
          <path {...stroke} d="M70 34v12M70 102v12M30 74h12M98 74h12M43 47l8 8M89 93l8 8M43 101l8-8M89 55l8-8" />
        </>
      )
    case '月亮':
      return (
        <>
          <path {...stroke} d="M88 42c-6-2-10-2-16-2-22 0-40 18-40 40s18 40 40 40c6 0 10-1 16-2-16-6-26-20-26-38S72 48 88 42z" />
        </>
      )
    case '钥匙':
      return (
        <>
          <circle {...stroke} cx="52" cy="68" r="14" />
          <path {...stroke} d="M66 68h36M88 68v10M96 68v6M102 68v12" />
        </>
      )
    case '锚':
      return (
        <>
          <path {...stroke} d="M70 38v46M58 54a12 12 0 1 1 24 0" />
          <path {...stroke} d="M46 82c0 16 10 28 24 28s24-12 24-28" />
          <path {...stroke} d="M46 82l-14 8M94 82l14 8" />
        </>
      )
    case '十字架':
      return (
        <>
          <path {...stroke} d="M70 36v74M46 58h48" />
          <path {...stroke} d="M58 110h24" />
        </>
      )
    case '鱼':
      return (
        <>
          <path {...stroke} d="M40 76c12-16 30-24 52-22-2 8-2 14 0 22-22 2-40-6-52-22z" />
          <path {...stroke} d="M92 54l14-10v20zM58 66h6M64 88c10 10 20 14 32 14" />
        </>
      )
    default:
      return (
        <>
          <circle {...accentStroke} cx="70" cy="74" r="26" />
          <path {...detailStroke} d="M70 48v52M44 74h52" />
        </>
      )
  }
}

function CardFrontVisual({ card }) {
  return (
    <CardBackVisual
      className="oracle-card__face oracle-card__face--front"
      badgeText={card.nameEn}
      bottomText={`${toRoman(card.id)} · ${card.playingCard}`}
      centerContent={
        <div className="card-front__sigil-core">
          <motion.div
            className="card-front__liquid card-front__liquid--halo"
            initial={false}
            animate={{
              rotate: [0, 180, 360],
              scale: [1, 1.08, 0.96, 1],
              opacity: [0.24, 0.46, 0.22],
            }}
            transition={{
              duration: 11,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          />
          <motion.div
            className="card-front__liquid card-front__liquid--beam"
            initial={false}
            animate={{
              rotate: [0, 16, -12, 0],
              scaleX: [0.92, 1.12, 0.95],
              opacity: [0.24, 0.52, 0.26],
            }}
            transition={{
              duration: 7.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
          <motion.svg
            className="card-front__line-art"
            viewBox="0 0 140 140"
            fill="none"
            initial={false}
            animate={{
              rotate: [0, 2.2, -1.8, 0],
              y: [0, -2, 1, 0],
              scale: [1, 1.015, 0.99, 1],
            }}
            transition={{
              duration: 5.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          >
            <defs>
              <linearGradient id="card-line-gradient" x1="22" y1="20" x2="118" y2="122" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(219, 234, 254, 1)" />
                <stop offset="45%" stopColor="rgba(191, 219, 254, 0.98)" />
                <stop offset="100%" stopColor="rgba(147, 197, 253, 0.96)" />
              </linearGradient>
              <linearGradient id="card-line-gradient-soft" x1="16" y1="30" x2="122" y2="112" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(221, 214, 254, 0.95)" />
                <stop offset="100%" stopColor="rgba(191, 219, 254, 0.85)" />
              </linearGradient>
              <linearGradient id="card-line-gradient-bright" x1="48" y1="24" x2="102" y2="118" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(239, 246, 255, 1)" />
                <stop offset="100%" stopColor="rgba(219, 234, 254, 1)" />
              </linearGradient>
              <filter id="card-line-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="2.4" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="0.6 0 0 0 0  0 0.75 0 0 0  0 0 1 0 0  0 0 0 1 0"
                  result="coolGlow"
                />
                <feMerge>
                  <feMergeNode in="coolGlow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle className="card-front__ring card-front__ring--outer" cx="70" cy="70" r="40" />
            <circle className="card-front__ring card-front__ring--inner" cx="70" cy="70" r="30" />
            <g filter="url(#card-line-glow)" transform="translate(70 70) scale(0.78) translate(-70 -70)">
              <LineArt card={card} />
            </g>
          </motion.svg>
        </div>
      }
    >
      <motion.div
        className="card-front__aura card-front__aura--mist"
        initial={false}
        animate={{
          opacity: [0.24, 0.5, 0.28],
          x: ['-6%', '8%', '-2%'],
          y: ['0%', '-4%', '2%'],
          scale: [1, 1.06, 1.01],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="card-front__aura card-front__aura--stars"
        initial={false}
        animate={{
          opacity: [0.16, 0.3, 0.2],
          y: [0, 14, 0],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'linear',
        }}
      />
    </CardBackVisual>
  )
}

export function CardBackOnly({ className = '', tone = 'gold' }) {
  return (
    <article className={`oracle-card oracle-card--back-only ${className}`.trim()}>
      <CardBackVisual className="oracle-card__face oracle-card__face--back" tone={tone} />
    </article>
  )
}

export default function Card({ card, flipped, compact = false, label = '', delay = 0, onAnimationComplete }) {
  const style = {
    animationDelay: `${delay}s`,
  }

  return (
    <article className={`oracle-card ${compact ? 'is-compact' : ''} ${flipped ? 'is-flipped' : ''}`} style={style}>
      {label ? <span className="oracle-card__label">{label}</span> : null}
      <motion.div
        className="oracle-card__motion"
        initial={false}
        animate={{
          rotateZ: flipped ? [0, -2, 0] : 0,
          scale: flipped ? [0.96, 1.03, 1] : 1,
          y: flipped ? [8, -10, 0] : 0,
          filter: flipped ? ['brightness(0.92)', 'brightness(1.08)', 'brightness(1)'] : 'brightness(1)',
        }}
        transition={{
          duration: flipped ? 0.96 : 0.42,
          ease: [0.22, 1, 0.36, 1],
          times: flipped ? [0, 0.6, 1] : undefined,
        }}
        onAnimationComplete={onAnimationComplete}
      >
        <div className="oracle-card__inner">
          <CardBackVisual className="oracle-card__face oracle-card__face--back" aria-hidden={flipped} />
          <CardFrontVisual card={card} />
        </div>
      </motion.div>
    </article>
  )
}
