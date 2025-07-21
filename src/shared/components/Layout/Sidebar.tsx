import React from 'react';
import { LayoutDashboard, PlusCircle, Settings, LogOut } from 'lucide-react';
import { PageKey } from '../../types';

interface SidebarProps {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  onNavigate, 
  onLogout 
}) => {
  const menuItems = [
    { 
      key: 'dashboard' as const, 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      active: currentPage === 'dashboard'
    },
    { 
      key: 'new-screening' as const, 
      label: 'Nova Triagem', 
      icon: PlusCircle,
      active: currentPage === 'new-screening'
    },
    { 
      key: 'settings' as const, 
      label: 'Configurações', 
      icon: Settings,
      active: false
    }
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-white shadow-md">
      <div className="flex items-center justify-center h-20 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          Recruta.<span className="text-indigo-600">AI</span>
        </h1>
      </div>
      <div className="flex flex-col flex-grow p-4">
        <nav className="flex-grow space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => item.key !== 'settings' && onNavigate(item.key)}
              className={`flex items-center w-full p-3 rounded-lg font-medium transition-colors ${
                item.active
                  ? 'text-gray-600 bg-gray-100'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <item.icon className="mr-3" size={20} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <button
            onClick={onLogout}
            className="flex items-center w-full p-3 text-gray-500 hover:bg-gray-100 rounded-lg font-medium transition-colors"
          >
            <LogOut className="mr-3" size={20} />
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;