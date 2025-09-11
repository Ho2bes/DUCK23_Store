import { test, expect } from '@playwright/test';

test.setTimeout(30_000);

test('Home charge et affiche du contenu attendu', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // Titre: tolérant
  await expect(page).toHaveTitle(/Frontend|DUCK23|DUCK23 Store/i);

  // Evite le strict mode: on cible UN heading connu si présent...
  const heroHeading = page.getByRole('heading', { name: /Affichez fièrement/i }).first();
  const produitsHeading = page.getByRole('heading', { name: 'NOS PRODUITS', exact: true }).first();

  if (await heroHeading.count()) {
    await expect(heroHeading).toBeVisible();
    return;
  }
  if (await produitsHeading.count()) {
    await expect(produitsHeading).toBeVisible();
    return;
  }

  // ...sinon fallback ultra-souple sur un sélecteur précis (un seul élément)
  const anyText = page.locator('main, body').first();
  await expect(anyText).toContainText(/DUCK23|NOS PRODUITS|Site V1|Affichez fièrement/i);
});
