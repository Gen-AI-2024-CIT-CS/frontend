import dynamic from 'next/dynamic';

const UserList = dynamic(() => import('../components/UserList'), {
  ssr: false
});

export default function Home() {
  return (
    <main>
      <h1>My App</h1>
      <UserList />
    </main>
  );
}