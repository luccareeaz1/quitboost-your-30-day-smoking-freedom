// Lightweight analytics shim — logs to console.
// Replace with a real analytics table/provider when needed.
export const trackEvent = async (eventName: string, metadata: any = {}) => {
  try {
    if (!eventName) return;
    if (typeof window !== "undefined" && import.meta.env.DEV) {
      console.debug("[analytics]", eventName, metadata);
    }
  } catch (error) {
    console.error("Failed to track event:", error);
  }
};
