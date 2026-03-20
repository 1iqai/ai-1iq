import { useContext } from "react";
import { ChatContext} from "../contexts/ChatContext";
import type { ChatContextType } from "../types/ChatContextType";

export const useChat = (): ChatContextType=> {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within an ChatProvider");
  }
  return context;
};