import type { NextApiRequest, NextApiResponse } from 'next';
import authMiddleware from '@/middleware/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({ message: 'You are authenticated' });
};

export default authMiddleware(handler);
