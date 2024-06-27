import type { NextApiRequest, NextApiResponse } from 'next'
import { signUp } from '@/lib/supabase/service';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        await signUp(req.body, ({status,message}:{status:boolean,message:string}) => {
            if (status) {
                
                return res.status(200).json({ message: message, status: true });
            }
            return res.status(400).json({ message: message, status: false });
        });
        
    }else{
        return res.status(410).json({ message:'Method not allowed',status:false });
    }
}

export default handler;