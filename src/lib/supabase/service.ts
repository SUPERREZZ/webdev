import { UUID } from 'crypto';
import supabase from './init';
import bcrypt from 'bcrypt';

export type User = {
    name: string;
    email: string;
    role: string;
    password: string;
};

export const getByEmail = async (email: string) => {
    try {
        const { data: user, error } = await supabase.from('users').select('*').eq('email', email);
        if (error) throw error;
        return user ? user[0] : null;
    } catch (error) {
        console.error('Error retrieving user:', error);
        return null;
    }
};

export const validatePassword = async (password: string, hashedPassword: string) => {
    try {
        const isValid = await bcrypt.compare(password, hashedPassword);
        return isValid;
    } catch (error) {
        console.error('Error validating password:', error);
        return false;
    }
};

export const signUp = async (dataUser: User, callback: Function) => {
    try {
        const { data: existingUsers, error } = await supabase.from('users').select('*').eq('email', dataUser.email);
        if (error) throw error;
        if (existingUsers.length > 0) {
            callback({ status: false, message: 'User already exists' });
        } else {
            dataUser.password = await bcrypt.hash(dataUser.password, 15);
            const { data: newUser, error: signUpError } = await supabase.from('users').insert([dataUser]);
            if (signUpError) throw signUpError;
            callback({ status: true, message: 'User created successfully' });
        }
    } catch (err: any) {
        console.error('Error signing up:', err.message);
        callback({ status: false, message: err.message });
    }
};

export const signIn = async (email: string, password: string) => {
    try {
        const user = await getByEmail(email);
        if (!user) throw new Error('User not found');
        const isValid = await validatePassword(password, user.password);
        if (!isValid) throw new Error('Invalid password');
        return user;
    } catch (error) {
        throw new Error('Error signing in');
    }
};
export const getProducts = async () => {
    try {
      const { data, error } = await supabase.from('product').select('*');
  
      if (error) {
        throw error;
      }
  
      return data;
    } catch (error: any) {
      console.error('Error retrieving products:', error.message);
      return null;
    }
  };

export const getProductsById = async (id: UUID) => {
    try {
        const { data, error } = await supabase.from('product').select('*').eq('id', id).single();
    
        if (error) {
          throw error;
        }
    
        return data;
    
    } catch (error: any) {
      console.error('Error retrieving products:', error.message);
      return null;
    }
}
// belum cek
export const getDataCartByIdUser = async (userId: UUID) => {
  const { data, error } = await supabase
    .from('users')
    .select('cart')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data.cart;
};
export const updateCart = async (userId: UUID, cart: any[]) => {
  const { data, error } = await supabase
    .from('users')
    .update({ cart })
    .eq('id', userId);

  if (error) {
    throw error;
  }

  return data;
};

export const createOrder = async (userId: UUID) => {
  try {
    // Mengambil data cart berdasarkan userId
    const cart = await getDataCartByIdUser(userId);

    // Check if cart is empty
    if (!cart || cart.length === 0) {
      throw new Error('Cart is empty');
    }

    // Update stock and prepare order data
    const orderItems = [];
    for (const item of cart) {
      const { productId, quantity } = item;
      const product = await getProductsById(productId);

      if (product.stock < quantity) {
        throw new Error(`Insufficient stock for product ${productId}`);
      }

      // Kurangi stok produk
      await supabase
        .from('product')
        .update({ stock: product.stock - quantity })
        .eq('id', productId);

      // Tambahkan item ke pesanan
      orderItems.push(item);
    }

    // Perbarui kolom order di tabel users
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('order')
      .eq('id', userId)
      .single();

    if (userError) {
      throw userError;
    }

    const updatedOrder = [...(user.order || []), ...orderItems]; // Ensure user.order is always an array

    const { data: updatedUser, error: updateUserError } = await supabase
      .from('users')
      .update({ order: updatedOrder, cart: [] })
      .eq('id', userId);

    if (updateUserError) {
      throw updateUserError;
    }

    return updatedOrder;
  } catch (error: any) {
    console.error('Error creating order:', error.message);
    throw new Error(error.message);
  }
};
export const getOrders = async (userId: UUID) => {
  const { data, error } = await supabase
    .from('users')
    .select('order')
    .eq('id', userId)
    .single();
  if (error) {
    throw error;
  }
  console.log(data.order);
  return data.order;
}
export const updateProductById = async(id: UUID, product: any) => {
  const { data, error } = await supabase
      .from('product')
      .update(product)
      .eq('id', id)
      .single();
  if (error) throw error;
  return {message : "success"};
}
export const createProduct = async (product: any) => {
  const { data, error } = await supabase
      .from('product')
      .insert(product)
      .single();

  if (error) throw error;
  return data;
}
export const getOrdersWithProductDetails = async () => {
  try {
      const { data: users, error: userError } = await supabase
          .from('users')
          .select('email, order');
        console.log(users)
      if (userError) {
          console.error('Error fetching users:', userError);
          throw new Error(userError.message);
      }

      let ordersWithDetails = [];

      for (const user of users) {
          if (!user || !user.order) {
              continue;
          }

          for (const order of user.order) {
              const { data: product, error: productError } = await supabase
                  .from('product')
                  .select('*')
                  .eq('id', order.productId)
                  .single();

              if (productError) {
                  console.error('Error fetching product:', productError);
                  throw new Error(productError.message);
              }

              ordersWithDetails.push({
                  email: user.email,
                  ...order,
                  productName: product.name,
                  productPrice: product.price,
                  productImageUrl: product.image_url,
              });
          }
      }

      return ordersWithDetails;
  } catch (error) {
      console.error('Error in getOrdersWithProductDetails:', error);
      throw error;
  }
};
export async function deleteOrderByEmail(email: string) {
  const { data, error } = await supabase
      .from('users')
      .update({
          order: [],
      })
      .match({ email })
      .single();

  if (error) {
      throw new Error(error.message);
  }

  return data;
}