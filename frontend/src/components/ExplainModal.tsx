import React from 'react';
import { Match } from '../types';
import { X, Sparkles, CheckCircle, Sliders } from 'lucide-react';

interface ExplainModalProps {
  match: Match;
  onClose: () => void;
}

export const ExplainModal: React.FC<ExplainModalProps> = ({ match, onClose }) => {
  const f = match.factors;

  const factorsList = [
    { label: 'Location Proximity', weight: '20%', score: f.location_score, desc: 'Geographic and text location closeness' },
    { label: 'Category Match', weight: '15%', score: f.category_score, desc: 'Exact or parent item classification' },
    { label: 'Item Name Similarity', weight: '15%', score: f.item_score, desc: 'Title fuzzy and token similarity' },
    { label: 'Brand Match', weight: '15%', score: f.brand_score, desc: 'Manufacturer or brand correlation' },
    { label: 'Date/Time Proximity', weight: '15%', score: f.time_score, desc: 'Closeness of lost/found reported dates' },
    { label: 'Color Scheme', weight: '10%', score: f.color_score, desc: 'Attribute color match' },
    { label: 'Description Semantic Sim', weight: '10%', score: f.description_score, desc: 'TF-IDF semantic description match' },
  ];

  if (f.image_score !== undefined && f.image_score > 0) {
    factorsList.push({
      label: 'Visual Image Hash Sim',
      weight: 'Bonus',
      score: f.image_score,
      desc: 'Perceptual hashing & histogram correlation'
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl max-w-2xl w-full p-6 space-y-6 relative border border-slate-700 shadow-2xl animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Explainable Score Breakdown</h3>
            <p className="text-xs text-slate-400">
              Match #{match.id} &bull; Overall Calculated Score: <span className="text-blue-400 font-bold text-sm">{Math.round(match.match_score)}%</span>
            </p>
          </div>
        </div>

        {/* Explainable Reasons */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-sm font-semibold text-slate-200">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Why the engine identified this match:</span>
          </div>
          <ul className="space-y-1 pl-6 list-disc text-xs text-slate-300">
            {match.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>

        {/* Factor Breakdown Bars */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>SCORING FACTOR</span>
            <span>WEIGHT & SCORE</span>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {factorsList.map((factor, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-200">{factor.label} ({factor.weight})</span>
                  <span className="font-bold text-blue-400">{Math.round(factor.score)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      factor.score >= 80 ? 'bg-emerald-500' :
                      factor.score >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500">{factor.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close Explanation
          </button>
        </div>
      </div>
    </div>
  );
};
