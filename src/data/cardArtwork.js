const basePrompt = 'vintage lenormand oracle card illustration, victorian watercolor and ink, midnight blue celestial atmosphere, luminous stardust, subtle nebula flow, antique storybook realism, centered composition, highly detailed, no text, no border'

const cardScenes = {
  骑手: 'a lone rider on horseback arriving across open land beneath stars',
  三叶草: 'a clover with dew and tiny lights in moonlit grass',
  船: 'an old sailing ship on a moonlit sea with soft glowing waves',
  房子: 'a warm cottage house with garden and light in the windows under a night sky',
  树: 'an ancient tree with deep roots and faint constellations around the branches',
  云: 'rolling storm clouds parting across a dim celestial sky',
  蛇: 'a winding serpent coiled among flowers and dark leaves',
  棺材: 'an antique coffin surrounded by fading roses and mist',
  花束: 'a fresh bouquet of garden flowers tied with ribbon and golden dust',
  镰刀: 'a sharp harvest scythe lit by moonlight above field mist',
  鞭子: 'a ceremonial whip crossed with a wand in swirling tension',
  鸟: 'two small birds perched together amid restless air and branches',
  孩子: 'a young child with a hoop in a dreamy moonlit garden',
  狐狸: 'a clever fox standing alert in tall grass under stars',
  熊: 'a powerful bear in shadowed forest with warm golden haze',
  星星: 'a radiant field of stars and constellations reflecting on water',
  鹳: 'a white stork in flight carrying the feeling of change and dawn',
  狗: 'a loyal dog sitting calmly by a lantern in the night',
  塔: 'a tall stone tower rising alone into a dark luminous sky',
  花园: 'an elegant garden path with statues, hedges, and soft evening lights',
  山: 'a steep mountain ridge under cold stars and drifting mist',
  十字路口: 'a crossroads with signposts and diverging moonlit roads',
  老鼠: 'small mice nibbling through grain and fabric in dim light',
  心: 'an anatomical heart adorned with roses and gentle celestial glow',
  戒指: 'an ornate golden ring floating above velvet and light trails',
  书: 'an old mysterious book half-open with hidden light within',
  信: 'a sealed handwritten letter with wax and soft candle glow',
  男人: 'a refined gentleman portrait in antique storybook style',
  女人: 'an elegant lady portrait in antique storybook style',
  百合: 'white lilies arranged in calm luminous air with a serene background',
  太阳: 'a glowing vintage sun symbol over warm radiant clouds',
  月亮: 'a crescent moon over deep blue night and soft mist',
  钥匙: 'an ornate old key suspended in golden stardust',
  锚: 'a heavy anchor resting near dark sea foam and starlight',
  十字架: 'an aged cross in solemn light with drifting incense haze',
  鱼: 'two luminous fish swimming through dark blue currents and sparkle',
}

export function getCardArtworkUrl(card) {
  const subject = cardScenes[card.name] ?? `${card.nameEn} lenormand symbol in antique celestial illustration`
  const prompt = `${basePrompt}, ${subject}`
  return `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=portrait_16_9`
}
