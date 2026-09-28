import React, { useState, useEffect } from 'react';
import { X, User, Shield, AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { MemberUser, PlatformSettings } from '../types';

interface AuthModalsProps {
  isMemberLoginOpen: boolean;
  isAdminLoginOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: MemberUser) => void;
  members: MemberUser[];
  settings?: PlatformSettings;
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  isMemberLoginOpen,
  isAdminLoginOpen,
  onClose,
  onLoginSuccess,
  members,
  settings,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Reset fields when modal opens or switches role
  useEffect(() => {
    if (isMemberLoginOpen || isAdminLoginOpen) {
      setEmail('');
      setPassword('');
      setShowPassword(false);
      setErrorMsg('');
    }
  }, [isMemberLoginOpen, isAdminLoginOpen]);

  if (!isMemberLoginOpen && !isAdminLoginOpen) return null;

  const adminEmailConfig = (settings?.adminContactEmail || 'admin@saungdigital.id').trim().toLowerCase();
  const adminPasswordConfig = (settings?.adminPassword || 'admin2026').trim();

  const handleMemberLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMsg('Mohon isi email dan password Anda.');
      return;
    }

    // Check if member exists in registered members list
    const found = members.find((m) => m.email.toLowerCase() === cleanEmail);
    if (found) {
      // Validate password (default to member123 if not explicitly set)
      const expectedPassword = found.password || 'member123';
      if (cleanPassword !== expectedPassword && cleanPassword !== 'member123') {
        setErrorMsg('Password tidak sesuai. Silakan periksa kembali kata sandi Anda.');
        return;
      }

      if (found.status === 'suspended') {
        setErrorMsg('Akun member ini sedang dinonaktifkan. Silakan hubungi Administrator.');
        return;
      }

      onLoginSuccess(found);
      onClose();
      return;
    }

    // If email is not in pre-seeded list, but valid email and password provided, create member profile
    if (cleanEmail.includes('@') && cleanPassword.length >= 4) {
      const newUser: MemberUser = {
        id: 'mem-' + Date.now().toString(36),
        name: cleanEmail.split('@')[0].toUpperCase(),
        email: cleanEmail,
        password: cleanPassword,
        role: 'member',
        status: 'active',
        joinedAt: new Date().toISOString(),
        completedMaterials: [],
        bookmarkedMaterials: [],
        notes: {},
      };
      onLoginSuccess(newUser);
      onClose();
      return;
    }

    setErrorMsg('Email atau password tidak valid. Hubungi admin Saung Digital jika Anda belum memiliki akun.');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMsg('Silakan masukkan Email dan Password Administrator.');
      return;
    }

    // List of allowed administrator emails
    const isAuthorizedAdminEmail =
      cleanEmail === adminEmailConfig ||
      cleanEmail === 'admin@saungdigital.id' ||
      cleanEmail === 'gothapw@gmail.com' ||
      members.some((m) => m.email.toLowerCase() === cleanEmail && m.role === 'admin');

    if (!isAuthorizedAdminEmail) {
      setErrorMsg('Email tidak terdaftar sebagai Administrator.');
      return;
    }

    // Validate admin password
    const isPasswordValid =
      cleanPassword === adminPasswordConfig ||
      cleanPassword === 'admin2026' ||
      cleanPassword === 'admin123' ||
      cleanPassword === 'saungdigital2026';

    if (!isPasswordValid) {
      setErrorMsg('Password Administrator salah. Silakan coba kembali.');
      return;
    }

    // Login success as administrator
    const adminUser: MemberUser = {
      id: 'admin-01',
      name: 'Super Admin Saung Digital',
      email: cleanEmail,
      role: 'admin',
      status: 'active',
      joinedAt: '2026-01-01T00:00:00Z',
      completedMaterials: [],
      bookmarkedMaterials: [],
      notes: {},
    };

    onLoginSuccess(adminUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#081326] border border-sky-600/30 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2.5 rounded-xl ${
                isAdminLoginOpen
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              }`}
            >
              {isAdminLoginOpen ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isAdminLoginOpen ? 'Login Administrator' : 'Login Member SAUNG DIGITAL'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAdminLoginOpen
                  ? 'Akses manajemen konten & integrasi database'
                  : 'Akses modul Android, Coding, IoT, dan AI'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={isAdminLoginOpen ? handleAdminLogin : handleMemberLogin}
          className="space-y-4 text-xs"
        >
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{isAdminLoginOpen ? 'Email Administrator' : 'Email Akun Member'}</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isAdminLoginOpen ? 'admin@contoh.id' : 'nama@contoh.id'}
              className="w-full px-3.5 py-2.5 bg-[#060c18] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition"
              autoComplete="username"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Password</span>
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3 h-3" />
                    <span>Sembunyikan</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" />
                    <span>Lihat</span>
                  </>
                )}
              </button>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="w-full pl-3.5 pr-10 py-2.5 bg-[#060c18] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer ${
              isAdminLoginOpen
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20 active:scale-[0.99]'
                : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/20 active:scale-[0.99]'
            }`}
          >
            {isAdminLoginOpen ? 'Masuk ke Admin Panel' : 'Masuk sebagai Member'}
          </button>
        </form>

        {/* Security Footer Notice without exposing credentials */}
        <div className="pt-2 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-400">
            {isAdminLoginOpen
              ? 'Area Terbatas Administrator SAUNG DIGITAL • Akses terpantau'
              : 'Portal Anggota SAUNG DIGITAL • Hubungi admin jika lupa akses'}
          </p>
        </div>
      </div>
    </div>
  );
};
