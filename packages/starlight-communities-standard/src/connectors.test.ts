import { describe, expect, it } from 'vitest'
import {
  connectorsForEcosystem,
  evaluateConnectorReadiness,
  evaluateWorkflowReadiness,
  STARLIGHT_CONNECTORS,
  STARLIGHT_WORKFLOWS,
  workflowsForEcosystem,
  type ConnectorBlueprint,
  type WorkflowBlueprint,
} from './connectors'

describe('starlight connector and workflow registry', () => {
  it('keeps all registry connectors consented, exportable, and review gated', () => {
    for (const connector of STARLIGHT_CONNECTORS) {
      expect(evaluateConnectorReadiness(connector), connector.id).toMatchObject({
        ok: true,
        score: 100,
      })
    }
  })

  it('fails broad unsafe connectors', () => {
    const unsafe: ConnectorBlueprint = {
      id: 'unsafe',
      label: 'Unsafe',
      ecosystem: 'web4',
      mode: 'agent_tool',
      priority: 'later',
      purpose: 'Bad example',
      minimumScopes: ['*'],
      consentBoundary: '',
      exportMapping: [],
      supportedRisks: ['read', 'write', 'admin'],
      reviewRequiredFor: [],
    }

    const report = evaluateConnectorReadiness(unsafe)
    expect(report.ok).toBe(false)
    expect(report.issues).toEqual(
      expect.arrayContaining([
        'Missing consent boundary.',
        'Missing export mapping.',
        'Connector scopes are too broad.',
        'Dangerous actions missing review gates: write, admin.',
      ]),
    )
  })

  it('routes connectors and workflows by ecosystem layer', () => {
    expect(connectorsForEcosystem('web2').map((connector) => connector.id)).toEqual(
      expect.arrayContaining(['discord-activity', 'slack-workflow']),
    )
    expect(connectorsForEcosystem('web3').map((connector) => connector.id)).toEqual(
      expect.arrayContaining(['farcaster-mini-app', 'snapshot-governance']),
    )
    expect(connectorsForEcosystem('web4').map((connector) => connector.id)).toEqual(
      expect.arrayContaining(['mcp-agent-connectors', 'sovereign-export-api']),
    )
    expect(workflowsForEcosystem('web4').map((workflow) => workflow.id)).toEqual(
      expect.arrayContaining(['agent-scout-to-draft', 'export-to-protocol-adapter']),
    )
  })

  it('keeps every workflow tied to consent, approval, and export records', () => {
    for (const workflow of STARLIGHT_WORKFLOWS) {
      expect(evaluateWorkflowReadiness(workflow), workflow.id).toMatchObject({
        ok: true,
        score: 100,
      })
    }
  })

  it('fails workflows without consent, approval, artifacts, and exportability', () => {
    const unsafe: WorkflowBlueprint = {
      id: 'unsafe-workflow',
      label: 'Unsafe Workflow',
      ecosystems: ['web4'],
      trigger: '',
      steps: [],
      produces: [],
      consentCheckpoints: [],
      humanApprovalBefore: [],
      exportRecords: [],
    }

    const report = evaluateWorkflowReadiness(unsafe)
    expect(report.ok).toBe(false)
    expect(report.issues).toEqual(
      expect.arrayContaining([
        'Missing workflow trigger.',
        'Missing workflow steps.',
        'Missing produced artifacts.',
        'Missing consent checkpoints.',
        'Missing human approval boundaries.',
        'Missing export records.',
      ]),
    )
  })
})
