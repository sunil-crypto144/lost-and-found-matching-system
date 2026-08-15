import React from 'react';
import { Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-slate-300">
            Lost & Found Explainable Matching System
          </span>
        </div>
        <p className="text-xs text-slate-500 text-center md:text-right">
          Production Quality Full-Stack Software Engineering Assessment &copy; 2026. Built with FastAPI, React & TypeScript.
        </p>
      </div>
    </footer>
  );
};
