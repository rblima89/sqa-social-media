import { test, expect, Page } from '@playwright/test';
import { VALID_PASSWORD, OTHER_VALID_PASSWORD, API_URL, uniqueEmail } from '../helpers/user';

// Os <label> do front não estão ligados aos <input> (sem htmlFor), então
// getByLabel não funciona; usamos placeholder e o tipo do campo.
// Há também dois botões "Criar Conta"/"Entrar" na tela (header e formulário),
// por isso o botão de submit é buscado dentro do <form>.

async function loginPelaTela(page: Page, email: string, password: string) {
  await page.goto('/signin');
  await page.getByPlaceholder('seu@email.com').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.locator('form').getByRole('button', { name: 'Entrar' }).click();
}

test.describe('E2E - fluxos de usuário', () => {
  test('cadastro: novo usuário cria conta e cai no feed autenticado', async ({ page }) => {
    await page.goto('/signup');

    await page.getByPlaceholder('seu@email.com').fill(uniqueEmail('e2e-signup'));
    await page.locator('input[type="password"]').nth(0).fill(VALID_PASSWORD);
    await page.locator('input[type="password"]').nth(1).fill(VALID_PASSWORD);
    await page.locator('form').getByRole('button', { name: 'Criar Conta' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Feed de Posts' })).toBeVisible();
    // o header só mostra "Sair" para usuário autenticado
    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
  });

  test('login: senha errada mostra erro; senha correta leva ao feed', async ({ page, request }) => {
    // preparação: o usuário é criado direto pela API (mais rápido e estável que pela tela)
    const email = uniqueEmail('e2e-login');
    await request.post(`${API_URL}/auth/signup`, { data: { email, password: VALID_PASSWORD } });

    await loginPelaTela(page, email, OTHER_VALID_PASSWORD);
    await expect(page.getByText('Credenciais inválidas')).toBeVisible();
    await expect(page).toHaveURL(/\/signin/); // continua na tela de login

    await page.locator('input[type="password"]').fill(VALID_PASSWORD);
    await page.locator('form').getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
  });

  test('curtida sem autenticação: exibe alerta e não curte', async ({ page }) => {
    let mensagemDoAlerta = '';
    page.on('dialog', async (dialog) => {
      mensagemDoAlerta = dialog.message();
      await dialog.accept();
    });

    await page.goto('/');
    const primeiroPost = page.getByRole('listitem').first();
    await primeiroPost.getByRole('button', { name: /Curtir/ }).click();

    await expect.poll(() => mensagemDoAlerta).toBe('Você precisa estar autenticado para curtir posts!');
    // o botão continua como "Curtir" (nada foi curtido)
    await expect(primeiroPost.getByRole('button', { name: /Curtir/ })).toBeVisible();
  });

  test('curtida autenticada: post curtido aparece em "Posts Curtidos"', async ({ page, request }) => {
    const email = uniqueEmail('e2e-like');
    await request.post(`${API_URL}/auth/signup`, { data: { email, password: VALID_PASSWORD } });
    await loginPelaTela(page, email, VALID_PASSWORD);
    await expect(page).toHaveURL('/');

    const primeiroPost = page.getByRole('listitem').first();
    const titulo = (await primeiroPost.getByRole('heading').textContent()) ?? '';
    await primeiroPost.getByRole('button', { name: /Curtir/ }).click();
    await expect(primeiroPost.getByRole('button')).toContainText('Curtido');

    // navegação pelos botões (e não por page.goto) para manter a sessão em memória
    await page.getByRole('button', { name: 'Posts Curtidos' }).click();
    await expect(page).toHaveURL(/\/auth\/liked/);
    await expect(page.getByRole('heading', { name: titulo })).toBeVisible();
  });
});
