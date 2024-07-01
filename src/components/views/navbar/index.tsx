import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCartShopping, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/ui/button';
import UserDropdown from './userdropdown';

const Navbar = ({ setBarOpen, user, logout }: { setBarOpen: Function, user: any, logout: Function }) => {
  return (
    <nav className="bg-white border-gray-200 px-2 sm:px-4 py-4 rounded dark:bg-gray-800 flex justify-between">
      <Button onClick={() => setBarOpen(true)} className="ml-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-xl px-4 py-3 top-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" value="☰" type="button" />
      <p className="text-3xl font-bold text-center flex items-center">Nusa Karya</p>
      <div className="flex items-center">
        {user?.role !== 'admin' ? (
          <>
            <Button className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-md px-3 py-2 top-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" type="button">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Button>
            <Button className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-md px-3 py-2 top-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" type="button">
              <FontAwesomeIcon icon={faHeart} />
            </Button>
            <Button className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-md px-3 py-2 top-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" type="button">
              <FontAwesomeIcon icon={faCartShopping} />
            </Button>
          </>
        ) : null}
        <UserDropdown user={user} logout={logout} />
      </div>
    </nav>
  );
};

export default Navbar;
