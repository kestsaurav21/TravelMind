import { Link } from 'react-router-dom';
import { Plus, Compass, DollarSign, Calendar, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../app/providers/AuthProvider';
import { useTrips } from '../features/trips/services/trip-service';
import { TripCard } from '../features/trips/components/TripCard';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: trips, isLoading, isError } = useTrips();

  // Calculate statistics
  const totalTrips = trips?.length || 0;
  const totalBudget = trips?.reduce((sum, trip) => sum + trip.budget, 0) || 0;

  const nextTrip = trips
    ?.filter(trip => new Date(trip.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="p-8 rounded-2xl border border-purple-500/10 bg-gradient-to-r from-purple-900/10 to-indigo-900/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-semibold tracking-wider text-purple-400 uppercase">
            {getGreeting()}
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            Welcome back, {user?.fullName || 'Traveler'}!
          </h2>
          <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
            Ready for your next adventure? Manage your itineraries, map out budgets, or start generating new travel plans using AI.
          </p>
        </div>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Trips */}
        <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Total Trips</span>
            <span className="text-2xl font-bold text-slate-100">{totalTrips}</span>
          </div>
        </div>

        {/* Total Budget */}
        <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Total Budget</span>
            <span className="text-2xl font-bold text-slate-100">
              ${totalBudget.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        {/* Next Adventure */}
        <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Next Trip</span>
            <span className="text-sm font-semibold text-slate-200 block truncate">
              {nextTrip ? nextTrip.destination : 'None scheduled'}
            </span>
          </div>
        </div>
      </div>

      {/* Trips Section Header */}
      <div className="flex items-center justify-between border-t border-slate-800/60 pt-6">
        <h3 className="text-xl font-bold tracking-tight text-slate-200">
          Your Scheduled Trips
        </h3>
        {totalTrips > 0 && (
          <Link
            to="/trips/create"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white shadow-md shadow-purple-600/10 transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4" />
            Plan a Trip
          </Link>
        )}
      </div>

      {/* Trips Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
          <span className="text-sm text-slate-500">Loading your travel dashboard...</span>
        </div>
      ) : isError ? (
        <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-center">
          Failed to load trips. Please try refreshing the page.
        </div>
      ) : totalTrips === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 text-center max-w-xl mx-auto space-y-6">
          <div className="p-4 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
            <Compass className="w-12 h-12 stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-slate-200">No trips planned yet</h4>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Your next adventure is waiting. Input your travel preferences and let our system organize the perfect itinerary.
            </p>
          </div>
          <Link
            to="/trips/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:from-purple-700 active:to-indigo-700 text-white font-semibold shadow-lg shadow-purple-900/25 transition-all duration-150 transform hover:-translate-y-0.5"
          >
            Create Your First Trip
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Grid list */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips?.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
