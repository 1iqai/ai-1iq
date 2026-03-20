import { createContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "./SocketContext";
import type { NotificationContextType, NotificationPayload } from "../types/NotificationContext";

export interface Notification {
    id: string;
    title: string;
    body: string;
    source: string;
    type: string;
    projectId: string;
    taskId: string;
    issueId: string;
    dateCreated: string;
    projectName: string;
    taskName: string;
    issueDescription: string;
    pmName: string;
}



export const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    addNotification: () => { },
    markAsRead: async () => { },
    markAllAsRead: () => { }
});

const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { user } = useAuth();
    const { socket, connected } = useSocket();

    useEffect(() => {
        if (!user) {
            setNotifications([]);
            return;
        }

        // Fetch notifications from API
        const fetchData = async () => {
            try {
                // Demo app has no backend for notifications
                setNotifications([]);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
        fetchData();
    }, [user]);

    // Listen for real-time notifications via socket
    useEffect(() => {
        if (!socket || !connected || !user?.uid) return;

        const handleNewNotification = (data: any) => {
            // Only process notifications for the current user
            if (data.userUid !== user.uid) return;

            const notification = data.notification;
            setNotifications(prev => {
                // Avoid duplicates
                if (prev.some(n => n.id === notification.id)) return prev;
                return [notification, ...prev];
            });
        };

        socket.on("new_notification", handleNewNotification);

        return () => {
            socket.off("new_notification", handleNewNotification);
        };
    }, [socket, connected, user?.uid]);

    const addNotification = (payload: NotificationPayload) => {
        const newId = payload.data?.id as string;

        setNotifications(prev => {
            const isDuplicate = prev.some(notification => notification.id === newId);
            if (isDuplicate) return prev;

            return [
                ...prev,
                {
                    id: newId,
                    title: payload.notification?.title as string,
                    body: payload.notification?.body as string,
                    source: payload.data?.source || "",
                    type: payload.data?.type || "",
                    projectId: payload.data?.projectId || "",
                    taskId: payload.data?.taskId || "",
                    issueId: payload.data?.issueId || "",
                    dateCreated: payload.data?.dateCreated || "",
                    projectName: payload.data?.projectName || "",
                    taskName: payload.data?.taskName || "",
                    issueDescription: payload.data?.issueDescription || "",
                    pmName: payload.data?.pmName || ""
                }
            ];
        });
    };

    const markAsRead = async (id: string) => {
        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/notification/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error("Failed to mark notification as read");
            }

            setNotifications(prev =>
                prev.filter((notification: Notification) => notification.id !== id)
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem("token")

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/notification/user`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error("Failed to mark all notification as read");
            }

            setNotifications([]);
        } catch (error) {
            console.error("Error marking all notification as read:", error);
        }
    }
    return (
        <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;