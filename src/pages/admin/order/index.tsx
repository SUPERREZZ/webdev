/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Dashboard from '../..';
import { useState, useEffect } from 'react';
import React from 'react';


interface Order {
    productId: string;
    quantity: number;
    size: string;
    color: string;
    email: string;
    productName: string;
    productPrice: number;
    productImageUrl: string;
}


const OrderManagementPage = ({ initialOrders }: { initialOrders: Order[] }) => {
    const [orders, setOrders] = useState<Order[]>(initialOrders);

    const handleDelete = async (email: string) => {
        try {
            const res = await fetch(`https://webdev-ashen-nu.vercel.app/api/order/queryEmail/${email}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                console.log('Order deleted successfully');
                setOrders((prevOrders) => prevOrders.filter((order) => order.email !== email));
            } else {
                console.error('Failed to delete order');
            }
        } catch (error) {
            console.error('Failed to delete order:', error);
        }
    };

    // Function to render rows with colspan for email and accept columns
    const renderRows = () => {
        const groupedOrders: { [key: string]: Order[] } = {};
        let rowNumber = 1; // Nomor urut untuk setiap baris

        // Group orders by email
        orders.forEach((order) => {
            if (!groupedOrders[order.email]) {
                groupedOrders[order.email] = [];
            }
            groupedOrders[order.email].push(order);
        });

        // Render rows based on grouped orders
        return Object.keys(groupedOrders).map((email, index) => {
            const ordersByEmail = groupedOrders[email];
            return (
                <React.Fragment key={index}>
                    {ordersByEmail.map((order, subIndex) => (
                        <tr key={`${index}-${subIndex}`}>
                            {/* No urut cell */}
                            {subIndex === 0 && (
                                <td className="border px-4 py-2" rowSpan={ordersByEmail.length}>
                                    {rowNumber++}
                                </td>
                            )}
                            {/* Email cell */}
                            {subIndex === 0 && (
                                <td className="border px-4 py-2" rowSpan={ordersByEmail.length}>
                                    {email}
                                </td>
                            )}
                            {/* Order details cells */}
                            <td className="border px-4 py-2">{order.productName}</td>
                            <td className="border px-4 py-2">{order.productId}</td>
                            <td className="border px-4 py-2">{order.quantity}</td>
                            <td className="border px-4 py-2">{order.size}</td>
                            <td className="border px-4 py-2">{order.color}</td>
                            <td className="border px-4 py-2">{order.productPrice}</td>
                            <td className="border px-4 py-2">
                                <img src={order.productImageUrl} alt={order.productName} className="w-16 h-16 object-cover" />
                            </td>
                            {/* Accept cell */}
                            {subIndex === 0 && (
                                <td className="border px-4 py-2" rowSpan={ordersByEmail.length}>
                                    <button onClick={() => handleDelete(order.email)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                        Accept
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </React.Fragment>
            );
        });
    };

    return (
        <Dashboard>
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold mb-4">Order Management</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">No</th>
                                <th className="px-4 py-2">User Email</th>
                                <th className="px-4 py-2">Product Name</th>
                                <th className="px-4 py-2">Product ID</th>
                                <th className="px-4 py-2">Quantity</th>
                                <th className="px-4 py-2">Size</th>
                                <th className="px-4 py-2">Color</th>
                                <th className="px-4 py-2">Price</th>
                                <th className="px-4 py-2">Image</th>
                                <th className="px-4 py-2">Accept</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderRows()}
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

    let initialOrders: Order[] = [];

    try {
        const res = await fetch(`https://webdev-ashen-nu.vercel.app/api/order/getAll`);
        initialOrders = await res.json();
        console.log(initialOrders);
    } catch (error) {
        console.error(error);
    }

    return {
        props: {
            initialOrders,
        },
    };
};

export default OrderManagementPage;