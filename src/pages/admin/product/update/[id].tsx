import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Dashboard from '../../..';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  location: string;
  colors: string[];
  sizes: string[];
}

interface UpdateProductPageProps {
  product: Product;
}

const UpdateProductPage: React.FC<UpdateProductPageProps> = ({ product }) => {
  const [updatedProduct, setUpdatedProduct] = useState(product);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://webdev-ashen-nu.vercel.app/api/product/productsingle/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        alert('Product updated successfully');
        router.push('/admin/product');
      } else {
        console.log(response);
        alert('Failed to update product');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  };
  return (
    <Dashboard>
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4">Update Product</h1>
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="max-w-3xl mx-auto p-4 space-y-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={updatedProduct.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={updatedProduct.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={updatedProduct.stock}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Image URL</label>
              <input
                type="text"
                id="image_url"
                name="image_url"
                value={updatedProduct.image_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={updatedProduct.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
              <textarea
                id="description"
                name="description"
                value={updatedProduct.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="colors" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Colors (comma-separated)</label>
              <input
                type="text"
                id="colors"
                name="colors"
                value={updatedProduct.colors.join(', ')}
                onChange={(e) =>
                  setUpdatedProduct((prevProduct) => ({
                    ...prevProduct,
                    colors: e.target.value.split(',').map((color) => color.trim()),
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="sizes" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Sizes (comma-separated)</label>
              <input
                type="text"
                id="sizes"
                name="sizes"
                value={updatedProduct.sizes.join(', ')}
                onChange={(e) =>
                  setUpdatedProduct((prevProduct) => ({
                    ...prevProduct,
                    sizes: e.target.value.split(',').map((size) => size.trim()),
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">Update Product</button>
          </div>
        </form>
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

  const { id } = context.params!;
  let product = null;

  try {
    const response = await fetch(`https://webdev-ashen-nu.vercel.app/api/product/productsingle/${id}`);
    product = await response.json();
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      product,
    },
  };
};

export default UpdateProductPage;