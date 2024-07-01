// pages/dashboard.tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getSession, signOut, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Navbar from '@/components/views/navbar';
import Sidebar from '@/components/views/sidebar';

const Dashboard = () => {
  const router = useRouter();
  const { push } = useRouter();
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
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
              role: 'user'
            }),
          });
          const getData = await fetch('/api/auth/getuser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email
            }),
          });
          const data = await getData.json();
          setUser(data.data);
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
  

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    signOut({ callbackUrl: '/auth/login' }).then(() => {
      router.push('/auth/login');
    });
  };

  if (status === 'loading') {
    return <p>Loading...</p>; 
  }

  if (!session) {
    router.push('/auth/login'); 
    return null; 
  }
  return (
    <>
      <Navbar setBarOpen={setSidebarOpen} user={user} logout={handleLogout}  />
      <Sidebar setBarOpen={setSidebarOpen} barOpen={sidebarOpen} logout={handleLogout} user={user} />
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
