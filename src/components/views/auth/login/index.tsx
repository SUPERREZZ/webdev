import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useRouter } from "next/router";
import { useState, FormEvent } from "react";
import { setCookie } from "@/lib/cookie"; // Pastikan lib/cookies.ts sudah ada

const Login = () => {
    const router = useRouter();
    const [error, setError] = useState('');

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            setCookie('token', result.token, 7); // Simpan token di cookie
            router.push('/dashboard'); // Redirect ke dashboard setelah login
        } else {
            setError(result.message || 'Something went wrong');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Login</h2>
            <div className="flex justify-center space-x-6">
                <Button value="G" className="bg-black hover:bg-white text-white text-xl hover:text-black hover:cursor-pointer hover:outline-black hover:outline hover:outline-1 font-bold py-1 px-3 rounded-full" id="Google"/>
                <Button value="F" className="bg-blue-800 hover:bg-white text-white text-xl hover:text-blue-800 hover:cursor-pointer hover:outline-blue-800 hover:outline hover:outline-1 font-bold py-1 px-3 rounded-full" id="Google"/>
            </div>
            <form className="space-y-1" onSubmit={handleLogin}>
                <Input valueLabel="Email" type="email" name="email" classNameLabel="block text-gray-700 text-sm font-bold mb-2" classNameInput="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="Email"/>
                <Input valueLabel="Password" type="password" name="password" classNameLabel="block text-gray-700 text-sm font-bold mb-2" classNameInput="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="Password"/>
                <div>
                    <Button value="Login" type="submit" className="bg-black hover:bg-gray-200 text-white hover:text-black hover:cursor-pointer hover:outline-black hover:outline hover:outline-1 font-bold py-2 px-4 rounded w-full mt-10" id="loginButton"/>
                </div>
            </form>
            {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
        </div>
    );
};

export default Login;
