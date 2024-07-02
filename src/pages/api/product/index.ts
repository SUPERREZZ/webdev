import { NextApiRequest, NextApiResponse } from "next";
import { getProducts } from "@/lib/supabase/service";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    try {
        const products = await getProducts();
       return res.status(200).json({message:"success",data:products});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }

}

export default handler