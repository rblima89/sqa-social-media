import { fireEvent, render, screen } from "@testing-library/react";
import PostCard from "@/components/PostCard";

const post = { id: 7, title: "Título", body: "Corpo", liked: false };

describe("PostCard", () => {
  afterEach(() => jest.restoreAllMocks());

  test("usuário deslogado: deve exibir alert e não chamar onLike ao clicar em Curtir", () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const onLike = jest.fn();
    render(<PostCard post={post} isAuthenticated={false} onLike={onLike} />);

    fireEvent.click(screen.getByRole("button", { name: /curtir/i }));

    expect(alertSpy).toHaveBeenCalledWith(
      "Você precisa estar autenticado para curtir posts!"
    );
    expect(onLike).not.toHaveBeenCalled();
  });

  test("usuário logado: deve chamar onLike e exibir o estado 'Curtido' com coração vermelho", async () => {
    const onLike = jest.fn().mockResolvedValue(undefined);
    render(<PostCard post={post} isAuthenticated={true} onLike={onLike} />);

    fireEvent.click(screen.getByRole("button", { name: /curtir/i }));

    expect(await screen.findByText("Curtido")).toBeDefined();
    expect(screen.getByText("❤️")).toBeDefined();
    expect(onLike).toHaveBeenCalledWith(7);
  });
});
