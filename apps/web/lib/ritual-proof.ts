export interface RitualRecapInput {
  clubName: string
  crewCount: number
  shipTarget: string
  shipped: string
}

export function slugifyVibeclub(value: string): string {
  const base = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32)

  return base || 'new-vibeclub'
}

export function buildDeterministicRecap(input: RitualRecapInput): string {
  const clubName = input.clubName.trim() || 'New Vibeclub'
  const shipTarget = input.shipTarget.trim() || 'move one piece of work'
  const shipped = input.shipped.trim() || 'one visible artifact'
  const crew = input.crewCount === 1 ? '1 person' : `${input.crewCount} people`
  return `${clubName}: ${crew} locked in to ${shipTarget}. Shipped: ${shipped}.`
}
