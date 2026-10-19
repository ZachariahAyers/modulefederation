import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import AuthForm from "./AuthForm";

function renderForm(mode: "signin" | "signup") {
  const onSignIn = vi.fn();
  render(
    <MemoryRouter>
      <AuthForm mode={mode} onSignIn={onSignIn} />
    </MemoryRouter>,
  );
  return onSignIn;
}

describe("AuthForm", () => {
  it("signs in once the email and password are filled in", async () => {
    const onSignIn = renderForm("signin");

    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "correct horse");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  it("does not sign in while a required field is empty", async () => {
    const onSignIn = renderForm("signin");

    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(onSignIn).not.toHaveBeenCalled();
  });

  it("asks for a name and a new password when creating an account", () => {
    renderForm("signup");

    expect(screen.getByRole("heading", { name: "Create an account" })).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeRequired();
    expect(screen.getByLabelText("Password")).toHaveAttribute("autocomplete", "new-password");
  });

  it("links each form to the other", () => {
    renderForm("signin");

    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Create one" })).toHaveAttribute(
      "href",
      "/auth/signup",
    );
  });
});
