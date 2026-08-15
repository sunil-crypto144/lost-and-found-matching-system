import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Shield, LogOut, Sparkles, HelpCircle, Award } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Lost & Found
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
              Explainable Engine
            </span>
          </div>
        </Link>

        <nav className="flex items-center space-x-1 sm:space-x-3">
          <Link
            to="/how-it-works"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>How It Works</span>
          </Link>

          <Link
            to="/report-lost"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Lost</span>
          </Link>

          <Link
            to="/report-found"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Found</span>
          </Link>

          {user && user.role === 'ADMIN' ? (
            <>
              <Link
                to="/retrieved"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Retrieved Archive</span>
              </Link>
              <Link
                to="/admin"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                title="Admin Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin Login</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
