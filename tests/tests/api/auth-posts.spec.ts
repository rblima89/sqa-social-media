import { test, expect } from '@playwright/test';
import { VALID_PASSWORD, OTHER_VALID_PASSWORD, uniqueEmail } from '../helpers/user';

// Testes de API (caixa-preta): só conhecemos o contrato (entrada -> status + corpo).
// baseURL (http://localhost:8080) vem do project "api" no playwright.config.ts.

test.describe('API - autenticação', () => {
  test('POST /auth/signup cria usuário com dados válidos (200)', async ({ request }) => {
    const email = uniqueEmail('signup');

    const res = await request.post('/auth/signup', {
      data: { email, password: VALID_PASSWORD },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toEqual(expect.any(Number)); // o banco gerou um id
    expect(body.email).toBe(email);
  });

  test('POST /auth/signup com e-mail duplicado retorna 409', async ({ request }) => {
    const email = uniqueEmail('dup');
    await request.post('/auth/signup', { data: { email, password: VALID_PASSWORD } });

    const res = await request.post('/auth/signup', {
      data: { email, password: VALID_PASSWORD },
    });

    expect(res.status()).toBe(409);
    expect(await res.json()).toMatchObject({ message: 'E-mail já cadastrado', status: 409 });
  });

  test('POST /auth/signup com e-mail sem "@" retorna 422', async ({ request }) => {
    const res = await request.post('/auth/signup', {
      data: { email: 'emailsemarroba', password: VALID_PASSWORD },
    });

    expect(res.status()).toBe(422);
    expect(await res.json()).toMatchObject({ message: 'E-mail inválido', status: 422 });
  });

  test('POST /auth/signin com credenciais corretas retorna 200 e o usuário', async ({ request }) => {
    const email = uniqueEmail('signin');
    const created = await (
      await request.post('/auth/signup', { data: { email, password: VALID_PASSWORD } })
    ).json();

    const res = await request.post('/auth/signin', {
      data: { email, password: VALID_PASSWORD },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(created.id); // é o mesmo usuário que cadastramos
    expect(body.email).toBe(email);
  });

  test('POST /auth/signin com senha incorreta retorna 401', async ({ request }) => {
    const email = uniqueEmail('wrongpass');
    await request.post('/auth/signup', { data: { email, password: VALID_PASSWORD } });

    const res = await request.post('/auth/signin', {
      data: { email, password: OTHER_VALID_PASSWORD },
    });

    expect(res.status()).toBe(401);
    expect(await res.json()).toMatchObject({ message: 'Credenciais inválidas', status: 401 });
  });
});

test.describe('API - posts', () => {
  test('POST /posts/{id}/like alterna curtir e descurtir (toggle)', async ({ request }) => {
    const email = uniqueEmail('like');
    const user = await (
      await request.post('/auth/signup', { data: { email, password: VALID_PASSWORD } })
    ).json();

    const first = await request.post(`/posts/1/like?userId=${user.id}`);
    expect(first.status()).toBe(200);
    expect(await first.json()).toEqual({ postId: 1, liked: true });

    // chamando de novo, a mesma rota desfaz a curtida
    const second = await request.post(`/posts/1/like?userId=${user.id}`);
    expect(await second.json()).toEqual({ postId: 1, liked: false });
  });
});
