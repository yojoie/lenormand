import { ArrowLeft, RotateCcw } from 'lucide-react'
import SpecularButton from './SpecularButton'
import TrueFocus from './TrueFocus'

export default function ReadingLayout({ title, subtitle, onBack, onReset, children }) {
  return (
    <section className="reading-page">
      <header className="reading-page__header">
        <div className="reading-page__intro">
          <p className="eyebrow">LENORMAND JOURNEY</p>
          <TrueFocus
            sentence={title}
            separator=""
            manualMode={false}
            blurAmount={4}
            borderColor="#a78bfa"
            glowColor="rgba(167, 139, 250, 0.6)"
            animationDuration={0.6}
            pauseBetweenAnimations={0.8}
          />
          <p className="reading-page__subtitle">{subtitle}</p>
        </div>

        <div className="reading-page__actions">
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
            onClick={onBack}
          >
            <ArrowLeft size={14} style={{ marginRight: 6 }} />
            返回首页
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
            onClick={onReset}
          >
            <RotateCcw size={14} style={{ marginRight: 6 }} />
            重新开始
          </SpecularButton>
        </div>
      </header>

      <div className="reading-page__body">{children}</div>
    </section>
  )
}
