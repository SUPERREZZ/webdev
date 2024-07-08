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
  const { children, products, user } = props;
  const { push, query } = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [dataUser, setDataUser] = useState(user)

  useEffect(() => {
    if (!session && status !== 'loading') {
      push('/auth/login');
    }
  }, [session, status, push]);

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
      push('/auth/login');
    });
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }


  return (
    <>
      <Navbar setBarOpen={setSidebarOpen} user={dataUser} logout={handleLogout} handleSearch={handleSearch} />
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

  let user = null;
  const email = session.user?.email;
  try {
    // Fetch user data
    const getData = await fetch(`http://localhost:3000/api/auth/getuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    const data = await getData.json();
    console.log(data);
    user = data.data;

    // Register user if not exists
    if (!user) {
      const regis = await fetch(`http://localhost:3000/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: email,
          name: session.user?.name,
          role: 'user',
        }),
      });
      if (regis.ok) {
        const newUser = await getData.json();
        user = newUser.data;
      }
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }

  const product = await fetch(`http://localhost:3000/api/product`);
  const data = await product.json();
  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      products: data.data,
      user,
    },
  };
};

export default Dashboard;
