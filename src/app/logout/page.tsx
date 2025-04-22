"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                const response = await fetch('/api/user/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Clear any client-side storage if exists
                    localStorage.removeItem('token');
                    // Redirect to login page
                    router.push('/login');
                }
            } catch (error) {
                console.error('Logout error:', error);
                // Still redirect to login on error
                router.push('/login');
            }
        };

        handleLogout();
    }, [router]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
}