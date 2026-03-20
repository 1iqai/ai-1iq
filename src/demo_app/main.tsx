import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";
import "./index.css";
// import { ThemeProvider } from './contexts/ThemeContext';
import { SocketProvider } from "./contexts/SocketContext";
import ChatProvider from "./contexts/ChatContext";
import NotificationProvider from "./contexts/NotificationContext";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";
import { ThemeProviderRaw } from "./contexts/ThemeContext";
const rootElement = document.getElementById("root");

// Importing font styles
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import '@fontsource/inter/600.css';
import "@fontsource/inter/700.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import '@fontsource/poppins/600.css';
import "@fontsource/poppins/700.css";

if (rootElement) {
  createRoot(rootElement).render(
    <>
      <ThemeProvider theme={theme} defaultMode="light">
        <BrowserRouter>
          <ThemeProviderRaw>
            <AuthProvider>
              <SocketProvider>
                <NotificationProvider>
                  <ChatProvider>
                    <App />
                  </ChatProvider>
                </NotificationProvider>
              </SocketProvider>
            </AuthProvider>
          </ThemeProviderRaw>
        </BrowserRouter>
      </ThemeProvider>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="custom-toast"
        theme="light"
        toastStyle={{ borderRadius: "8px" }}
      />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
        containerStyle={{ zIndex: 9999 }}
      />
    </>
  );
} else {
  // console.error("Refresh the page");
}
