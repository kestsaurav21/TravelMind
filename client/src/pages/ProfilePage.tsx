import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ProfileForm } from '../features/profile/components/ProfileForm';

export default function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Back Button */}
      <div>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent">
          User Settings
        </h2>
        <p className="text-slate-400 text-sm">
          Manage your personal details, email address, and authentication password.
        </p>
      </div>

      <div className="flex">
        <ProfileForm />
      </div>
    </div>
  );
}
