import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import { useTheme } from "../../../../hooks/useTheme";
import { useChat } from "../../../../hooks/useChat";
import DOMPurify from "dompurify";
import { Alert, Box, Typography } from "@mui/material";
import toast from "react-hot-toast";

type OneiQChatProps = {
  selectedProject: any;
  selectedMilestone: any;
  selectedTeam: any;
  selectedTask: any;
};

const OneiQChat: React.FC<OneiQChatProps> = ({ selectedMilestone, selectedProject, selectedTask, selectedTeam }) => {
  const { chat, sendPrompt, loading } = useChat();
  const { isDark } = useTheme();

  const [input, setInput] = useState("");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    toast("AI Chat is not available in this demo.", { icon: "🛈", duration: 3000 });
    setInput("");
    return;
    const query = input;
    setInput("");

    const params = new URLSearchParams();

    if (selectedProject?.id !== "all") params.append("projectId", selectedProject.id);
    if (selectedMilestone !== "all" && selectedMilestone !== null) params.append("milestoneId", selectedMilestone);
    if (selectedTeam !== "all" && selectedTeam !== null) params.append("teamId", selectedTeam);
    if (selectedTask !== "all" && selectedTask !== null) params.append("taskId", selectedTask);

    params.append("prompt", query);
    // params.append("responseType", format);

    const queryString = params.toString();
    await sendPrompt(queryString, query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <>
      <Box
        className="chat-container"
        sx={{
          backgroundColor: "background.default",
          height: {
            xs: "calc(100vh - 140px)",
            sm: "calc(100vh - 140px)",
            md: "calc(100vh - 172px)",
          },
          borderRadius: "8px",
          border: 1,
          borderColor: "divider",
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center px-4 py-3 border-b ${isDark ? "border-gray-700" : "border-gray-200"
            }`}
        >
          <Typography variant="h6" component="div">
            1iQ Chat
          </Typography>
        </div>

        <div
          className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 scroll-smooth"
          style={{ scrollbarWidth: "thin" }}
        >
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            <strong>Demo mode</strong> — AI Chat is not available in this demo. Sending a message will not produce a response.
          </Alert>

          {chat.length === 0 && (
            <Box className="chat-get-started" sx={{ mb: 0, mt: 4 }}>
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                How can I assist?
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "center", color: isDark ? "gray.400" : "gray.500", mt: 1 }}>
                Ask me anything about your project, tasks, or team!
              </Typography>
            </Box>
          )}

          {chat.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
              >
                <div
                  className={`p-2 rounded-full flex-shrink-0 ${msg.role === "user" ? "bg-blue-500" : isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  )}
                </div>

                <div
                  className={`p-2 sm:p-3 rounded-2xl text-xs sm:text-sm break-words ${msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : isDark
                      ? "bg-gray-800 text-gray-100"
                      : "bg-gray-100 text-gray-900"
                    }`}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(msg.content || ""),
                  }}
                />
              </div>
            </motion.div>
          ))}

          {loading && (
            <>
              <div className={`flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[80%]  flex-row `}>
                <div className={`p-2 rounded-full flex-shrink-0 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                </div>

                <div
                  className={`p-2 sm:p-3 rounded-2xl text-xs sm:text-sm break-words ${isDark ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"
                    }`}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize("Typing...."),
                  }}
                />
              </div>
            </>
          )}
          <div ref={chatEndRef} />
        </div>
        {/* Input Box */}
        <div
          className={`p-2 sm:p-3 border-t flex flex-col gap-2 sm:gap-3 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"
            }`}
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Text Input & Send Button */}
            <div className="flex items-center gap-2 flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
                placeholder="Ask 1iQ..."
                rows={1}
                className={`flex-1 resize-none p-2 rounded-lg border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark
                  ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
};

export default OneiQChat;
