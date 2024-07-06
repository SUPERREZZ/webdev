import type { NextApiRequest, NextApiResponse } from 'next';
import { getOrdersWithProductDetails } from '@/lib/supabase/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const orders = await getOrdersWithProductDetails();
            return res.status(200).json(orders);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
