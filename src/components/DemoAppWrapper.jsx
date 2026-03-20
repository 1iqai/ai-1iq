import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../demo_app/theme/theme";
import { ThemeProviderRaw } from "../demo_app/contexts/ThemeContext";
import { AuthProvider } from "../demo_app/contexts/AuthContext";
import { SocketProvider } from "../demo_app/contexts/SocketContext";
import NotificationProvider from "../demo_app/contexts/NotificationContext";
import ChatProvider from "../demo_app/contexts/ChatContext";
import App from "../demo_app/App";

// Importing dashboard fonts & styles
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "../demo_app/index.css"; 

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 30, color: '#e11d48', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 8, margin: 20, fontFamily: 'monospace' }}>
          <h1 style={{ fontSize: 20, marginBottom: 10 }}>Something went wrong inside the Demo App Layout:</h1>
          <p style={{ fontWeight: 'bold' }}>{this.state.error?.message}</p>
          <pre style={{ fontSize: 12, overflow: 'auto', maxHeight: '600px', background: '#ffffff', padding: 10, borderRadius: 4 }}>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children; 
  }
}

export default function DemoAppWrapper() {
  return (
    <div className="demo-scope">
      <ThemeProvider theme={theme}>
        <ThemeProviderRaw>
          <AuthProvider>
            <SocketProvider>
              <NotificationProvider>
                <ChatProvider>
                  <ErrorBoundary>
                    <App />
                  </ErrorBoundary>
                </ChatProvider>
              </NotificationProvider>
            </SocketProvider>
          </AuthProvider>
        </ThemeProviderRaw>
      </ThemeProvider>
    </div>
  );
}
