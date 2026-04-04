import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/lib/services";
import { toast } from "sonner";

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State matching the image exactly
  const [whatFuma, setWhatFuma] = useState("Cigarros");
  const [precoMaco, setPrecoMaco] = useState("");
  const [quantosPorDia, setQuantosPorDia] = useState("");
  const [cigarrosNoMaco, setCigarrosNoMaco] = useState("");
  const [tempoPrimeiroCigarro, setTempoPrimeiroCigarro] = useState("");

  useEffect(() => {
    if (!user && !isSubmitting) navigate("/auth");
  }, [user, navigate, isSubmitting]);

  const handleContinue = async () => {
    if (!user) return;
    
    // Basic validation
    if (!precoMaco || !quantosPorDia || !cigarrosNoMaco || !tempoPrimeiroCigarro) {
      toast.error("Por favor, preencha todos os campos para continuarmos.");
      return;
    }

    try {
      setIsSubmitting(true);

      const price = parseFloat(precoMaco.replace(",", "."));
      const packSize = parseInt(cigarrosNoMaco, 10);
      const daily = parseInt(quantosPorDia, 10);
      const pricePerCigarette = price / packSize;

      // Supabase connection saving the answers
      await profileService.saveOnboarding(user.id, {
        cigarettes_per_day: daily,
        years_smoking: 1, // Defaulting as it's absent from the new layout
        price_per_cigarette: pricePerCigarette,
        quit_date: new Date().toISOString(),
        triggers: [
          `Fuma: ${whatFuma}`,
          `Primeiro cigarro: ${tempoPrimeiroCigarro}`
        ],
        display_name: user.email?.split("@")[0],
      });

      // Saving consent automatically for this fast-track onboarding
      await profileService.saveConsent(user.id, {
        policy_version: "2026.1",
        accepted_terms: true,
        accepted_health_data: true,
        marketing_consent: false,
      });

      toast.success("Plano personalizado gerado com sucesso!");
      navigate("/checkout");
    } catch (error) {
      console.error("Erro no onboarding:", error);
      toast.error("Ocorreu um erro ao salvar seus dados. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col font-sans">
      {/* Header */}
      <div className="bg-[#F9F9FB] border-b border-gray-200/60 pt-10 pb-4 px-4 sticky top-0 z-10 flex flex-col items-center shadow-sm">
        <h1 className="text-[17px] font-bold text-black tracking-tight">
          Sobre o seu hábito tabágico
        </h1>
      </div>

      {/* Main Form Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-24 space-y-6">
        
        {/* Section: O QUE FUMA? */}
        <section>
          <div className="text-[12px] font-semibold text-gray-500 uppercase px-2 mb-2 tracking-wide">
            O QUE FUMA?
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => setWhatFuma("Cigarros")}
              className="w-full flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-white active:bg-gray-50 transition-colors"
            >
              <span className="text-[17px] text-black">Cigarros</span>
              {whatFuma === "Cigarros" && <Check className="text-[#65A30D] w-5 h-5" />}
            </button>
            <button
              onClick={() => setWhatFuma("Tabaco de enrolar")}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-white active:bg-gray-50 transition-colors"
            >
              <span className="text-[17px] text-black">Tabaco de enrolar</span>
              {whatFuma === "Tabaco de enrolar" && <Check className="text-[#65A30D] w-5 h-5" />}
            </button>
          </div>
        </section>

        {/* Section: PREÇO DO MAÇO */}
        <section>
          <div className="text-[12px] font-semibold text-gray-500 uppercase px-2 mb-2 tracking-wide">
            PREÇO DO MAÇO
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm px-4 py-1">
            <input
              type="number"
              placeholder="Preço R$"
              value={precoMaco}
              onChange={(e) => setPrecoMaco(e.target.value)}
              className="w-full text-[17px] py-2.5 outline-none text-black placeholder:text-gray-300 bg-transparent"
            />
          </div>
        </section>

        {/* Section: QUANTOS FUMA (OU FUMAVA) POR DIA (APROXIMADAMENTE)? */}
        <section>
          <div className="text-[12px] font-semibold text-gray-500 uppercase px-2 mb-2 tracking-wide">
            QUANTOS FUMA (OU FUMAVA) POR DIA (APROXIMADAMENTE)?
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm px-4 py-1">
            <input
              type="number"
              placeholder="Por dia"
              value={quantosPorDia}
              onChange={(e) => setQuantosPorDia(e.target.value)}
              className="w-full text-[17px] py-2.5 outline-none text-black placeholder:text-gray-300 bg-transparent"
            />
          </div>
        </section>

        {/* Section: NÚMERO DE CIGARROS NUM MAÇO */}
        <section>
          <div className="text-[12px] font-semibold text-gray-500 uppercase px-2 mb-2 tracking-wide">
            NÚMERO DE CIGARROS NUM MAÇO
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm px-4 py-1">
            <input
              type="number"
              placeholder="Maço de"
              value={cigarrosNoMaco}
              onChange={(e) => setCigarrosNoMaco(e.target.value)}
              className="w-full text-[17px] py-2.5 outline-none text-black placeholder:text-gray-300 bg-transparent"
            />
          </div>
        </section>

        {/* Section: QUANTO TEMPO LEVA PARA FUMAR O PRIMEIRO CIGARRO APÓS ACORDAR? */}
        <section>
          <div className="text-[12px] font-semibold text-gray-500 uppercase px-2 mb-2 tracking-wide leading-tight">
            QUANTO TEMPO LEVA PARA FUMAR O PRIMEIRO CIGARRO APÓS ACORDAR?
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col">
            {[
              "Em 5 minutos",
              "6-30 minutos",
              "31-60 minutos",
              "Mais de 60 minutos"
            ].map((option, idx, arr) => (
              <button
                key={option}
                onClick={() => setTempoPrimeiroCigarro(option)}
                className={`w-full flex items-center justify-between px-4 py-3.5 bg-white active:bg-gray-50 transition-colors ${
                  idx !== arr.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <span className="text-[17px] text-black text-left">{option}</span>
                {tempoPrimeiroCigarro === option && <Check className="text-[#65A30D] w-5 h-5 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Sticky Button */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-[#F2F2F7] border-t border-gray-200/50 pb-8">
        <button
          disabled={isSubmitting}
          onClick={handleContinue}
          className={`w-full py-4 rounded-xl text-white font-bold text-[15px] tracking-wide uppercase transition-all shadow-md flex justify-center items-center ${
            isSubmitting ? "bg-[#5A8D15] opacity-70" : "bg-[#4D7E0E] active:scale-[0.98]"
          }`}
          style={{ backgroundColor: "#4A7A11" }} // Specific visual match to the image's green button
        >
          {isSubmitting ? "Carregando..." : "Habilitar Plano de Parada"}
        </button>
      </div>
    </div>
  );
}
