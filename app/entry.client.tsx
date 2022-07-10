import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";
import { webVitals } from "./web-vitals";

hydrate(<RemixBrowser />, document);

webVitals();
