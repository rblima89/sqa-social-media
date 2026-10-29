import { saveUser, getUser, removeUser } from "@/lib/localStorage";

describe("Lib - localStorage", () => {
  beforeEach(() => localStorage.clear());

  test("deve recuperar o usuário salvo (BUG: saveUser grava em 'user' e getUser lê 'sqa_social_user')", () => {
    saveUser({ id: 1, email: "aluno@teste.com" });
    expect(getUser()).toEqual({ id: 1, email: "aluno@teste.com" });
  });

  test("deve retornar null quando não há usuário salvo", () => {
    expect(getUser()).toBeNull();
  });
});
