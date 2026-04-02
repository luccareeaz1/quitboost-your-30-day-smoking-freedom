import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { notificationService } from "@/lib/services";
import { toast } from "sonner";
import { Bell } from "lucide-react";

interface NotificationContextType {
  unreadCount: number;
  notifications: any[];
  requestPushPermission: () => Promise<boolean>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Load initial state
    const loadNotifications = async () => {
      try {
        const data = await notificationService.getAll(user.id);
        const count = await notificationService.getUnreadCount(user.id);
        setNotifications(data);
        setUnreadCount(count);
      } catch (error) {
        console.error("Failed to load notifications", error);
      }
    };

    loadNotifications();

    const channel = notificationService.subscribeToNotifications(user.id, (payload: any) => {
      const newNotification = payload as any; // The service passes payload.new
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Visual toast for the new notification
      toast(newNotification.title, {
        description: newNotification.body,
        action: {
          label: "Ver",
          onClick: () => {
            // Logic to navigate/action
          }
        },
        icon: <Bell className="text-primary" size={16} />
      });

      // Try browser native push if supported
      if (Notification.permission === "granted") {
        new Notification(newNotification.title, {
          body: newNotification.body,
          icon: "/favicon.ico"
        });
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const requestPushPermission = async () => {
    if (!("Notification" in window)) {
      console.warn("Notifications non-supported");
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === "granted";
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      await notificationService.markAllAsRead(user.id);
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  return (
    <NotificationContext.Provider value={{ unreadCount, notifications, requestPushPermission, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
