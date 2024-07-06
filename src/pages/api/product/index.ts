import { NextApiRequest, NextApiResponse } from "next";
import { createProduct, getProducts } from "@/lib/supabase/service";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        try {
            const products = await getProducts();
           return res.status(200).json({message:"success",data:products});
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        }
    }else if (req.method === 'POST') {
        const { name, description, price, image_url, stock, colors, sizes,location } = req.body;
        console.log(name, description, price, image_url, stock, colors, sizes,location)
        if (!name || !description || !price || !image_url || !stock || !colors || !sizes || !location) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        try {
            const newProduct = await createProduct({ name, description, price, image_url, stock, colors, sizes,location });
            return res.status(200).json({message:"success",data:newProduct});
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }else{
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }

}

export default handler