import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '../store/hooks';
import { STORAGE_KEYS } from '../constants/localStorage';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (isAuthenticated && token) {
            const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const newSocket = io(serverUrl, {
                auth: { token },
                transports: ['websocket'],
            });

            newSocket.on('connect', () => {
                setIsConnected(true);
            });

            newSocket.on('disconnect', () => {
                setIsConnected(false);
            });

            setSocket(newSocket);

            return () => {
                newSocket.close();
            };
        } else {
            setSocket(null);
            setIsConnected(false);
        }
    }, [isAuthenticated]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
