import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps pages that require authentication.
 * - If auth is loading, shows a full-screen spinner.
 * - If no user is detected, redirects to /auth preserving the intended path.
 * - If authenticated, renders children normally.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
            Autenticando...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Preserve intended destination so we can redirect back after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
