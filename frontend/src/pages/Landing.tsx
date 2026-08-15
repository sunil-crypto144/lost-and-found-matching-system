import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { itemService, matchService } from '../services/api';
import { 
  PlusCircle, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  ArrowRight,
  Activity,
  Award
} from 'lucide-react';

export const Landing: React.FC = () => {
  const [stats, setStats] = useState({ lostCount: 0, foundCount: 0, retrievedCount: 0 });
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [items, matches] = await Promise.all([
          itemService.searchItems(),
          matchService.getMatches()
        ]);
        const lost = items.filter(i => i.type === 'LOST' && i.status === 'OPEN').length;
        const found = items.filter(i => i.type === 'FOUND' && i.status === 'OPEN').length;
        const retrieved = items.filter(i => i.status === 'RESOLVED').length || matches.filter(m => m.status === 'RESOLVED').length;
        
        setStats({ 
          lostCount: lost || items.filter(i => i.type === 'LOST').length, 
          foundCount: found || items.filter(i => i.type === 'FOUND').length, 
          retrievedCount: retrieved
        });
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    };
    fetchData();
  }, []);

  const faqs = [
    {
      q: "Do I need to create an account to report an item?",
      a: "No! Anyone can submit a lost or found report in 30 seconds without signing up. Just provide your contact details (email or phone) so finders and owners can be reconnected."
    },
    {
      q: "How does the explainable matching engine work?",
      a: "Rather than treating AI as a black box, our engine calculates deterministic weighted scores across 7 structured attributes: Location (20%), Category (15%), Brand (15%), Title (15%), Date proximity (15%), Color (10%), and Semantic Description (10%)."
    },
    {
      q: "Can I upload a photo of the item?",
      a: "Yes! You can attach photos in JPEG, PNG, or WEBP formats up to 5MB. The system computes perceptual visual hashes to compare visual similarities."
    },
    {
      q: "Who confirms matches and handles handoffs?",
      a: "When a potential match is identified, both parties and system administrators can review the transparent score breakdown and confirm the match, locking the item from duplicate submissions."
    }
  ];

  return (
    <div className="relative overflow-hidden pb-24 space-y-24">
      {/* Ambient Background Glowing Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[15%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[130px] animate-pulse-glow" />
        <div className="absolute top-[10%] right-[15%] w-[450px] h-[450px] rounded-full bg-purple-600/20 blur-[140px] animate-float-slow" />
        <div className="absolute top-[30%] left-[35%] w-[380px] h-[380px] rounded-full bg-rose-600/15 blur-[120px] animate-float-reverse" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 text-center space-y-8">
        {/* Animated Badge */}
        <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-blue-500/30 text-blue-400 text-xs font-semibold shadow-lg shadow-blue-500/10 backdrop-blur-md animate-float-slow">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Explainable Multi-Factor AI Engine 2.0</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            <span className="text-white">Find What's </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-rose-400 to-pink-500">Lost.</span>
            <br />
            <span className="text-white">Reconnect What's </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">Found.</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            No mandatory signup required. File a lost or found report in 30 seconds and let our transparent AI matching engine calculate real similarity scores.
          </p>
        </div>

        {/* Dual High-Impact Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto pt-4">
          {/* Lost Item Card */}
          <Link
            to="/report-lost"
            className="group relative rounded-3xl p-8 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-red-950/20 border border-red-500/30 hover:border-red-400/80 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-red-500/20 flex flex-col justify-between text-left"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-500/40 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-red-400">Lost Something?</span>
                <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-red-300 transition-colors">
                  Report Lost Item
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Provide item attributes, last seen location, and optional photo. Our engine scans active found listings instantly.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold text-red-400 group-hover:text-red-300 space-x-1.5">
              <span>Start Lost Report</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Found Item Card */}
          <Link
            to="/report-found"
            className="group relative rounded-3xl p-8 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-emerald-950/20 border border-emerald-500/30 hover:border-emerald-400/80 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 flex flex-col justify-between text-left"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/40 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-emerald-400">Discovered an Item?</span>
                <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
                  Report Found Item
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Log what you found and where. Help return valuables to their rightful owners safely with automatic matching.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold text-emerald-400 group-hover:text-emerald-300 space-x-1.5">
              <span>Start Found Report</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Dynamic Live Statistics Bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
            <div className="space-y-2 pt-4 sm:pt-0">
              <div className="flex items-center justify-center space-x-2">
                <Activity className="w-5 h-5 text-red-400" />
                <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">
                  {stats.lostCount}
                </span>
              </div>
              <div className="text-sm font-semibold text-slate-200">Active Lost Reports</div>
              <p className="text-xs text-slate-500">Items currently being searched</p>
            </div>

            <div className="space-y-2 pt-4 sm:pt-0">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  {stats.foundCount}
                </span>
              </div>
              <div className="text-sm font-semibold text-slate-200">Found Items Logged</div>
              <p className="text-xs text-slate-500">Awaiting owner verification</p>
            </div>

            <div className="space-y-2 pt-4 sm:pt-0">
              <div className="flex items-center justify-center space-x-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                  {stats.retrievedCount}
                </span>
              </div>
              <div className="text-sm font-semibold text-slate-200">Successfully Retrieved & Returned</div>
              <p className="text-xs text-slate-500">Reunited with rightful owners</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Simple How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            SIMPLE 3-STEP PROCESS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How Lost & Found Works</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            A frictionless workflow designed for fast submissions and high recovery rates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card rounded-3xl p-8 space-y-4 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black text-xl">
              1
            </div>
            <h3 className="text-xl font-bold text-white">Submit Report</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              No account needed. Fill out the 30-second form with item name, category, color, location, and optional photo.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 space-y-4 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-black text-xl">
              2
            </div>
            <h3 className="text-xl font-bold text-white">Engine Matching</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Our explainable engine scans the database across 7 attributes and calculates a transparent percentage match score.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 space-y-4 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-xl">
              3
            </div>
            <h3 className="text-xl font-bold text-white">Verified Reunion</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Review factor breakdowns, confirm the match, and safely connect with the finder or coordinator to retrieve your item.
            </p>
          </div>
        </div>

        {/* Want to know more? Click here Link Button */}
        <div className="text-center pt-4">
          <Link
            to="/how-it-works"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 border border-blue-500/30 hover:border-blue-400/80 text-blue-300 hover:text-white font-semibold text-sm transition-all shadow-lg hover:shadow-blue-500/20 group"
          >
            <span>Want to know more?</span>
            <span className="text-blue-400 underline group-hover:text-white font-bold">Click here</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm">Everything you need to know about reporting and recovery.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="glass-card rounded-2xl border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between space-x-4 text-white font-bold text-sm sm:text-base hover:text-blue-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-blue-400" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* High Impact Bottom CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-10 sm:p-14 bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border border-blue-500/30 text-center space-y-6 overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Ready to Find Your Lost Item?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Submit a report in under a minute without signing up. Our explainable engine scans new listings 24/7.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/report-lost"
              className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 shadow-xl shadow-red-600/30 transition-all flex items-center space-x-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Report Lost Item Now</span>
            </Link>

            <Link
              to="/report-found"
              className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-600/30 transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Report Found Item</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
