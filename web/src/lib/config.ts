export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
export const SOCKET_IO_URL = process.env.NEXT_PUBLIC_SOCKET_IO_URL || 'http://localhost:4000';
export function toImageUrl(path: string) {
	if (!path) return path;
	if (path.startsWith('http')) return path;
	return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}