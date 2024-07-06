// pages/api/order/queryEmail/[email].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { createOrder, deleteOrderByEmail, getByEmail,getOrders } from '@/lib/supabase/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email } = req.query;
    if (req.method === 'POST') {
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
    }else if (req.method === 'DELETE') {
        try {
            await deleteOrderByEmail(email as string);
            res.status(200).json({ message: 'Order deleted successfully' });
        } catch (error: any) {
            console.error('Error deleting order:', error);
            res.status(500).json({ message: error.message });
        }
    }else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }

}
