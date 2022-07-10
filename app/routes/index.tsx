import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prismaClient } from "~/utils/prisma.server";

export const loader: LoaderFunction = async ({ request }) => {
  const count = await prismaClient.personTest.count();
  return json({ count });
};

export default function Index() {
  const { count } = useLoaderData();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1 className="font-serif">Welcome to Remix</h1>
      <p>Total test count: {count}</p>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
