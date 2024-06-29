import supabase from './init';
import bcrypt from 'bcrypt';

export type User = {
    name: string;
    email: string;
    role: string;
    password: string;
};

const getByEmail = async (email: string) => {
    try {
        const { data: user, error } = await supabase.from('users').select('*').eq('email', email);
        if (error) throw error;
        return user ? user[0] : null;
    } catch (error) {
        console.error('Error retrieving user:', error);
        return null;
    }
};

const validatePassword = async (password: string, hashedPassword: string) => {
    try {
        const isValid = await bcrypt.compare(password, hashedPassword);
        return isValid;
    } catch (error) {
        console.error('Error validating password:', error);
        return false;
    }
};

const signUp = async (dataUser: User, callback: Function) => {
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

const signIn = async (email: string, password: string) => {
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

export { getByEmail, validatePassword, signUp, signIn };
