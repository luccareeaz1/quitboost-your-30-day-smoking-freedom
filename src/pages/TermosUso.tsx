import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Scale, Star, Zap, ShieldCheck, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermosUso = () => {
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
              <Scale size={32} />
           </div>
           <h1 className="text-5xl font-black tracking-tighter mb-4 italic">Termos de <br />Uso & <span className="text-primary italic">Serviços.</span></h1>
           <p className="text-muted-foreground font-medium text-lg leading-relaxed">As regras do jogo para sua liberdade. Leia atentamente.</p>
           <div className="flex items-center gap-2 mt-6">
              <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full">Atualizado: Março 2026</span>
           </div>
        </header>

        <div className="prose prose-invert max-w-none space-y-12">
           <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                 <Heart size={20} />
                 <h2 className="text-xl font-black uppercase tracking-widest m-0">1. Natureza Informativa</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium bg-muted/30 p-8 rounded-[40px] border border-border/50 italic">
                **IMPORTANTE:** O QuitBoost é uma ferramenta de suporte à cessação tabágica e **não substitui** o acompanhamento médico presencial, psiquiátrico ou tratamentos farmacológicos prescritos por profissionais habilitados. O Coach IA utiliza algoritmos informativos baseados em diretrizes da OMS e INCA, mas não emite prescrições médicas.
              </p>
           </section>

           <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                 <Star size={20} />
                 <h2 className="text-xl font-black uppercase tracking-widest m-0">2. Uso do Serviço</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                Ao utilizar o QuitBoost e interagir com a Comunidade ou Desafios, você concorda em:
                <ul className="list-disc pl-6 space-y-2 mt-4 text-sm">
                   <li>Ter pelo menos 18 anos de idade.</li>
                   <li>Fornecer informações verdadeiras sobre seu hábito de fumo para maior eficácia do algoritmo.</li>
                   <li>Não praticar ofensas, bullying ou disseminar desinformação (fake news) médica na Comunidade.</li>
                   <li>Respeitar a privacidade dos outros "Guerreiros" do sistema.</li>
                </ul>
              </p>
           </section>

           <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                 <Zap size={20} />
                 <h2 className="text-xl font-black uppercase tracking-widest m-0">3. Assinatura & Elite</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                O Status Elite concede acesso ilimitado ao Coach IA Neural e Comunidades VIP. 
                <ul className="list-disc pl-6 space-y-2 mt-4 text-sm">
                   <li>O acesso é individual e intransferível.</li>
                   <li>O pagamento é processado via gateways terceiros (Stripe/Asaas).</li>
                   <li>Reembolsos seguem o Art. 49 do CDC brasileiro (direito de arrependimento em 7 dias).</li>
                </ul>
              </p>
           </section>

           <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                 <ShieldCheck size={20} />
                 <h2 className="text-xl font-black uppercase tracking-widest m-0">4. Modificações</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                Podemos modificar as funcionalidades a qualquer momento para melhorar a taxa de sucesso da cessação dos usuários. Você será notificado por e-mail ou via sistema se houver mudanças estruturais nos Termos.
              </p>
           </section>
        </div>

        <footer className="mt-20 pt-10 border-t border-border/40 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center justify-between">
           <span>QuitBoost Protocol 2026</span>
           <span className="text-primary italic font-black uppercase tracking-widest">Liberdade Digital</span>
        </footer>
      </div>
    </div>
  );
};

export default TermosUso;
