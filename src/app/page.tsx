import dynamic from 'next/dynamic';

const UserList = dynamic(() => import('../components/UserList'), { ssr: false });
const Login = dynamic(() => import('../components/Login'), { ssr: false });

export default function Home() {
  return (
    <main>
      <h1 className='text-center font-bold text-3xl m-5'>My App</h1>
      <Login />
      <UserList />
    </main>
  );
}