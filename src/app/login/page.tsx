'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder authentication logic
    if (email === 'user@example.com' && password === 'password') {
      router.push('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleContactAdmin = () => {
    alert('Please contact akshaykumarb.cs2023@citchennai.net for assistance.');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-lg">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">NPTEL - Automation Tool</h1>
          <p className="text-sm text-gray-600">Use your NPTEL Account</p>
        </div>
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
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
          <div className="flex items-center justify-between">
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
          <div className="flex justify-end">
            <button
              type="submit"
              className="group relative flex justify-center rounded-md border border-transparent bg-[#990011] px-4 py-2 text-sm font-medium text-white hover:bg-[#800000] focus:outline-none focus:ring-2 focus:ring-[#990011] focus:ring-offset-2"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}