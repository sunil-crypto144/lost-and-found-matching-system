import React from 'react';
import { Item } from '../types';
import { MapPin, Calendar, Tag, ShieldCheck, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ItemCardProps {
  item: Item;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const isLost = item.type === 'LOST';

  return (
    <div className="glass-card rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
            isLost 
              ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {isLost ? 'LOST REPORT' : 'FOUND REPORT'}
          </span>

          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            item.status === 'OPEN' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
            item.status === 'MATCHED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
            'bg-slate-800 text-slate-400'
          }`}>
            {item.status}
          </span>
        </div>

        <div className="relative h-44 mb-4 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
          {item.image_url ? (
            <img 
              src={item.image_url} 
              alt={item.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center text-slate-600">
              <HelpCircle className="w-10 h-10 mb-1 stroke-1" />
              <span className="text-xs">No image provided</span>
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
          {item.name}
        </h3>

        <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-medium text-slate-200">{item.category}</span>
            {item.brand && <span className="text-slate-400">• {item.brand}</span>}
            {item.color && <span className="text-slate-400">• {item.color}</span>}
          </div>

          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate">{item.location}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{item.event_date} {item.event_time && `at ${item.event_time}`}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-500">Reported by {item.owner_name || 'User'}</span>
        <Link
          to={`/items/${item.id}`}
          className="text-blue-400 font-semibold hover:underline"
        >
          View Details &rarr;
        </Link>
      </div>
    </div>
  );
};
