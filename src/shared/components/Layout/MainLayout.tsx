import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { PageKey } from '../../types';
import { User } from '../../../features/auth/types';

interface MainLayoutProps {
  currentPage: PageKey;
  user: User | null;
  onNavigate: (page: PageKey) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  currentPage,
  user,
  onNavigate,
  onLogout,
  children
}) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
      <div className="flex flex-col flex-grow">
        <Header currentPage={currentPage} user={user} />
        <main className="flex-grow p-6 sm:p-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;