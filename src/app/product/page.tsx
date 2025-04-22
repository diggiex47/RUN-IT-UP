'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
    id: string;
    title: string;
    description: string;
    lastModified: string;
    modifiedBy: string;
}

interface User {
    role: string;
}

export default function ProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState<string | null>(null);
    const [editContent, setEditContent] = useState({ title: '', description: '' });

    useEffect(() => {
        const fetchUserAndProducts = async () => {
            try {
                // Fetch user profile to check role
                const profileResponse = await fetch('/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                
                if (profileResponse.ok) {
                    const userData = await profileResponse.json();
                    setUser(userData.user);
                }

                // Fetch products
                const productsResponse = await fetch('/api/products', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (productsResponse.ok) {
                    const data = await productsResponse.json();
                    setProducts(data.products);
                }
            } catch (error) {
                setError('Error loading content');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndProducts();
    }, []);

    const handleEdit = (product: Product) => {
        setEditMode(product.id);
        setEditContent({
            title: product.title,
            description: product.description,
        });
    };

    const handleSave = async (productId: string) => {
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(editContent),
            });

            if (response.ok) {
                const updatedProduct = await response.json();
                setProducts(products.map(p => 
                    p.id === productId ? updatedProduct : p
                ));
                setEditMode(null);
            }
        } catch (error) {
            console.error('Error updating product:', error);
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

    const canEdit = user?.role === 'admin' || user?.role === 'content manager';

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Products</h1>
                    <Link 
                        href="/profile" 
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Back to Profile
                    </Link>
                </div>

                <div className="grid gap-6">
                    {products.map(product => (
                        <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
                            {editMode === product.id ? (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={editContent.title}
                                        onChange={e => setEditContent({...editContent, title: e.target.value})}
                                        className="w-full p-2 border rounded"
                                    />
                                    <textarea
                                        value={editContent.description}
                                        onChange={e => setEditContent({...editContent, description: e.target.value})}
                                        className="w-full p-2 border rounded h-32"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleSave(product.id)}
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditMode(null)}
                                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
                                    <p className="text-gray-600 mb-4">{product.description}</p>
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <p>Last modified: {product.lastModified}</p>
                                        <p>Modified by: {product.modifiedBy}</p>
                                    </div>
                                    {canEdit && (
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
