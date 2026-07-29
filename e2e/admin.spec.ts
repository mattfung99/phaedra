import { test, expect } from '@playwright/test'

// Full authoring lifecycle against a LIVE staging Supabase. Skips unless creds are
// provided (so it no-ops locally and runs in the staging e2e job).
const email = process.env.E2E_ADMIN_EMAIL
const password = process.env.E2E_ADMIN_PASSWORD

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

test.describe('admin post lifecycle', () => {
  test.skip(
    !email || !password,
    'requires E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD + a live staging Supabase',
  )

  test('login → create → publish → view → edit → delete', async ({ page }) => {
    const title = `E2E Post ${Date.now()}`
    const slug = slugify(title)

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
    await expect(page.locator('li', { hasText: title })).toBeVisible()

    // Public page renders the (sanitized) content
    await page.goto(`blog/${slug}`)
    await expect(page.getByRole('heading', { name: title })).toBeVisible()
    await expect(page.getByText('Hello from the e2e suite.')).toBeVisible()

    // Edit
    await page.goto('admin/posts')
    await page
      .locator('li', { hasText: title })
      .getByRole('link', { name: 'Edit' })
      .click()
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
