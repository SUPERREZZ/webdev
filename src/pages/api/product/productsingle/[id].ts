// pages/api/product/productsingle/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getProductsById } from '@/lib/supabase/service';
import { UUID } from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    const { id } = req.query
    try {
        const product = await getProductsById(id as UUID);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }

}
