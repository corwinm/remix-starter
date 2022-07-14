import type { ErrorBoundaryComponent, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { confirmUser } from "~/models/user";

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <>
      <h1>Error Occurred</h1>
      <p>{error.message || "Unknown error ocurred"}</p>
    </>
  );
};

export const loader: LoaderFunction = async ({ request }) => {
  const code = new URL(request.url).searchParams.get("code");

  if (!code) {
    throw new Error(
      "Missing confirmation code. Try the link in your email again."
    );
  }

  await confirmUser({
    code,
  });

  return redirect("/login");
};
