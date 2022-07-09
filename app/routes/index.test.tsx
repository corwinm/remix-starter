import { render, screen } from "@testing-library/react";
import Index from "./index";

it("renders the app", () => {
  render(<Index />);
  expect(
    screen.getByRole("heading", { name: /Welcome to Remix/i })
  ).toBeInTheDocument();
});
