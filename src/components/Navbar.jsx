import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Zap, Search, Bell, Menu, X, Plus, Home, Compass,
  LayoutDashboard, User, CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch] = useState('');
  const notifRef = useRef(null);
  const location = useLocation();
  const { notifications, markAllRead, user } = useApp();

  const unread = notifications.filter((n) => !n.read).length;

  // Close notification panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/my-hustles', label: 'My Hustles', icon: LayoutDashboard },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNotifToggle = () => {
    setNotifOpen((prev) => !prev);
    if (!notifOpen && unread > 0) {
      setTimeout(markAllRead, 2000); // mark read after 2s viewing
    }
  };

  // Keyboard search submit → navigate to explore
  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      window.location.href = `/explore?q=${encodeURIComponent(search.trim())}`;
      setSearch('');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9333ea, #3b82f6)' }}>
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-lg tracking-tight gradient-text">CAMPUS</span>
              <span className="font-black text-lg tracking-tight text-white ml-1">HUSTLE</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link px-4 py-2 rounded-lg text-sm transition-all ${
                  isActive(to) ? 'active text-white bg-white/5' : ''
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search hustles..."
                className="pl-9 pr-4 py-2 rounded-xl text-sm bg-white/5 border border-white/10 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/60 w-44 transition-all"
              />
            </div>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                id="notif-btn"
                onClick={handleNotifToggle}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/8 transition-all"
              >
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ background: 'linear-gradient(135deg, #9333ea, #3b82f6)' }}>
                    {unread}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50 animate-fade-in">
                  <div className="p-4 border-b border-white/8 flex items-center justify-between">
                    <span className="font-semibold text-sm text-white">Notifications</span>
                    <div className="flex items-center gap-2">
                      {unread > 0 && <span className="badge-purple text-xs">{unread} new</span>}
                      <button onClick={markAllRead} className="text-xs text-gray-500 hover:text-purple-400 transition-colors">
                        Mark all read
                      </button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-600 text-sm">No notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 border-b border-white/[0.04] cursor-pointer transition-colors ${!n.read ? 'bg-purple-500/[0.06]' : ''} hover:bg-white/5`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-sm mt-0.5">
                              {n.type === 'offer' ? '📬' : n.type === 'complete' ? '✅' : n.type === 'review' ? '⭐' : '💬'}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-300 leading-relaxed">{n.message}</p>
                              <p className="text-xs text-gray-600 mt-1">{n.time}</p>
                            </div>
                            {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 text-center border-t border-white/8">
                    <button onClick={markAllRead} className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors">
                      Clear all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Post CTA */}
            <Link to="/post" className="btn-primary text-xs px-4 py-2.5 gap-1.5">
              <Plus size={14} />
              Post a Hustle
            </Link>

            {/* Avatar */}
            <Link to="/profile" className="flex items-center gap-2 group">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-purple-500/40 group-hover:ring-purple-500/70 transition-all"
                style={{ background: 'linear-gradient(135deg, #9333ea, #3b82f6)' }}
              >
                {user.avatar}
              </div>
            </Link>
          </div>

          {/* Mobile: Notif + Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={handleNotifToggle}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-gray-400"
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ background: 'linear-gradient(135deg, #9333ea, #3b82f6)' }}>
                  {unread}
                </span>
              )}
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Notification Panel */}
      {notifOpen && (
        <div className="md:hidden border-t border-white/8 bg-navy-900/98 backdrop-blur-xl max-h-80 overflow-y-auto animate-fade-in">
          {notifications.slice(0, 5).map((n) => (
            <div key={n.id} className={`px-4 py-3 border-b border-white/[0.04] ${!n.read ? 'bg-purple-500/[0.06]' : ''}`}>
              <div className="flex items-start gap-2">
                <span className="text-sm">{n.type === 'offer' ? '📬' : n.type === 'complete' ? '✅' : n.type === 'review' ? '⭐' : '💬'}</span>
                <div>
                  <p className="text-xs text-gray-300 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-gray-600 mt-1">{n.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden mobile-menu border-t border-white/8 bg-navy-900/98 backdrop-blur-xl">
          {/* Search */}
          <div className="px-4 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search hustles..."
                className="input-field pl-9 text-sm"
              />
            </div>
          </div>
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(to)
                    ? 'text-white bg-purple-500/15 border border-purple-500/25'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
          <div className="px-4 pb-4 flex flex-col gap-2">
            <Link to="/post" className="btn-primary justify-center py-3">
              <Plus size={16} />
              Post a Hustle
            </Link>
            <Link to="/profile" className="btn-secondary justify-center py-3">
              <User size={16} />
              My Profile · {user.name}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
