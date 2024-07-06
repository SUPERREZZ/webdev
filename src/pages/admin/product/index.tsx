// pages/admin/products/index.tsx

import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Dashboard from '../..';
import Button from '@/components/ui/button';
import { useState } from 'react';
import Image from 'next/image';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    stock: number;
    colors: string[];
    sizes: string[];
}

interface ProductsPageProps {
    initialProducts: Product[];
}

const fetchProducts = async () => {
    const response = await fetch(`${process.env.URLFETCH}/api/product`);
    const data = await response.json();
    return data.data;
};

const truncateText = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
};

const ProductsPage: React.FC<ProductsPageProps> = ({ initialProducts }) => {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const router = useRouter();
    const [showFullDescription, setShowFullDescription] = useState<{ [key: string]: boolean }>({});

    const handleUpdate = (productId: string) => {
        router.push(`/admin/product/update/${productId}`);
    };

    const handleAddProduct = () => {
        router.push(`/admin/product/create`);
    };

    const toggleDescription = (productId: string) => {
        setShowFullDescription((prevState) => ({
            ...prevState,
            [productId]: !prevState[productId],
        }));
    };

    return (
        <Dashboard>
            <div className="p-4 space-y-4">
                <Button onClick={() => router.back()} type="button" className="flex items-center gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-5">
                    <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
                    <p>Back</p>
                </Button>
                <h1 className="text-4xl font-bold mb-4 text-center">Product Management</h1>
                <Button onClick={handleAddProduct} className=" px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                    Add Product
                </Button>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Image</th>
                                <th className="py-2 px-4 border-b">ID</th>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Description</th>
                                <th className="py-2 px-4 border-b">Stock</th>
                                <th className="py-2 px-4 border-b">Sizes</th>
                                <th className="py-2 px-4 border-b">Colors</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td className="py-2 px-4 border-b">
                                        <Image
                                            src={product.image_url}
                                            alt={product.name}
                                            width={50}
                                            height={50}
                                            className="object-cover rounded"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b">{product.id}</td>
                                    <td className="py-2 px-4 border-b">{product.name}</td>
                                    <td className="py-2 px-4 border-b">
                                        {showFullDescription[product.id]
                                            ? product.description
                                            : truncateText(product.description, 50)}
                                        <button
                                            onClick={() => toggleDescription(product.id)}
                                            className="text-blue-500 ml-2"
                                        >
                                            {showFullDescription[product.id] ? 'Show Less' : 'Show More'}
                                        </button>
                                    </td>
                                    <td className="py-2 px-4 border-b">{product.stock}</td>
                                    <td className="py-2 px-4 border-b">{product.sizes.join(', ')}</td>
                                    <td className="py-2 px-4 border-b">{product.colors.join(', ')}</td>
                                    <td className="py-2 px-4 border-b">
                                        <Button onClick={() => handleUpdate(product.id)} className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded">
                                            Update
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Dashboard>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    let initialProducts = [];

    try {
        initialProducts = await fetchProducts();
    } catch (error) {
        console.error(error);
    }

    return {
        props: {
            initialProducts,
        },
    };
};

export default ProductsPage;
