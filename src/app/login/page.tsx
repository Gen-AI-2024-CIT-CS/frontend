'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../utils/api';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const clearForm = () => {
    setEmail('');
    setPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await login(email, password);
        if (response.data.success) {
          console.log('Logged in successfully', response.data.user);
          setSuccess('Logged in successfully');
          clearForm();
          // Clear success message after 3 seconds
          setTimeout(() => setSuccess(''), 3000);
        }
      } catch (err) {
        setError('Invalid credentials');
        setPassword(''); // Only clear password on error
        // Clear error message after 3 seconds
        setTimeout(() => setError(''), 3000);
      }
  };

  const handleContactAdmin = () => {
    alert('Please contact akshaykumarb.cs2023@citchennai.net for assistance.');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-10 shadow-lg">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">NPTEL - Automation Tool</h1>
          <p className="text-sm text-gray-600">Use your NPTEL Account</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-[#990011] focus:outline-none focus:ring-[#990011]"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-[#990011] focus:outline-none focus:ring-[#990011]"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          {success && <p className="text-xs text-green-500 mt-1">{success}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              className="group relative flex justify-center rounded-md border border-transparent bg-[#990011] px-4 py-2 text-sm font-medium text-white hover:bg-[#800000] focus:outline-none focus:ring-2 focus:ring-[#990011] focus:ring-offset-2"
            >
              Log In
            </button>
          </div>
        </form>
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm">
            <a href="#" className="font-medium text-[#990011] hover:text-[#800000]">
              Having Trouble Logging in?
            </a>
          </div>
          <button
            type="button"
            onClick={handleContactAdmin}
            className="rounded-md bg-transparent px-3 py-2 text-sm font-medium text-[#990011] hover:bg-[#ffebee] focus:outline-none focus:ring-2 focus:ring-[#990011] focus:ring-offset-2"
          >
            Contact Admin
          </button>
        </div>
      </div>
    </main>
  );
}