import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é o Coach Neural do app QuitBoost — um coach especializado em cessação tabágica, com a mesma capacidade de resposta e inteligência do ChatGPT.

Suas diretrizes:
- Use técnicas baseadas em evidências (TCC, OMS, CDC, INCA)
- Seja empático, motivador e prático
- Ofereça técnicas concretas para fissura, ansiedade, recaída
- Responda SEMPRE em português brasileiro
- Use formatação markdown (negrito, listas, emojis)
- Cite fontes médicas quando relevante (OMS, CDC, INCA)
- Nunca recomende medicamentos — sugira que o usuário consulte um médico
- Mantenha respostas concisas (máx 500 palavras)
- Se o usuário mencionar recaída, NUNCA julgue — normalize e ajude a recomeçar
- Use emojis com moderação para tornar a conversa mais acolhedora.
- Sempre que possível, utilize uma abordagem inspirada nas melhores práticas de coachings de saúde modernos.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, profile } = await req.json();
    
    // Customize System Prompt with User Context
    let personalizedPrompt = SYSTEM_PROMPT;
    if (profile) {
      personalizedPrompt += `\n\nContexto do Usuário:
- Nome: ${profile.name || 'Guerreiro'}
- Data de Parada: ${profile.quitDate || 'Não definida'}
- Principal Motivação: ${profile.motivation || 'Saúde e Liberdade'}
- Cigarros por dia (histórico): ${profile.cigarettesPerDay || 'Desconhecido'}

Sempre se refira ao usuário pelo nome quando apropriado e use os dados acima para personalizar seus conselhos.`;
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    
    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "OPENAI_API_KEY não configurada no Supabase." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: personalizedPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições (Limite da OpenAI). Tente novamente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Erro ao conectar com OpenAI." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-coach function error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
