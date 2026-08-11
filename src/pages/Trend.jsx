import { useEffect, useRef, useState } from 'react'

import CardDeck from '../components/CardDeck'
import GlitchText from '../components/GlitchText'
import StrokeText from '../components/StrokeText'
import TextLoop from '../components/TextLoop'
import ReadingLayout from '../components/ReadingLayout'
import SpecularButton from '../components/SpecularButton'
import WarpText from '../components/WarpText'
import { createAiPrompt, createHistoryItem, getTrendReading } from '../data/interpretations'
import { lenormandCards } from '../data/lenormandCards'
import { useShuffle } from '../hooks/useShuffle'

export default function Trend({ onBack, onSave }) {
  const { shuffling, startShuffle } = useShuffle(lenormandCards)
  const [question, setQuestion] = useState('')
  const [drawMode, setDrawMode] = useState('')
  const [step, setStep] = useState('intro')
  const [cards, setCards] = useState([])
  const [pendingCards, setPendingCards] = useState([])
  const [flippedCount, setFlippedCount] = useState(0)
  const [reading, setReading] = useState(null)
  const [copyMessage, setCopyMessage] = useState('')
  const timersRef = useRef([])
  const resultPendingRef = useRef(false)

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current = []
  }

  const scheduleTimer = (callback, delay) => {
    const timer = window.setTimeout(callback, delay)
    timersRef.current.push(timer)
    return timer
  }

  const finishReading = (nextCards) => {
    resultPendingRef.current = false
    const nextReading = getTrendReading(question.trim(), nextCards)
    setCards(nextCards)
    setPendingCards([])
    setReading(nextReading)
    setStep('result')
    onSave(createHistoryItem('trend', '事件趋势', nextCards, nextReading, { question: question.trim() }))
  }

  const resetReading = () => {
    clearTimers()
    resultPendingRef.current = false
    setDrawMode('')
    setStep('intro')
    setCards([])
    setPendingCards([])
    setFlippedCount(0)
    setReading(null)
    setCopyMessage('')
  }

  const handleLastCardFlipped = () => {
    if (!resultPendingRef.current || cards.length !== 3) return
    const nextCards = [...cards]
    resultPendingRef.current = false
    scheduleTimer(() => finishReading(nextCards), 800)
  }

  const revealAutoCards = (nextCards) => {
    clearTimers()
    resultPendingRef.current = true
    setCards(nextCards)
    nextCards.forEach((_, index) => {
      scheduleTimer(() => setFlippedCount(index + 1), 540 + index * 340)
    })
  }

  const startReading = (nextMode = drawMode) => {
    if (!question.trim()) return
    resetReading()
    setDrawMode(nextMode)
    setStep('draw')

    startShuffle(nextMode === 'manual' ? lenormandCards.length : 3, (nextCards) => {
      if (nextMode === 'manual') {
        setPendingCards(nextCards)
        return
      }
      revealAutoCards(nextCards)
    })
  }

  const drawNextCard = (cardId) => {
    if (!pendingCards.length || cards.length >= 3) return
    const drawnCard = pendingCards.find((card) => card.id === cardId)
    if (!drawnCard) return
    const nextPending = pendingCards.filter((card) => card.id !== cardId)
    const nextCards = [...cards, drawnCard]
    setPendingCards(nextPending)
    setCards(nextCards)

    if (nextCards.length === 3) {
      clearTimers()
      resultPendingRef.current = true
    }
  }

  const copyPrompt = async () => {
    if (!reading) return
    const prompt = createAiPrompt('trend', question.trim(), cards, reading)
    await navigator.clipboard.writeText(prompt)
    setCopyMessage('提示词已复制')
    window.setTimeout(() => setCopyMessage(''), 1800)
  }

  useEffect(() => {
    if (!cards.length || drawMode !== 'manual') return undefined
    const timer = window.setTimeout(() => setFlippedCount(cards.length), 260)
    return () => window.clearTimeout(timer)
  }, [cards, drawMode])

  useEffect(() => () => clearTimers(), [])

  return (
    <ReadingLayout
      title="事件趋势"
      subtitle="过去、现在、未来并不总是线性的答案，它们更像同一片星图里逐渐连成的轨迹。"
      onBack={onBack}
      onReset={resetReading}
    >
      {step === 'intro' ? (
        <section className="flow-screen flow-screen--center flow-screen--question flow-screen--intro-panel">
          <div className="flow-screen__content flow-screen__content--wide">
            <div className="flow-screen__intro flow-screen__intro--form">
              <p className="flow-screen__eyebrow">Timeline Reading</p>
              <GlitchText
                speed={1}
                enableShadows={true}
                enableOnHover={false}
                className="flow-screen__headline"
              >
                确定你要观察的事件
              </GlitchText>
              <p className="flow-screen__intro-copy">
                过去、现在、未来将围绕同一个主题展开。
              </p>
              <label className="field field--intro">
                <span>你想观察的事件问题</span>
                <textarea
                  maxLength={120}
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="例如：我和她接下来三个月的整体趋势会怎么走？"
                />
              </label>
              <div className="flow-screen__choice">
                <StrokeText
                  text="选择抽牌方式"
                  strokeColor="#a78bfa"
                  fillColor="#f8fafc"
                  strokeWidth={1.2}
                  drawDuration={1.4}
                  fillDelay={0.2}
                  stagger={0.08}
                  ease="power2.out"
                  trigger="mount"
                  fillMode="wipe"
                  fontSize={32}
                  fontWeight={600}
                  letterSpacing={2}
                  className="stroke-text--choice"
                />
                <div className="mode-switch">
                  <SpecularButton
                    size="sm"
                    radius={14}
                    lineColor="#7c3aed"
                    baseColor="#4b2878"
                    tint="#1a1032"
                    tintOpacity={0.3}
                    textColor="#e8e4f0"
                    shineSize={8}
                    shineFade={30}
                    thickness={1}
                    intensity={0.8}
                    speed={0.3}
                    proximity={200}
                    disabled={!question.trim()}
                    onClick={() => startReading('auto')}
                  >
                    <WarpText
                      text="自动抽取"
                      color={drawMode === 'auto' ? '#93c5fd' : '#e8e4f0'}
                      fontSize="14px"
                      fontWeight={700}
                      letterSpacing="0.05em"
                      className="warp-text--button"
                      style={{ height: '18px', minHeight: '0' }}
                      animate={false}
                    />
                  </SpecularButton>
                  <SpecularButton
                    size="sm"
                    radius={14}
                    lineColor="#7c3aed"
                    baseColor="#4b2878"
                    tint="#1a1032"
                    tintOpacity={0.3}
                    textColor="#e8e4f0"
                    shineSize={8}
                    shineFade={30}
                    thickness={1}
                    intensity={0.8}
                    speed={0.3}
                    proximity={200}
                    disabled={!question.trim()}
                    onClick={() => startReading('manual')}
                  >
                    <WarpText
                      text="手动抽取"
                      color={drawMode === 'manual' ? '#d8b4fe' : '#e8e4f0'}
                      fontSize="14px"
                      fontWeight={700}
                      letterSpacing="0.05em"
                      className="warp-text--button"
                      style={{ height: '18px', minHeight: '0' }}
                      animate={false}
                    />
                  </SpecularButton>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {step === 'draw' ? (
        <section className={`flow-screen ${drawMode === 'manual' ? 'flow-screen--draw' : 'flow-screen--draw-auto'}`}>
          <div className="flow-screen__content">
            <p className="flow-screen__lead">
              {drawMode === 'manual'
                ? ''
                : ''}
            </p>
          </div>
          <div className={`draw-stage ${drawMode === 'manual' ? 'draw-stage--full' : ''}`}>
            <CardDeck
              cards={cards}
              shuffling={shuffling}
              flippedCount={flippedCount}
              layout="timeline"
              labels={['过去', '现在', '未来']}
              pendingCards={pendingCards}
              onSelectPendingCard={drawMode === 'manual' ? drawNextCard : undefined}
              drawText=""
              hintText="依次选牌，构成过去、现在、未来"
              autoDrawText={"时间线正在展开\n请等待三张牌依次落下"}
              selectedGoal={3}
              onLastCardFlipped={handleLastCardFlipped}
            />
          </div>
        </section>
      ) : null}

      {step === 'result' && reading ? (
        <section className="flow-screen flow-screen--result flow-screen--trend-result">
          <div className="result-stack result-stack--timeline">
            <div className="result-stack__cards">
              <CardDeck cards={cards} shuffling={false} flippedCount={flippedCount} layout="timeline" labels={['过去', '现在', '未来']} />
            </div>
            <div className="result-stack__content">
              <p className="eyebrow">Timeline Summary</p>
              <GlitchText
                speed={1}
                enableShadows={true}
                enableOnHover={false}
                className="result-stack__headline"
              >
                {reading.resultLabel}
              </GlitchText>
              <p className="result-stack__summary">{reading.summary}</p>
              <div className="result-stack__details">
                {reading.details.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
              <div className="result-panel__actions">
                <button type="button" className="text-loop--action" onClick={copyPrompt}>
                  <TextLoop
                    text="复制提示词到 AI"
                    shape="wave"
                    speed={90}
                    direction="forward"
                    separator="✦"
                    curviness={70}
                    fontSize={46}
                    fontWeight={700}
                    letterSpacing={2}
                    uppercase={false}
                    color="#e8e4f0"
                    ribbon
                    ribbonColor="#3b1f6b"
                    ribbonWidth={70}
                    pauseOnHover
                  />
                </button>
                {copyMessage ? <span className="copy-message">{copyMessage}</span> : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </ReadingLayout>
  )
}
