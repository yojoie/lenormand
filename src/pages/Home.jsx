import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { lazy, Suspense } from 'react'
import FuzzyText from '../components/FuzzyText'
import MaskedHeading from '../components/MaskedHeading'

// Lazy load DecayCard to split GSAP + card images into a separate chunk
const DecayCard = lazy(() => import('../components/DecayCard'))

const modeItems = [
  {
    key: 'daily',
    label: '今日运势',
    description: '照见今天最值得留意的情绪、机会与提醒。',
  },
  {
    key: 'yesno',
    label: '是否占卜',
    description: '让两张牌交错给出更清晰的倾向。',
  },
  {
    key: 'trend',
    label: '未来趋势',
    description: '沿着过去现在与未来，观察一件事的发展。',
  },
]

const heroStars = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${6 + index * 5.2}%`,
  top: `${10 + (index % 4) * 18}%`,
  delay: index * 0.16,
  duration: 2.6 + (index % 5) * 0.5,
}))

function GoldStrokeDefs({ prefix }) {
  return (
    <defs>
      <linearGradient id={`${prefix}-gold`} x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(196,181,253,0.9)" />
        <stop offset="45%" stopColor="rgba(167,139,250,0.98)" />
        <stop offset="100%" stopColor="rgba(91,33,182,0.92)" />
      </linearGradient>
      <linearGradient id={`${prefix}-gold-soft`} x1="0%" x2="100%" y1="50%" y2="50%">
        <stop offset="0%" stopColor="rgba(196,181,253,0.24)" />
        <stop offset="50%" stopColor="rgba(167,139,250,0.74)" />
        <stop offset="100%" stopColor="rgba(196,181,253,0.24)" />
      </linearGradient>
      <linearGradient id={`${prefix}-smoke`} x1="8%" x2="92%" y1="16%" y2="84%">
        <stop offset="0%" stopColor="rgba(167,139,250,0)" />
        <stop offset="16%" stopColor="rgba(167,139,250,0.18)" />
        <stop offset="46%" stopColor="rgba(124,58,237,0.78)" />
        <stop offset="72%" stopColor="rgba(167,139,250,0.36)" />
        <stop offset="100%" stopColor="rgba(167,139,250,0)" />
      </linearGradient>
      <filter id={`${prefix}-smoke-blur`} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
      <filter id={`${prefix}-smoke-soft`} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
    </defs>
  )
}

function DailyIllustration({ prefix = 'daily', className = '', objectOnly = false }) {
  return (
    <svg className={className} viewBox="0 0 320 240" aria-hidden="true">
      <GoldStrokeDefs prefix={prefix} />
      <g className="home-illustration__smoke home-illustration__smoke--orb">
        <path
          className="home-illustration__smoke-path home-illustration__smoke-path--soft"
          d="M138 126C157 104 189 98 216 108C239 117 250 136 245 157C240 176 222 189 197 193"
          stroke={`url(#${prefix}-smoke)`}
          strokeWidth="16"
          filter={`url(#${prefix}-smoke-soft)`}
        />
        <path
          className="home-illustration__smoke-path home-illustration__smoke-path--wide"
          d="M148 72C172 57 203 57 225 70C244 81 254 98 253 116"
          stroke={`url(#${prefix}-smoke)`}
          strokeWidth="11"
          filter={`url(#${prefix}-smoke-blur)`}
        />
        <path
          className="home-illustration__smoke-path home-illustration__smoke-path--thin"
          d="M154 145C174 131 199 128 219 136C233 142 241 154 242 168"
          stroke={`url(#${prefix}-smoke)`}
          strokeWidth="6.5"
          filter={`url(#${prefix}-smoke-blur)`}
        />
      </g>
      <g fill="none" stroke={`url(#${prefix}-gold)`} strokeLinecap="round" strokeLinejoin="round">
        {!objectOnly && (
          <>
            <path d="M12 194C34 194 48 182 69 164C92 145 108 136 129 136" strokeWidth="6" />
            <path d="M96 157C111 149 123 149 137 154C148 158 156 166 157 176" strokeWidth="7" />
            <path d="M136 152C147 144 157 144 165 150C172 156 173 166 169 174" strokeWidth="5" />
            <path d="M78 168C90 179 104 186 124 190C140 193 156 192 168 188" strokeWidth="4.5" opacity="0.58" />
          </>
        )}
        <circle cx="205" cy="88" r="50" strokeWidth="4.5" />
        <ellipse cx="205" cy="90" rx="40" ry="40" stroke={`url(#${prefix}-gold-soft)`} strokeWidth="11" opacity="0.14" />
        <path d="M175 110C189 96 212 92 229 98C239 102 247 111 250 121" strokeWidth="3.2" opacity="0.7" />
        <path d="M205 40V28M205 148V160M255 88H267M143 88H155M240 53L248 45M162 131L154 139" strokeWidth="3" />
      </g>
    </svg>
  )
}

function YesNoIllustration({ prefix = 'yesno', className = '', objectOnly = false }) {
  return (
    <svg className={className} viewBox="0 0 320 240" aria-hidden="true">
      <GoldStrokeDefs prefix={prefix} />
      <g className="home-illustration__smoke home-illustration__smoke--coin">
        <path
          className="home-illustration__smoke-path home-illustration__smoke-path--soft"
          d="M160 108C164 78 188 54 216 54C240 54 258 72 259 96C259 120 244 140 219 147"
          stroke={`url(#${prefix}-smoke)`}
          strokeWidth="15"
          filter={`url(#${prefix}-smoke-soft)`}
        />
        <path
          className="home-illustration__smoke-path home-illustration__smoke-path--wide"
          d="M170 66C191 49 219 47 239 60C255 69 264 84 264 101"
          stroke={`url(#${prefix}-smoke)`}
          strokeWidth="8.5"
          filter={`url(#${prefix}-smoke-blur)`}
        />
        <path
          className="home-illustration__smoke-path home-illustration__smoke-path--thin"
          d="M164 133C179 150 202 159 224 157C239 156 253 149 261 137"
          stroke={`url(#${prefix}-smoke)`}
          strokeWidth="6"
          filter={`url(#${prefix}-smoke-blur)`}
        />
      </g>
      {!objectOnly && (
        <g fill="none" stroke={`url(#${prefix}-gold)`} strokeLinecap="round" strokeLinejoin="round">
          <path d="M160 228C160 198 161 180 166 159C170 142 178 129 191 118" strokeWidth="6.2" />
          <path d="M187 153C174 151 162 156 156 167C149 181 156 194 171 199" strokeWidth="5.2" />
          <path d="M194 151C204 157 212 165 218 177" strokeWidth="5.2" />
          <path d="M171 212C188 214 206 214 220 210" strokeWidth="3.4" opacity="0.48" />
        </g>
      )}
      <g fill="none" stroke={`url(#${prefix}-gold)`} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="201" cy="76" r="28" strokeWidth="4.4" />
        <circle cx="201" cy="76" r="21" fill={`url(#${prefix}-gold-soft)`} strokeWidth="0" opacity="0.82" />
        <circle cx="201" cy="76" r="10" fill="rgba(196,181,253,0.18)" strokeWidth="0" opacity="0.9" />
      </g>
    </svg>
  )
}

function TrendIllustration({ prefix = 'trend', className = '', objectOnly = false }) {
  return (
    <svg className={className} viewBox="0 0 320 240" aria-hidden="true">
      <GoldStrokeDefs prefix={prefix} />
      <g className="home-illustration__smoke home-illustration__smoke--hourglass">
        <path
          className="home-illustration__smoke-path home-illustration__smoke-path--soft"
          d="M112 90C128 70 154 61 178 67C201 73 218 89 221 111C224 132 213 151 194 161"
          stroke={`url(#${prefix}-smoke)`}
          strokeWidth="16"
          filter={`url(#${prefix}-smoke-soft)`}
        />
        <path
          className="home-illustration__smoke-path home-illustration__smoke-path--wide"
          d="M121 61C143 49 170 49 191 61C208 71 218 87 220 102"
          stroke={`url(#${prefix}-smoke)`}
          strokeWidth="8.5"
          filter={`url(#${prefix}-smoke-blur)`}
        />
        <path
          className="home-illustration__smoke-path home-illustration__smoke-path--thin"
          d="M120 160C140 147 166 143 188 149C203 153 214 163 219 176"
          stroke={`url(#${prefix}-smoke)`}
          strokeWidth="6"
          filter={`url(#${prefix}-smoke-blur)`}
        />
      </g>
      <g fill="none" stroke={`url(#${prefix}-gold)`} strokeLinecap="round" strokeLinejoin="round">
        {!objectOnly && (
          <>
            <path d="M309 178C286 178 271 168 252 155C232 142 217 137 198 138" strokeWidth="6" />
            <path d="M208 144C194 148 183 156 178 167C173 178 175 187 182 193" strokeWidth="7" />
            <path d="M190 149C178 142 168 142 160 148C153 154 153 164 159 172" strokeWidth="5.2" />
          </>
        )}
        <path d="M117 48H203M117 176H203" strokeWidth="5" />
        <path d="M127 48C132 84 146 103 160 111C174 103 188 84 193 48" strokeWidth="4.4" />
        <path d="M127 176C132 140 146 121 160 113C174 121 188 140 193 176" strokeWidth="4.4" />
        <path d="M146 72C160 84 168 96 170 109M152 149C160 139 166 130 170 118" strokeWidth="3.2" opacity="0.66" />
      </g>
    </svg>
  )
}

function ModeIllustration({ modeKey, className }) {
  if (modeKey === 'daily') return <DailyIllustration prefix={`${modeKey}-card`} className={className} />
  if (modeKey === 'yesno') return <YesNoIllustration prefix={`${modeKey}-card`} className={className} />
  return <TrendIllustration prefix={`${modeKey}-card`} className={className} />
}

export default function Home({ onSelect }) {
  const [transitionMode, setTransitionMode] = useState(null)
  const transitionTimerRef = useRef(null)

  useEffect(
    () => () => {
      window.clearTimeout(transitionTimerRef.current)
    },
    []
  )

  // Pre-load card title font while the DecayCard lazy chunk is downloading.
  // This ensures the font is ready (or nearly ready) by the time FuzzyText
  // mounts, so all three cards render with the correct font on first paint.
  useEffect(() => {
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.load('700 24px "Noto Serif SC"').catch(() => {})
    }
  }, [])

  const handleSelect = (modeKey) => {
    if (transitionMode) return
    onSelect(modeKey)
  }

  return (
    <>
      <div className="home-page">
        <div className="hero-card">
          <div className="hero-card__stars" aria-hidden="true">
            {heroStars.map((star) => (
              <motion.span
                key={star.id}
                className="hero-card__star"
                style={{ left: star.left, top: star.top }}
                animate={{ opacity: [0.18, 1, 0.28], scale: [0.7, 1.18, 0.8], y: [0, -8, 0] }}
                transition={{ duration: star.duration, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut', delay: star.delay }}
              />
            ))}
          </div>

          <motion.div className="hero-card__intro" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="hero-card__title-wrapper">
              <MaskedHeading
                text="LENORMAND DIVINATION"
                src="/images/fortune-hand-1.webp"
                fillScale={1.3}
                parallax={26}
                drift={18}
                reveal="rise"
                trigger="view"
                duration={1.1}
                stagger={0.12}
                textScale={0.095}
                lineHeight={1.23}
                weight={700}
                tracking={0.07}
                align="left"
                className="hero-masked-heading"
                strokeColor="rgba(0,0,0,0.85)"
                strokeWidth={1.5}
                strokeWordIndex={1}
              />
            </div>
          </motion.div>
        </div>

        <Suspense fallback={<div className="mode-gallery decay-cards" style={{ minHeight: 280 }} />}>
          <div className="mode-gallery decay-cards">
            <DecayCard
              width={200}
              height={280}
              image="fortune-hand-1"
              filterId="decay-filter-1"
              seed={3}
              maxDisplacement={260}
              movementBound={28}
              onClick={() => handleSelect('daily')}
            >
              <FuzzyText
                fontSize={24}
                fontWeight={700}
                fontFamily="'Noto Serif SC', 'Inter', sans-serif"
                color="#f3eeff"
                baseIntensity={0.15}
                hoverIntensity={0.5}
                enableHover={true}
                fuzzRange={10}
                fps={60}
                direction="horizontal"
                letterSpacing={2}
                className="fuzzy-card-text"
              >
                今日运势
              </FuzzyText>
            </DecayCard>
            <DecayCard
              width={200}
              height={280}
              image="fortune-hand-3"
              filterId="decay-filter-2"
              seed={5}
              maxDisplacement={260}
              movementBound={28}
              onClick={() => handleSelect('yesno')}
            >
              <FuzzyText
                fontSize={24}
                fontWeight={700}
                fontFamily="'Noto Serif SC', 'Inter', sans-serif"
                color="#f3eeff"
                baseIntensity={0.15}
                hoverIntensity={0.5}
                enableHover={true}
                fuzzRange={10}
                fps={60}
                direction="horizontal"
                letterSpacing={2}
                className="fuzzy-card-text"
              >
                是否占卜
              </FuzzyText>
            </DecayCard>
            <DecayCard
              width={200}
              height={280}
              image="fortune-hand-2"
              filterId="decay-filter-3"
              seed={7}
              maxDisplacement={260}
              movementBound={28}
              onClick={() => handleSelect('trend')}
            >
              <FuzzyText
                fontSize={24}
                fontWeight={700}
                fontFamily="'Noto Serif SC', 'Inter', sans-serif"
                color="#f3eeff"
                baseIntensity={0.15}
                hoverIntensity={0.5}
                enableHover={true}
                fuzzRange={10}
                fps={60}
                direction="horizontal"
                letterSpacing={2}
                className="fuzzy-card-text"
              >
                未来趋势
              </FuzzyText>
            </DecayCard>
          </div>
        </Suspense>
      </div>
    </>
  )
}
