/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from 'next';
import Dashboard from '..';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxes, faCartShopping, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/ui/button';
import { useSession } from 'next-auth/react';

type Product = {
    id: string;
    name: string;
    price: number;
    description: string;
    image_url: string;
    stock: number;
    sizes: string[];
    colors: string[];
};

const ProductPage = ({ product }: { product: Product }) => {
    const [selectedSize, setSelectedSize] = useState('Small');
    const [selectedColor, setSelectedColor] = useState('Blue');
    const router = useRouter();
    const { data: session } = useSession();

    const handleSizeChange = (size: string) => {
        setSelectedSize(size);
    };
    const handleColorChange = (color: string) => {
        setSelectedColor(color);
    };
    const handleAddToCart = async () => {
        try {
            // Dapatkan ID user dari sesi
            const userId = await fetch('http://localhost:3000/api/auth/getuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: session?.user?.email })
            }).then((res) => res.json()).then((data) => data.data.id);
            console.log(userId);
    
            // Dapatkan data keranjang saat ini dari database
            const currentCart: any = await fetch(`http://localhost:3000/api/cart/${userId}`)
                .then((res) => res.json());
            
            if (!currentCart) {
                currentCart.push({
                    size: selectedSize,
                    color: selectedColor,
                    quantity: 1,
                    productId: product.id,
                });
            }
            // Periksa apakah produk dengan ID yang sama sudah ada di keranjang
            const existingItemIndex = currentCart.findIndex(
                (item: any) =>
                    item.productId === product.id &&
                    item.size === selectedSize &&
                    item.color === selectedColor
            );
    
            if (existingItemIndex !== -1) {
                // Jika produk sudah ada, tingkatkan quantity
                currentCart[existingItemIndex].quantity += 1;
            } else {
                // Jika produk belum ada, tambahkan produk baru ke keranjang
                currentCart.push({
                    size: selectedSize,
                    color: selectedColor,
                    quantity: 1,
                    productId: product.id,
                });
            }    
            // Perbarui keranjang di database
            await fetch(`http://localhost:3000/api/cart/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cart: currentCart }),
            }).then((res) => res.json());
           
            // Arahkan pengguna ke halaman keranjang
            router.push('/cart');
        } catch (error) {
            console.error('Error updating cart:', error);
        }
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
                <div className="w-1/2 p-4 ">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
                    <p className="text-lg mt-4 text-gray-700 dark:text-gray-300">{product.description}</p>
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Color:</h3>
                        <div className="flex items-center mt-2 space-x-2">
                            {product.colors.map((color, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleColorChange(color)}
                                    className={`w-8 h-8 rounded-full border  ${selectedColor === color ? 'border-white ' : 'border-gray-900'}`}
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
                            <FontAwesomeIcon icon={faBoxes} className="text-gray-500 mr-2" />
                            {product.stock} pcs
                        </p>
                    </div>
                    <div className="flex items-center justify-between mt-12 ">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                        <Button onClick={handleAddToCart} type="button" className="flex items-center gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
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
                <Button onClick={() => router.back()} type="button" className="flex items-center gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-5">
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
