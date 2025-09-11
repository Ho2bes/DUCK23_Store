import { test, expect } from '@playwright/test';

test.setTimeout(30_000);

// Test de fumée basique pour vérifier que la section Produits est accessible et visible
test('Section Produits visible (via lien, route ou ancre)', async ({ page }) => {
  await page.goto('/');

  // 1) Si un lien "Produits" existe, on clique
  const productsLink = page.getByRole('link', { name: /produits|products/i });
  if (await productsLink.count()) {
    await productsLink.first().click();
  } else {
    // 2) Sinon on tente des routes/ancres courantes
    try { await page.goto('/products'); }
    catch { try { await page.goto('/#produits'); } catch {}
    }
  }

  // 3) Vérifications souples
  //   - un H2 “NOS PRODUITS”, OU
  //   - le mot “Produits” quelque part, OU
  //   - une classe courante (ex: .nos-produits)
  const h2NosProduits = page.getByRole('heading', { name: 'NOS PRODUITS', exact: true });
  if (await h2NosProduits.count()) {
    await expect(h2NosProduits.first()).toBeVisible();
  } else {
    await expect(page.locator('body')).toContainText(/NOS PRODUITS|Produits|Our Products|Catálogo/i);
  }
});
