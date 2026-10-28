import { fireEvent, render, screen } from "@testing-library/react";
import ResetPassword from "@/app/reset-password/page";
import { AuthProvider } from "@/contexts/AuthContext";
import api from "../src/service/api";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("../src/service/api");
const mockedApi = api as jest.Mocked<typeof api>;

describe("Tela - Redefinição de senha", () => {
  test("e-mail cadastrado: deve exibir a mensagem 'E-mail enviado com sucesso' (BUG: texto diferente do requisito)", async () => {
    mockedApi.post.mockResolvedValueOnce({ data: {} });
    render(<AuthProvider><ResetPassword /></AuthProvider>);

    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "aluno@teste.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enviar Email" }));

    expect(await screen.findByText("E-mail enviado com sucesso")).toBeDefined();
  });
});
