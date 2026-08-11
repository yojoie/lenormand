import { AnimatePresence, motion } from 'framer-motion'

import Card, { CardBackOnly } from './Card'
import Shuffle from './Shuffle'

function DeckPlaceholder({ shuffling, tone = 'gold' }) {
  return (
    <div className={`deck-placeholder ${shuffling ? 'is-shuffling' : ''}`}>
      {Array.from({ length: 9 }).map((_, index) => {
        const spread = index - 4
        return (
          <motion.div
            key={index}
            className="deck-placeholder__card"
            animate={{
              x: shuffling ? [spread * 8, spread * 34, spread * -26, spread * 6] : spread * 4,
              y: shuffling ? [Math.abs(spread) * 4, -16 + Math.abs(spread) * 3, 12 + Math.abs(spread) * 2, Math.abs(spread) * 2] : Math.abs(spread) * 2,
              rotate: shuffling ? [spread * 2, spread * 12, spread * -10, spread * 2] : spread * 2,
              scale: shuffling ? [1, 1.04, 0.98, 1] : 1,
            }}
            transition={{
              duration: shuffling ? 1.2 : 0.75,
              ease: [0.4, 0, 0.2, 1],
              repeat: shuffling ? Number.POSITIVE_INFINITY : 0,
              delay: shuffling ? index * 0.04 : 0,
            }}
          >
            <CardBackOnly tone={tone} />
          </motion.div>
        )
      })}
    </div>
  )
}

export default function CardDeck({
  cards = [],
  shuffling = false,
  flippedCount = 0,
  layout = 'single',
  labels = [],
  pendingCards = [],
  onSelectPendingCard,
  drawText = '点击任意一张牌进行抽取',
  hintText = '',
  autoDrawText = '',
  selectedGoal = 1,
  onLastCardFlipped,
}) {
  const showManualSpread = pendingCards.length > 0 && typeof onSelectPendingCard === 'function'
  const showAutoReveal = cards.length > 0 && !showManualSpread

  if (!cards.length && !showManualSpread) {
    const isAutoMode = typeof onSelectPendingCard !== 'function'
    if (isAutoMode) {
      const shuffleStyle = { fontSize: '20px', color: 'rgba(255, 255, 255, 0.84)', lineHeight: '1.3', fontFamily: "'Noto Serif SC', 'Cinzel', serif" }
      return (
        <div className="auto-draw-placeholder">
          {autoDrawText ? (
            <div className="auto-draw-placeholder__text">
              {autoDrawText.split('\n').map((line, i) => (
                <Shuffle
                  key={i}
                  text={line}
                  shuffleDirection="right"
                  duration={1}
                  stagger={0.03}
                  triggerOnce={true}
                  triggerOnHover={false}
                  style={shuffleStyle}
                />
              ))}
            </div>
          ) : null}
          <DeckPlaceholder shuffling={shuffling} />
        </div>
      )
    }
    return <DeckPlaceholder shuffling={shuffling} />
  }

  if (showManualSpread) {
    return (
      <div className="manual-draw-stage">
        <div className="manual-selected">
          <div className="manual-spread__header">
            {drawText ? <p>{drawText}</p> : <span aria-hidden="true" />}
            <span>
              已选择 {cards.length} / {selectedGoal} · 牌阵剩余 {pendingCards.length} 张
            </span>
          </div>

          <div className={`card-layout card-layout--${layout} card-layout--selected`}>
            <AnimatePresence mode="popLayout">
              {cards.length ? (
                cards.map((card, index) => (
                  <motion.div
                    key={`selected-${card.id}-${index}`}
                    layoutId={`manual-card-${card.id}`}
                    className="manual-selected__card"
                    initial={{ opacity: 0, y: 120, scale: 0.88 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -80, scale: 0.9 }}
                    transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Card
                      card={card}
                      flipped={flippedCount > index}
                      label={labels[index]}
                      delay={index * 0.12}
                      onAnimationComplete={flippedCount > index && index === cards.length - 1 ? onLastCardFlipped : undefined}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  key="manual-placeholder"
                  className="manual-draw-stage__placeholder"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Shuffle
                    text="整副 36 张牌已经洗好"
                    shuffleDirection="right"
                    duration={1}
                    stagger={0.03}
                    triggerOnce={true}
                    triggerOnHover={false}
                    style={{ fontSize: '17px', color: 'rgba(255, 255, 255, 0.84)', lineHeight: '1.8', fontFamily: "'Noto Serif SC', 'Cinzel', serif" }}
                  />
                  <Shuffle
                    text="从下方横向牌列中选中你最有感应的那一张"
                    shuffleDirection="right"
                    duration={1}
                    stagger={0.03}
                    triggerOnce={true}
                    triggerOnHover={false}
                    style={{ fontSize: '17px', color: 'rgba(255, 255, 255, 0.84)', lineHeight: '1.8', fontFamily: "'Noto Serif SC', 'Cinzel', serif" }}
                  />
                  {hintText ? (
                    hintText.split('\n').map((line, i) => (
                      <Shuffle
                        key={i}
                        text={line}
                        shuffleDirection="right"
                        duration={1}
                        stagger={0.03}
                        triggerOnce={true}
                        triggerOnHover={false}
                        style={{ fontSize: '17px', color: 'rgba(255, 255, 255, 0.84)', lineHeight: '1.8', fontFamily: "'Noto Serif SC', 'Cinzel', serif" }}
                      />
                    ))
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="manual-spread manual-spread--rail">
          <div className="manual-rail__track">
            <AnimatePresence mode="popLayout">
              {pendingCards.map((card, index) => (
                <motion.button
                  key={`pending-${card.id}`}
                  type="button"
                  layoutId={`manual-card-${card.id}`}
                  className="manual-spread__card manual-spread__card--rail"
                  onClick={() => onSelectPendingCard(card.id)}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -3 : 3 }}
                  exit={{ opacity: 0, y: -140, scale: 0.86, rotate: 0 }}
                  whileHover={{ y: -22, x: index % 2 === 0 ? 5 : -5, rotate: 0, scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.01, 0.18) }}
                >
                  <CardBackOnly className="manual-spread__card-back" />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`auto-draw-stage auto-draw-stage--${layout}`}>
      <motion.div
        className="auto-draw-stage__deck"
        initial={false}
        animate={{
          opacity: showAutoReveal ? 0.76 : 1,
          scale: showAutoReveal ? 0.9 : 1,
          y: showAutoReveal ? 26 : 0,
        }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <DeckPlaceholder shuffling={shuffling} tone={showAutoReveal ? 'silver' : 'gold'} />
      </motion.div>

      <div className={`card-layout card-layout--${layout} auto-draw-stage__cards`}>
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => (
            <motion.div
              key={`${card.id}-${index}`}
              className="auto-draw-card"
              initial={{
                opacity: 0,
                y: 26,
                scale: 0.36,
                rotate: index % 2 === 0 ? -16 : 16,
                filter: 'blur(4px)',
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: 0,
                filter: 'blur(0px)',
              }}
              exit={{ opacity: 0, y: -100, scale: 0.88 }}
              transition={{
                duration: 0.92,
                ease: [0.16, 1, 0.3, 1],
                delay: index * 0.22,
              }}
            >
              <Card
                card={card}
                flipped={flippedCount > index}
                label={labels[index]}
                delay={index * 0.12}
                onAnimationComplete={flippedCount > index && index === cards.length - 1 ? onLastCardFlipped : undefined}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
