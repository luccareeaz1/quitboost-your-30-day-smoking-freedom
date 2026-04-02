import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TIERS: Record<string, string> = {
  "price_1TDaiH2N0nzreyfm7NzaopPG": "standard", // Replace with your actual Price IDs
  "price_1TDaj82N0nzreyfmstYsVMTI": "elite",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });
  const signature = req.headers.get("stripe-signature");

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const body = await req.text();
    const event = signature 
      ? stripe.webhooks.constructEvent(body, signature, Deno.env.get("STRIPE_WEBHOOK_SECRET") || "")
      : JSON.parse(body); // Fallback for testing if secret not set

    console.log(`Processing event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const customerEmail = session.customer_email || session.customer_details?.email;
        const subscriptionId = session.subscription as string;
        
        // Get user by email
        const { data: userData, error: userError } = await supabaseClient
          .from("profiles")
          .select("id")
          .eq("id", session.client_reference_id || (await getUserByEmail(supabaseClient, customerEmail)))
          .single();

        if (userData) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0].price.id;
          const plan = TIERS[priceId] || "standard";

          await Promise.all([
            supabaseClient.from("subscriptions").upsert({
              user_id: userData.id,
              plan,
              status: "active",
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: subscriptionId,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            }),
            supabaseClient.from("profiles").update({
              stripe_customer_id: session.customer as string
            }).eq("id", userData.id)
          ]);
          
          console.log(`Subscription activated for ${userData.id} (Plan: ${plan})`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const priceId = subscription.items.data[0].price.id;
        const plan = TIERS[priceId] || "standard";
        
        await supabaseClient
          .from("subscriptions")
          .update({ 
            plan,
            status: subscription.status === "active" ? "active" : "past_due",
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
          })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await supabaseClient
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

async function getUserByEmail(supabase: SupabaseClient, email: string) {
  // This requires a custom RPC or a way to search auth.users which is restricted
  // Usually, we pass client_reference_id in Checkout Session
  console.log(`Searching user by email: ${email}`);
  return null;
}
