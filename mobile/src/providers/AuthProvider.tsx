import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

interface User {
	_id: string;
	name: string;
	email: string;
	role: 'user' | 'company';
	companyName?: string;
	phone?: string;
}

interface AuthContextShape {
	user: User | null;
	token: string | null;
	login: (email: string, password: string) => Promise<void>;
	register: (payload: any) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextShape>({} as any);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		axios.defaults.baseURL = API_BASE_URL;
	}, []);

	useEffect(() => {
		if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		else delete axios.defaults.headers.common['Authorization'];
	}, [token]);

	async function login(email: string, password: string) {
		const { data } = await axios.post('/api/auth/login', { email, password });
		setToken(data.token);
		setUser(data.user);
	}

	async function register(payload: any) {
		const { data } = await axios.post('/api/auth/register', payload);
		setToken(data.token);
		setUser(data.user);
	}

	function logout() {
		setToken(null);
		setUser(null);
	}

	return (
		<AuthContext.Provider value={{ user, token, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}