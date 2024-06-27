import type { NextApiRequest, NextApiResponse } from 'next'
import { signUp } from '@/lib/supabase/service';
import cookie from 'cookie';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const response = await signUp(req.body, (sts: boolean, token?: string) => {
            if (sts && token) {
                res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60,
                    sameSite: 'strict',
                    path: '/',
                }));
                return res.status(200).json({ message: 'success', status: true });
            }
            return res.status(400).json({ message: 'failed', sts: false });
        });
        
    }else{
        return res.status(410).json({ message:'Method not allowed',status:false });
    }
}

export default handler;