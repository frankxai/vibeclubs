import { test, expect } from '@playwright/test'

test.describe('landing smoke', () => {
  test('landing renders hero + nav', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Host a\s*vibeclub/i)
    await expect(page.getByRole('link', { name: /Host a vibeclub/i }).first()).toBeVisible()
  })

  test('nav links reach primary surfaces', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Find' }).first().click()
    await expect(page).toHaveURL(/\/explore$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Find a vibeclub/)
  })

  test('start page renders the template picker', async ({ page }) => {
    await page.goto('/start')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Host a vibeclub/)
    await expect(page.getByText('Claude Code vibeclub')).toBeVisible()
  })

  test('signin renders magic-link form', async ({ page }) => {
    await page.goto('/signin')
    await expect(page.getByPlaceholder('you@crew.rocks')).toBeVisible()
  })

  test('playbook index renders four entries', async ({ page }) => {
    await page.goto('/playbook')
    await expect(page.getByText("What's a vibeclub?")).toBeVisible()
    await expect(page.getByText('The recap')).toBeVisible()
  })

  test('og endpoint returns 200', async ({ request }) => {
    const resp = await request.get('/api/og')
    expect(resp.status()).toBe(200)
    expect(resp.headers()['content-type']).toContain('image/png')
  })
})
