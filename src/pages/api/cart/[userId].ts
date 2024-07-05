// pages/api/cart.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getDataCartByIdUser, updateCart } from '@/lib/supabase/service';
import { UUID } from 'crypto';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;
  try {
    switch (req.method) {
      case 'GET':
        const cart = await getDataCartByIdUser(userId as UUID);
        res.status(200).json(cart);
        break;
      case 'POST':
        const { cart: newCart } = req.body;
        await updateCart(userId as UUID, newCart);
        res.status(200).json({ message: 'Cart updated' });
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
