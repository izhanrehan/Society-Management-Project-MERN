import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ pageTitle = 'Dashboard' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      'Are you sure you want to logout from the Society Admin Panel?'
    );

    if (confirmLogout) {
      localStorage.clear();
      navigate('/');
    }
  };

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-8 py-4 pl-24 sm:pl-8 bg-white shadow-sm border-b border-gray-200">
      <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 text-left leading-snug break-words">
        Society Name - {pageTitle}
      </h1>

      <button
        className="self-start sm:self-auto text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-md transition-colors text-sm font-bold tracking-wide"
        onClick={handleLogout}
      >
        Logout
      </button>
    </header>
  );
};

export default Header;