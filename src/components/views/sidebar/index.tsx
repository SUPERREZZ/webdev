import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons/faHouse';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons/faArrowRightFromBracket'
import { faCartPlus } from '@fortawesome/free-solid-svg-icons/faCartPlus'
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart'
import { faCartShopping as faCart } from "@fortawesome/free-solid-svg-icons/faCartShopping";
import Button from '@/components/ui/button';


const Sidebar = ({ barOpen, setBarOpen, logout, user }: { barOpen: boolean, setBarOpen: Function , logout: Function, user: any}) => {

  return (
    <div className={`fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform ${barOpen ? 'translate-x-0' : '-translate-x-full'} bg-white dark:bg-gray-800 `} >
      <Button type="button" onClick={() => setBarOpen(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
        <FontAwesomeIcon icon={faXmark} className='text-xl px-2 py-1' />
        <span className="sr-only">Close menu</span>
      </Button>
      <div className="py-4 overflow-y-auto mt-10">
        <ul className="space-y-2 font-medium space-y-5">
          <li>
            <Button className="w-full ">
              <p className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100  dark:hover:bg-gray-700 group">
                <FontAwesomeIcon icon={faHouse} />
                <span className="ms-3 whitespace-nowrap flex-1">Home</span>
              </p>
            </Button>
          </li>
          {user?.role !== 'admin' ? (
            <>
              <li>
                <Button className="w-full">
                  <p className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <FontAwesomeIcon icon={faCart} />
                    <span className="flex-1 ms-3 whitespace-nowrap">Cart</span>
                  </p>
                </Button>
              </li>
              <li>
                <Button className="w-full">
                  <p className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <FontAwesomeIcon icon={faHeart} />
                    <span className="flex-1 ms-3 whitespace-nowrap">Wishlist</span>
                  </p>
                </Button>
              </li>

            </>) : (
            <li>
              <Button className="w-full">
                <p className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <FontAwesomeIcon icon={faCartPlus} />
                  <span className="flex-1 ms-3 whitespace-nowrap">add Products</span>
                </p>
              </Button>
            </li>
          )}
          <li>
            <Button className="w-full" onClick={() => logout()}>
              <p className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
                <span className="flex-1 ms-3 whitespace-nowrap">Log Out</span>
              </p>
            </Button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar