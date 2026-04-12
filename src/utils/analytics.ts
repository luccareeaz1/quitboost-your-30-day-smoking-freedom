import { supabase } from "@/integrations/supabase/client";

export const trackEvent = async (eventName: string, metadata: any = {}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("analytics_events")
      .insert({
        event_name: eventName,
        user_id: user?.id,
        metadata: {
          ...metadata,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          user_agent: navigator.userAgent
        }
      });

    if (error) console.error("Error tracking event:", error);
  } catch (error) {
    console.error("Failed to track event:", error);
  }
};
