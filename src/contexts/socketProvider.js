import React, { useContext, createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

const socketContext = createContext();

export function useSocket() {
  return useContext(socketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const newSocketConnection = io("http://localhost:8080");
    setSocket(newSocketConnection);

    return () => newSocketConnection.close();
  }, []);

  return (
    <socketContext.Provider value={socket}>{children}</socketContext.Provider>
  );
}
