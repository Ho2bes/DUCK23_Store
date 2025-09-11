import { test, expect } from '@playwright/test';

test.setTimeout(30_000);

test('Aucune erreur JavaScript bloquante sur la Home', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(String(err?.message || err)));

  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // Smoke: la page montre bien du contenu
  await expect(page.locator('main, body').first())
    .toContainText(/DUCK23|NOS PRODUITS|Affichez|Accueil/i);

  // Autorise des warnings, mais on veut éviter les erreurs JS "uncaught"
  expect(errors.join('\n')).not.toMatch(/ReferenceError|TypeError|SyntaxError|Unhandled/i);
});
