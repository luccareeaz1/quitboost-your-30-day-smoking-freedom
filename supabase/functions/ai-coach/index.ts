import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    // Rate Limiting Logic
    const { data: usage } = await supabaseClient
      .from("user_usage_limits")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const { data: subscription } = await supabaseClient
      .from("subscriptions")
      .select("plan")
      .eq("user_id", user.id)
      .single();

    const plan = subscription?.plan || "free";
    const maxRequests = plan === "elite" ? 100 : plan === "standard" ? 30 : 10;
    
    let dailyRequests = usage?.daily_ai_requests || 0;
    const lastReset = usage?.last_reset_at ? new Date(usage.last_reset_at) : new Date(0);
    const now = new Date();

    // Reset if 24h passed
    if (now.getTime() - lastReset.getTime() > 24 * 60 * 60 * 1000) {
      dailyRequests = 0;
      await supabaseClient
        .from("user_usage_limits")
        .upsert({ user_id: user.id, daily_ai_requests: 0, last_reset_at: now.toISOString(), max_daily_requests: maxRequests });
    }

    if (dailyRequests >= maxRequests) {
      return new Response(JSON.stringify({ 
        error: "Limite diário atingido", 
        message: `Você atingiu seu limite de ${maxRequests} mensagens diárias no plano ${plan}. Faça upgrade para continuar!` 
      }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, profile } = await req.json();
    
    // System Prompt and OpenAI Logic
    const SYSTEM_PROMPT = `Você é o Coach Neural do app QuitBoost — um coach especializado em cessação tabágica.
    Suas diretrizes:
    - Use técnicas baseadas em evidências (TCC, OMS, CDC, INCA)
    - Seja empático, motivador e prático
    - Responda SEMPRE em português brasileiro
    - Use formatação markdown (negrito, listas, emojis)
    - Nunca recomende medicamentos — sugira que o usuário consulte um médico
    - Mantenha respostas concisas (máx 500 palavras)`;

    let personalizedPrompt = SYSTEM_PROMPT;
    if (profile) {
      personalizedPrompt += `\n\nContexto do Usuário:
- Nome: ${profile.name || 'Guerreiro'}
- Data de Parada: ${profile.quitDate || 'Não definida'}
- Principal Motivação: ${profile.motivation || 'Saúde e Liberdade'}`;
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "system", content: personalizedPrompt }, ...messages],
        stream: false, // For easier usage counting in this refactor
      }),
    });

    if (!response.ok) throw new Error("Erro ao conectar com OpenAI");

    const result = await response.json();

    // Increment Usage
    await supabaseClient
      .from("user_usage_limits")
      .upsert({ 
        user_id: user.id, 
        daily_ai_requests: dailyRequests + 1, 
        last_reset_at: usage?.last_reset_at || now.toISOString(),
        max_daily_requests: maxRequests
      });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro interno" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
