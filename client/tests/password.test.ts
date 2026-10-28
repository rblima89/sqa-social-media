import { isPasswordValid } from "@/utils/password";

describe("Utils - Password", () => {
  describe("function isPasswordValid", () => {
    test("deve rejeitar senha sem letra maiúscula", () => {
      expect(isPasswordValid("senha1234@")).toBe(false);
    });

    test("deve aceitar senha com exatamente 8 caracteres que atende aos demais critérios (BUG: usa <= 8)", () => {
      // Requisito: mínimo 8 caracteres -> "Abcd123@" tem 8 e deveria ser válida
      expect(isPasswordValid("Abcd123@")).toBe(true);
    });

    test("deve aceitar '!' como caractere especial (BUG: '!' não está na regex)", () => {
      expect(isPasswordValid("Abcdef12!")).toBe(true);
    });
  });
});
