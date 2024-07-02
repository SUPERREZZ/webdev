/* eslint-disable @next/next/no-img-element */
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';


interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  stock: number;
}
const Pro = ({  products }: {  products: Product[] }) => {

  return (
    <div className={`w-full container mx-auto p-4`}>
      <h1 className="text-4xl font-bold m-4 ml-8 ">Products</h1>
      <div className="grid grid-cols-3 gap-4">
        {products?.map(product => (
          <div key={product.id} className=" group w-full my-4 max-w-sm bg-white  border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <Link href={`/products/${product.id}`}>
              <img src={product.image_url} alt={product.name} className='p-8 rounded-t-lg w-30 h-30 object-cover group-hover:opacity-75 group-hover:scale-105 transition ease-in-out duration-300' />
              <div className="px-5 pb-5 group-hover:opacity-75">
                <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{product.name}</h5>
                <div className="flex items-center mt-2.5 mb-5">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FontAwesomeIcon
                        key={index}
                        icon={faStar}
                        className={`w-4 h-4 ${index < 3 ? 'text-yellow-300' : 'text-gray-200 dark:text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">4.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}
                  </span>
                  <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
                    Add to cart
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Pro