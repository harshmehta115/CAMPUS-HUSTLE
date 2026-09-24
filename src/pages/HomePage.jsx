import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Sparkles, ChevronRight } from 'lucide-react';
import { categories } from '../data/mockData';
import { useApp } from '../context/AppContext';
import HustleCard from '../components/HustleCard';

const HomePage = () => {
  const navigate = useNavigate();
  const { hustles, user } = useApp();
  const trending = hustles.slice(0, 6);

  return (
    <div className="page-enter">
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="blob blob-purple w-96 h-96 top-20 -left-20 animate-float" style={{ animationDelay: '0s' }} />
        <div className="blob blob-blue w-80 h-80 bottom-20 -right-10 animate-float" style={{ animationDelay: '3s' }} />
        <div className="blob blob-purple w-64 h-64 top-40 right-1/4 animate-pulse-slow opacity-10" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-semibold tracking-widest uppercase" style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc' }}>
                <Sparkles size={12} />
                The Campus Marketplace
                <Sparkles size={12} />
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] mb-6">
                <span className="text-white">Turn Your Skills</span><br />
                <span className="gradient-text">Into Your Next</span><br />
                <span className="text-white">Hustle.</span>
              </h1>

              <p className="text-gray-400 text-lg lg:text-xl leading-relaxed mb-10 max-w-lg">
                Need something done? Find a student who can.<br />
                Have a skill? <span className="text-purple-400 font-medium">Turn it into an opportunity.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/explore" className="btn-primary text-base px-8 py-4 gap-2">
                  Explore Hustles <ArrowRight size={18} />
                </Link>
                <Link to="/post" className="btn-secondary text-base px-8 py-4">
                  Post a Requirement
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 mt-12 justify-center lg:justify-start">
                <div>
                  <p className="text-2xl font-black gradient-text">1,200+</p>
                  <p className="text-xs text-gray-500 mt-0.5">Active Students</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-2xl font-black gradient-text">{hustles.length}+</p>
                  <p className="text-xs text-gray-500 mt-0.5">Hustles Posted</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-2xl font-black" style={{ color: '#22c55e' }}>₹{(user.totalEarnings / 1000).toFixed(1)}k+</p>
                  <p className="text-xs text-gray-500 mt-0.5">Your Earnings</p>
                </div>
              </div>
            </div>

            {/* Right — Hero Mockup */}
            <div className="relative hidden lg:block animate-float" style={{ animationDuration: '7s' }}>
              <div className="mockup-card shadow-2xl" style={{ boxShadow: '0 30px 80px rgba(147,51,234,0.25)' }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-gray-500">Trending Now</p>
                    <p className="font-bold text-white text-base">🔥 Campus Hustles</p>
                  </div>
                  <span className="badge-green text-xs">Live</span>
                </div>

                {hustles.slice(0, 3).map((h, i) => (
                  <button
                    key={h.id}
                    onClick={() => navigate(`/hustle/${h.id}`)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl mb-3 bg-white/5 border border-white/8 hover:border-purple-500/30 transition-all cursor-pointer text-left"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 bg-white/8">
                      {categories.find(c => c.id === h.category)?.icon || '📌'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{h.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-green-400 text-xs font-medium">₹{h.budget.min}–{h.budget.max}</span>
                        <span className="text-gray-600 text-xs">·</span>
                        <span className="text-gray-500 text-xs">{h.offers} offers</span>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: ['#9333ea','#3b82f6','#ec4899'][i % 3] }}>
                      {h.poster.avatar}
                    </div>
                  </button>
                ))}

                <div className="grid grid-cols-3 gap-3 mt-5">
                  {[
                    { label: 'Earning', value: `₹${(user.totalEarnings/1000).toFixed(1)}k`, icon: '💰', color: '#22c55e' },
                    { label: 'Done', value: user.totalHustles, icon: '✅', color: '#a855f7' },
                    { label: 'Rating', value: `${user.rating}★`, icon: '⭐', color: '#f59e0b' },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-lg mb-1">{s.icon}</p>
                      <p className="text-sm font-bold" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-xs text-gray-600">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -top-4 -right-4 glass rounded-2xl px-4 py-3 shadow-xl border border-white/10 animate-float" style={{ animationDelay: '2s', animationDuration: '5s' }}>
                <div className="flex items-center gap-2">
                  <div className="glow-dot" />
                  <span className="text-xs font-semibold text-white">New offer received!</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Sneha K. — ₹400</p>
              </div>

              <div className="absolute -bottom-4 -left-4 glass rounded-2xl px-4 py-3 shadow-xl border border-white/10 animate-float" style={{ animationDelay: '4s', animationDuration: '6s' }}>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-xs font-semibold text-white">Hustle completed!</span>
                </div>
                <p className="text-xs text-green-500 font-bold mt-0.5">+₹1,200 earned</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="badge-purple mb-4 mx-auto inline-flex">How it works</div>
            <h2 className="text-4xl font-black text-white mb-2">Simple. Fast. Student-first.</h2>
            <p className="text-gray-400">Three steps to your next hustle</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '📝', title: 'POST', subtitle: 'Tell the campus what you need.', desc: 'Post your requirement — tutoring, design, food, tech help. Set your budget and deadline.', color: '#9333ea' },
              { step: '02', icon: '🤝', title: 'CONNECT', subtitle: 'Get offers from students who can help.', desc: 'Students from your campus send their best offer. Browse profiles, ratings, and portfolios.', color: '#3b82f6' },
              { step: '03', icon: '⚡', title: 'HUSTLE', subtitle: 'Choose an offer, get it done, and earn.', desc: 'Accept the best offer, get the work done, rate each other. Build your campus reputation.', color: '#22c55e' },
            ].map((item) => (
              <div key={item.step} className="card group text-center relative overflow-hidden">
                <div className="absolute top-4 right-4 text-6xl font-black text-white/[0.03] select-none">{item.step}</div>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto" style={{ background: `${item.color}20`, border: `1px solid ${item.color}40` }}>
                  {item.icon}
                </div>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="font-black text-xs tracking-widest" style={{ color: item.color }}>{item.step}</span>
                  <span className="font-black text-xl text-white">{item.title}</span>
                </div>
                <p className="text-gray-300 font-semibold text-sm mb-3">{item.subtitle}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CATEGORIES ==================== */}
      <section className="py-24 relative">
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #9333ea 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <div className="badge-blue mb-4 mx-auto inline-flex">Browse by category</div>
            <h2 className="text-4xl font-black text-white mb-2">Popular Categories</h2>
            <p className="text-gray-400">Everything you need, from students who get it</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/explore?category=${cat.id}`}
                className="category-card group"
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
                <h3 className="font-bold text-sm text-white mb-1.5">{cat.label}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{cat.desc}</p>
                <div className="mt-4 flex items-center justify-center gap-1 text-purple-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Browse <ChevronRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TRENDING ==================== */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="badge-orange mb-3 inline-flex">🔥 Trending now</div>
              <h2 className="text-4xl font-black text-white mb-1">Trending on Campus</h2>
              <p className="text-gray-400">Hot requirements that need a hustler like you</p>
            </div>
            <Link to="/explore" className="btn-ghost hidden md:flex items-center gap-1 text-sm">
              View all ({hustles.length}) <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trending.map((hustle) => (
              <HustleCard
                key={hustle.id}
                hustle={hustle}
                onClick={() => navigate(`/hustle/${hustle.id}`)}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/explore" className="btn-primary px-8 py-3.5">
              Explore All Hustles <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(147,51,234,0.15) 0%, rgba(59,130,246,0.1) 100%)', borderTop: '1px solid rgba(168,85,247,0.2)', borderBottom: '1px solid rgba(168,85,247,0.2)' }} />
        <div className="blob blob-purple w-64 h-64 top-0 left-1/4 opacity-20" />
        <div className="blob blob-blue w-64 h-64 bottom-0 right-1/4 opacity-20" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-4">Ready to hustle?</p>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
            Your Campus. <span className="gradient-text">Your Skills.</span><br />Your Hustle.
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
            Join 1,200+ students already making money from their skills — right on campus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/post" className="btn-primary text-base px-10 py-4">
              Post Your First Hustle <ArrowRight size={18} />
            </Link>
            <Link to="/explore" className="btn-secondary text-base px-10 py-4">
              Start Exploring
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-12 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9333ea, #3b82f6)' }}>
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <span className="font-black text-sm gradient-text">CAMPUS</span>
              <span className="font-black text-sm text-white">HUSTLE</span>
            </div>
            <p className="text-gray-600 text-xs text-center">
              © 2025 Campus Hustle · Built for ITBM College · Peer-to-peer campus marketplace
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <button className="hover:text-gray-400 transition-colors">Privacy</button>
              <button className="hover:text-gray-400 transition-colors">Terms</button>
              <button className="hover:text-gray-400 transition-colors">Help</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
