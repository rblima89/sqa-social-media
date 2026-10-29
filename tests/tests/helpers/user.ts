// Senha que atende as regras do BACK (>= 8, maiúscula, minúscula, número e um de @$!%*?&)
// e do FRONT (> 8 caracteres e caractere especial). Tem 11 caracteres.
export const VALID_PASSWORD = 'Senha@12345';

// Outra senha forte (passa na validação), mas diferente da cadastrada.
// Importante: no /auth/signin o back valida o formato da senha ANTES de checar
// as credenciais, então uma senha "errada" precisa ser forte para dar 401 (e não 422).
export const OTHER_VALID_PASSWORD = 'Outra@98765';

export const API_URL = process.env.API_URL ?? 'http://localhost:8080';

// E-mail único por execução: o banco (MySQL) mantém os dados entre as rodadas.
export function uniqueEmail(prefix = 'user'): string {
  return `${prefix}.${Date.now()}.${Math.floor(Math.random() * 1_000_000)}@teste.com`;
}
