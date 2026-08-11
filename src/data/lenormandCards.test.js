import { describe, expect, it } from 'vitest'

import { lenormandCards } from './lenormandCards'

describe('lenormandCards', () => {
  it('包含完整 36 张牌', () => {
    expect(lenormandCards).toHaveLength(36)
    expect(lenormandCards.some((card) => card.name === '鱼')).toBe(true)
  })

  it('每张牌都包含必要字段', () => {
    lenormandCards.forEach((card) => {
      expect(card.id).toBeTypeOf('number')
      expect(card.name).toBeTypeOf('string')
      expect(card.nameEn).toBeTypeOf('string')
      expect(Array.isArray(card.keywords)).toBe(true)
      expect(card.meaning).toBeTypeOf('string')
      expect(card.symbol).toBeTypeOf('string')
      expect(card.polarity).toMatch(/positive|neutral|negative/)
      expect(card.playingCard).toBeTypeOf('string')
    })
  })
})
