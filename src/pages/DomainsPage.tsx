import React, { useEffect, useState } from 'react';
import {
  Shirt,
  Sparkles,
  Dumbbell,
  Utensils,
  Plane,
  Gamepad2,
  Cpu,
  Landmark,
  GraduationCap,
  Building2,
  Car,
  Music,
  Baby,
  Palette,
  Ghost,
  Film,
  Leaf,
  HeartPulse,
  Trophy,
  Gem,
  ShoppingBag,
  Heart,
  Wheat,
  PawPrint,
  Languages,
  Castle,
  ArrowRight,
  Search,
  Grid,
  TrendingUp,
  Layers
} from 'lucide-react';
import { Domain, Creator } from '../types';
import { dataService } from '../services/dataService';

const ICON_MAP: Record<string, React.ElementType> = {
  shirt: Shirt,
  sparkles: Sparkles,
  dumbbell: Dumbbell,
  utensils: Utensils,
  plane: Plane,
  'gamepad-2': Gamepad2,
  cpu: Cpu,
  landmark: Landmark,
  'graduation-cap': GraduationCap,
  'building-2': Building2,
  car: Car,
  music: Music,
  baby: Baby,
  palette: Palette,
  ghost: Ghost,
  film: Film,
  leaf: Leaf,
  'heart-pulse': HeartPulse,
  trophy: Trophy,
  gem: Gem,
  'shopping-bag': ShoppingBag,
  heart: Heart,
  wheat: Wheat,
  'paw-print': PawPrint,
  languages: Languages,
  castle: Castle,
};

// Vibrant color accents per domain category
const DOMAIN_COLOR_ACCENTS: Record<string, { iconBg: string; iconColor: string; borderHover: string; glow: string; badge: string }> = {
  'fashion-apparel': { iconBg: 'bg-fuchsia-500/20', iconColor: 'text-fuchsia-400', borderHover: 'hover:border-fuchsia-500/60', glow: 'group-hover:shadow-fuchsia-500/20', badge: 'text-fuchsia-300 bg-fuchsia-950/40 border-fuchsia-500/30' },
  'beauty-skincare': { iconBg: 'bg-pink-500/20', iconColor: 'text-pink-400', borderHover: 'hover:border-pink-500/60', glow: 'group-hover:shadow-pink-500/20', badge: 'text-pink-300 bg-pink-950/40 border-pink-500/30' },
  'automotive-mobility': { iconBg: 'bg-orange-500/20', iconColor: 'text-orange-400', borderHover: 'hover:border-orange-500/60', glow: 'group-hover:shadow-orange-500/20', badge: 'text-orange-300 bg-orange-950/40 border-orange-500/30' },
  'tech-saas': { iconBg: 'bg-cyan-500/20', iconColor: 'text-cyan-400', borderHover: 'hover:border-cyan-500/60', glow: 'group-hover:shadow-cyan-500/20', badge: 'text-cyan-300 bg-cyan-950/40 border-cyan-500/30' },
  'gaming-esports': { iconBg: 'bg-purple-500/20', iconColor: 'text-purple-400', borderHover: 'hover:border-purple-500/60', glow: 'group-hover:shadow-purple-500/20', badge: 'text-purple-300 bg-purple-950/40 border-purple-500/30' },
  'fintech-finance': { iconBg: 'bg-blue-500/20', iconColor: 'text-blue-400', borderHover: 'hover:border-blue-500/60', glow: 'group-hover:shadow-blue-500/20', badge: 'text-blue-300 bg-blue-950/40 border-blue-500/30' },
  'food-beverage': { iconBg: 'bg-amber-500/20', iconColor: 'text-amber-400', borderHover: 'hover:border-amber-500/60', glow: 'group-hover:shadow-amber-500/20', badge: 'text-amber-300 bg-amber-950/40 border-amber-500/30' },
  'travel-hospitality': { iconBg: 'bg-sky-500/20', iconColor: 'text-sky-400', borderHover: 'hover:border-sky-500/60', glow: 'group-hover:shadow-sky-500/20', badge: 'text-sky-300 bg-sky-950/40 border-sky-500/30' },
  'health-wellness': { iconBg: 'bg-emerald-500/20', iconColor: 'text-emerald-400', borderHover: 'hover:border-emerald-500/60', glow: 'group-hover:shadow-emerald-500/20', badge: 'text-emerald-300 bg-emerald-950/40 border-emerald-500/30' },
  'music-entertainment': { iconBg: 'bg-violet-500/20', iconColor: 'text-violet-400', borderHover: 'hover:border-violet-500/60', glow: 'group-hover:shadow-violet-500/20', badge: 'text-violet-300 bg-violet-950/40 border-violet-500/30' },
  'regional-vernacular': { iconBg: 'bg-indigo-500/20', iconColor: 'text-indigo-400', borderHover: 'hover:border-indigo-500/60', glow: 'group-hover:shadow-indigo-500/20', badge: 'text-indigo-300 bg-indigo-950/40 border-indigo-500/30' },
  'luxury-jewelry': { iconBg: 'bg-yellow-500/20', iconColor: 'text-yellow-400', borderHover: 'hover:border-yellow-500/60', glow: 'group-hover:shadow-yellow-500/20', badge: 'text-yellow-300 bg-yellow-950/40 border-yellow-500/30' },
  'sci-fi-cyberpunk': { iconBg: 'bg-teal-500/20', iconColor: 'text-teal-400', borderHover: 'hover:border-teal-500/60', glow: 'group-hover:shadow-teal-500/20', badge: 'text-teal-300 bg-teal-950/40 border-teal-500/30' },
};

const DEFAULT_ACCENT = {
  iconBg: 'bg-indigo-500/20',
  iconColor: 'text-indigo-400',
  borderHover: 'hover:border-indigo-500/60',
  glow: 'group-hover:shadow-indigo-500/20',
  badge: 'text-indigo-300 bg-indigo-950/40 border-indigo-500/30'
};

interface DomainsPageProps {
  onSelectDomain: (domainId: string) => void;
}

export const DomainsPage: React.FC<DomainsPageProps> = ({ onSelectDomain }) => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filterText, setFilterText] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  useEffect(() => {
    Promise.all([dataService.getDomains(), dataService.getCreators()]).then(([dms, crs]) => {
      setDomains(dms);
      setCreators(crs);
    });
  }, []);

  const getCreatorCountForDomain = (domainId: string) => {
    return creators.filter(c => c.domains.includes(domainId)).length;
  };

  const categories = [
    { id: 'all', label: 'All 26 Verticals' },
    { id: 'fashion', label: 'Fashion & Luxury' },
    { id: 'automotive', label: 'Automotive & 3D' },
    { id: 'tech', label: 'Tech & SaaS' },
    { id: 'entertainment', label: 'Film & Music' },
    { id: 'regional', label: 'Regional Vernacular' },
  ];

  const filteredDomains = domains.filter(d => {
    const q = filterText.toLowerCase();
    const matchesSearch = d.label.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.keywords.some(k => k.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (activeCategoryFilter === 'all') return true;
    if (activeCategoryFilter === 'fashion') return ['fashion-apparel', 'beauty-skincare', 'luxury-jewelry', 'lifestyle-home'].includes(d.id);
    if (activeCategoryFilter === 'automotive') return ['automotive-mobility', 'industrial-robotics', 'real-estate-archviz'].includes(d.id);
    if (activeCategoryFilter === 'tech') return ['tech-saas', 'fintech-finance', 'crypto-web3'].includes(d.id);
    if (activeCategoryFilter === 'entertainment') return ['music-entertainment', 'gaming-esports', 'anime-manga', 'sci-fi-cyberpunk'].includes(d.id);
    if (activeCategoryFilter === 'regional') return ['regional-vernacular', 'travel-hospitality', 'food-beverage'].includes(d.id);
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header with Ambient Backlight */}
      <div className="relative text-center max-w-3xl mx-auto mb-10 space-y-4">
        {/* Glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[250px] bg-gradient-to-r from-cyan-500/15 via-indigo-500/20 to-fuchsia-500/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold shadow-lg shadow-indigo-500/10">
          <Grid className="w-3.5 h-3.5 text-cyan-400" />
          <span>SPECIALIZED GENERATIVE VERTICALS</span>
        </div>

        <h1 className="relative z-10 text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
          Browse Across{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">
            26 Industry Domains
          </span>
        </h1>
        <p className="relative z-10 text-sm text-neutral-300 leading-relaxed max-w-2xl mx-auto">
          From high-fashion lookbooks and automotive 3D commercials to regional language campaigns (Telugu, Hindi, Tamil, Spanish, German) with proven prompt receipts.
        </p>

        {/* Live Search inside domains */}
        <div className="relative z-10 max-w-md mx-auto relative pt-2">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            placeholder="Filter domains by keyword (e.g. saree, ev, saas, beauty)..."
            className="w-full bg-[#0d0f18] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 shadow-xl"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-1.5 pt-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCategoryFilter === cat.id
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 border border-white/[0.06]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Domains */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4">
        {filteredDomains.map(domain => {
          const Icon = ICON_MAP[domain.icon] || Film;
          const count = getCreatorCountForDomain(domain.id);
          const accent = DOMAIN_COLOR_ACCENTS[domain.id] || DEFAULT_ACCENT;

          return (
            <div
              key={domain.id}
              onClick={() => onSelectDomain(domain.id)}
              className={`p-5 rounded-2xl bg-[#0d0f18]/90 border border-white/[0.08] ${accent.borderHover} transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-xl shadow-black/25 hover:-translate-y-1 ${accent.glow} backdrop-blur-xl`}
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className={`w-12 h-12 rounded-xl ${accent.iconBg} ${accent.iconColor} border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${accent.badge}`}>
                    {count} creators
                  </span>
                </div>

                <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors font-display">
                  {domain.label}
                </h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed line-clamp-2">
                  {domain.description}
                </p>

                {/* Sample Keywords */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {domain.keywords.slice(0, 3).map(k => (
                    <span
                      key={k}
                      className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] text-neutral-300 border border-white/[0.06]"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-cyan-400 font-bold group-hover:text-cyan-300">
                <span>Explore creators</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
