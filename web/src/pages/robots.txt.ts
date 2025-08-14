import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const host = `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`;
	const content = `User-agent: *
Allow: /

Sitemap: ${host}/sitemap.xml
`;
	res.setHeader('Content-Type', 'text/plain');
	res.send(content);
}