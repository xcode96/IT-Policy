import React from 'react';

interface HeaderProps {
  isAdmin: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, onLoginClick, onLogout, onSettingsClick }) => {
  return (
    <header className="flex-shrink-0 border-b border-border bg-surface">
      <div className="container mx-auto px-6 md:px-8 lg:px-10">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
             </svg>
            <h1 className="ml-4 text-2xl font-bold text-textPrimary tracking-wider">
              POLICY<span className="font-light text-primary">PORTAL</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
               <button 
                onClick={onSettingsClick}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-textSecondary bg-slate-100 rounded-md hover:bg-slate-200 hover:text-textPrimary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                 <span>Settings</span>
               </button>
            )}
            {isAdmin ? (
              <button 
                onClick={onLogout} 
                className="px-5 py-2 text-sm font-semibold text-textSecondary bg-slate-100 rounded-md hover:bg-slate-200 hover:text-textPrimary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={onLoginClick}
                className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-light transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-sm"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;