import { test, expect } from '@playwright/test'

// Paths are RELATIVE (no leading slash) so they resolve against the /phaedra/
// baseURL — a leading slash would drop the base and hit the wrong path.
test('home renders and navigates to the blog', async ({ page }) => {
  await page.goto('./')
  await expect(
    page.getByRole('heading', { name: 'Phaedra', level: 1 }),
  ).toBeVisible()

  await page.getByRole('navigation').getByRole('link', { name: 'Blog' }).click()
  await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible()
})

test('unknown post slug shows a not-found message', async ({ page }) => {
  await page.goto('blog/this-post-does-not-exist')
  await expect(page.getByText(/post not found/i)).toBeVisible()
})

test('admin redirects unauthenticated visitors to login', async ({ page }) => {
  await page.goto('admin')
  await expect(page).toHaveURL(/\/login$/)
})

test('theme toggle switches the html theme class', async ({ page }) => {
  await page.goto('./')
  const html = page.locator('html')
  // next-themes stamps a light/dark class on <html> once mounted.
  await expect(html).toHaveClass(/dark|light/)
  const before = await html.getAttribute('class')
  await page.getByRole('button', { name: 'Toggle theme' }).click()
  await expect.poll(() => html.getAttribute('class')).not.toBe(before)
})
