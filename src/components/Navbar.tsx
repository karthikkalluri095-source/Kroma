import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Grid,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  Bell,
  Sun,
  Moon,
  Users,
  Compass,
  CheckCircle,
  PlayCircle,
  Menu,
  X,
  RotateCcw,
  LogIn,
  Building2,
  Film,
  ChevronDown,
  ArrowRight,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserRole } from '../types';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onStartGuidedDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onStartGuidedDemo,
}) => {
  const { user, role, switchRole, demoAccounts, unreadNotificationCount } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);

  const navItems = [
    { id: 'discover', label: 'Discover', icon: Search, color: 'text-cyan-400' },
    { id: 'domains', label: '26 Domains', icon: Grid, color: 'text-indigo-400' },
    { id: 'briefs', label: 'Briefs & Jobs', icon: FileText, color: 'text-purple-400' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-pink-400' },
    { id: 'admin', label: 'Verification', icon: ShieldCheck, color: 'text-emerald-400', badge: role === 'admin' ? 'Admin' : undefined },
    { id: 'qa', label: 'QA Suite', icon: CheckCircle, color: 'text-amber-400' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#08090d]/85 backdrop-blur-xl border-b border-white/[0.08] text-neutral-200 shadow-xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-7">
            <button
              onClick={() => onNavigate('discover')}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 p-[1.5px] shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all">
                <div className="w-full h-full bg-[#0a0a10] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-fuchsia-200 bg-clip-text text-transparent">
                  Kroma
                </span>
                <span className="text-[9px] font-mono tracking-widest text-cyan-400 block -mt-1 font-bold uppercase">
                  Creative Market
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-white/[0.08] text-white border border-white/15 shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? item.color : 'text-neutral-500 group-hover:text-neutral-300'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-indigo-500/25 text-indigo-300 font-mono font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* Dual Login Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLoginMenuOpen(!loginMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  currentTab === 'login-brand' || currentTab === 'login-creator'
                    ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-indigo-200 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-neutral-200 border-white/[0.08] hover:border-white/20'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Portals</span>
                <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${loginMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {loginMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0e1017] border border-white/10 shadow-2xl shadow-black/80 p-2.5 z-50 text-xs space-y-1.5 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-white/[0.06] flex items-center justify-between">
                    <p className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 font-bold">
                      Access Portals
                    </p>
                    <span className="text-[9px] font-mono text-cyan-400">Select Portal</span>
                  </div>

                  <button
                    onClick={() => {
                      onNavigate('login-brand');
                      setLoginMenuOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all group ${
                      currentTab === 'login-brand'
                        ? 'bg-indigo-600/25 text-indigo-200 border border-indigo-500/40'
                        : 'hover:bg-white/[0.05] text-neutral-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 p-0.5 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                      <div className="w-full h-full bg-[#0a0c14] rounded-[10px] flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-cyan-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-white text-xs group-hover:text-cyan-300 transition-colors">Brand & Agency Login</p>
                        <ArrowRight className="w-3 h-3 text-neutral-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                        Search creators for marketing, post briefs & hire
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('login-creator');
                      setLoginMenuOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all group ${
                      currentTab === 'login-creator'
                        ? 'bg-purple-600/25 text-purple-200 border border-purple-500/40'
                        : 'hover:bg-white/[0.05] text-neutral-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
                      <div className="w-full h-full bg-[#0e0a16] rounded-[10px] flex items-center justify-center">
                        <Film className="w-4 h-4 text-purple-300" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-white text-xs group-hover:text-purple-300 transition-colors">Creator Studio Login</p>
                        <ArrowRight className="w-3 h-3 text-neutral-500 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                        Upload portfolio & reels for manager observation & hire
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Guided Demo Button */}
            <button
              onClick={onStartGuidedDemo}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-fuchsia-500 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all hover:scale-105"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Guided Demo</span>
            </button>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-neutral-200 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full ${role === 'brand' ? 'bg-cyan-400 shadow-sm shadow-cyan-400/50' : role === 'creator' ? 'bg-purple-400 shadow-sm shadow-purple-400/50' : 'bg-emerald-400'}`} />
                <span className="capitalize text-neutral-400 font-normal">{role}:</span>
                <span className="font-bold text-white max-w-[100px] truncate">
                  {user?.displayName || 'Select'}
                </span>
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0e1017] border border-white/10 shadow-2xl p-2 z-50 text-xs backdrop-blur-2xl">
                  <p className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-neutral-400 font-bold">
                    Switch Active Persona
                  </p>
                  <div className="space-y-1">
                    {demoAccounts.map(acc => (
                      <button
                        key={acc.role}
                        onClick={() => {
                          switchRole(acc.role);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                          role === acc.role
                            ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/40'
                            : 'hover:bg-white/[0.05] text-neutral-300'
                        }`}
                      >
                        <div>
                          <p className="font-bold capitalize text-white">{acc.role}</p>
                          <p className="text-[11px] text-neutral-400">{acc.displayName}</p>
                        </div>
                        {role === acc.role && <CheckCircle className="w-4 h-4 text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Button */}
            <button
              onClick={() => onNavigate('dashboard')}
              title="Notifications"
              className="relative p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 ring-2 ring-[#08090d]" />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.06]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/[0.08] py-3 space-y-1.5 animate-in slide-in-from-top-2 duration-150">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/30' : 'text-neutral-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Sign in quick actions in mobile drawer */}
            <div className="pt-2 pb-1 border-t border-white/[0.08] grid grid-cols-2 gap-2 px-1">
              <button
                onClick={() => {
                  onNavigate('login-brand');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs font-bold"
              >
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>Brand Login</span>
              </button>
              <button
                onClick={() => {
                  onNavigate('login-creator');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-bold"
              >
                <Film className="w-4 h-4 text-purple-400" />
                <span>Creator Studio</span>
              </button>
            </div>

            <button
              onClick={() => {
                onStartGuidedDemo();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 shadow-md shadow-indigo-500/20"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Launch Guided Demo</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
