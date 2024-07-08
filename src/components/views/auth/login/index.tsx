import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { signIn as signInNextAuth } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, FormEvent } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle';
const Login = () => {
    const { push } = useRouter();
    const [error, setError] = useState('');
    const url: any = 'https://webdev-ashen-nu.vercel.app';


    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        try {
            const response = await signInNextAuth('credentials', {
                email: (form.elements.namedItem('email') as HTMLInputElement).value,
                password: (form.elements.namedItem('password') as HTMLInputElement).value,
                redirect: false,
                callbackUrl: url
            });
            if (!response?.error) {
                form.reset();
                push(url);
                return;
            } else {
                setError(response.error || 'Invalid login');
            }
        } catch (error) {
            setError('Error logging in');
            console.error('Error logging in:', error);
        }
    };

    const handleGoogleLogin = async () => {
        const callbackUrl = '/';

        try {
            // Sign in with Google
            const response = await signInNextAuth('google', { callbackUrl });
            if (response?.error) {
                throw new Error(response.error);
            }
        } catch (error) {
            setError('Error logging in with Google');
            console.error('Error logging in with Google:', error);
        }
    };


    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Login</h2>
            <div className="flex justify-center space-x-6">
                <Button onClick={handleGoogleLogin} className="bg-black hover:bg-white text-white text-xl hover:text-black hover:cursor-pointer hover:outline-black hover:outline hover:outline-1 font-bold py-1 px-2 rounded-full" id="Google">
                    <FontAwesomeIcon icon={faGoogle} />
                </Button>
            </div>
            <form className="space-y-1" onSubmit={handleLogin}>
                <Input valueLabel="Email" type="email" name="email" classNameLabel="block text-gray-700 text-sm font-bold mb-2" classNameInput="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="Email" />
                <Input valueLabel="Password" type="password" name="password" classNameLabel="block text-gray-700 text-sm font-bold mb-2" classNameInput="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="Password" />
                <div>
                    <Button type="submit" className="bg-black hover:bg-gray-200 text-white hover:text-black hover:cursor-pointer hover:outline-black hover:outline hover:outline-1 font-bold py-2 px-4 rounded w-full mt-10" id="loginButton">Login</Button>
                </div>
            </form>
            <p className="text-center text-gray-500 text-md mt-5">Dont have an account? <Link href="/auth/register" className="text-blue-500 hover:text-blue-700 ml-1" id="register">Register here</Link></p>
            {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
        </div>
    );
};

export default Login;
