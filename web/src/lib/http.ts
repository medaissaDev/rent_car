import axios from 'axios';
import { API_BASE_URL } from './config';

export const http = axios.create({ baseURL: API_BASE_URL });

export function setAuthToken(token: string | null) {
	if (token) http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	else delete http.defaults.headers.common['Authorization'];
}

export function getStoredAuth() {
	if (typeof window === 'undefined') return { token: null, user: null } as any;
	const token = localStorage.getItem('token');
	const userRaw = localStorage.getItem('user');
	const user = userRaw ? JSON.parse(userRaw) : null;
	return { token, user };
}