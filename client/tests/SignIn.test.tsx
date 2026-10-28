import { fireEvent, render, screen } from "@testing-library/react";
import { AxiosError, AxiosResponse } from "axios";
import SignIn from "@/app/signin/page";
import { AuthProvider } from "@/contexts/AuthContext";
import api from "../src/service/api";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("../src/service/api");
const mockedApi = api as jest.Mocked<typeof api>;

const submitButton = () =>
  screen.getAllByRole("button", { name: "Entrar" }).find((b) => b.getAttribute("type") === "submit")!;

describe("Tela - Signin", () => {
  beforeEach(() => jest.clearAllMocks());

  test("credenciais incorretas: deve exibir 'Credenciais inválidas'", async () => {
    const response = { status: 401, data: { message: "Credenciais inválidas" } } as AxiosResponse;
    mockedApi.post.mockRejectedValueOnce(
      new AxiosError("Unauthorized", "ERR_BAD_REQUEST", undefined, undefined, response)
    );
    render(<AuthProvider><SignIn /></AuthProvider>);

    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), { target: { value: "aluno@teste.com" } });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "Errada123@" } });
    fireEvent.click(submitButton());

    expect(await screen.findByText("Credenciais inválidas")).toBeDefined();
  });

  test("e-mail em formato inválido: não deve chamar a API e deve exibir erro", async () => {
    render(<AuthProvider><SignIn /></AuthProvider>);

    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), { target: { value: "invalido" } });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "Qualquer1@" } });
    fireEvent.submit(submitButton().closest("form")!);

    expect(await screen.findByText("Email inválido")).toBeDefined();
    expect(mockedApi.post).not.toHaveBeenCalled();
  });
});
