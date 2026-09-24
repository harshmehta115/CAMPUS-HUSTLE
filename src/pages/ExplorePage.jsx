import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, TrendingUp, Clock, IndianRupee, Grid3X3, List, Plus } from 'lucide-react';
import { categories, getCategoryInfo } from '../data/mockData';
import { useApp } from '../context/AppContext';
import HustleCard from '../components/HustleCard';
import { Link } from 'react-router-dom';

const ExplorePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { hustles } = useApp();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('trending');
  const [showFilters, setShowFilters] = useState(false);
  const [budgetMax, setBudgetMax] = useState(2000);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedStatus, setSelectedStatus] = useState('open');

  // Sync URL params when they change (e.g. click category from home)
  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('q');
    if (cat) setSelectedCat(cat);
    if (q) setSearch(q);
  }, [searchParams]);

  const sortOptions = [
    { id: 'trending', label: '🔥 Trending' },
    { id: 'newest', label: '🕐 Newest' },
    { id: 'budget_low', label: '💰 Budget: Low' },
    { id: 'budget_high', label: '💎 Budget: High' },
    { id: 'offers', label: '📬 Most Offers' },
  ];

  const filteredHustles = hustles
    .filter((h) => {
      const matchSearch = !search ||
        h.title.toLowerCase().includes(search.toLowerCase()) ||
        h.description.toLowerCase().includes(search.toLowerCase()) ||
        h.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat = selectedCat === 'all' || h.category === selectedCat;
      const matchBudget = h.budget.min <= budgetMax;
      const matchStatus = selectedStatus === 'all' || h.status === selectedStatus;
      return matchSearch && matchCat && matchBudget && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'budget_low') return a.budget.min - b.budget.min;
      if (sortBy === 'budget_high') return b.budget.max - a.budget.max;
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'offers') return b.offers - a.offers;
      return b.views - a.views;
    });

  const clearFilters = () => {
    setSearch('');
    setSelectedCat('all');
    setBudgetMax(2000);
    setSortBy('trending');
    setSelectedStatus('open');
  };

  const activeFilterCount = [
    search !== '',
    selectedCat !== 'all',
    budgetMax < 2000,
    sortBy !== 'trending',
    selectedStatus !== 'open',
  ].filter(Boolean).length;

  return (
    <div className="page-enter min-h-screen pt-20">
      {/* ── Header ── */}
      <div className="relative py-10 overflow-hidden border-b border-white/8">
        <div className="blob blob-purple w-64 h-64 top-0 left-0 opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl font-black text-white mb-1">Explore Hustles</h1>
              <p className="text-gray-500 text-sm">
                <span className="text-purple-400 font-semibold">{filteredHustles.length}</span> hustles found
                {search && <span className="ml-1">for "<span className="text-white">{search}</span>"</span>}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-1 max-w-xl">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search hustles, skills, tags..."
                  className="input-field pl-10"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X size={14} className="text-gray-500 hover:text-white" />
                  </button>
                )}
              </div>

              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all shrink-0 ${
                  showFilters || activeFilterCount > 0
                    ? 'text-white border border-purple-500/50 bg-purple-500/15'
                    : 'btn-secondary'
                }`}
              >
                <SlidersHorizontal size={15} />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#9333ea,#3b82f6)' }}>
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <Link to="/post" className="btn-primary shrink-0 py-3 px-4 text-sm gap-1.5">
                <Plus size={15} />
                <span className="hidden sm:inline">Post</span>
              </Link>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => setSelectedCat('all')}
              className={`tab-btn shrink-0 ${selectedCat === 'all' ? 'active' : ''}`}
            >
              🌐 All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id === selectedCat ? 'all' : cat.id)}
                className={`tab-btn shrink-0 flex items-center gap-1.5 ${selectedCat === cat.id ? 'active' : ''}`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filters panel ── */}
      {showFilters && (
        <div className="border-b border-white/8 bg-white/[0.02] animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sort */}
              <div>
                <label className="text-xs font-semibold text-gray-400 mb-2 block">Sort by</label>
                <div className="flex flex-wrap gap-1.5">
                  {sortOptions.map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setSortBy(id)}
                      className={`tab-btn text-xs py-1.5 px-3 ${sortBy === id ? 'active' : ''}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-xs font-semibold text-gray-400 mb-2 block">Status</label>
                <div className="flex flex-wrap gap-1.5">
                  {['open', 'active', 'all'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedStatus(s)}
                      className={`tab-btn text-xs py-1.5 px-3 capitalize ${selectedStatus === s ? 'active' : ''}`}
                    >
                      {s === 'all' ? '🌐 All' : s === 'open' ? '🟢 Open' : '🔵 Active'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="text-xs font-semibold text-gray-400 mb-2 block">
                  Max Budget: <span className="text-purple-400 font-bold">₹{budgetMax}</span>
                </label>
                <input
                  type="range"
                  min={100}
                  max={2000}
                  step={50}
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>₹100</span>
                  <span>₹2000+</span>
                </div>
              </div>

              {/* Reset */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-400 transition-colors border border-white/10 px-4 py-2 rounded-xl hover:border-purple-500/30"
                >
                  <X size={12} />
                  Reset all filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Results ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500">
              <span className="text-white font-semibold">{filteredHustles.length}</span> results
              {selectedCat !== 'all' && (
                <span className="ml-2 text-purple-400 font-medium">
                  {getCategoryInfo(selectedCat).icon} {getCategoryInfo(selectedCat).label}
                </span>
              )}
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                <X size={11} /> Clear
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'text-white bg-white/10' : 'text-gray-600 hover:text-gray-400'}`}
              title="Grid view"
            >
              <Grid3X3 size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'text-white bg-white/10' : 'text-gray-600 hover:text-gray-400'}`}
              title="List view"
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {filteredHustles.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-xl font-bold text-white mb-2">No hustles found</h3>
            <p className="text-gray-500 text-sm mb-6">
              {search ? `No results for "${search}"` : 'Try different filters or categories'}
            </p>
            <div className="flex items-center gap-3 justify-center">
              <button onClick={clearFilters} className="btn-primary">Clear all filters</button>
              <Link to="/post" className="btn-secondary">Post a New Hustle</Link>
            </div>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-5'
              : 'flex flex-col gap-4'
          }>
            {filteredHustles.map((hustle) => (
              <HustleCard
                key={hustle.id}
                hustle={hustle}
                onClick={() => navigate(`/hustle/${hustle.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
