import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext({
    user: null,
    token: null,
    login: async () => { },
    register: async () => { },
    logout: async () => { },
    loading: true,
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const { data } = await api.get('/auth/me');
            setUser(data);
        } catch (error) {
            console.error('Failed to fetch user', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        setToken(data.access_token);
        setUser(data.user);
        localStorage.setItem('token', data.access_token);
        return data.user;
    };

    const register = async (userData) => {
        const { data } = await api.post('/auth/register', userData);
        setToken(data.access_token);
        setUser(data.user);
        localStorage.setItem('token', data.access_token);
        return data.user;
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout failed', error);
        }
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
