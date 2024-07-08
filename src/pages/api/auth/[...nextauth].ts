import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_S!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'email' },
                password: { label: 'Password', type: 'password', placeholder: 'password' },
            },
            async authorize(credentials) {
                const { email, password } = credentials as { email: string, password: string };
                console.log(email, password);
                try {
                    const res = await fetch("https://webdev-ashen-nu.vercel.app/api/auth/login", {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password }),
                    });
                    if (!res.ok) {
                        throw new Error('Failed to sign in');
                    }
                    const user = await res.json();
                    if (user) {
                        console.log(user);
                        return { id: user.id, name: user.name, email: user.email, role: user.role };
                    } else {
                        return null;
                    }
                } catch (error) {
                    console.error('Error during authorization:', error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token as any;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/auth/login',
    },
};

export default NextAuth(authOptions);
