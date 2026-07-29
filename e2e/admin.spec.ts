import { test, expect } from '@playwright/test'

// Full authoring lifecycle against a LIVE Supabase (local stack in CI). Skips
// unless creds are provided. Verifies the write path via the admin list, which
// fetches live (react-query) — a freshly created post isn't on the public SSG
// site until a rebuild, so we don't assert public rendering here (see
// public-post.spec.ts for the pre-rendered path).
const email = process.env.E2E_ADMIN_EMAIL
const password = process.env.E2E_ADMIN_PASSWORD

test.describe('admin post lifecycle', () => {
  test.skip(
    !email || !password,
    'requires E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD + a live Supabase',
  )

  test('login → create → publish → edit → delete', async ({ page }) => {
    const title = `E2E Post ${Date.now()}`

    // Sign in
    await page.goto('login')
    await page.getByLabel(/email/i).fill(email!)
    await page.getByLabel(/password/i).fill(password!)
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/admin$/)

    // Create + publish
    await page.goto('admin/new')
    await page.getByLabel('Title').fill(title)
    await page.locator('.ProseMirror').click()
    await page.keyboard.type('Hello from the e2e suite.')
    await page.getByRole('button', { name: 'Publish' }).click()
    await expect(page).toHaveURL(/\/admin\/posts$/)
    const row = page.locator('li', { hasText: title })
    await expect(row).toBeVisible()
    await expect(row.getByText('Published')).toBeVisible()

    // Edit
    await row.getByRole('link', { name: 'Edit' }).click()
    await expect(page).toHaveURL(/\/admin\/edit\//)
    const edited = `${title} (edited)`
    await page.getByLabel('Title').fill(edited)
    await page.getByRole('button', { name: 'Publish' }).click()
    await expect(page).toHaveURL(/\/admin\/posts$/)
    await expect(page.locator('li', { hasText: edited })).toBeVisible()

    // Delete (confirm dialog)
    page.on('dialog', (d) => d.accept())
    await page
      .locator('li', { hasText: edited })
      .getByRole('button', { name: 'Delete' })
      .click()
    await expect(page.locator('li', { hasText: edited })).toHaveCount(0)
  })
})
