import { test, expect } from '@playwright/test';

test.setTimeout(30_000);

test('Accès Mes commandes: affiche mes commandes OU demande de login', async ({ page }) => {
  // route la plus probable (adapte si nécessaire)
  await page.goto('/my-orders').catch(async () => {
    await page.goto('/orders').catch(async () => {});
  });

  // Tolérance: soit on voit "Mes commandes", soit on voit un écran de login
  const ordersHeading = page.getByRole('heading', { name: /mes commandes|my orders/i }).first();
  const loginHeading  = page.getByRole('heading', { name: /connexion|login|sign in/i }).first();

  if (await ordersHeading.count()) {
    await expect(ordersHeading).toBeVisible();
  } else if (await loginHeading.count()) {
    await expect(loginHeading).toBeVisible();
  } else {
    // fallback sur contenu page
    const content = page.locator('main, body').first();
    await expect(content).toContainText(/mes commandes|my orders|connexion|login|sign in/i);
  }
});
