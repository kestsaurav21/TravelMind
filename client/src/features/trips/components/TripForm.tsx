import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, DollarSign, Compass, X, Plus, AlertCircle, Loader2 } from 'lucide-react';
import type { Trip, TripCreateInput } from '../services/trip-service';

interface TripFormProps {
  initialData?: Trip;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  submitLabel?: string;
}

const TRAVEL_STYLES = ['Leisure', 'Adventure', 'Backpacking', 'Luxury', 'Business', 'Family', 'Romantic'];
const POPULAR_INTERESTS = ['Sightseeing', 'Food & Dining', 'Museums', 'Nature', 'History', 'Shopping', 'Beaches', 'Nightlife', 'Hiking'];

export function TripForm({ initialData, onSubmit, isLoading, submitLabel = 'Save Trip' }: TripFormProps) {
  const [destination, setDestination] = useState('');
  const [departureLocation, setDepartureLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState<number>(1000);
  const [travelStyle, setTravelStyle] = useState('Leisure');
  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setDestination(initialData.destination);
      setDepartureLocation(initialData.departureLocation || '');
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
      setBudget(initialData.budget);
      setTravelStyle(initialData.travelStyle || 'Leisure');
      setInterests(initialData.interests || []);
    }
  }, [initialData]);

  const handleAddInterest = (interest: string) => {
    const trimmed = interest.trim();
    if (trimmed && !interests.some(item => item.toLowerCase() === trimmed.toLowerCase())) {
      setInterests([...interests, trimmed]);
      setInterestInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddInterest(interestInput);
    }
  };

  const handleRemoveInterest = (index: number) => {
    setInterests(interests.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!destination || !startDate || !endDate) {
      setError('Destination, Start Date, and End Date are required.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError('End Date cannot be earlier than Start Date.');
      return;
    }

    if (budget < 0) {
      setError('Budget must be greater than or equal to 0.');
      return;
    }

    setError(null);

    const payload: TripCreateInput = {
      destination,
      departureLocation: departureLocation || undefined,
      startDate,
      endDate,
      budget,
      travelStyle: travelStyle || undefined,
      interests,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-slate-900/30 border border-slate-800/80 p-8 rounded-2xl backdrop-blur-md">
      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Destination */}
        <div className="space-y-2">
          <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider" htmlFor="destination">
            Where to? *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <MapPin className="w-5 h-5" />
            </span>
            <input
              type="text"
              id="destination"
              required
              placeholder="e.g. Paris, Tokyo, Bali"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-150"
            />
          </div>
        </div>

        {/* Departure City */}
        <div className="space-y-2">
          <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider" htmlFor="departureLocation">
            Departure Location
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <MapPin className="w-5 h-5" />
            </span>
            <input
              type="text"
              id="departureLocation"
              placeholder="e.g. New York, London"
              value={departureLocation}
              onChange={(e) => setDepartureLocation(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-150"
            />
          </div>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider" htmlFor="startDate">
            Start Date *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <Calendar className="w-5 h-5" />
            </span>
            <input
              type="date"
              id="startDate"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-150"
            />
          </div>
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider" htmlFor="endDate">
            End Date *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <Calendar className="w-5 h-5" />
            </span>
            <input
              type="date"
              id="endDate"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-150"
            />
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider" htmlFor="budget">
            Budget ($) *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <DollarSign className="w-5 h-5" />
            </span>
            <input
              type="number"
              id="budget"
              required
              min="0"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-150"
            />
          </div>
        </div>

        {/* Travel Style */}
        <div className="space-y-2">
          <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider" htmlFor="travelStyle">
            Travel Style
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <Compass className="w-5 h-5" />
            </span>
            <select
              id="travelStyle"
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-150 appearance-none"
            >
              {TRAVEL_STYLES.map((style) => (
                <option key={style} value={style} className="bg-slate-950 text-slate-200">
                  {style}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Interests Tags Input */}
      <div className="space-y-3 pt-4 border-t border-slate-800/60">
        <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider">
          Travel Interests
        </label>
        
        {/* Render Interests Tags */}
        {interests.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {interests.map((interest, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20"
              >
                {interest}
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(idx)}
                  className="hover:text-purple-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add an interest (e.g. Hiking, Museums, Food) and press Enter"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-grow px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-150"
          />
          <button
            type="button"
            onClick={() => handleAddInterest(interestInput)}
            disabled={isLoading || !interestInput.trim()}
            className="px-4 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Quick popular recommendations */}
        <div className="pt-2">
          <span className="text-xs text-slate-500 block mb-2">Or select from popular recommendations:</span>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_INTERESTS.filter(item => !interests.includes(item)).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleAddInterest(item)}
                disabled={isLoading}
                className="text-[10px] font-semibold bg-slate-900/50 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800/80 px-2.5 py-1 rounded-md transition-colors"
              >
                + {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form Submission */}
      <div className="pt-6 border-t border-slate-800/60 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:from-purple-700 active:to-indigo-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
