import { negativeCardNames, positiveCardNames } from './lenormandCards'

const dailyOpeners = [
  '今日的星图把焦点落在',
  '今晚最先发光的讯号来自',
  '此刻浮上台面的牌是',
]

const trendLabels = ['过去', '现在', '未来']

function scoreCard(card) {
  if (card.polarity === 'positive') return 1
  if (card.polarity === 'negative') return -1
  return 0
}

export function getDailyReading(card) {
  const opener = dailyOpeners[card.id % dailyOpeners.length]
  return {
    resultLabel: '今日星讯',
    summary: `${opener}${card.name}。它意味着${card.meaning}今天的主题围绕${card.keywords.join('、')}展开，适合顺着心里的微光行动。`,
    details: [
      `牌面关键词：${card.keywords.join(' / ')}`,
      `今日建议：先关注与“${card.keywords[0]}”相关的人、决定或机会。`,
    ],
  }
}

export function getYesNoReading(question, cards) {
  const baseScore = cards.reduce((total, card) => total + scoreCard(card), 0)
  const extraScore = cards.reduce((total, card) => {
    if (positiveCardNames.includes(card.name)) return total + 0.5
    if (negativeCardNames.includes(card.name)) return total - 0.5
    return total
  }, 0)
  const totalScore = baseScore + extraScore

  let resultLabel = '需要更多观察'
  if (totalScore > 0.5) resultLabel = '偏向 Yes'
  if (totalScore < -0.5) resultLabel = '偏向 No'

  return {
    resultLabel,
    summary: `对于“${question}”，${cards[0].name}与${cards[1].name}共同给出的讯号是“${resultLabel}”。当前局面更受${cards[0].keywords[0]}与${cards[1].keywords[0]}影响。`,
    details: cards.map((card, index) => `第 ${index + 1} 张 ${card.name}：${card.meaning}`),
  }
}

export function getTrendReading(question, cards) {
  return {
    resultLabel: '时间线趋势',
    summary: `关于“${question}”，过去的${cards[0].name}说明此前受${cards[0].keywords[0]}牵引；现在的${cards[1].name}指出你正处在${cards[1].keywords[0]}阶段；未来的${cards[2].name}预示局势会朝着${cards[2].keywords[0]}推进。`,
    details: cards.map((card, index) => `${trendLabels[index]} · ${card.name}：${card.meaning}`),
  }
}

export function createAiPrompt(mode, question, cards, reading) {
  const titleMap = {
    daily: '今日运势',
    yesno: '是 / 否占卜',
    trend: '事件趋势',
  }

  return [
    `请你作为一名擅长雷诺曼解读的占卜顾问，用中文继续深入分析这次“${titleMap[mode]}”结果。`,
    question ? `问题：${question}` : '问题：无，按牌面主题延伸解读。',
    `抽到的牌：${cards.map((card) => `${card.name}（${card.keywords.join('、')}）`).join('、')}`,
    `当前结论：${reading.resultLabel}`,
    `当前摘要：${reading.summary}`,
    '请从整体趋势、需要注意的现实信号、行动建议三个角度展开，不要脱离雷诺曼牌义。',
  ].join('\n')
}

export function createHistoryItem(mode, title, cards, reading, extra = {}) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    mode,
    title,
    cards,
    resultLabel: reading.resultLabel,
    summary: reading.summary,
    createdAt: new Date().toISOString(),
    ...extra,
  }
}
