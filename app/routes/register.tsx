// app/routes/login.tsx
import { Form, useActionData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/utils/authenticator.server";
import { json } from "@remix-run/node";
import { EmailAlreadyUsedError, registerUser } from "~/models/user";
import invariant from "tiny-invariant";

// First we create our UI with the form doing a POST and the inputs with the
// names we are going to use in the strategy
export default function Screen() {
  const data = useActionData();
  return (
    <Form method="post" className="flex flex-col">
      <h1>Register new user</h1>
      <label className="flex flex-col">
        E-Mail
        <span>{data?.errors?.email}</span>
        <input type="email" name="email" required />
      </label>
      <label className="flex flex-col">
        Password
        <span>{data?.errors?.password}</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
      </label>
      <button>Register</button>
    </Form>
  );
}

// Second, we need to export an action function, here we will use the
// `authenticator.authenticate method`
export let action: ActionFunction = async ({ request }) => {
  // we call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  invariant(typeof email === "string", "email must be a string");
  invariant(typeof password === "string", "password must be a string");
  if (!email || !password) {
    return json({
      errors: {
        email: email ? "" : "Email is required",
        password: password ? "" : "Password is required",
      },
    });
  }
  try {
    await registerUser({
      email,
      password,
    });
  } catch (error) {
    if (error instanceof EmailAlreadyUsedError) {
      return json({
        errors: { email: error.message },
      });
    }
    return json({
      error: "Unknown error occurred.",
    });
  }

  return redirect("/");
};

// Finally, we can export a loader function where we check if the user is
// authenticated with `authenticator.isAuthenticated` and redirect to the
// dashboard if it is or return null if it's not
export let loader: LoaderFunction = async ({ request }) => {
  // If the user is already authenticated redirect to /dashboard directly
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });
};
