import {getByEmail} from '@/lib/supabase/service';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try { 
        const user = await getByEmail(email);
        return res.status(200).json({ message: 'Sign in successful', data:{name:user?.name,email:user?.email,role:user?.role,id:user?.id} });
    } catch (error: any) {
        return res.status(401).json({ message: error.message });
    }

}
export default handler