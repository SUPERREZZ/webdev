import type { NextApiRequest, NextApiResponse } from 'next';
import { signIn } from '@/lib/supabase/service';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await signIn(email, password);
        return res.status(200).json({ message: 'Sign in successful', user });
    } catch (error: any) {
        return res.status(401).json({ message: error.message });
    }
};

export default handler;
