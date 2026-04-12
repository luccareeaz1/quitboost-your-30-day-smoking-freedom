import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
// QuitBoost SaaS — Version 2026.1 (Force Rebuild)
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import OnboardingMotivo from "./pages/OnboardingMotivo";
import Dashboard from "./pages/Dashboard";
import Progresso from "./pages/Progresso";
import Desafios from "./pages/Desafios";
import Comunidade from "./pages/Comunidade";
import Conquistas from "./pages/Conquistas";
import Perfil from "./pages/Perfil";
import AICoach from "./pages/AICoach";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import TermosUso from "./pages/TermosUso";
import NotFound from "./pages/NotFound";
import PageTransition from "./components/app/PageTransition";
import { AuthProvider } from "./hooks/useAuth";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";

import ErrorBoundary from "./components/common/ErrorBoundary";
import { NotificationProvider } from "./hooks/useNotifications";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/onboarding" element={<PageTransition><Onboarding /></PageTransition>} />
        <Route path="/onboarding-motivo" element={<PageTransition><OnboardingMotivo /></PageTransition>} />
        <Route path="/politica-de-privacidade" element={<PageTransition><PoliticaPrivacidade /></PageTransition>} />
        <Route path="/termos-de-uso" element={<PageTransition><TermosUso /></PageTransition>} />

        {/* Protected routes — require authentication */}
        <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/progresso" element={<ProtectedRoute><PageTransition><Progresso /></PageTransition></ProtectedRoute>} />
        <Route path="/desafios" element={<ProtectedRoute><PageTransition><Desafios /></PageTransition></ProtectedRoute>} />
        <Route path="/comunidade" element={<ProtectedRoute><PageTransition><Comunidade /></PageTransition></ProtectedRoute>} />
        <Route path="/conquistas" element={<ProtectedRoute><PageTransition><Conquistas /></PageTransition></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><PageTransition><Perfil /></PageTransition></ProtectedRoute>} />
        <Route path="/coach" element={<ProtectedRoute><PageTransition><AICoach /></PageTransition></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><PageTransition><Checkout /></PageTransition></ProtectedRoute>} />

        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <AppLayout>
                <AnimatedRoutes />
              </AppLayout>
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);


export default App;

