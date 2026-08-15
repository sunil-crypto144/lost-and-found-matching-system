import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, Shield, Calendar } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div className="glass-card rounded-2xl p-8 border border-slate-800 space-y-6">
        <div className="flex items-center space-x-4 border-b border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-extrabold text-2xl text-white shadow-lg shadow-blue-500/20">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mt-1">
              Role: {user.role}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <Mail className="w-5 h-5 text-slate-500" />
            <div>
              <span className="text-xs text-slate-500 block">Email Address</span>
              <span className="font-medium text-white">{user.email}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <Shield className="w-5 h-5 text-slate-500" />
            <div>
              <span className="text-xs text-slate-500 block">Access Control Role</span>
              <span className="font-medium text-white">{user.role}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <Calendar className="w-5 h-5 text-slate-500" />
            <div>
              <span className="text-xs text-slate-500 block">Account Member Since</span>
              <span className="font-medium text-white">{new Date(user.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
