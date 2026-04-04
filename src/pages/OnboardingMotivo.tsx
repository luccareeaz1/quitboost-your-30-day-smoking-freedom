import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/lib/services";
import { toast } from "sonner";

export default function OnboardingMotivo() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customMotivation, setCustomMotivation] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    if (!user && !isSubmitting) navigate("/auth");
  }, [user, navigate, isSubmitting]);

  const handleSelect = async (motivation: string) => {
    if (!user) return;
    try {
      setIsSubmitting(true);
      // Fetch current profile to get triggers and append this motivation to it
      const profile = await profileService.get(user.id);
      const existingTriggers = profile?.triggers || [];
      
      await profileService.update(user.id, {
        triggers: [...existingTriggers, `Motivo: ${motivation}`]
      });
      
      // Proceed to checkout
      navigate("/checkout");
    } catch (error) {
      console.error("Erro ao salvar motivo:", error);
      // Even if it fails, proceed so the user is not stuck
      navigate("/checkout");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomSubmit = () => {
    if (!customMotivation.trim()) return;
    handleSelect(customMotivation);
  };

  const options = [
    "Porque quero viver uma vida longa e feliz",
    "Porque quero ter mais dinheiro",
    "Porque quero estar por perto para a minha família",
    "Porque quero sentir-me livre",
    "Porque eu prometi que o faria"
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans px-6 pt-16 pb-10">
      <div className="flex-1 max-w-md mx-auto w-full">
        {/* Header Title */}
        <h1 className="text-3xl font-light text-black text-center leading-tight mb-8">
          Qual é o teu motivo para deixar<br />de fumar?
        </h1>

        <p className="text-[15px] text-zinc-600 leading-relaxed mb-6">
          Lembra-te de qual é a tua principal razão para parar de fumar e os teus desejos serão mais fáceis de vencer. Acrescentaremos isto ao teu painel. Podes editá-la em qualquer altura.
        </p>

        <p className="text-[15px] text-zinc-800 mb-4">Escolhe a tua</p>

        {/* Motivation Options List */}
        <div className="flex flex-col gap-3">
          {options.map((option) => (
            <button
              key={option}
              disabled={isSubmitting}
              onClick={() => handleSelect(option)}
              className="w-full text-left bg-[#F2F2F7] hover:bg-[#E5E5EA] text-black text-[15px] font-medium py-4 px-5 rounded-[18px] transition-colors active:scale-[0.98]"
            >
              {option}
            </button>
          ))}
          
          {!showCustom ? (
            <button
              onClick={() => setShowCustom(true)}
              className="w-full text-left bg-[#F2F2F7] hover:bg-[#E5E5EA] text-black text-[15px] font-medium py-4 px-5 rounded-[18px] transition-colors active:scale-[0.98]"
            >
              Escreve a tua própria
            </button>
          ) : (
            <div className="mt-2 flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="Descreva seu motivo" 
                value={customMotivation}
                onChange={(e) => setCustomMotivation(e.target.value)}
                className="w-full bg-[#F2F2F7] text-black text-[15px] font-medium py-4 px-5 rounded-[18px] outline-none border border-transparent focus:border-zinc-300"
                autoFocus
              />
              <button 
                onClick={handleCustomSubmit}
                disabled={!customMotivation.trim() || isSubmitting}
                className="w-full bg-black text-white py-4 rounded-[18px] font-bold tracking-wide disabled:opacity-50"
              >
                Salvar Motivo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Ignore option */}
      {!showCustom && (
        <div className="pt-10 flex justify-center pb-4">
          <button 
            disabled={isSubmitting}
            onClick={() => navigate("/checkout")}
            className="text-black font-bold text-[13px] tracking-widest uppercase hover:opacity-70 transition-opacity"
          >
            {isSubmitting ? "Carregando..." : "Ignorar"}
          </button>
        </div>
      )}
    </div>
  );
}
