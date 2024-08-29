import dynamic from 'next/dynamic';

const UserList = dynamic(() => import('../components/UserList'), { ssr: false });
const Login = dynamic(() => import('../components/Login'), { ssr: false });

export default function Home() {
  return (
    <main>
      <h1 className='text-center m-5 font-bold text-3xl'>My App</h1>
      <Login />
      <UserList />
    </main>
  );
}