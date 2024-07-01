import { faArrowRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
const UserDropdown = ({ user, logout }: { user: any, logout: Function }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: '', email: '', role: '' });

    useEffect(() => {
        const data = user;
        if (data) {
            const { name, email, role } = data;
            setUserInfo({
                name, email, role
            });
        }
    }, [user]);
    return (
        <div className="relative" onClick={() => setDropdownOpen(!dropdownOpen)} style={{ cursor: 'pointer' }}>
            <Button className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-md px-3 py-2 top-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" type="button">
                <FontAwesomeIcon icon={faUser} />
            </Button>

            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-70 bg-white rounded-md shadow-lg  dark:bg-gray-700" >
                    <div className="px-5 py-4 space-y-1 ">
                        <span className="block text-sm text-gray-900 dark:text-white">{userInfo.name}</span>
                        <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{userInfo.email}</span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">{userInfo.role}</span>
                    </div>
                    <Button onClick={() => logout()} className="w-full text-gray-500 text-center bg-transparent hover:bg-gray-300 hover:text-gray-900  text-md px-3 py-4 top-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white ">Log out</Button>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
