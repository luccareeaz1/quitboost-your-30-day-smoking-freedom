import * as Sentry from "@sentry/react";
import posthog from "posthog-js";

/**
 * Observability Layer - Enterprise Ready
 * Configures Sentry (Error Tracking) and PostHog (Product Analytics)
 */

export const initObservability = () => {
  const isProd = import.meta.env.PROD;
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
  const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
  const posthogHost = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

  // Initialize Sentry
  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: isProd ? 0.1 : 1.0,
      // Session Replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: isProd ? "production" : "development",
    });
    console.log("🚀 Sentry Initialized");
  }

  // Initialize PostHog
  if (posthogKey) {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      person_profiles: "identified_only", // Recommended for LGPD
      capture_pageview: false, // We'll handle this manually for SPA
      autocapture: true,
      persistence: "localStorage",
    });
    console.log("📊 PostHog Initialized");
  }
};

/**
 * Custom Hook for Analytics
 */
export const useAnalytics = () => {
  const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
    if (import.meta.env.PROD) {
      posthog.capture(eventName, properties);
    } else {
      console.log(`[Analytics] Track: ${eventName}`, properties);
    }
  };

  const identifyUser = (userId: string, email?: string, name?: string) => {
    if (import.meta.env.PROD) {
      posthog.identify(userId, {
        email,
        name,
      });
      Sentry.setUser({ id: userId, email });
    }
  };

  const resetUser = () => {
    posthog.reset();
    Sentry.setUser(null);
  };

  return { trackEvent, identifyUser, resetUser };
};
