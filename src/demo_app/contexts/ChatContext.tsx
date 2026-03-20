import { createContext, useState, type ReactNode } from "react";
import type { ChatContextType } from "../types/ChatContextType";

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const ChatContext = createContext<ChatContextType | null>(null);

interface ChatProviderProps {
    children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
    const [chat, setChat] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);


    const sendPrompt = async (_params: string, prompt: string): Promise<void> => {
        if (!prompt.trim()) return;

        setLoading(true);
        const userMessage: Message = { role: 'user', content: prompt };
        setChat((prev) => [...prev, userMessage]);

        // Demo mode: AI assistant is not available without a backend
        const assistantMessage: Message = {
            role: 'assistant',
            content: 'The AI assistant is not available in demo mode. Please connect to a backend to enable this feature.',
        };
        setChat((prev) => [...prev, assistantMessage]);
        setLoading(false);
    }

    return (
        <ChatContext.Provider
            value={{ chat, sendPrompt, loading }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;