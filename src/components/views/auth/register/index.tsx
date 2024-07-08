'use client'
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import { useRouter } from "next/router"
import { FormEvent, useEffect, useState } from "react"
import { registerSchema } from "@/lib/validation/zod"
import Link from "next/link"

const Register = () => {
    const router = useRouter()
    const [error, setError] = useState('')
    const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        const data = {
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            password: (form.elements.namedItem('password') as HTMLInputElement).value,
            confirmPassword: (form.elements.namedItem('confirmPassword') as HTMLInputElement).value,
            name: (form.elements.namedItem('fullname') as HTMLInputElement).value
        }
        const result = registerSchema.safeParse(data)
        if (!result.success) {
            setError('Validation error: ' + result.error.errors.map(e => e.message).join(', '));
            return;
        }
        if (data.password !== data.confirmPassword) {
            setError('Password and confirm password should match')
            return
        }
        const response = await fetch(`https://webdev-ashen-nu.vercel.app/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
                name: data.name,
                role: 'admin'
            })
        })
        if (response.ok) {
            setError('Registration successful')
            router.push('/auth/login')
        } else if (response.status === 400) {
            setError('Email already exists')
            return
        } else {
            console.log(response)
            setError('Something went wrong')
            return
        }
        form.reset()
    }
    useEffect(() => {
        if (error !== '') {
            setTimeout(() => {
                setError('')
            }, 10000)
        }
    }, [error])
    return (
        <>
            <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Register</h2>
                <div className="flex justify-center space-x-6">
                    <Button value="G" className="bg-black hover:bg-white text-white text-xl hover:text-black hover:cursor-pointer hover:outline-black hover:outline hover:outline-1 font-bold py-1 px-3 rounded-full" id="Google" />
                    <Button value="F" className="bg-blue-800 hover:bg-white text-white text-xl hover:text-blue-800 hover:cursor-pointer hover:outline-blue-800 hover:outline hover:outline-1 font-bold py-1 px-3 rounded-full" id="Google" />
                </div>
                <form className="space-y-1" onSubmit={handleRegister}>
                    <Input valueLabel="Full Name" type="text" name="fullname" classNameLabel="block text-gray-700 text-sm font-bold mb-2" classNameInput="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="Fullname" />
                    <Input valueLabel="Email" type="email" name="email" classNameLabel="block text-gray-700 text-sm font-bold mb-2" classNameInput="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="Email" />
                    <Input valueLabel="Password" type="password" name="password" classNameLabel="block text-gray-700 text-sm font-bold mb-2" classNameInput="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="Password" />
                    <Input valueLabel="Confirm Password" type="password" name="confirmPassword" classNameLabel="block text-gray-700 text-sm font-bold mb-2" classNameInput="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="confirmPassword" />
                    <div>
                        <Button value="Register" type="submit" className="bg-black hover:bg-gray-200 text-white hover:text-black hover:cursor-pointer hover:outline-black hover:outline hover:outline-1 font-bold py-2 px-4 rounded w-full mt-10" id="registerButton" />
                    </div>
                </form>
                <p className="text-center text-gray-500 text-md mt-5">Already have an account?<Link href="/auth/login" className="text-blue-500 hover:text-blue-700 ml-1" id="loginLink">Login here</Link></p>
            </div>
            <div id="toast-danger" className={`flex fixed mr-4 bottom-0 right-0 ${error !== '' && error !== 'Registration successful' ? '' : 'hidden'} justify-center max-w-lg animate-bounce-in items-center w-full p-4 mb-3 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800`} role="alert">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                    </svg>
                    <span className="sr-only">Error icon</span>
                </div>
                <div className="ms-3 text-sm font-normal">{error}</div>
                <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" onClick={() => setError('')} aria-label="Close">
                    <span className="sr-only">Close</span>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                </button>
            </div>
            <div id="toast-success" className={`flex fixed mr-4 bottom-0 right-0 ${error === 'Registration successful' ? '' : 'hidden'} justify-center max-w-lg animate-bounce-in items-center w-full p-4 mb-3 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800`} role="alert">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                    <span className="sr-only">Check icon</span>
                </div>
                <div className="ms-3 text-sm font-normal">{error}</div>
                <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
                    <span className="sr-only">Close</span>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                </button>
            </div>
        </>


    )
}

export default Register


