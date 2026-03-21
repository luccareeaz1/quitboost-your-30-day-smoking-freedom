import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText, Scale, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PoliticaPrivacidade = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all mb-12"
        >
          <div className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center group-hover:-translate-x-1 transition-transform">
             <ArrowLeft size={14} />
          </div>
          Voltar
        </button>

        <header className="mb-16">
           <div className="w-16 h-16 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary mb-8 shadow-soft">
              <ShieldCheck size={32} />
           </div>
           <h1 className="text-5xl font-black tracking-tighter mb-4 italic">Privacidade & <br />Conformidade <span className="text-primary italic">LGPD.</span></h1>
           <p className="text-muted-foreground font-medium text-lg leading-relaxed">Sua jornada para a liberdade exige confiança total. Veja como protegemos seus dados vitais.</p>
           <div className="flex items-center gap-2 mt-6">
              <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full">Versão 2026.1</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Última atualização: Março 2026</span>
           </div>
        </header>

        <div className="prose prose-invert max-w-none space-y-12">
           <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                 <Database size={20} />
                 <h2 className="text-xl font-black uppercase tracking-widest m-0">1. Coleta e Finalidade</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                O **QuitBoost** coleta dados essenciais para personalizar seu tratamento de cessação tabágica:
                <ul className="list-disc pl-6 space-y-2 mt-4">
                   <li><strong>Identificação:</strong> Nome e e-mail (para conta e segurança).</li>
                   <li><strong>Dados de Saúde:</strong> Frequência de fumo, gatilhos mentais, recaídas e métricas de saúde (usados exclusivamente para algoritmos clínicos e o Coach IA).</li>
                   <li><strong>Financeiro:</strong> Histórico de gastos com tabaco (para cálculo de economia).</li>
                </ul>
              </p>
           </section>

           <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                 <Lock size={20} />
                 <h2 className="text-xl font-black uppercase tracking-widest m-0">2. Segurança & RLS</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                Utilizamos tecnologia **Supabase** com **Row Level Security (RLS)** ativo. Isso significa que seus dados de saúde são isolados a nível de banco de dados — ninguém, exceto você, tem permissão técnica para acessar seus logs privados. A comunicação é protegida por criptografia **TLS 1.3** e armazenamento **AES-256**.
              </p>
           </section>

           <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                 <Scale size={20} />
                 <h2 className="text-xl font-black uppercase tracking-widest m-0">3. Seus Direitos (LGPD)</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você possui direito à:
                <ul className="list-disc pl-6 space-y-2 mt-4">
                   <li><strong>Confirmação de Acesso:</strong> Ver todos os dados que temos sobre você.</li>
                   <li><strong>Correção:</strong> Atualizar informações imprecisas.</li>
                   <li><strong>Eliminação:</strong> Excluir sua conta e todos os dados de saúde associados a qualquer momento (opção disponível nas Configurações).</li>
                   <li><strong>Portabilidade:</strong> Exportar seus logs em formato JSON/CSV.</li>
                </ul>
              </p>
           </section>

           <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                 <Eye size={20} />
                 <h2 className="text-xl font-black uppercase tracking-widest m-0">4. Compartilhamento</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                **Nunca vendemos seus dados.** Compartilhamos informações apenas com operadores essenciais:
                <ul className="list-disc pl-6 space-y-2 mt-4">
                   <li><strong>Supabase Inc:</strong> Infraestrutura de dados e autenticação.</li>
                   <li><strong>Stripe/Asaas:</strong> Apenas se você realizar uma assinatura (dados de pagamento não passam pelo nosso servidor).</li>
                </ul>
              </p>
           </section>

           <section className="bg-card p-8 rounded-[40px] border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                 <FileText size={20} className="text-primary" />
                 <h3 className="text-sm font-black uppercase tracking-widest m-0">DPO do Projeto</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Para dúvidas ou solicitações LGPD, contate nosso Encarregado de Dados (DPO) através do e-mail:<br />
                <span className="text-primary font-bold">privacidade@quitboost.com.br</span>
              </p>
           </section>
        </div>

        <footer className="mt-20 pt-10 border-t border-border/40 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">
           © 2026 QuitBoost Ecosistema • Saúde Digital Ética
        </footer>
      </div>
    </div>
  );
};

export default PoliticaPrivacidade;
