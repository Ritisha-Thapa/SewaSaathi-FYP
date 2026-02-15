import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hydrate state from localStorage on mount
        const access = localStorage.getItem('access');
        const role = localStorage.getItem('role');
        const name = localStorage.getItem('first_name');

        if (access) {
            setUser({ role, first_name: name });
        }
        setLoading(false);
    }, []);

    const login = (data) => {
        const { token, user: userData } = data;
        localStorage.setItem('access', token.access);
        localStorage.setItem('refresh', token.refresh);
        localStorage.setItem('role', userData.role);
        localStorage.setItem('first_name', userData.first_name);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('role');
        localStorage.removeItem('first_name');
        setUser(null);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
