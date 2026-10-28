import { test, expect } from '@playwright/test';
import { VALID_PASSWORD, API_URL, uniqueEmail } from '../helpers/user';

// EXTRA (não conta nos 3 E2E mínimos): teste que documenta um possível bug.
// O front salva o usuário em localStorage com a chave "user" (saveUser), mas lê
// com a chave "sqa_social_user" (getUser). Resultado esperado: ao recarregar a
// página, a sessão se perde. Este teste deve FALHAR enquanto o bug existir.
test('sessão persiste após recarregar a página', async ({ page, request }) => {
  const email = uniqueEmail('e2e-reload');
  await request.post(`${API_URL}/auth/signup`, { data: { email, password: VALID_PASSWORD } });

  await page.goto('/signin');
  await page.getByPlaceholder('seu@email.com').fill(email);
  await page.locator('input[type="password"]').fill(VALID_PASSWORD);
  await page.locator('form').getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();

  await page.reload();

  await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
});
