// pages/api/product/productsingle/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { createProduct, getProductsById, updateProductById } from '@/lib/supabase/service';
import { UUID } from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query
    if (req.method === 'GET') {
        try {
            const product = await getProductsById(id as UUID);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }else if (req.method === 'PUT') {
        const { name, description, price, image_url, stock, colors, sizes } = req.body;

        if (!name || !description || !price || !image_url || !stock || !colors || !sizes) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        try {
            const updatedProduct = await updateProductById(id as UUID, { name, description, price, image_url, stock, colors, sizes });
            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json(updatedProduct);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
