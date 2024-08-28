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
  
if (loading) return <div>Loading...</div>;
if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.id}. {user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;