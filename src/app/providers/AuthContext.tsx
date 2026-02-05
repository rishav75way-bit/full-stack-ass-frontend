import { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/auth.types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUser, clearUser } from '../store/slices/authSlice';
import { STORAGE_KEYS } from '../constants/localStorage';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (token && storedUser) {
            dispatch(setUser(JSON.parse(storedUser)));
        }
    }, [dispatch]);

    const login = (token: string, userData: User) => {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
        dispatch(setUser(userData));
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_WORKSPACE);
        dispatch(clearUser());
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
