// pages/index.tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getSession, signOut, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Navbar from '@/components/views/navbar';
import Sidebar from '@/components/views/sidebar';
import Product from '@/components/views/product';

type ProductType = {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  stock: number;
  sizes: string[];
  colors: string[];
};


const Dashboard = (props: any) => {
  const { children, products } = props
  const router = useRouter();
  const { push } = useRouter();
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(products);
  useEffect(() => {
    const registerUserIfNeeded = async () => {
      if (session) {
        const email = session.user?.email;
        const name = session.user?.name;
        try {
          const regis = await fetch(`https://webdev-ashen-nu.vercel.app/api/auth/register`, {
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
          const getData = await fetch(`https://webdev-ashen-nu.vercel.app/api/auth/getuser`, {
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

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product: ProductType) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

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
      <Navbar setBarOpen={setSidebarOpen} user={user} logout={handleLogout} handleSearch={handleSearch} />
      <div className='flex  justify-center'>
        <Sidebar setBarOpen={setSidebarOpen} barOpen={sidebarOpen} logout={handleLogout} user={user} />
        {children ? children : <Product products={filteredProducts} />}
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
  const product = await fetch(`https://webdev-ashen-nu.vercel.app/api/product`)
  const data = await product.json()
  if (!product) {
    return {
      notFound: true,
    };

  }
  return {
    props: {
      products: data.data,
    },
  };
};

export default Dashboard;
