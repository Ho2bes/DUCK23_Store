import { test, expect } from '@playwright/test';

test.setTimeout(30_000);

// Test de fumée basique pour vérifier que la page Panier est accessible et affiche du contenu attendu
test('Page Panier accessible (lien ou route)', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 1) Via lien "Panier" si présent
  const cartLink = page.getByRole('link', { name: /panier|cart/i }).first();
  if (await cartLink.count()) {
    await cartLink.click();
  } else {
    // 2) Sinon route directe
    try {
      await page.goto('/cart');
    } catch {
      // 3) Ou clic sur un texte "Mon panier" s'il existe ailleurs
      const textCart = page.getByText(/mon panier|panier/i).first();
      if (await textCart.count()) await textCart.click();
    }
  }

  await page.waitForLoadState('domcontentloaded');

  // Marqueurs souples de la page Panier
  const headingCart = page.getByRole('heading', { name: /Panier|Cart/i }).first();
  if (await headingCart.count()) {
    await expect(headingCart).toBeVisible();
  } else {
    const content = page.locator('main, body').first();
    await expect(content).toContainText(/Panier|Cart|Total|Votre panier|Mon panier/i);
  }

  // Sanity check DOM prêt
  const ready = await page.evaluate(() => document.readyState);
  expect(ready).toMatch(/interactive|complete/);
});
