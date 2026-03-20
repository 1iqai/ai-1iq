import {type Notification } from "../contexts/NotificationContext";

// Custom notification payload type (replaces Firebase MessagePayload)
export interface NotificationPayload {
    notification?: {
        title?: string;
        body?: string;
    };
    data?: Record<string, string>;
}

export interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: NotificationPayload) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void
}