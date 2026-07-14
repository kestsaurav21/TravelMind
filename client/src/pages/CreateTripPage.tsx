import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCreateTrip } from '../features/trips/services/trip-service';
import { TripForm } from '../features/trips/components/TripForm';

export default function CreateTripPage() {
  const navigate = useNavigate();
  const { mutate: createTrip, isPending } = useCreateTrip();

  const handleSubmit = (data: any) => {
    createTrip(data, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };

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
          Plan a New Trip
        </h2>
        <p className="text-slate-400 text-sm">
          Fill in your destination, date preferences, budget constraints, and interests.
        </p>
      </div>

      <div>
        <TripForm
          onSubmit={handleSubmit}
          isLoading={isPending}
          submitLabel="Create Trip Plan"
        />
      </div>
    </div>
  );
}
