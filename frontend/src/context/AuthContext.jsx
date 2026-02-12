import { createContext, useState, useEffect, useContext } from 'react';
<<<<<<< HEAD
import api from '../api/axiosConfig';
=======
import axios from 'axios';
>>>>>>> c5cb1bd4b96ab4c7275e81b709ca115f32511f6d

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(
        localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo'))
            : null
    );

    const login = async (email, password) => {
<<<<<<< HEAD
        const { data } = await api.post('/api/users/login', { email, password });
=======
        const { data } = await axios.post('/api/users/login', { email, password });
>>>>>>> c5cb1bd4b96ab4c7275e81b709ca115f32511f6d
        setUserInfo(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
    };

    const register = async (name, email, password) => {
<<<<<<< HEAD
        const { data } = await api.post('/api/users', { name, email, password });
=======
        const { data } = await axios.post('/api/users', { name, email, password });
>>>>>>> c5cb1bd4b96ab4c7275e81b709ca115f32511f6d
        setUserInfo(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
    };

    const logout = () => {
        setUserInfo(null);
        localStorage.removeItem('userInfo');
    };

    return (
        <AuthContext.Provider value={{ userInfo, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
