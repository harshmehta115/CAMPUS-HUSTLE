import { Link } from 'react-router-dom';
import { Clock, Eye, MessageSquare, ArrowUpRight, IndianRupee } from 'lucide-react';
import { getCategoryInfo, getStatusColor } from '../data/mockData';

const HustleCard = ({ hustle, onClick }) => {
  const cat = getCategoryInfo(hustle.category);

  return (
    <div
      className="hustle-card group"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{cat.icon}</span>
          <div>
            <span className="text-xs text-gray-500 font-medium">{cat.label}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge ${getStatusColor(hustle.status)} uppercase text-xs`}>
            {hustle.status === 'open' ? 'Open' : hustle.status}
          </span>
          <ArrowUpRight
            size={15}
            className="text-gray-600 group-hover:text-purple-400 transition-colors shrink-0"
          />
        </div>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-white text-base leading-snug mb-2 line-clamp-2 group-hover:text-purple-100 transition-colors">
        {hustle.title}
      </h3>

      {/* Description */}
      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
        {hustle.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {hustle.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="tag-pill">{tag}</span>
        ))}
      </div>

      {/* Budget & Deadline */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 text-neon-green">
          <IndianRupee size={13} />
          <span className="font-bold text-sm">
            {hustle.budget.min === hustle.budget.max
              ? hustle.budget.min
              : `${hustle.budget.min}–${hustle.budget.max}`}
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <Clock size={12} />
          <span>{hustle.deadline}</span>
        </div>
      </div>

      <div className="divider mb-3" />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, #9333ea, #3b82f6)' }}>
            {hustle.poster.avatar}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-300">{hustle.poster.name}</p>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-xs text-gray-500">{hustle.poster.rating}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-gray-600 text-xs">
          <div className="flex items-center gap-1">
            <MessageSquare size={11} />
            <span>{hustle.offers}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={11} />
            <span>{hustle.views}</span>
          </div>
          <span>{hustle.postedAt}</span>
        </div>
      </div>
    </div>
  );
};

export default HustleCard;
