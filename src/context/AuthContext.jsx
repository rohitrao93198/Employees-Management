import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/localStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(storage.getCurrentUser());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = storage.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);


    const login = (email, password) => {
        const users = storage.getUsers();
        const foundUser = users.find(user => {
            const emailMatch = user.email.toLowerCase() === email.toLowerCase();
            const passwordMatch = user.password === password;
            return emailMatch && passwordMatch;
        });

        if (foundUser) {
            storage.setCurrentUser(foundUser);
            setUser(foundUser);
            return true;
        }

        return false;
    };

    const logout = () => {
        storage.clearCurrentUser();
        setUser(null);
    };

    const updateCurrentUser = (updatedUser) => {
        storage.setCurrentUser(updatedUser);
        setUser(updatedUser);
    };

    if (loading) {
        return null;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, updateCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};