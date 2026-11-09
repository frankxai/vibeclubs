# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> landing smoke >> local ritual stays on recap after a manual focus skip
- Location: apps/web/tests/e2e/smoke.spec.ts:10:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:3000/", waiting until "domcontentloaded"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  |
  3  | test.describe('landing smoke', () => {
  4  |   test('landing renders hero + nav', async ({ page }) => {
  5  |     await page.goto('/', { waitUntil: 'domcontentloaded' })
  6  |     await expect(page.getByRole('heading', { level: 1 })).toContainText(/Lock in together/i)
  7  |     await expect(page.getByRole('link', { name: /Try the proof/i }).first()).toBeVisible()
  8  |   })
  9  |
  10 |   test('local ritual stays on recap after a manual focus skip', async ({ page }) => {
> 11 |     await page.goto('/', { waitUntil: 'domcontentloaded' })
     |                ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  12 |     await page.getByRole('button', { name: /Create local invite/i }).click()
  13 |     await page.getByRole('button', { name: /Start 6-second focus/i }).click()
  14 |     await page.getByRole('button', { name: /Move to ship checkpoint/i }).click()
  15 |     await page
  16 |       .getByPlaceholder(/A link, artifact, decision, or concrete change/i)
  17 |       .fill('A verified recap flow')
  18 |     await page.getByRole('button', { name: /Create local recap/i }).click()
  19 |
  20 |     await expect(page.getByRole('heading', { name: /Keep the proof/i })).toBeVisible()
  21 |     await page.waitForTimeout(7_000)
  22 |     await expect(page.getByRole('heading', { name: /Keep the proof/i })).toBeVisible()
  23 |     await expect(page.getByRole('img', { name: /Recap card for Ship Night/i })).toBeVisible()
  24 |   })
  25 |
  26 |   test('nav links reach primary surfaces', async ({ page }) => {
  27 |     await page.goto('/', { waitUntil: 'domcontentloaded' })
  28 |     await page.getByRole('link', { name: 'Find' }).first().click()
  29 |     await expect(page).toHaveURL(/\/explore$/)
  30 |     await expect(page.getByRole('heading', { level: 1 })).toContainText(/Find a vibeclub/)
  31 |   })
  32 |
  33 |   test('start page renders the template picker', async ({ page }) => {
  34 |     await page.goto('/start', { waitUntil: 'domcontentloaded' })
  35 |     await expect(page.getByRole('heading', { level: 1 })).toContainText(/Host a vibeclub/)
  36 |     await expect(page.getByRole('button', { name: /Vibe coding/ })).toBeVisible()
  37 |     await expect(page.getByRole('button', { name: 'Download host pack' })).toBeEnabled()
  38 |   })
  39 |
  40 |   test('signin renders magic-link form', async ({ page }) => {
  41 |     await page.goto('/signin', { waitUntil: 'domcontentloaded' })
  42 |     await expect(page.getByPlaceholder('you@crew.rocks')).toBeVisible()
  43 |   })
  44 |
  45 |   test('playbook index renders four entries', async ({ page }) => {
  46 |     await page.goto('/playbook', { waitUntil: 'domcontentloaded' })
  47 |     await expect(page.getByText("What's a vibeclub?")).toBeVisible()
  48 |     await expect(page.getByText('The recap', { exact: true })).toBeVisible()
  49 |   })
  50 |
  51 |   test('og endpoint returns 200', async ({ request }) => {
  52 |     const resp = await request.get('/api/og')
  53 |     expect(resp.status()).toBe(200)
  54 |     expect(resp.headers()['content-type']).toContain('image/png')
  55 |   })
  56 | })
  57 |
```