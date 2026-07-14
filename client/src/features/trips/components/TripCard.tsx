import { Link } from 'react-router-dom';
import { Calendar, DollarSign, MapPin, Tag } from 'lucide-react';
import type { Trip } from '../services/trip-service';

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const durationDays = Math.ceil(
    (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  return (
    <Link
      to={`/trips/${trip.id}`}
      className="group block rounded-2xl border border-slate-800/80 bg-slate-900/30 hover:border-purple-500/50 hover:bg-slate-900/50 transition-all duration-350 overflow-hidden shadow-lg hover:shadow-purple-900/10 hover:scale-[1.02] transform"
    >
      <div className="p-6 space-y-4">
        {/* Destination Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-slate-100 group-hover:text-purple-300 transition-colors line-clamp-1">
              {trip.destination}
            </h4>
            {trip.departureLocation && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span>from {trip.departureLocation}</span>
              </div>
            )}
          </div>
          {trip.travelStyle && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {trip.travelStyle}
            </span>
          )}
        </div>

        {/* Date and Duration */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <span>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </span>
          <span className="text-xs text-slate-600 font-mono">
            ({durationDays} {durationDays === 1 ? 'day' : 'days'})
          </span>
        </div>

        {/* Budget */}
        <div className="flex items-center gap-1 text-slate-200">
          <DollarSign className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span className="font-semibold text-base">
            {trip.budget.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          <span className="text-xs text-slate-500 ml-1">budget</span>
        </div>

        {/* Interests */}
        {trip.interests && trip.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/40">
            {trip.interests.slice(0, 3).map((interest, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-950/60 text-slate-400 border border-slate-800"
              >
                <Tag className="w-2.5 h-2.5 text-slate-500" />
                {interest}
              </span>
            ))}
            {trip.interests.length > 3 && (
              <span className="text-[10px] text-slate-500 font-semibold self-center ml-1">
                +{trip.interests.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
