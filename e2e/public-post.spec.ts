import { test, expect } from '@playwright/test'

// Verifies the SSG public render path using the post seeded before the build
// (scripts/seed-e2e-user.mjs). Skips unless that seed ran (CI local-Supabase job).
const seeded = process.env.E2E_ADMIN_EMAIL

test.describe('public SSG post', () => {
  test.skip(
    !seeded,
    'requires the seeded published post (local-Supabase CI job)',
  )

  test('renders the seeded post at its slug', async ({ page }) => {
    await page.goto('blog/e2e-welcome')
    await expect(
      page.getByRole('heading', { name: 'E2E Welcome' }),
    ).toBeVisible()
    await expect(page.getByText('Welcome from the e2e suite.')).toBeVisible()
  })

  test('lists the seeded post on the blog index', async ({ page }) => {
    await page.goto('blog')
    await expect(page.getByRole('link', { name: /E2E Welcome/ })).toBeVisible()
  })
})
