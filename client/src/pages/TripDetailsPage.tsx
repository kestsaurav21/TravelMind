import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, MapPin, DollarSign, Tag, Loader2, Sparkles, CloudSun, Map } from 'lucide-react';
import { useTrip, useUpdateTrip, useDeleteTrip } from '../features/trips/services/trip-service';
import { TripForm } from '../features/trips/components/TripForm';

export default function TripDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const { data: trip, isLoading, isError } = useTrip(id);
  const { mutate: updateTrip, isPending: isUpdating } = useUpdateTrip(id || '');
  const { mutate: deleteTrip, isPending: isDeleting } = useDeleteTrip();

  const handleUpdate = (formData: any) => {
    updateTrip(formData, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this trip plan? This action cannot be undone.')) {
      deleteTrip(id || '', {
        onSuccess: () => {
          navigate('/');
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <span className="text-sm text-slate-500">Loading trip details...</span>
      </div>
    );
  }

  if (isError || !trip) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-center">
          Trip plan not found or you do not have permission to view it.
        </div>
      </div>
    );
  }

  const durationDays = Math.ceil(
    (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {!isEditing && (
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <Edit2 className="w-4 h-4 text-purple-400" />
              Edit Details
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete Trip
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-100">Edit Trip Details</h2>
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              Cancel Editing
            </button>
          </div>
          <TripForm
            initialData={trip}
            onSubmit={handleUpdate}
            isLoading={isUpdating}
            submitLabel="Save Changes"
          />
        </div>
      ) : (
        /* Details View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-8 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md space-y-6">
              <div className="space-y-2">
                {trip.travelStyle && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 inline-block">
                    {trip.travelStyle} Style
                  </span>
                )}
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-100">
                  {trip.destination}
                </h2>
                {trip.departureLocation && (
                  <p className="text-sm text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    Departing from {trip.departureLocation}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-y border-slate-850 py-6">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Duration</span>
                  <p className="text-slate-200 text-sm font-semibold">
                    {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Dates</span>
                  <p className="text-slate-200 text-sm font-semibold">
                    {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Trip Budget</span>
                  <p className="text-slate-200 text-sm font-semibold flex items-center">
                    <DollarSign className="w-4 h-4 text-purple-400" />
                    {trip.budget.toLocaleString()} USD
                  </p>
                </div>
              </div>

              {trip.interests && trip.interests.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Interests & Focus</h4>
                  <div className="flex flex-wrap gap-2">
                    {trip.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-950/60 text-slate-300 border border-slate-850"
                      >
                        <Tag className="w-3.5 h-3.5 text-purple-400" />
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Itinerary Placeholder Block */}
            <div className="p-8 rounded-2xl border border-purple-500/10 bg-gradient-to-br from-purple-950/10 to-indigo-950/10 border-dashed flex flex-col items-center justify-center text-center space-y-4 py-16">
              <div className="p-4 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-200">AI Itinerary Generator</h4>
                <p className="text-sm text-slate-500 max-w-sm">
                  We'll connect to Gemini in the next step to automatically compile a custom day-by-day plan for your {durationDays}-day vacation.
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-wider bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full font-bold">
                Coming Next (AI Service Integration)
              </span>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Weather Placeholder Card */}
            <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/20 space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <CloudSun className="w-5 h-5 text-indigo-400" />
                <h4 className="font-bold text-slate-200">Destination Weather</h4>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900 text-center py-8">
                <span className="text-xs text-slate-500 block mb-1">Weather Forecast</span>
                <span className="text-xs font-semibold text-slate-400">Available in Step 3 (Open-Meteo Integration)</span>
              </div>
            </div>

            {/* Map Placeholder Card */}
            <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/20 space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <Map className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-slate-200">Interactive Map</h4>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900 text-center py-8">
                <span className="text-xs text-slate-500 block mb-1">Interactive Leaflet Map</span>
                <span className="text-xs font-semibold text-slate-400">Available in Step 4 (Leaflet/Nominatim integration)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
