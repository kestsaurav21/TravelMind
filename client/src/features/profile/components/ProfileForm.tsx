import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { updateProfile } from '../services/profile-service';

export function ProfileForm() {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      setError('Name and Email are required');
      return;
    }
    if (password && password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const updatedUser = await updateProfile({
        fullName,
        email,
        ...(password ? { password } : {})
      });
      updateUser(updatedUser);
      setSuccess('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update profile. Email may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl p-8 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Decorative gradient blur background */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <h3 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent mb-6">
        Edit Personal Profile
      </h3>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="fullName">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <UserIcon className="w-5 h-5" />
              </span>
              <input
                type="text"
                id="fullName"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-150"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-150"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/60 my-6 pt-5">
          <h4 className="text-slate-300 font-semibold mb-4 text-sm">
            Change Password <span className="text-xs text-slate-500 font-normal">(Leave blank to keep current)</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-slate-400 text-xs tracking-wider mb-2" htmlFor="password">
                New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  id="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-150"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-xs tracking-wider mb-2" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-150"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
