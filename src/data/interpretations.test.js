import { describe, expect, it } from 'vitest'

import { createAiPrompt, getDailyReading, getTrendReading, getYesNoReading } from './interpretations'

const sun = { id: 31, name: '太阳', nameEn: 'Sun', keywords: ['成功'], meaning: '非常积极。', symbol: '☼', polarity: 'positive', playingCard: 'A♦' }
const coffin = { id: 8, name: '棺材', nameEn: 'Coffin', keywords: ['结束'], meaning: '阶段结束。', symbol: '✝', polarity: 'negative', playingCard: '9♦' }
const stars = { id: 16, name: '星星', nameEn: 'Stars', keywords: ['希望'], meaning: '方向清晰。', symbol: '✦', polarity: 'positive', playingCard: '6♥' }

describe('interpretations', () => {
  it('能够生成今日运势解读', () => {
    const reading = getDailyReading(sun)
    expect(reading.resultLabel).toBe('今日星讯')
    expect(reading.summary).toContain('太阳')
  })

  it('能够判断是 / 否结果', () => {
    const yesReading = getYesNoReading('我适合主动推进吗？', [sun, stars])
    const noReading = getYesNoReading('我适合继续投入吗？', [coffin, coffin])

    expect(yesReading.resultLabel).toBe('偏向 Yes')
    expect(noReading.resultLabel).toBe('偏向 No')
  })

  it('能够生成趋势解读和 AI 提示词', () => {
    const trend = getTrendReading('这个项目接下来会怎么走？', [sun, stars, coffin])
    const prompt = createAiPrompt('trend', '这个项目接下来会怎么走？', [sun, stars, coffin], trend)

    expect(trend.details).toHaveLength(3)
    expect(prompt).toContain('这个项目接下来会怎么走？')
  })
})
