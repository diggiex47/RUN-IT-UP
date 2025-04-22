'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import  React  from 'react'

interface UserProfile {
    id: string;
    username: string;
    email: string;
    role: string;
    isVerified: boolean;
    emailVerified: boolean;
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('/api/user/profile');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const data = await response.json();
                setUser(data.user);
            } catch (error) {
                setError('Error loading profile');
                console.error('Profile fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleResendVerification = async () => {
        try {
            const response = await fetch('/api/user/verifymail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                alert('Verification email sent successfully!');
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Failed to send verification email');
            }
        } catch (error: any) {
            alert(error.message || 'Error sending verification email');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold mb-6">Profile</h1>
                    
                    {user && (
                        <div className="space-y-6">
                            {/* User Information */}
                            <div className="border-b pb-4">
                                <h2 className="text-xl font-semibold mb-4">User Information</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-600">Username</p>
                                        <p className="font-medium">{user.username}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Email</p>
                                        <p className="font-medium">{user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Role</p>
                                        <p className="font-medium capitalize">{user.role}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Email Verification</p>
                                        <p className={`font-medium ${user.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                                            {user.isVerified ? 'Verified' : 'Not Verified'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Role-specific Content */}
                            {user.role === 'admin' && (
                                <div className="border-b pb-4">
                                    <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
                                    <button 
                                        onClick={() => router.push('/admin')}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Go to Admin Dashboard
                                    </button >
                                </div>
                            )}

                            {user.role === 'content manager' && (
                                <div className="border-b pb-4">
                                    <h2 className="text-xl font-semibold mb-4">Content Management</h2>
                                    <button 
                                        onClick={() => router.push('/product')}
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    >
                                        Manage Content
                                    </button>
                                </div>
                            )}

                            {/* Account Settings */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                                {!user.isVerified && (
                                    <button 
                                        onClick={handleResendVerification}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
                                    >
                                        Resend Verification Email
                                    </button>
                                )}
                                <button 
                                    onClick={() => router.push('/resetPassword')}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

