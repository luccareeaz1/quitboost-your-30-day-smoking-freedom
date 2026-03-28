# 🛰️ QuitBoost: Mission Control Center

**QuitBoost** is a premium, high-performance smoking cessation platform engineered for the elite. Combining neuroscientific protocols, real-time AI bio-support, and a luxury space-themed interface, we empower users to navigate their 30-day journey to permanent freedom.

---

## 🚀 Mission Objectives

1.  **30-Day Trajectory**: Guided daily protocols to rewire neural habits.
2.  **Neural Command (AI Coach)**: 24/7 AI-driven behavioral support using advanced LLMs.
3.  **Vitality Dashboard**: Real-time tracking of health recovery, capital saved, and streak integrity.
4.  **Galactic Missions**: Gamified behavioral challenges based on CBT (Cognitive Behavioral Therapy).
5.  **Elite Community**: High-signal social proof and peer motivation.

---

## 🛠️ Tech Stack & Architecture

-   **Frontend**: React (Vite) + TypeScript + Framer Motion (Fluid Animations).
-   **Design System**: Custom Space-Themed Glassmorphism & AppleCard Components.
-   **Backend**: Supabase (Auth, Postgres, Realtime, Edge Functions).
-   **Payments**: Stripe API (Subscriptions: Standard & Elite).
-   **Observability**: Sentry (Errors) & PostHog (Product Analytics).
-   **Testing**: Vitest (Unit & Smoke Tests).

---

## 📡 Mission Launch Checklist (Beta)

Before deploying to production, ensure:

1.  [ ] **Stripe Webhooks**: `supabase/functions/stripe-webhook` is deployed with matching `STRIPE_WEBHOOK_SECRET`.
2.  [ ] **Email Templates**: Supabase Auth templates are configured according to `email_configuration_guide.md`.
3.  [ ] **Environment Variables**: All `VITE_SUPABASE_*` and `STRIPE_*` keys are set in the Lovable/Supabase dashboards.
4.  [ ] **Unit Tests**: Pass with `npm test`.

---

## 🛠️ Local Command Center (Development)

```sh
# Clone the repository
git clone <git-url>

# Install Life Support (Dependencies)
npm install

# Start the Engines
npm run dev

# Run Verification Protocols (Tests)
npm test
```

---

## 🛰️ Reach Control

- **Project URL**: [lovable.dev/projects/quitboost](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)
- **Status**: Release Candidate (Beta v1.0)
- **Protocol**: LGPD/GDPR Compliant

© 2026 QUITBOOST • MISSION CONTROL • SECURE UPLINK ESTABLISHED.
