import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { expect, vi } from "vitest";

describe("<Blog />", () => {
  let container;

  const mockLikes = vi.fn();

  beforeEach(() => {
    container = render(
      <Blog
        blog={{
          likes: 19291,
          author: "Tester",
          title: "Show & Hide",
          url: "https://lukadevv.com",
        }}
        onLike={mockLikes}
      />,
    ).container;
  });

  test("title and author only (hide by default)", async () => {
    const url = screen.queryByText("https://lukadevv.com");

    expect(url).not.toBeInTheDocument();

    const title = screen.queryByText("Show & Hide Tester");

    expect(title).toBeInTheDocument();
  });

  test("full blog data (view)", async () => {
    const user = userEvent.setup();

    const button = screen.getByText("view");

    await user.click(button);

    screen.getByText("https://lukadevv.com");
    screen.getByText("19291");
    screen.getByText("Show & Hide Tester");
  });
});
