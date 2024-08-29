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
      <div className="flex w-full max-w-4xl bg-white shadow-lg">
        {/* Left Section for Heading and Subheading */}
        <div className="flex w-1/2 flex-col items-center justify-center p-10">
          <h1 className="mb-2 text-2xl font-bold text-gray-900 text-center">NPTEL - Automation Tool</h1>
          <p className="text-sm text-gray-600 text-center">Use your NPTEL Account</p>
        </div>
        {/* Right Section for Form */}
        <div className="flex w-1/2 flex-col justify-center p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input Field */}
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                className="peer w-full rounded-md border border-gray-300 px-3 py-4 text-gray-900 placeholder-transparent focus:border-[#990011] focus:outline-none focus:ring-2 focus:ring-[#990011]"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                htmlFor="email"
                className="absolute left-3 top-1/2 text-sm text-gray-500 transition-transform duration-300 ease-in-out transform -translate-y-1/2 bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-[#990011]"
              >
                Email address
              </label>
            </div>

            {/* Password Input Field */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="peer w-full rounded-md border border-gray-300 px-3 py-4 text-gray-900 placeholder-transparent focus:border-[#990011] focus:outline-none focus:ring-2 focus:ring-[#990011]"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                htmlFor="password"
                className="absolute left-3 top-1/2 text-sm text-gray-500 transition-transform duration-300 ease-in-out transform -translate-y-1/2 bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-[#990011]"
              >
                Password
              </label>
            </div>

            {/* Links and Buttons */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleContactAdmin}
                className="rounded-md bg-transparent px-3 py-2 text-sm font-medium text-[#990011] hover:bg-[#ffebee] focus:outline-none focus:ring-2 focus:ring-[#990011] focus:ring-offset-2"
              >
                Contact Admin
              </button>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="group relative flex justify-center rounded-md border border-transparent bg-[#990011] px-4 py-2 text-sm font-medium text-white hover:bg-[#800000] focus:outline-none focus:ring-2 focus:ring-[#990011] focus:ring-offset-2"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}