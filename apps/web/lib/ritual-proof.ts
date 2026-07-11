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
  const crew = input.crewCount === 1 ? '1 person' : `${input.crewCount} people`
  return `${input.clubName}: ${crew} locked in to ${input.shipTarget}. Shipped: ${input.shipped}.`
}
