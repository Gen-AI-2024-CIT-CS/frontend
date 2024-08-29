'use client';

import React, { useEffect, useState } from 'react';
import { getUsers } from '../utils/api';

interface User {
  id: number;
  name: string;
  email: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white underline">User List</h2>
      <ul className="space-y-2">
        {users.map(user => (
          <li key={user.id} className="bg-gray-700 p-3 rounded-lg shadow flex justify-evenly">
            <span className="font-semibold text-blue-300">{user.id}</span>
            <span className="ml-2 text-white">{user.name}</span>
            <span className="ml-2 text-gray-400">{user.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;