// pages/orders.tsx
import Dashboard from "..";
import Button from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Image from 'next/image';

interface OrderItem {
    productId: string;
    quantity: number;
    size: string;
    color: string;
    productDetails: ProductDetails;
}
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

interface OrdersProps {
    orders: {
        message: string;
        data: OrderItem[];
    };
}

const Orders: React.FC<OrdersProps> = ({ orders }) => {
    const { data } = orders;

    const totalPrice = data.reduce((total, order) => {
        return total + order.quantity * order.productDetails.price;
      }, 0);
    return (
        <div className="flex justify-center items-start space-x-4 p-4">
        <div className="w-full max-w-2xl h-screen  p-4">
          <h1 className="text-4xl font-bold m-4">Orders</h1>
          {data.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {data.map((order, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
                  <h2 className="text-xl font-semibold mb-4">Order #{index + 1}</h2>
                  <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                  <Image src={order.productDetails.image_url} alt={order.productDetails.name} width={200} height={150}  className="rounded-lg" />
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold">{order.productDetails.name}</h3>
                      <p className="text-gray-600">{order.productDetails.description}</p>
                      <div className="flex gap-3 mt-2">
                        <span className="font-medium">Price:</span>
                        <span>${order.productDetails.price}</span>
                      </div>
                      <div className="flex gap-3 mt-2">
                        <span className="font-medium">Quantity:</span>
                        <span>{order.quantity}</span>
                      </div>
                      <div className="flex gap-3 mt-2">
                        <span className="font-medium">Size:</span>
                        <span>{order.size}</span>
                      </div>
                      <div className="flex gap-3 mt-2">
                        <span className="font-medium">Color:</span>
                        <span>{order.color}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-1/4  max-w-xs p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 self-center">
          <h2 className="text-2xl font-semibold">Total Tagihan</h2>
          <div className="flex justify-between mt-2">
            <span className="font-medium">Total Price:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
        
    );
};


const OrdersPage: React.FC<OrdersProps> = ({ orders }) => {
    const router = useRouter();
    return (
        <Dashboard>
            <div className='space-y-4 p-3 '>
                <Button onClick={() => router.back()} type="button" className="flex items-center gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-5">
                    <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
                    <p>Back</p>
                </Button>
                <Orders orders={orders} />
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
        }
    }

    const email = session?.user?.email;
    let orders = [];

    try {
        orders = await fetch(`${process.env.URLFETCH}/api/order/queryEmail/${email}`).then((res) => res.json())
        for (const item of orders.data) {
            const product = await fetch(`${process.env.URLFETCH}/api/product/productsingle/${item.productId}`).then((res) => res.json())
            item.productDetails = product
        }


    } catch (error) {
        console.error(error);
    }
    console.log(orders.data)
    console.log(email)
    return {
        props: {
            orders,
        },
    };
};

export default OrdersPage;
