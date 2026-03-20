import type { Message } from "../contexts/ChatContext";

export type ChatContextType = {
    chat: Message[];
    sendPrompt: (params: string, prompt: string) => Promise<void>;
    loading: boolean;
}