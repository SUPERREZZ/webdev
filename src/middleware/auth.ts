import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { getCookie } from '@/lib/cookie';

const authMiddleware = (handler: NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const token = getCookie('token');

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }


        return handler(req, res);
    };
};

export default authMiddleware;
