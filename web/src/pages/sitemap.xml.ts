import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { API_BASE_URL } from '../lib/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { data } = await axios.get(`${API_BASE_URL}/api/cars`);
	const cars = data.cars || [];
	const host = `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`;
	const urls = cars.map((c: any) => `<url><loc>${host}/cars/${c._id}</loc></url>`).join('');
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			<url><loc>${host}/</loc></url>
			${urls}
		</urlset>`;
	res.setHeader('Content-Type', 'application/xml');
	res.send(xml);
}