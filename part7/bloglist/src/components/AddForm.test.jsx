import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, vi } from "vitest";
import { AddForm } from "./AddForm";

describe("<Blog />", () => {
  let container;

  const mockSubmit = vi.fn();

  beforeEach(() => {
    container = render(<AddForm handleSubmit={mockSubmit} />).container;
  });

  test("create blog", async () => {
    const user = userEvent.setup();

    const button = screen.getByText("create new blog");

    await user.click(button);

    const title = container.querySelector("#create-title");
    const author = container.querySelector("#create-author");
    const url = container.querySelector("#create-url");

    await user.type(title, "This is a title");
    await user.type(author, "lukadevv");
    await user.type(url, "https://lukadevv.com");

    await user.click(screen.getByText("create"));

    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });
});
