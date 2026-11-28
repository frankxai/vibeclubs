import { expect, test } from 'vitest'
import { GET } from '../app/agents.md/route'
import doc from '../public/.well-known/agent.json'

test('/agents.md returns markdown AX contract with canonical discovery links', async () => {
  const res = GET()
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toContain('text/markdown; charset=utf-8')

  const body = await res.text()
  expect(body).toContain('https://vibeclubs.ai/llms.txt')
  expect(body).toContain('https://vibeclubs.ai/.well-known/agent.json')
  expect(body).toContain('https://vibeclubs.ai/playbook')
  expect(body).toContain('https://vibeclubs.ai/explore')
})

test('public/.well-known/agent.json matches canonical discovery contract', () => {
  expect(doc.schema).toBe('starlight.agent.v1')
  expect(doc.canonical).toBe('https://vibeclubs.ai')
  expect(doc.discovery.agentsMd).toBe('https://vibeclubs.ai/agents.md')
  expect(doc.discovery.llmsTxt).toBe('https://vibeclubs.ai/llms.txt')
  expect(doc.license).toBe('MIT')
})
