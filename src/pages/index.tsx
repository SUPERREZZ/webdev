// pages/dashboard.tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const Dashboard = () => {
  const router = useRouter();
  const { push } = useRouter();
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  useEffect(() => {
    const registerUserIfNeeded = async () => {
      if (session) {
        const email = session.user?.email;
        const name = session.user?.name;
  
        try {
          const regis = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              password: email, 
              name: name,
            }),
          });
  
          if (regis.ok) {
            setError('Registration successful');
            push('/');
          } else if (regis.status === 400) {
            setError('Email already exists');
          } else {
            setError('Something went wrong');
          }
        } catch (error) {
          setError('Error registering user');
          console.error('Error registering user:', error);
        }
      }
    };

    registerUserIfNeeded();
  }, [session, push]);

  if (status === 'loading') {
    return <p>Loading...</p>; 
  }

  if (!session) {
    router.push('/auth/login'); 
    return null; 
  }
  const toogleNav = () => {
    document.getElementById("drawer-navigation")?.classList.toggle("-translate-x-full");
  }
  return (
    <>
      <div className="text-center">
      <button onClick={() => toogleNav()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="button">
        Show navigation
      </button>
      <div id="drawer-navigation" className="fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-white dark:bg-gray-800 " >
        <h5 id="drawer-navigation-label" className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Menu</h5>
        <button type="button" onClick={() => toogleNav()} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
          <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <div className="py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <Link href="#">
                <p className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                  </svg>
                  <span className="ms-3">Dashboard</span>
                </p>
              </Link>
            </li>
            <li>
              <Link href="#">
                <p className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">Kanban</span>
                  <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>
                </p>
              </Link>
            </li>
            <li>
              <Link href="#">
                <p className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z"/>
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
                  <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
                </p>
              </Link>
            </li>
            <li>
              <Link href="#">
                <p className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.147 14.5a1 1 0 0 0-.999.959 1.976 1.976 0 0 1-1.993 1.788 1.976 1.976 0 0 1-1.993-1.788 1 1 0 1 0-1.997.082A3.983 3.983 0 0 0 5 18.222 3.983 3.983 0 0 0 8.835 15.54a1 1 0 0 0-.688-1.04ZM14 11H6a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2Zm-9-1a1 1 0 0 0 1-1V7.915a1 1 0 0 0-.293-.707L5.707 6h8.586l-.293.208a1 1 0 0 0-.293.707V9a1 1 0 0 0 2 0V7.915a3 3 0 0 0-.879-2.121l-.707-.707A2.99 2.99 0 0 0 13 4.088V3a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v1.088a2.99 2.99 0 0 0-.707 1.086l-.707.707A3 3 0 0 0 1.5 7.915V9a1 1 0 0 0 1 1Z"/>
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                </p>
              </Link>
            </li>
            <li>
              <Link href="#">
                <p className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z"/>
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">Products</span>
                </p>
              </Link>
            </li>
            <li>
              <Link href="#">
                <p className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.147 14.5a1 1 0 0 0-.999.959 1.976 1.976 0 0 1-1.993 1.788 1.976 1.976 0 0 1-1.993-1.788 1 1 0 1 0-1.997.082A3.983 3.983 0 0 0 5 18.222 3.983 3.983 0 0 0 8.835 15.54a1 1 0 0 0-.688-1.04ZM14 11H6a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2Zm-9-1a1 1 0 0 0 1-1V7.915a1 1 0 0 0-.293-.707L5.707 6h8.586l-.293.208a1 1 0 0 0-.293.707V9a1 1 0 0 0 2 0V7.915a3 3 0 0 0-.879-2.121l-.707-.707A2.99 2.99 0 0 0 13 4.088V3a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v1.088a2.99 2.99 0 0 0-.707 1.086l-.707.707A3 3 0 0 0 1.5 7.915V9a1 1 0 0 0 1 1Z"/>
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">Sign In</span>
                </p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </>
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

  return {
    props: {},
  };
};

export default Dashboard;
