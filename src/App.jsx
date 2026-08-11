import { AnimatePresence, motion } from 'framer-motion'
import { Suspense, lazy, useMemo, useState } from 'react'

import ClickSpark from './components/ClickSpark'
import CloudEffect from './components/CloudEffect'
import StarryBackground from './components/StarryBackground'
import Home from './pages/Home'
// Lazy load non-home pages to reduce initial bundle size
const DailyLuck = lazy(() => import('./pages/DailyLuck'))
const YesNo = lazy(() => import('./pages/YesNo'))
const Trend = lazy(() => import('./pages/Trend'))

const modeMap = {
  home: Home,
  daily: DailyLuck,
  yesno: YesNo,
  trend: Trend,
}

const PageFallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <span style={{ color: 'rgba(196,181,253,0.6)', fontFamily: "'Noto Serif SC', serif", fontSize: '18px' }}>加载中…</span>
  </div>
)

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
              <Suspense fallback={<PageFallback />}>
                <CurrentPage
                  onSelect={setMode}
                  onBack={() => setMode('home')}
                  onSave={() => { }}
                />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </ClickSpark>
    </main>
  )
}
