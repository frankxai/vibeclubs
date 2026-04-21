import { describe, expect, it } from 'vitest'
import { renderSessionCardSVG } from './index'

describe('renderSessionCardSVG', () => {
  const baseData = {
    clubName: 'lofi-coders',
    handle: '@frankx',
    durationMinutes: 90,
    pomodoroCycles: 3,
    platform: 'discord',
    date: new Date('2026-04-21T10:00:00Z'),
  }

  it('produces 1200x630 SVG', () => {
    const svg = renderSessionCardSVG(baseData)
    expect(svg).toContain('width="1200"')
    expect(svg).toContain('height="630"')
  })

  it('embeds the club name', () => {
    const svg = renderSessionCardSVG(baseData)
    expect(svg).toContain('lofi-coders')
  })

  it('escapes XML in user-provided text', () => {
    const svg = renderSessionCardSVG({ ...baseData, clubName: '<script>evil</script>' })
    expect(svg).not.toContain('<script>evil')
    expect(svg).toContain('&lt;script&gt;evil&lt;/script&gt;')
  })

  it('pretty-prints platform names', () => {
    const svg = renderSessionCardSVG({ ...baseData, platform: 'in_person' })
    expect(svg).toContain('IRL')
  })

  it('renders the session card brand wordmark', () => {
    const svg = renderSessionCardSVG(baseData)
    expect(svg).toContain('Vibeclubs')
    expect(svg).toContain('vibeclubs.ai')
  })
})
