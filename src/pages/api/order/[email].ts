// pages/api/order/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { createOrder, getByEmail,getOrders } from '@/lib/supabase/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method === 'POST') {
        const { email } = req.query;
        try {
            const user = await getByEmail(email as string);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const { id: userId } = user;
            const newOrders = await createOrder(userId);
            res.status(200).json({ message: 'Order placed successfully', data: newOrders });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }else if (req.method === 'GET') {
        const { email } = req.query;
        try {
            const user = await getByEmail(email as string);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const { id: userId } = user;
            const orders = await getOrders(userId);
            if (orders) {
                return res.status(200).json({ message: 'Orders retrieved successfully', data: orders });
            } else {
                return res.status(404).json({ message: 'Orders not found' });
            }
        } catch (error) {
            
        }
    }

}
