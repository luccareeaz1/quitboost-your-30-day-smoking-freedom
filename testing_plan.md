# QuitBoost: Comprehensive Testing Guide

This document defines the critical path for testing the application before its public release. It covers functional logic, third-party integrations (Stripe/Supabase), and UX stability.

## 1. Authentication & Security (Auth)

### Signup & Login Flow
1. **New Account Creation**:
   - Go to `/auth`.
   - Submit a valid email and strong password.
   - **Expected**: Redirect to `/onboarding`. Check Supabase Dashboard for the new profile record.
2. **Email Confirmation**:
   - Verify if the `supabase.auth` configuration requires email verification.
   - Check if the "Magic Link" or "Signup Confirmation" email is received (using a test email).
3. **Session Persistence**:
   - Login, refresh the page.
   - **Expected**: Session is preserved (`useAuth` hook should return the user).

### Password Recovery
1. **Trigger Reset**:
   - In `/auth`, select "Forgot Password".
   - Submit email.
   - **Expected**: Receive the password reset email from Supabase.
2. **Handle Update**:
   - Use the link from the email.
   - **Expected**: Redirect to the profile/reset page to update the password.

---

## 2. Onboarding & Health Data (DB)

### Data Persistence
1. **Submit Form**:
   - In `/onboarding`, fill all fields (cigarettes/day, expense, quit date).
   - Click "Salvar".
   - **Expected**: Redirect to `/dashboard`. 
   - **Technical Check**: Go to Supabase Table Editor → `profiles`. Verify `onboarding_completed` is `true`.

### Calculation Logic
1. **Money Saved**:
   - Compare "Cigarettes Avoided × Price per Cigarette" against the dashboard value.
2. **Health Health Stats**:
   - Check if milestones like "20m sem fumar" or "48h sem fumar" are correctly updating based on the `quit_date`.

---

## 3. Payments & Subscriptions (Stripe)

### Checkout Flow
1. **Select Plan**:
   - Go to `/checkout`.
   - Select "Elite" plan.
   - Click "Assinar".
   - **Expected**: Redirect to a Stripe Checkout URL (hosted by Stripe).
2. **Test Transaction**:
   - Use a Stripe Test Card (e.g., `4242 4242 4242 4242`).
   - Complete checkout.
   - **Expected**: Return to the application success URL (usually `/dashboard?session_id=...`).
3. **Webhook Verification**:
   - Check Supabase `subscriptions` table.
   - **Expected**: `status` should be `active`.

---

## 4. Email & Communication
> [!IMPORTANT]
> Since email templates are managed via the Supabase Dashboard, manually verify the copy for consistent branding.

### Recommended Space-Theme Templates (Supabase Dashboard)
- **Confirmation Email**: "Bem-vindo ao centro de comando, {user}! Sua contagem regressiva para a liberdade cerebral começou. Confirme seu e-mail para decolar."
- **Magic Link**: "Sua cápsula de acesso rápido chegou. Clique abaixo para entrar instantaneamente na sua jornada QuitBoost."
- **Password Reset**: "Protocolo de segurança ativado. Redefina sua chave de acesso para manter sua órbita livre de fumaça sob controle."

| Feature | Status | Verified (Initial) |
| :--- | :--- | :--- |
| Magic Link Delivery | System | [ ] |
| Profile Image Upload | System | [ ] |
| AI Coach Streaming | Code | [X] |
| Dashboard Graph Refresh | Code | [X] |

---

## 5. AI Coach Neural (AI)

### Conversational Flow
1. **Initiate Chat**:
   - Go to `/coach`.
   - Send "Sinto vontade de fumar agora".
   - **Expected**: Streaming response starts within 3 seconds.
2. **Context Persistence**:
   - Reload the page.
   - **Expected**: Previous messages should be fetched from the database and rendered.

---

## 6. UI/UX & Responsive Design

### Visual Audit
1. **Space Theme Check**: 
   - Check for "flash" of white before the black background loads.
   - Verify particles are moving smoothly (no lag).
2. **Glassmorphism Consistency**:
   - Ensure the `NavBar` and `Pricing` cards have visible blurred backgrounds against the stars.
3. **Mobile Browser Compliance**:
   - Test on iOS Safari and Android Chrome.
   - **Check**: Footer spacing and "Assinar" button visibility.

---

## 7. API & Infrastructure (Backend)

### Function Responses
1. **Edge Function Connectivity**:
   - Run console commands to check `create-checkout` and `ai-coach` endpoint health.
2. **Database RLS Policies**:
   - Try to access data from another user via API.
   - **Expected**: Access denied (HTTP 401/403).

> [!CAUTION]
> Always use "Test Mode" credentials when performing payment triggers. Do not use real credit cards unless specifically testing the production switch.

## Conclusion
The QuitBoost application is now in a **High-Conversion Beta State**. All core flows (Auth, Onboarding, Checkout, Dashboard) have been polished with a premium space-themed design system.
