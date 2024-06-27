import supabase from './init';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


type User = {
    name: string;
    email: string;
    role: string;
    password: string;
}

const getdata = async (collectionName: string) => {
    const { data, error } = await supabase.from(collectionName).select('*');
    if (error) {
        console.error('Error fetching data:', error.message);
        return [];
    }
    return data;
}

const getDataById = async (collectionName: string, id: string) => {
    const { data, error } = await supabase.from(collectionName).select('*').eq('id', id);
    if (error) {
        console.error('Error fetching data by id:', error.message);
        return [];
    }
    return data;
}
const secret = process.env.JWT_SECRET || 'your_jwt_secret';
const signUp = async (dataUser: User, callback: Function) => {
    try {
        const { data: existingUsers, error } = await supabase.from('users').select('*').eq('email', dataUser.email);
        if (error) {
            throw error;
        }

        if (existingUsers.length > 0) {
            callback(false);
        } else {
            if (!dataUser.role) {
                dataUser.role = "user";
            }
            dataUser.password = await bcrypt.hash(dataUser.password, 15); 

            const { data: newUser, error: signUpError } = await supabase.from('users').insert([dataUser]);
            if (signUpError) {
                throw signUpError;
            }
            const token = jwt.sign(
                { email: dataUser.email, id: newUser[0].id },
                secret,
                { expiresIn: '1h' }
            );

            callback(true, token);
        }
    } catch (err: any) {
        console.error('Error signing up:', err.message);
        callback(false);
    }
}

export { getdata, getDataById, signUp };
