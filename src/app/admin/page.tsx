"use client";

import { useState, useEffect } from 'react';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [newRole, setNewRole] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/user/getAllUsers', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setUsers(data.users);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setMessage('Error fetching users.');
            }
        };

        fetchUsers();
    }, []);

    const updateRole = async () => {
        try {
            const response = await fetch('/api/user/updateRole', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    userId: selectedUser,
                    newRole: newRole,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`Success: ${data.message}`);
                setUsers(users.map(user => 
                    user.id === selectedUser 
                        ? { ...user, role: newRole }
                        : user
                ));
                setSelectedUser('');
                setNewRole('');
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error) {
            setMessage('Error updating role.');
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Manage User Roles</h2>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Select User</label>
                    <select 
                        className="w-full p-2 border rounded"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        <option value="">Select a user</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.username} ({user.email}) - Current Role: {user.role}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">New Role</label>
                    <select 
                        className="w-full p-2 border rounded"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                    >
                        <option value="">Select new role</option>
                        <option value="user">User</option>
                        <option value="content manager">Content Manager</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={updateRole}
                    disabled={!selectedUser || !newRole}
                >
                    Update Role
                </button>

                {message && (
                    <div className={`mt-4 p-3 rounded ${
                        message.startsWith('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {message}
                    </div>
                )}

                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">All Users</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Username</th>
                                    <th className="px-4 py-2">Email</th>
                                    <th className="px-4 py-2">Current Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="border px-4 py-2">{user.username}</td>
                                        <td className="border px-4 py-2">{user.email}</td>
                                        <td className="border px-4 py-2">{user.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}