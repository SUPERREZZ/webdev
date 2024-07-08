import { useState } from 'react';
import { useRouter } from 'next/router';
import Dashboard from '../../..';
import Button from '@/components/ui/button';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AddProductForm: React.FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [stock, setStock] = useState(0);
    const [colors, setColors] = useState<string[]>([]);
    const [sizes, setSizes] = useState<string[]>([]);
    const [location, setLocation] = useState('');

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log({ name, description, price, imageUrl, stock, colors, sizes, location });

            const res = await fetch(`https://webdev-ashen-nu.vercel.app/api/product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description, price, image_url: imageUrl, stock, colors, sizes, location }),
            });
            if (res.ok) {
                router.push('/admin/product');
            } else {
                console.error('Failed to add product');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dashboard>
            <div className='p-4 space-y-4 max-h-screen'>
                <Button onClick={() => router.back()} type="button" className="flex items-center gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-5">
                    <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
                    <p>Back</p>
                </Button>
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4 space-y-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Price</label>
                            <input
                                type="number"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Stock</label>
                            <input
                                type="number"
                                id="stock"
                                value={stock}
                                onChange={(e) => setStock(Number(e.target.value))}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="colors" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Colors</label>
                            <input
                                type="text"
                                id="colors"
                                value={colors.join(', ')}
                                onChange={(e) => setColors(e.target.value.split(',').map(color => color.trim()))}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="sizes" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Sizes</label>
                            <input
                                type="text"
                                id="sizes"
                                value={sizes.join(', ')}
                                onChange={(e) => setSizes(e.target.value.split(',').map(size => size.trim()))}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Location</label>
                            <input
                                type="text"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Image URL</label>
                            <input
                                type="text"
                                id="imageUrl"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                        Add Product
                    </button>
                </form>
            </div>

        </Dashboard>
    );
};

export default AddProductForm;
