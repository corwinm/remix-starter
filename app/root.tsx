import type {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import styles from "./tailwind.css";

export const links: LinksFunction = () => [
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/favicons/apple-touch-icon.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicons/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicons/favicon-16x16.png",
  },
  { rel: "icon", href: "/favicon.ico" },
  { rel: "manifest", href: "/site.webmanifest" },
  { rel: "stylesheet", href: styles },
];

export const meta: MetaFunction = ({ data }) => ({
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1",
  title: `New Remix App`,
  description: `New Remix App`,
  author: `Corwin W. Marsh`,
  twitter: `@CorwinMarsh`,
  "og:title": `New Remix App`,
  "og:description": `New Remix App`,
  "og:type": "website",
  "og:image": `${data.origin}/favicons/android-chrome-512x512.png`,
  "twitter:card": "summary",
  "twitter:creator": `@CorwinMarsh`,
  "twitter:title": `New Remix App`,
  "twitter:image": `${data.origin}/favicons/android-chrome-512x512.png`,
});

function getEnv() {
  return {
    VERCEL_ANALYTICS_ID: process.env.VERCEL_ANALYTICS_ID,
  };
}

type ENV = ReturnType<typeof getEnv>;

declare global {
  // eslint-disable-next-line
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  return json({
    origin: new URL(request.url).origin,
    ENV: getEnv(),
  });
};

export default function App() {
  const data = useLoaderData();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
