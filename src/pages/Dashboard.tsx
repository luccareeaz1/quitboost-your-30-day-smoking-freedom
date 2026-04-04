import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Settings, MoreHorizontal, X, ArrowUpRight } from "lucide-react";
import { calculateQuitStats, calculateHealthProgress, HEALTH_MILESTONES } from "@/lib/calculations";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/app/AppLayout";

// Componente para desenhar cada Círculo de Progresso no estilo iOS
function ProgressRing({ percentage, label }: { percentage: number, label: string }) {
  const radius = 34; // tamanho ajustado para alinhar perfeitamente 3 lado a lado
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center w-24">
      <div className="relative w-[76px] h-[76px] flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="#E5E5EA" strokeWidth="5" />
          <motion.circle
            cx="40" cy="40" r={radius}
            fill="none"
            stroke="#4D7E0E"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[17px] font-normal text-black font-sans tracking-tight">
          {Math.floor(percentage)}%
        </div>
      </div>
      <span className="text-[11px] font-medium text-gray-800 text-center mt-3 leading-[1.2] px-1 h-8 flex items-start justify-center">
        {label}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [now, setNow] = useState(new Date());

  // Modal States
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showFinanceModal, setShowFinanceModal] = useState(false);

  useEffect(() => {
    if (!profile && !user) return;
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [profile, user]);

  const stats = useMemo(() => {
    if (!profile) return null;
    const quitStats = calculateQuitStats({
      quit_date: profile.quit_date || new Date().toISOString(),
      cigarettes_per_day: profile.cigarettes_per_day || 0,
      price_per_cigarette: Number(profile.price_per_cigarette) || 0,
    }, now);
    
    const milestones = calculateHealthProgress(quitStats.totalSeconds);
    const annualSavings = (profile.cigarettes_per_day || 0) * (Number(profile.price_per_cigarette) || 0) * 365;

    return { ...quitStats, milestones, annualSavings };
  }, [profile, now]);

  if (!profile || !stats) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#4D7E0E]/20 border-t-[#4D7E0E] rounded-full animate-spin" />
      </div>
    );
  }

  // Filtrar os próximos 3 objetivos que não chegaram a 100% ainda
  // Se todos chegaram a 100%, mostra os 3 últimos
  const ongoing = stats.milestones.filter(m => !m.achieved);
  const displayMilestones = ongoing.length >= 3 ? ongoing.slice(0, 3) : stats.milestones.slice(-3);

  return (
    <AppLayout>
      <div className="min-h-screen bg-white font-sans pb-24">
        
        {/* Painel Hero Top - Green */}
        <div className="bg-[#528114] text-white pt-10 pb-6 px-4 flex flex-col relative rounded-b-none md:rounded-b-3xl">
          <div className="flex items-center justify-between mb-2 z-10 relative">
            <button className="p-2 -ml-2" onClick={() => navigate('/perfil')}>
              <Settings className="w-6 h-6 text-white/90" />
            </button>
            <h1 className="text-lg font-bold tracking-wide">Painel</h1>
            <button className="p-2 -mr-2 text-white/90 font-black">
               {/* 3 dots minimal menu mock */}
               <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center pt-4 pb-2 relative z-10">
            <div className="text-[64px] leading-none font-bold tracking-tight">{stats.days}</div>
            <div className="text-[13px] font-medium uppercase tracking-widest text-white/90 mt-1">
              Dias sem Fumar
            </div>
            
            <div className="flex gap-3 justify-center items-center mt-3 opacity-80 text-sm font-semibold tracking-wide">
              <span>{String(stats.hours).padStart(2, '0')} h</span>
              <span>:</span>
              <span>{String(stats.minutes).padStart(2, '0')} m</span>
              <span>:</span>
              <span>{String(stats.seconds).padStart(2, '0')} s</span>
            </div>
          </div>
        </div>

        {/* Content Modules */}
        <div className="px-4 py-8 space-y-8 max-w-lg mx-auto">

          {/* Saúde */}
          <section className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-1 mb-8">
              <h2 className="text-[22px] text-gray-900 font-normal">As suas melhorias de saúde</h2>
              <ArrowUpRight className="w-4 h-4 text-gray-300 ml-1" />
            </div>

            <div className="flex justify-center gap-2 mb-8 w-full">
              {displayMilestones.map((m) => (
                <ProgressRing key={m.title} percentage={m.progress} label={m.title} />
              ))}
            </div>

            <button 
              onClick={() => setShowHealthModal(true)}
              className="bg-[#528114] text-white text-[13px] font-bold tracking-wider px-8 py-3 rounded-full uppercase transition-transform active:scale-95"
            >
              Explorar
            </button>
          </section>

          <hr className="border-gray-200/60" />

          {/* Economia */}
          <section className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-1 mb-4">
              <h2 className="text-[22px] text-gray-900 font-normal">Dinheiro poupado</h2>
              <ArrowUpRight className="w-4 h-4 text-gray-300 ml-1" />
            </div>

            <div className="text-[52px] font-light text-[#528114] mb-4 tracking-tight leading-none text-center">
               R$ {stats.moneySaved.toFixed(2).replace('.', ',')}
            </div>

            <div className="text-[13px] text-gray-500 font-medium mb-1">
               Poupança anual
            </div>
            <div className="text-[26px] font-light text-[#528114] mb-8 leading-none">
               R$ {stats.annualSavings.toFixed(2).replace('.', ',')}
            </div>

            <button 
              onClick={() => setShowFinanceModal(true)}
              className="bg-[#528114] text-white text-[13px] font-bold tracking-wider px-8 py-3 rounded-full uppercase transition-transform active:scale-95"
            >
              Explorar
            </button>
          </section>

        </div>
      </div>

      {/* --- Modals for Explorar --- */}
      <AnimatePresence>
        {showHealthModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white overflow-y-auto"
          >
            <div className="sticky top-0 bg-[#528114] text-white px-4 py-4 flex items-center shadow-sm z-10">
              <button onClick={() => setShowHealthModal(false)} className="p-2"><X className="w-6 h-6" /></button>
              <h1 className="text-lg font-bold ml-4">Melhorias Explicadas</h1>
            </div>
            <div className="px-4 py-6 pb-24 max-w-lg mx-auto space-y-6">
               <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                 Aqui estão {stats.milestones.length} métricas científicas documentando o que acontece ao longo do tempo quando você deixa de fumar. Elas avançam magicamente para mostrar que seu esforço já está rendendo frutos.
               </p>
               {stats.milestones.map((m, idx) => (
                 <div key={idx} className={`border-b border-gray-100 pb-5 ${m.achieved ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="flex justify-between items-end mb-2">
                      <h3 className="text-black font-semibold text-lg">{m.title}</h3>
                      <span className="text-[#528114] font-medium text-sm">{Math.floor(m.progress)}%</span>
                    </div>
                    <p className="text-gray-500 text-[15px] leading-relaxed mb-3">{m.description}</p>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-[#528114] h-full" style={{ width: `${m.progress}%` }} />
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>
        )}

        {showFinanceModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white overflow-y-auto"
          >
            <div className="sticky top-0 bg-[#528114] text-white px-4 py-4 flex items-center shadow-sm z-10">
              <button onClick={() => setShowFinanceModal(false)} className="p-2"><X className="w-6 h-6" /></button>
              <h1 className="text-lg font-bold ml-4">Métricas Financeiras</h1>
            </div>
            <div className="px-5 py-8 pb-24 max-w-lg mx-auto">
               <div className="bg-[#F2F2F7] rounded-3xl p-8 text-center mb-8">
                 <div className="text-sm font-semibold uppercase text-gray-500 tracking-wider mb-2">Você vai salvar</div>
                 <div className="text-5xl font-bold text-[#528114] tracking-tight">R$ {(stats.annualSavings * 5).toFixed(2).replace('.', ',')}</div>
                 <div className="text-gray-500 font-medium mt-2">em 5 anos</div>
               </div>

               <div className="space-y-4">
                 <h3 className="font-bold text-lg text-black border-b border-gray-200 pb-2 mb-4">Projeção Dinâmica</h3>
                 <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">1 Mês</span>
                    <span className="text-black font-bold">R$ {(stats.annualSavings / 12).toFixed(2).replace('.',',')}</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-t border-gray-100">
                    <span className="text-gray-600 font-medium">3 Meses</span>
                    <span className="text-black font-bold">R$ {(stats.annualSavings / 4).toFixed(2).replace('.',',')}</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-t border-gray-100">
                    <span className="text-gray-600 font-medium">6 Meses</span>
                    <span className="text-black font-bold">R$ {(stats.annualSavings / 2).toFixed(2).replace('.',',')}</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-t border-gray-100 bg-[#528114]/5 -mx-4 px-4 rounded-lg">
                    <span className="text-[#528114] font-bold">1 Ano</span>
                    <span className="text-[#528114] font-bold text-xl">R$ {(stats.annualSavings).toFixed(2).replace('.',',')}</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-t border-gray-100">
                    <span className="text-gray-600 font-medium">10 Anos</span>
                    <span className="text-black font-bold text-lg">R$ {(stats.annualSavings * 10).toFixed(2).replace('.',',')}</span>
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </AppLayout>
  );
}
