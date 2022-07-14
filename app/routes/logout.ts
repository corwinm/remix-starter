import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/utils/authenticator.server";

export let action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/login" });
};

export let loader: LoaderFunction = async ({ request }) => {
  // If the user is already authenticated redirect to / directly
  return redirect("/");
};
