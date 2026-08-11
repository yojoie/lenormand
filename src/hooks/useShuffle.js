import { useCallback, useEffect, useRef, useState } from 'react'

export function shuffleDeck(cards) {
  const deck = [...cards]
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
      ;[deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]]
  }
  return deck
}

export function useShuffle(sourceCards, duration = 1500) {
  const [shuffling, setShuffling] = useState(false)
  const timerRef = useRef(null)

  const cancelShuffle = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setShuffling(false)
  }, [])

  const startShuffle = useCallback(
    (count = sourceCards.length, onComplete) => {
      cancelShuffle()
      setShuffling(true)

      timerRef.current = window.setTimeout(() => {
        const nextCards = shuffleDeck(sourceCards).slice(0, count)
        setShuffling(false)
        onComplete(nextCards)
      }, duration)
    },
    [cancelShuffle, duration, sourceCards],
  )

  useEffect(() => cancelShuffle, [cancelShuffle])

  return {
    shuffling,
    startShuffle,
    cancelShuffle,
  }
}
