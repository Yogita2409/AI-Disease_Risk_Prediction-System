import { Outlet } from 'react-router';
import { Navbar } from './Navbar';
import { Toaster } from './ui/sonner';

export const Root = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};
