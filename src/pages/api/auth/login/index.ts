import type { NextApiRequest, NextApiResponse } from 'next';
import supabase from '@/lib/supabase/init';
import bcrypt from 'bcrypt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(400).json({ message: 'User not found', status: false });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ message: 'Incorrect password', status: false });
        }
        return res.status(200).json({ message: 'Login successful', status: true });
    } else {
        return res.status(405).json({ message: 'Method not allowed', status: false });
    }
};

export default handler;
