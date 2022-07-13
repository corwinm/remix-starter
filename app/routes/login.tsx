// app/routes/login.tsx
import { Form, useActionData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/utils/authenticator.server";
import { json } from "@remix-run/node";

// First we create our UI with the form doing a POST and the inputs with the
// names we are going to use in the strategy
export default function Screen() {
  const data = useActionData();
  return (
    <Form method="post" className="flex flex-col">
      <fieldset>
        <legend>Login</legend>
        {data?.error}
        <label className="flex flex-col">
          E-Mail
          <input type="email" name="email" required />
        </label>
        <label className="flex flex-col">
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
          />
        </label>
        <button>Sign In</button>
      </fieldset>
    </Form>
  );
}

// Second, we need to export an action function, here we will use the
// `authenticator.authenticate method`
export let action: ActionFunction = async ({ request }) => {
  // we call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure
  try {
    return await authenticator.authenticate("user-pass", request, {
      successRedirect: "/",
      throwOnError: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      return json({ error: error.message });
    }
    if (error instanceof Response) {
      return error;
    }
    return json({ error: "Unknown Error" });
  }
};

// Finally, we can export a loader function where we check if the user is
// authenticated with `authenticator.isAuthenticated` and redirect to the
// dashboard if it is or return null if it's not
export let loader: LoaderFunction = async ({ request }) => {
  // If the user is already authenticated redirect to /dashboard directly
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
};
