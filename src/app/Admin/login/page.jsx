//tampilan login admin
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { FaSignInAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Login() {
    const router = useRouter();

    const { t } = useTranslations();
    const [session, setSession] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    useEffect(() => {
        const fetchSession = async () => {
            const sessionData = await getSession();
            if (sessionData) {
                setSession(sessionData);
                router.push('/dashboard');
            }
        };
        fetchSession();
    }, [router]);
    const handleLogin = async (e) => {
        e.preventDefault();
        // Implement your login logic here
        // For example, you can call an API to authenticate the user
        // If successful, redirect to the dashboard
        router.push('/dashboard');
    };
    if (session) return null;
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{t('login.title')}</h1>
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">{t('login.email')}</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="password">{t('login.password')}</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button type="submit" className="flex items-center mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    <FaSignInAlt className="mr-2" />
                    {t('login.submit')}
                </button>
            </form>
            <Link href="/dashboard" className="mt-4 inline-block text-blue-500 hover:text-blue-700">
                {t('login.backToDashboard')}
            </Link>
        </div>
    );

}