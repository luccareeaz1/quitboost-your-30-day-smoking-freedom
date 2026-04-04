import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-[30px] bg-destructive/10 flex items-center justify-center text-destructive mb-8 shadow-soft animate-pulse">
            <AlertTriangle size={40} />
          </div>
          
          <h1 className="text-3xl font-black tracking-tighter mb-4 text-foreground">
            Ops! Algo deu errado.
          </h1>
          
          <p className="text-muted-foreground max-w-md mb-10 leading-relaxed font-medium">
            O protocolo encontrou uma instabilidade inesperada. Não se preocupe, seus dados estão seguros.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
            <Button 
              onClick={this.handleReset}
              className="flex-1 h-14 rounded-[20px] bg-primary font-black uppercase tracking-widest text-sm font-medium shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <RefreshCcw size={14} className="mr-2" /> Recarregar App
            </Button>
            
            <Button 
              variant="outline"
              onClick={this.handleGoHome}
              className="flex-1 h-14 rounded-[20px] font-black uppercase tracking-widest text-sm font-medium border-2"
            >
              <Home size={14} className="mr-2" /> Voltar ao Início
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <div className="mt-12 p-6 rounded-3xl bg-muted/50 border border-border text-left overflow-auto max-w-2xl w-full">
              <p className="text-sm font-medium font-black uppercase tracking-widest text-muted-foreground mb-2">Detalhes técnicos:</p>
              <code className="text-xs text-destructive font-mono break-all">
                {this.state.error?.message}
              </code>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
