import React from "react";
import "./index.scss";
import Routes from "./containers/routes";
import "core-js/stable";
import "regenerator-runtime/runtime";
import "./i18n";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastRenderer } from "components/Toast";
import { createRoot } from "react-dom/client";
import configureStore from "./store";
import { createBrowserHistory } from "history";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/browser";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_URL,
  integrations: [new BrowserTracing()],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

// Global error handler for runtime errors
window.onerror = function (message, source, lineno, colno, error) {
  Sentry.captureException(error);
};

// Global error handler for unhandled promise rejections
window.onunhandledrejection = function (event) {
  Sentry.captureException(event.reason);
};

if (process.env.NODE_ENV !== "production") {
  console.log(process.env, "env");
}

const history = createBrowserHistory();
const store = configureStore(history);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <BrowserRouter>
          <Routes />
          <ReactQueryDevtools initialIsOpen={false} />
          <ToastRenderer />
        </BrowserRouter>
      </ConnectedRouter>
    </Provider>
  </QueryClientProvider>
  // </React.StrictMode>
);
