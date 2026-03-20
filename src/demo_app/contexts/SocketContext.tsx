// SocketProvider.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import type { SocketContextType } from "../types/SocketContextType";


const SocketContext = createContext<SocketContextType>({ socket: null, connected: false });

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);

  const socketUrl = import.meta.env.VITE_SOCKET_URL;
  const socket = useMemo(() => {
    if (!socketUrl) {
      return {
        on: () => { },
        off: () => { },
        connect: () => { },
        close: () => { },
        emit: () => { },
      } as any;
    }
    return io(`${socketUrl}`, { path: "/api/socket.io", autoConnect: true });
  }, [socketUrl]);
  useEffect(() => {
    const onConnect = () => setConnected(true);

    const onDisconnect = () => setConnected(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.close();
    };
  }, [socket]);

  return <SocketContext.Provider value={{ socket, connected }}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);
