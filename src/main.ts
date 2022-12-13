import App from "./App.svelte";
import "./app.css"; 

import * as Sentry from "@sentry/svelte";
import { BrowserTracing } from "@sentry/tracing"; 

// Initialize the Sentry SDK here
Sentry.init({
  dsn: "https://20270e32fcb247da8d97e1f9f48b82c2@o4504321693777920.ingest.sentry.io/4504321696202752",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
const app = new App({
  target: document.body,
  props: {
    name: "world",
  },
});

export default app;
