import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/utils/session.server";
import type { User } from "~/models/user";
import { findUserByEmail } from "~/models/user";
import { FormStrategy } from "remix-auth-form";
import invariant from "tiny-invariant";
import { compare } from "./bcrypt.server";

export let authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form, context }) => {
    // Here you can use `form` to access and input values from the form.
    // and also use `context` to access more things from the server
    let email = form.get("email");
    let password = form.get("password");

    // You can validate the inputs however you want
    invariant(typeof email === "string", "email must be a string");
    invariant(email.length > 0, "email must not be empty");

    invariant(typeof password === "string", "password must be a string");
    invariant(password.length > 0, "password must not be empty");

    // And finally, you can find, or create, the user
    let user = await findUserByEmail(email);

    const match = await compare(password, user?.passwordHash ?? "");
    invariant(match, "password is not correct");

    // And return the user as the Authenticator expects it
    return {
      email: user.email,
      confirmed: user.confirmed,
    };
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  "user-pass"
);
