import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Dashboard from '..';
import { useRouter } from 'next/router';
import Button from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { getSession, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface ProductDetails {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    created_at: string;
    stock: number;
    colors: string[];
    sizes: string[];
}
interface CartItem {
    productId: string;
    quantity: number;
    size: string;
    color: string;
    productDetails: ProductDetails;
}
interface CartPageProps {
    cart: CartItem[];
}

const CartPage: React.FC<CartPageProps> = ({ cart: initialCart }) => {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>(initialCart);
    const { data: session } = useSession();

    const removeFromCart = async (productId: string) => {
        setCart((prevCart) =>
            prevCart.reduce((acc, item) => {
                if (item.productId === productId) {
                    if (item.quantity > 1) {
                        acc.push({ ...item, quantity: item.quantity - 1 });
                    }
                    // Jika kuantitas 1, item tidak masuk ke acc
                } else {
                    acc.push(item);
                }
                return acc;
            }, [] as CartItem[])
        );
    };
    const handleOrder = async () => {
        try {
            const response = await fetch(`https://webdev-ashen-nu.vercel.app/api/order/queryEmail/${session?.user?.email}`, {
                method: 'POST'
            });
            console.log(response);
            if (response.ok) {
                alert('Order placed successfully');
                router.push('/orders'); // Arahkan ke halaman order atau halaman lain yang diinginkan
            } else {
                const result = await response.json();
                alert(result.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Error placing order');
        }
    };

    useEffect(() => {
        const updateCart = async () => {
            try {
                // Dapatkan IdUser dari server 
                const IdUser = await fetch(`https://webdev-ashen-nu.vercel.app/api/auth/getuser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: session?.user?.email })
                }).then((res) => res.json()).then((data) => {
                    return data.data.id;
                });

                // Ambil cart yang sudah diperbarui dari state 
                const updatedCart = cart.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color
                }));

                // fetch ke API untuk memperbarui cart di server
                const newCart = await fetch(`https://webdev-ashen-nu.vercel.app/api/cart/${IdUser}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ cart: updatedCart })
                }).then((res) => res.json());

                console.log(newCart);

            } catch (error) {
                console.error('Error updating cart:', error);
            }
        };

        updateCart();

    }, [cart, session]);
    return (
        <div className="w-full container mx-auto px-4 py-3">
            <h1 className="text-3xl font-bold mb-4 text-center">Your Cart</h1>
            {cart.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 mt-10 md:grid-cols-2">
                    {cart.map((item) => (
                        <div key={item.productId} className="w-full bg-white p-4 rounded shadow-sm flex items-center">
                            <Image
                                src={item.productDetails.image_url}
                                alt={item.productDetails.name}
                                width={200}
                                height={150}
                                className="object-cover"
                            />
                            <div className="ml-4 flex-1">
                                <h2 className="text-xl font-semibold text-black">{item.productDetails.name}</h2>
                                <p className="text-gray-600">${item.productDetails.price}</p>
                                <div className="flex items-center gap-6">
                                    <div className={`w-6 min-h-6 rounded-full`} style={{ backgroundColor: item.color }}></div>
                                    <p className="text-gray-600">{item.size}</p>
                                    <p className="text-gray-600">{item.quantity} pcs</p>
                                </div>
                                <div className="mt-2">
                                    <button
                                        onClick={() => removeFromCart(item.productId)}
                                        className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                    >
                                        Remove from Cart
                                    </button>
                                    <Link href={`/products/${item.productId}`}>
                                        <button className="bg-blue-500 text-white px-4 py-2 rounded">View Details</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-600">Your cart is empty.</p>
                </div>
            )}
            <div className="mt-4 flex justify-between">
                <Link href="/">
                    <p className="inline-block bg-blue-500 text-white px-4 py-2 rounded">Continue Shopping</p>
                </Link>
                {cart.length > 0 && (
                    <Button onClick={handleOrder} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Order
                    </Button>
                )}
            </div>
        </div>

    );
};
const CartPageWithDashboard = ({ cart }: CartPageProps) => {
    const router = useRouter();
    return (
        <Dashboard>
            <div className='space-y-4 p-3 w-full '>
                <Button onClick={() => router.back()} type="button" className="flex items-center gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-5">
                    <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
                    <p>Back</p>
                </Button>
                <CartPage cart={cart} />
            </div>
        </Dashboard>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false,
            },
        };
    }
    try {
        const IdUser = await fetch(`https://webdev-ashen-nu.vercel.app/api/auth/getuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: session?.user?.email })
        }).then((res) => res.json()).then((data) => {
            return data.data.id
        })
        const dataBarang = await fetch(`https://webdev-ashen-nu.vercel.app/api/cart/${IdUser}`).then((res) => res.json());

        const products = [];

        for (const item of dataBarang) {
            const { productId } = item;
            const product = await fetch(`https://webdev-ashen-nu.vercel.app/api/product/productsingle/${productId}`)
                .then((res) => res.json());
            products.push({
                ...item,
                productDetails: product,
            });
        }
        return {
            props: {
                cart: products
            },
        }
    } catch (error) {
        console.error(error);
        return {
            props: {
                cart: [],
            },
        }
    }
};

export default CartPageWithDashboard;
