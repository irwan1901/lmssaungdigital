import React, { useState } from 'react';
import { SaungDigitalLogo } from './SaungDigitalLogo';
import {
  RefreshCw,
  Database,
  User,
  Shield,
  LogOut,
  Sparkles,
  Wrench,
  BookOpen,
  Menu,
  X,
  Layers,
  Award,
} from 'lucide-react';
import { MemberUser, SyncConfig } from '../types';

interface NavbarProps {
  currentView: 'home' | 'catalog' | 'sync' | 'admin' | 'member';
  setCurrentView: (view: 'home' | 'catalog' | 'sync' | 'admin' | 'member') => void;
  memberActiveTab: 'learning' | 'prompts' | 'tools';
  onNavigateMember: (tab: 'learning' | 'prompts' | 'tools') => void;
  currentUser: MemberUser | null;
  onOpenLoginModal: () => void;
  onOpenAdminModal: () => void;
  onLogout: () => void;
  syncConfig: SyncConfig;
  onTriggerSync: () => void;
  isSyncing: boolean;
  customLogoUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  memberActiveTab,
  onNavigateMember,
  currentUser,
  onOpenLoginModal,
  onOpenAdminModal,
  onLogout,
  syncConfig,
  onTriggerSync,
  isSyncing,
  customLogoUrl,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#060c18]/90 border-b border-sky-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            setCurrentView('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <SaungDigitalLogo size="md" customLogoUrl={customLogoUrl} />
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden xl:flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={() => setCurrentView('home')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              currentView === 'home'
                ? 'text-sky-400 bg-sky-950/50 border border-sky-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            Beranda
          </button>

          <button
            onClick={() => setCurrentView('catalog')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              currentView === 'catalog'
                ? 'text-sky-400 bg-sky-950/50 border border-sky-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            Katalog Materi
          </button>

          {/* Halaman Member Menu */}
          <button
            onClick={() => onNavigateMember('learning')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentView === 'member'
                ? 'text-sky-300 bg-blue-950/60 border border-blue-500/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <User className="w-3.5 h-3.5 text-sky-400" />
            <span>Halaman Member</span>
          </button>

          {/* Database Sheets Menu */}
          <button
            onClick={() => setCurrentView('sync')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentView === 'sync'
                ? 'text-sky-400 bg-sky-950/50 border border-sky-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span>Database</span>
          </button>

          {/* Admin Panel (if admin) */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'admin'
                  ? 'text-amber-400 bg-amber-950/60 border border-amber-500/40'
                  : 'text-amber-300/80 hover:text-amber-300 hover:bg-amber-950/20'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}
        </nav>

        {/* Medium Screen Compact Navigation (md to xl) */}
        <nav className="hidden md:flex xl:hidden items-center gap-1">
          <button
            onClick={() => setCurrentView('home')}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              currentView === 'home'
                ? 'text-sky-400 bg-sky-950/50 border border-sky-500/25'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => setCurrentView('catalog')}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              currentView === 'catalog'
                ? 'text-sky-400 bg-sky-950/50 border border-sky-500/25'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Katalog
          </button>
          <button
            onClick={() => onNavigateMember('learning')}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
              currentView === 'member'
                ? 'text-sky-300 bg-blue-950/60 border border-blue-500/40'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5 text-sky-400" />
            <span>Member</span>
          </button>
          <button
            onClick={() => setCurrentView('sync')}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              currentView === 'sync'
                ? 'text-sky-400 bg-sky-950/50 border border-sky-500/25'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Sync
          </button>
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setCurrentView('admin')}
              className="px-2 py-1.5 text-xs font-semibold rounded-lg text-amber-300 hover:bg-amber-950/30 flex items-center gap-1 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Actions & Auth */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Sync Button */}
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            title={
              syncConfig.appsScriptUrl
                ? 'Sinkronisasi real-time dengan Google Sheets'
                : 'Klik untuk sync (konfigurasikan Apps Script di tab Database)'
            }
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
              syncConfig.syncStatus === 'success'
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/50'
                : syncConfig.syncStatus === 'error'
                ? 'bg-rose-950/40 text-rose-300 border-rose-500/30 hover:bg-rose-900/50'
                : 'bg-slate-900/80 text-slate-300 border-slate-700/60 hover:border-sky-500/40 hover:text-sky-200'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-sky-400' : ''}`} />
            <span className="hidden sm:inline">
              {isSyncing
                ? 'Syncing...'
                : syncConfig.appsScriptUrl
                ? 'Sheets Sync'
                : 'Sync Lokal'}
            </span>
          </button>

          {/* User state */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateMember('learning')}
                className="hidden lg:flex flex-col text-right hover:opacity-80 transition-opacity cursor-pointer"
                title="Buka Halaman Member"
              >
                <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-sky-400 capitalize">
                  {currentUser.role === 'admin' ? 'Administrator' : 'Member'}
                </span>
              </button>
              <button
                onClick={onLogout}
                title="Keluar / Logout"
                className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLoginModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm shadow-blue-500/30 transition-all cursor-pointer whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login Member</span>
              </button>
              <button
                onClick={onOpenAdminModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold shadow-sm shadow-amber-400/20 transition-all cursor-pointer whitespace-nowrap"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-sky-900/40 bg-[#060e1d]/95 backdrop-blur-xl px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => {
              setCurrentView('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between ${
              currentView === 'home' ? 'bg-sky-950 text-sky-400' : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <span>Beranda</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('catalog');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between ${
              currentView === 'catalog' ? 'bg-sky-950 text-sky-400' : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <span>Katalog Materi</span>
          </button>

          <button
            onClick={() => {
              onNavigateMember('learning');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 ${
              currentView === 'member'
                ? 'bg-blue-950 text-sky-300'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <User className="w-4 h-4 text-sky-400" />
            <span>Halaman Member (Materi &amp; Progres, Prompt Library, Tools)</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('sync');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 ${
              currentView === 'sync' ? 'bg-sky-950 text-sky-400' : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-4 h-4 text-sky-400" />
            <span>Database Google Sheets</span>
          </button>

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                setCurrentView('admin');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 text-amber-300 ${
                currentView === 'admin' ? 'bg-amber-950/60' : 'hover:bg-amber-950/30'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin Panel</span>
            </button>
          )}

          {!currentUser && (
            <button
              onClick={() => {
                onOpenAdminModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 text-amber-400 hover:bg-amber-950/30"
            >
              <Shield className="w-4 h-4" />
              <span>Login Admin</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
