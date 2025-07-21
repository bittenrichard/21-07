import React from 'react';
import { PageKey } from '../../types';
import { User } from '../../../features/auth/types';

interface HeaderProps {
  currentPage: PageKey;
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ currentPage, user }) => {
  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard';
      case 'new-screening':
        return 'Nova Triagem';
      case 'results':
        return 'Resultados da Triagem';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="flex items-center h-20 px-6 sm:px-10 bg-white shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-800">
        {getPageTitle()}
      </h1>
      <div className="flex flex-shrink-0 items-center ml-auto">
        <button className="inline-flex items-center p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <div className="hidden md:flex md:flex-col md:items-end md:leading-tight">
            <span className="font-semibold">{user?.name}</span>
            <span className="text-sm text-gray-600">{user?.company}</span>
          </div>
          <span className="h-12 w-12 ml-2 sm:ml-3 mr-2 bg-gray-100 rounded-full overflow-hidden">
            <img
              src={user?.avatar}
              alt="avatar"
              className="h-full w-full object-cover"
            />
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;