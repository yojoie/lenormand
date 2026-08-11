import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'

import ClickSpark from './components/ClickSpark'
import CloudEffect from './components/CloudEffect'
import StarryBackground from './components/StarryBackground'
import DailyLuck from './pages/DailyLuck'
import Home from './pages/Home'
import Trend from './pages/Trend'
import YesNo from './pages/YesNo'

const modeMap = {
  home: Home,
  daily: DailyLuck,
  yesno: YesNo,
  trend: Trend,
}

export default function App() {
  const [mode, setMode] = useState('home')

  const CurrentPage = useMemo(() => modeMap[mode], [mode])

  return (
    <main className="app-shell">
      <StarryBackground />
      <CloudEffect />
      <div className="app-shell__overlay" />

      <ClickSpark
        sparkColor="rgba(124, 58, 237, 0.8)"
        sparkSize={12}
        sparkRadius={20}
        sparkCount={8}
        duration={500}
        extraScale={1.2}
      >
        <div className="app-shell__content">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <CurrentPage
                onSelect={setMode}
                onBack={() => setMode('home')}
                onSave={() => { }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </ClickSpark>
    </main>
  )
}
