import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import Home from './Home'

describe('Home', () => {
  it('展示三个功能入口并支持点击', async () => {
    vi.useFakeTimers()
    const onSelect = vi.fn()

    render(<Home onSelect={onSelect} />)

    fireEvent.click(screen.getByRole('button', { name: /今日运势/i }))
    vi.advanceTimersByTime(1700)
    expect(onSelect).toHaveBeenCalledWith('daily')
    expect(screen.getByRole('button', { name: /是 \/ 否占卜/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /未来趋势/i })).toBeInTheDocument()
    vi.useRealTimers()
  })
})
