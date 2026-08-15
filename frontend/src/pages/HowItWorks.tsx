import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Cpu, 
  MapPin, 
  Tag, 
  Calendar, 
  Sliders, 
  Camera, 
  PlusCircle, 
  ArrowLeft,
  ShieldCheck,
  Percent,
  CheckCircle2
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [selectedDemoTab, setSelectedDemoTab] = useState<'electronics' | 'bag' | 'keys'>('electronics');

  const demoScenarios = {
    electronics: {
      lostName: "Samsung Galaxy S23 Ultra (Phantom Black)",
      lostDesc: "Black Samsung phone with clear transparent case and developer sticker.",
      foundName: "Black Samsung Smartphone with Clear Case",
      foundDesc: "Black Samsung phone with transparent protective cover found on desk.",
      overallScore: 94,
      factors: [
        { label: "Location Proximity", score: 100, weight: "20%" },
        { label: "Category Match", score: 100, weight: "15%" },
        { label: "Brand Correlation", score: 100, weight: "15%" },
        { label: "Item Title Similarity", score: 92, weight: "15%" },
        { label: "Date/Time Closeness", score: 85, weight: "15%" },
        { label: "Color Scheme", score: 100, weight: "10%" },
        { label: "Semantic Description", score: 88, weight: "10%" },
      ],
      reasons: ["Identical Electronics category", "Matching Samsung brand", "Exact same location area", "High description semantic similarity"]
    },
    bag: {
      lostName: "Blue Nike Water-Resistant Backpack",
      lostDesc: "Navy blue backpack containing college notes and blue umbrella.",
      foundName: "Dark Blue Nike Bag",
      foundDesc: "Blue sports bag with notebooks found near ticketing counter.",
      overallScore: 86,
      factors: [
        { label: "Location Proximity", score: 90, weight: "20%" },
        { label: "Category Match", score: 100, weight: "15%" },
        { label: "Brand Correlation", score: 100, weight: "15%" },
        { label: "Item Title Similarity", score: 84, weight: "15%" },
        { label: "Date/Time Closeness", score: 80, weight: "15%" },
        { label: "Color Scheme", score: 90, weight: "10%" },
        { label: "Semantic Description", score: 78, weight: "10%" },
      ],
      reasons: ["Matching Bags category", "Matching Nike brand", "Reported within 1 day", "High token semantic overlap"]
    },
    keys: {
      lostName: "Silver Honda Car Key with Leather Fob",
      lostDesc: "Remote key with brown leather strap and house key.",
      foundName: "Honda Key with Brown Fob",
      foundDesc: "Car key with leather keychain found in food court area.",
      overallScore: 91,
      factors: [
        { label: "Location Proximity", score: 85, weight: "20%" },
        { label: "Category Match", score: 100, weight: "15%" },
        { label: "Brand Correlation", score: 100, weight: "15%" },
        { label: "Item Title Similarity", score: 88, weight: "15%" },
        { label: "Date/Time Closeness", score: 90, weight: "15%" },
        { label: "Color Scheme", score: 80, weight: "10%" },
        { label: "Semantic Description", score: 85, weight: "10%" },
      ],
      reasons: ["Identical Keys category", "Matching Honda brand", "Same day report", "Nearby mall zone"]
    }
  };

  const currentDemo = demoScenarios[selectedDemoTab];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Back button & Header */}
      <div className="space-y-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HOW IT WORKS & MATCHING ENGINE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Inside the Explainable Matching System
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
            Learn how our deterministic 7-factor similarity engine computes match probabilities and provides clear natural-language reasons for every item recommendation.
          </p>
        </div>
      </div>

      {/* Live Interactive Engine Simulator */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Cpu className="w-6 h-6 text-blue-400" />
            <span>Live Interactive Engine Simulator</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Select a sample scenario below to test how structured weights and semantic text similarity compute transparent scores in real time.
          </p>

          {/* Scenario Selector Pills */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setSelectedDemoTab('electronics')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDemoTab === 'electronics'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              📱 Smartphone Match (94%)
            </button>
            <button
              onClick={() => setSelectedDemoTab('bag')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDemoTab === 'bag'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              🎒 Backpack Match (86%)
            </button>
            <button
              onClick={() => setSelectedDemoTab('keys')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDemoTab === 'keys'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              🔑 Car Keys Match (91%)
            </button>
          </div>
        </div>

        {/* Live Simulator Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-8 bg-slate-900/80">
          {/* Header Dial */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex flex-col items-center justify-center text-white shadow-xl shadow-emerald-600/30">
                <span className="text-2xl font-black">{currentDemo.overallScore}%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Score</span>
              </div>
              <div>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Strong Match Identified
                </div>
                <h3 className="text-lg font-bold text-white mt-1">Multi-Attribute Similarity Breakdown</h3>
              </div>
            </div>

            {/* Explain Reasons */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              {currentDemo.reasons.map((r, i) => (
                <span key={i} className="text-xs bg-slate-800/90 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700">
                  ✓ {r}
                </span>
              ))}
            </div>
          </div>

          {/* Comparison Pair */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-red-950/20 border border-red-900/30 space-y-2">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Reported Lost</span>
              <h4 className="text-base font-bold text-white">{currentDemo.lostName}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{currentDemo.lostDesc}</p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Reported Found</span>
              <h4 className="text-base font-bold text-white">{currentDemo.foundName}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{currentDemo.foundDesc}</p>
            </div>
          </div>

          {/* Factor Progress Bars */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Factor Breakdown Matrix</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentDemo.factors.map((f, i) => (
                <div key={i} className="space-y-1.5 p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{f.label} ({f.weight})</span>
                    <span className="font-bold text-blue-400">{f.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 rounded-full"
                      style={{ width: `${f.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive 7-Factor Scoring Section */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Percent className="w-6 h-6 text-purple-400" />
            <span>Comprehensive 7-Factor Scoring Matrix</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Rather than relying on vague keyword searches, our algorithm evaluates structured attributes with calibrated mathematical weights.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 space-y-3 border border-slate-800">
            <MapPin className="w-6 h-6 text-blue-400" />
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-white">Location Proximity</h4>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">20% Weight</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Spatial closeness comparing geographic coordinates via Haversine formula and tokenized string matching for indoor building locations.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3 border border-slate-800">
            <Tag className="w-6 h-6 text-purple-400" />
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-white">Category Taxonomy</h4>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">15% Weight</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verifies candidate items belong to matching classification taxonomies (Electronics, Bags, Keys, Documents, Accessories).
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3 border border-slate-800">
            <Cpu className="w-6 h-6 text-emerald-400" />
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-white">Brand & Model NLP</h4>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">15% Weight</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracts manufacturer entities (Apple, Samsung, Nike, Sony) and handles fuzzy typos or abbreviation variances.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3 border border-slate-800">
            <Calendar className="w-6 h-6 text-rose-400" />
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-white">Date Closeness</h4>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400">15% Weight</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Applies an exponential time-decay curve comparing report dates. Same-day reports receive 100%, with progressive decay over days.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3 border border-slate-800">
            <Sliders className="w-6 h-6 text-amber-400" />
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-white">Color Correlation</h4>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">10% Weight</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Attribute color matching supporting compound phrases and shade variations (e.g. Midnight Black, Navy Blue, Silver/Grey).
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3 border border-slate-800">
            <Camera className="w-6 h-6 text-cyan-400" />
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-white">Perceptual Image Hash</h4>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">Bonus Factor</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates 64-bit difference perceptual hashes (dHash) to measure visual structure similarity across uploaded photos.
            </p>
          </div>
        </div>
      </section>

      {/* Confidence Thresholds Guide */}
      <section className="glass-card rounded-3xl p-8 border border-slate-800 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Match Confidence Categories</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
            <span className="px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-400">≥ 80% Match</span>
            <div className="font-bold text-white text-sm">Strong Match</div>
            <p className="text-slate-400">High confidence across location, category, brand, and temporal window. Immediate action suggested.</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
            <span className="px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-400">60% – 79% Match</span>
            <div className="font-bold text-white text-sm">Possible Match</div>
            <p className="text-slate-400">Solid similarity with minor variances in description or date. Recommended for user review.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-1.5">
            <span className="px-2 py-0.5 rounded font-bold bg-slate-800 text-slate-400">40% – 59% Match</span>
            <div className="font-bold text-white text-sm">Weak Match</div>
            <p className="text-slate-400">Partial category or title overlap. Flagged for optional manual inspection.</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="text-center space-y-4 pt-4">
        <h3 className="text-xl font-bold text-white">Ready to File a Report?</h3>
        <div className="flex justify-center space-x-4">
          <Link
            to="/report-lost"
            className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-600/20 text-xs flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Lost Item</span>
          </Link>
          <Link
            to="/report-found"
            className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/20 text-xs flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Report Found Item</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
