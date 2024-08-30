'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../utils/api';  // Make sure to create this file and function

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showContactEmail, setShowContactEmail] = useState(false);
  const router = useRouter();

  const clearForm = () => {
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      if (response.data.success) {
        console.log('Logged in successfully', response.data.user);
        setSuccess('Logged in successfully');
        clearForm();
        setTimeout(() => setSuccess(''), 3000);
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials');
      setPassword('');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleContactAdmin = () => {
    setShowContactEmail(!showContactEmail);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-[10px]" >
        <div className="flex w-1/2 flex-col items-center justify-center p-10">
          <div className='flex flex-row'>
          <h1 className="mb-2 text-2xl font-bold text-gray-900 text-center hover:text-[#990011] hover:cursor-pointer transition-colors duration-250 ease-in-out">NPTEL</h1><h1 className="mb-2 text-2xl font-bold text-gray-900 text-center"> - Automation Tool</h1>
          </div>
          <p className="text-sm text-gray-600 text-center">Use your NPTEL Account</p>
        </div>
        <div className="flex w-1/2 flex-col justify-center p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <div className="relative mt-11">
              <input
                id="email"
                name="email"
                type="email"
                required
                className=" peer w-full rounded-md border border-gray-300 px-3 py-3  text-gray-900 placeholder-transparent focus:border-[#990011] hover:cursor-pointer focus:outline-none focus:ring-1  focus:ring-[#990011]"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                htmlFor="email"
                className="absolute left-3 -top-2 text-xs text-gray-500 transition-all 
                           peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                           peer-placeholder-shown:top-3 peer-focus:-top-2 peer-focus:text-xs 
                           peer-focus:text-[#990011] bg-white px-1"
              >
                Email address
              </label>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="peer w-full rounded-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-transparent focus:border-[#990011] hover:cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#990011]"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                htmlFor="password"
                className="absolute left-3 -top-2 text-xs text-gray-500 transition-all 
                           peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                           peer-placeholder-shown:top-3 peer-focus:-top-2 peer-focus:text-xs 
                           peer-focus:text-[#990011] bg-white px-1"
              >
                Password
              </label>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-gray-600">Having any trouble logging in?</p>
              <div className="relative inline-block pt-1">
                <button
                  type="button"
                  onClick={handleContactAdmin}
                  className="text-xs font-medium text-[#990011] hover:bg-[#ffe3e7] active:bg-[#ffd7dd] focus:outline-none p-2 rounded-md transition-colors duration-100 ease-in-out"
                >
                  Contact Admin
                </button>
                <span 
                  className={`absolute left-full top-0 ml-2 mt-[12px] font-medium whitespace-nowrap overflow-hidden text-xs text-[#990011] transition-all duration-300 ease-in-out ${
                    showContactEmail ? 'w-64 opacity-100' : 'w-0 opacity-0'
                  }`}
                >
                  akshaykumarb.cs2023@citchennai.net
                </span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-[#990011] px-4 py-2 text-sm font-medium text-white hover:bg-[#800000] hover:scale-[1.2] focus:outline-none focus:ring-2 focus:ring-[#990011] focus:ring-offset-2 transition-transform duration-500 ease-in-out"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}