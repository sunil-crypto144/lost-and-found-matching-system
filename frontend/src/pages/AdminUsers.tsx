import React, { useEffect, useState } from 'react';
import { adminService } from '../services/api';
import { User } from '../types';
import { Users, Shield } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminService.getUsers();
        setUsers(data);
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-400">Loading user list...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Registered User Directory</h1>
        <p className="text-sm text-slate-400">Inspect system accounts and assigned access roles</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4">User ID</th>
              <th className="p-4">Full Name</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">System Role</th>
              <th className="p-4">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 text-slate-500">#{u.id}</td>
                <td className="p-4 font-semibold text-white">{u.name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4">{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
