//dashboard admin page.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useTranslations } from 'next-intl';


export default function Dashboard() {
//     const router = useRouter();
//   const { t } = useTranslations();
//     const [session, setSession] = useState(null);

//     useEffect(() => {
//         const fetchSession = async () => {
//             const sessionData = await getSession();
//             if (!sessionData) {
//                 router.push('/login');
//             } else {
//                 setSession(sessionData);
//             }
//         };
//         fetchSession();
//     }, [router]);

//     if (!session) return null;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{t('dashboard.title')}</h1>
            <p>{t('dashboard.welcome', { name: session.user.name })}</p>
            <Link href="/api/auth/signout" className="flex items-center mt-4 text-red-500 hover:text-red-700">
                <FaSignOutAlt className="mr-2" />
                {t('dashboard.logout')}
            </Link>
        </div>
    );

}