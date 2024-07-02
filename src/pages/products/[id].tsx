/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from 'next';
import Dashboard from '..';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faBoxes, faCartShopping, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/ui/button';

type Product = {
    id: string;
    name: string;
    price: number;
    description: string;
    image_url: string;
    stock: number;
    location: string;
    sizes: string[];
    colors: string[];
};

const ProductPage = ({ product }: { product: Product }) => {
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');

    const handleSizeChange = (size: string) => {
        setSelectedSize(size);
    };
    const handleColorChange = (color: string) => {
        setSelectedColor(color);
    };

    if (!product) {
        return <p>Loading...</p>;
    }


    return (
        <div className="w-full  bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 container mx-auto h-[75vh]">
            <div className="flex h-full">
                <div className="w-1/2 ">
                    <img src={product.image_url} alt={product.name} className='w-full h-full object-cover rounded-l-lg' />
                </div>
                <div className="w-1/2 p-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
                    <p className="text-lg mt-4 text-gray-700 dark:text-gray-300">{product.description}</p>
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Color:</h3>
                        <div className="flex items-center mt-2 space-x-2">
                            {product.colors.map((color, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleColorChange(color)}
                                    className={`w-8 h-8 rounded-full border border-gray-300 ${selectedColor === color ? 'border-blue-500' : ''}`}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Size:</h3>
                        <div className="flex items-center mt-2 space-x-2">
                            {product.sizes.map((size, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSizeChange(size)}
                                    className={`px-3 py-1 text-sm font-medium rounded-lg border border-gray-300 ${selectedSize === size ? 'border-blue-500 text-blue-500' : ''}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500 mr-2" />
                            {product.location}
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            <FontAwesomeIcon icon={faBoxes} className="text-gray-500 mr-2" />
                            {product.stock} pcs
                        </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                        <Button type="button" className="flex items-center gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <p>Add to cart</p>
                            <FontAwesomeIcon icon={faCartShopping} className="text-white" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductPageWithDashboard = ({ product }: { product: Product }) => {
    const router = useRouter();
    return (
        <Dashboard>
            <div className='space-y-4 p-3'>
                <Button onClick={() => router.back()} type="button" className="flex items-center gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
                    <p>Back</p>
                </Button>
                <ProductPage product={product} />
            </div>
        </Dashboard>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params!;
    const productResponse = await fetch(`http://localhost:3000/api/product/productsingle/${id}`);
    const productData = await productResponse.json();

    return {
        props: {
            product: productData,
        },
    };
};

export default ProductPageWithDashboard;
