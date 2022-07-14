import type { LoaderFunction } from "@remix-run/node";
import LogoutButton from "~/components/logout-button";
import type { User } from "~/models/user";
import { getUser } from "~/models/user";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = ({ request }) => {
  const user = getUser({ request });
  return user;
};

export default function Index() {
  const user = useLoaderData<User | null>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1 className="font-serif">Welcome to Remix</h1>
      <p>{user?.email}</p>
      <p>{user?.confirmed ? "Confirmed" : "Unconfirmed"}</p>
      <LogoutButton />
    </div>
  );
}
