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
      <div className="max-w-2xl mx-auto mt-8 p-6 rounded-lg shadow-lg">
        <h2 className='text-2xl font-bold mb-4 text-center text-white'>User List</h2>
        <ul className='space-y-2'>
          {users.map(user => (
            <li 
              key={user.id}
              className="bg-gray-700 p-4 rounded-lg shadow flex justify-evenly items-center hover:bg-gray-600 transition duration-300"
            >
              <span className="text-white">User ID: {user.id}</span>
              <span className="text-white">User Name: {user.name}</span>
              <span className="text-white">User Email: {user.email}</span>
            </li>
          ))}
        </ul>
      </div>
    );
};

export default UserList;