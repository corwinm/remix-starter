import type { Metric } from "web-vitals";
import { getCLS, getFCP, getFID, getLCP, getTTFB } from "web-vitals";

const vitalsUrl = "https://vitals.vercel-analytics.com/v1/vitals";

function getConnectionSpeed() {
  return "connection" in navigator &&
    navigator.connection &&
    "effectiveType" in navigator.connection
    ? // @ts-ignore
      navigator.connection.effectiveType
    : "";
}

function sendToAnalytics(metric: Metric) {
  const analyticsId = ENV?.VERCEL_ANALYTICS_ID;
  const body = {
    dsn: analyticsId || "debug",
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  };

  if (!analyticsId) {
    console.log("[Analytics]", metric.name, JSON.stringify(body, null, 2));
    return;
  }

  const blob = new Blob([new URLSearchParams(body).toString()], {
    // This content type is necessary for `sendBeacon`
    type: "application/x-www-form-urlencoded",
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, blob);
  } else
    fetch(vitalsUrl, {
      body: blob,
      method: "POST",
      credentials: "omit",
      keepalive: true,
    });
}

export function webVitals() {
  try {
    getFID((metric) => sendToAnalytics(metric));
    getTTFB((metric) => sendToAnalytics(metric));
    getLCP((metric) => sendToAnalytics(metric));
    getCLS((metric) => sendToAnalytics(metric));
    getFCP((metric) => sendToAnalytics(metric));
  } catch (err) {
    console.error("[Analytics]", err);
  }
}
