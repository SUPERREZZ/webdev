
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/ui/button';
import UserDropdown from './userdropdown';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Navbar = ({ setBarOpen, user, logout, handleSearch }: { setBarOpen: Function, user: any, logout: Function, handleSearch: Function }) => {
  const router = useRouter();
  const isHome = router.pathname === '/';

  const handleInputChange = (event: any) => {
    handleSearch(event.target.value);
  };

  return (
    <nav className="bg-white sticky top-0 z-10 border-gray-200 px-2 sm:px-4 py-4 rounded dark:bg-gray-800 grid grid-cols-3 items-center">
      <div className="flex items-center">
        <Button
          onClick={() => setBarOpen(true)}
          className="ml-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-xl px-4 py-3 top-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          value="☰"
          type="button"
        />
      </div>
      <p className="text-3xl font-bold text-center">Nusa Karya</p>
      <div className="flex items-center justify-end space-x-4">
        {isHome && (
          <input
            type="text"
            placeholder="Search..."
            className="w-30 text-black p-2 border border-gray-300 rounded-lg"
            onChange={handleInputChange}
          />
        )}
        {user?.role !== 'admin' && (
          <Link
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-md px-3 py-2 top-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            href="/cart"
          >
            <FontAwesomeIcon icon={faCartShopping} />
          </Link>
        )}
        <UserDropdown logout={logout} />
      </div>
    </nav>
  );
};

export default Navbar;
