import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, Edit2, Trash2, MapPin, DollarSign, Loader2, Sparkles, 
  CloudSun, Map as MapIcon, Calendar, Compass, PieChart, Info, CheckCircle2
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { 
  useTrip, useUpdateTrip, useDeleteTrip, useGenerateItinerary 
} from '../features/trips/services/trip-service';
import { TripForm } from '../features/trips/components/TripForm';
import { apiRequest } from '../lib/api-client';

// Fix Leaflet marker icon asset path issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface WeatherForecastItem {
  date: string;
  temp_max: number;
  temp_min: number;
  precip_probability: number;
  rain_sum: number;
}

interface WeatherResponse {
  success: boolean;
  data: {
    latitude: number;
    longitude: number;
    forecast: WeatherForecastItem[];
  };
}

export default function TripDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'weather'>('itinerary');
  const [activeDay, setActiveDay] = useState<number>(1);
  const [loadingStep, setLoadingStep] = useState<string>('Analyzing your details...');

  const { data: trip, isLoading, isError } = useTrip(id);
  const { mutate: updateTrip, isPending: isUpdating } = useUpdateTrip(id || '');
  const { mutate: deleteTrip, isPending: isDeleting } = useDeleteTrip();
  const { mutate: generateItinerary, isPending: isGenerating } = useGenerateItinerary(id || '');

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  // Fetch weather forecast from backend
  const { data: weather, isLoading: isWeatherLoading } = useQuery({
    queryKey: ['weather', trip?.latitude, trip?.longitude],
    queryFn: async () => {
      if (!trip || trip.latitude === null || trip.longitude === null) return null;
      const res = await apiRequest<WeatherResponse>(`/weather/?lat=${trip.latitude}&lon=${trip.longitude}`);
      return res.data.forecast;
    },
    enabled: !!trip && trip.latitude !== null && trip.longitude !== null,
  });

  // Cycle loading steps during AI generation
  useEffect(() => {
    if (!isGenerating) return;
    const steps = [
      'Locating destination city on open maps...',
      'Analyzing weather patterns for your dates...',
      'Synthesizing personalized itinerary using Gemini AI...',
      'Calculating local travel costs and budget breakdown...',
      'Formulating ultimate local travel tips...'
    ];
    let index = 0;
    setLoadingStep(steps[0]);
    const interval = setInterval(() => {
      index = (index + 1) % steps.length;
      setLoadingStep(steps[index]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isGenerating]);

  // Leaflet map initialization
  useEffect(() => {
    if (!trip || trip.latitude === null || trip.longitude === null) return;
    if (!mapContainer.current) return;

    // Remove old map instance if it exists
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const lat = trip.latitude;
    const lon = trip.longitude;

    const map = L.map(mapContainer.current).setView([lat, lon], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Main destination marker
    L.marker([lat, lon])
      .addTo(map)
      .bindPopup(`<b>${trip.destination}</b><br/>Destination City`)
      .openPopup();

    mapInstance.current = map;

    // Small delay to ensure container sizing is stable
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [trip, activeTab]);

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

  const handleGenerate = () => {
    generateItinerary();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <span className="text-sm text-slate-400">Loading trip details...</span>
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

  // Render Premium Generation Screen
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6 text-center animate-fadeIn max-w-lg mx-auto">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin flex items-center justify-center" />
          <Sparkles className="w-10 h-10 text-purple-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-100">Creating Travel Magic</h3>
          <p className="text-sm text-slate-400">{loadingStep}</p>
        </div>
        <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col items-start space-y-3 text-left">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Plan parameters:</span>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-300">
            <div><span className="text-slate-500 font-medium">Destination:</span> {trip.destination}</div>
            <div><span className="text-slate-500 font-medium">Duration:</span> {durationDays} Days</div>
            <div><span className="text-slate-500 font-medium">Budget:</span> ${trip.budget} USD</div>
            <div><span className="text-slate-500 font-medium">Travel Style:</span> {trip.travelStyle || 'Default'}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Back & Actions Header */}
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
        <div className="space-y-8">
          {/* Main Info Card */}
          <div className="p-8 rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/50 to-slate-950/20 backdrop-blur-md flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {trip.travelStyle && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {trip.travelStyle} Style
                  </span>
                )}
                {trip.interests && trip.interests.map((interest, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-slate-400 border border-slate-800">
                    {interest}
                  </span>
                ))}
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-100">
                {trip.destination}
              </h2>
              {trip.departureLocation && (
                <p className="text-sm text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  Departing from {trip.departureLocation}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-6 md:border-l md:border-slate-800 md:pl-8 text-sm">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Duration</span>
                <p className="text-slate-200 font-bold flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Dates</span>
                <p className="text-slate-200 font-bold">
                  {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Total Budget</span>
                <p className="text-purple-400 font-bold flex items-center text-base">
                  <DollarSign className="w-4 h-4" />
                  {trip.budget.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Conditional Rendering: Placeholder vs Full Generated Data */}
          {!trip.itinerary ? (
            /* Itinerary Generation CTA Placeholder */
            <div className="p-8 rounded-2xl border border-purple-500/10 bg-gradient-to-br from-purple-950/10 to-indigo-950/10 border-dashed flex flex-col items-center justify-center text-center space-y-4 py-20">
              <div className="p-4 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 animate-pulse">
                <Sparkles className="w-10 h-10" />
              </div>
              <div className="space-y-2 max-w-md">
                <h4 className="text-xl font-bold text-slate-200">Unlock Your AI Travel Plan</h4>
                <p className="text-sm text-slate-400">
                  Generate a fully personalized day-by-day itinerary, exact budget breakdowns, and local weather forecasts curated instantly by Gemini AI.
                </p>
              </div>
              <button
                onClick={handleGenerate}
                className="mt-2 inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg hover:shadow-purple-500/20 transition-all active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                Generate AI Itinerary
              </button>
            </div>
          ) : (
            /* Full Plan Grid */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Plan Tabs (2/3 width) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Tabs Switcher */}
                <div className="flex gap-2 p-1.5 bg-slate-900/60 border border-slate-800 rounded-xl">
                  <button
                    onClick={() => setActiveTab('itinerary')}
                    className={`flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      activeTab === 'itinerary' 
                        ? 'bg-purple-600 text-white' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    Itinerary
                  </button>
                  <button
                    onClick={() => setActiveTab('budget')}
                    className={`flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      activeTab === 'budget' 
                        ? 'bg-purple-600 text-white' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <PieChart className="w-4 h-4" />
                    Budget breakdown
                  </button>
                  <button
                    onClick={() => setActiveTab('weather')}
                    className={`flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      activeTab === 'weather' 
                        ? 'bg-purple-600 text-white' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CloudSun className="w-4 h-4" />
                    Weather Forecast
                  </button>
                </div>

                {/* Tab Content: Itinerary */}
                {activeTab === 'itinerary' && (
                  <div className="space-y-6">
                    {/* Day Selection Bar */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                      {trip.itinerary.map((dayPlan) => (
                        <button
                          key={dayPlan.day}
                          onClick={() => setActiveDay(dayPlan.day)}
                          className={`flex-shrink-0 px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                            activeDay === dayPlan.day
                              ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                              : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-300'
                          }`}
                        >
                          Day {dayPlan.day}
                        </button>
                      ))}
                    </div>

                    {/* Selected Day Plan */}
                    {trip.itinerary
                      .filter((dayPlan) => dayPlan.day === activeDay)
                      .map((dayPlan) => (
                        <div key={dayPlan.day} className="space-y-6">
                          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/20">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Day {dayPlan.day} Focus</span>
                            <h3 className="text-lg font-bold text-slate-200">{dayPlan.title}</h3>
                          </div>

                          {/* Timeline of Activities */}
                          <div className="relative border-l-2 border-slate-800 ml-4 pl-8 space-y-8">
                            {dayPlan.activities.map((act, index) => (
                              <div key={index} className="relative group">
                                {/* Dot on timeline */}
                                <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full border-2 border-purple-500 bg-slate-950 flex items-center justify-center text-[10px] text-purple-400 font-bold group-hover:scale-110 transition-transform">
                                  {index + 1}
                                </div>
                                <div className="p-5 rounded-2xl border border-slate-800/60 bg-slate-900/30 hover:border-slate-850 hover:bg-slate-900/40 transition-all space-y-3">
                                  <div className="flex items-center justify-between flex-wrap gap-2">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                                      {act.time}
                                    </div>
                                    {act.cost > 0 ? (
                                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        ${act.cost} USD
                                      </span>
                                    ) : (
                                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-500">
                                        Free
                                      </span>
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    <h4 className="text-base font-bold text-slate-100">{act.activity}</h4>
                                    <p className="text-sm text-slate-400 leading-relaxed">{act.description}</p>
                                  </div>
                                  <div className="text-xs text-slate-500 flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                                    {act.location}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Tab Content: Budget Breakdown */}
                {activeTab === 'budget' && trip.budgetBreakdown && (
                  <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-200">Budget Allocation Breakdown</h3>
                      <p className="text-sm text-slate-400">AI estimated expenses matching your travel style preferences.</p>
                    </div>

                    <div className="space-y-5">
                      {[
                        { label: 'Accommodation', value: trip.budgetBreakdown.accommodation, color: 'bg-indigo-500' },
                        { label: 'Transportation', value: trip.budgetBreakdown.transportation, color: 'bg-emerald-500' },
                        { label: 'Food & Meals', value: trip.budgetBreakdown.food, color: 'bg-amber-500' },
                        { label: 'Activities & Tours', value: trip.budgetBreakdown.activities, color: 'bg-purple-500' },
                        { label: 'Miscellaneous', value: trip.budgetBreakdown.miscellaneous, color: 'bg-pink-500' },
                      ].map((item, idx) => {
                        const total = (trip.budgetBreakdown?.total_estimated || trip.budgetBreakdown?.totalEstimated || trip.budget);
                        const percentage = Math.round((item.value / total) * 100) || 0;
                        return (
                          <div key={idx} className="space-y-2">
                            <div className="flex justify-between text-sm font-semibold">
                              <span className="text-slate-300">{item.label}</span>
                              <span className="text-slate-400">
                                ${item.value.toLocaleString()} USD ({percentage}%)
                              </span>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-900">
                              <div className={`h-full ${item.color}`} style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
                      <div className="p-4 rounded-xl bg-slate-950/40 text-center">
                        <span className="text-xs text-slate-500 block">Total Budget Set</span>
                        <span className="text-lg font-extrabold text-slate-200">${trip.budget.toLocaleString()} USD</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-950/40 text-center">
                        <span className="text-xs text-slate-500 block">Estimated Expenses</span>
                        <span className="text-lg font-extrabold text-purple-400">
                          ${(trip.budgetBreakdown.total_estimated || trip.budgetBreakdown.totalEstimated || 0).toLocaleString()} USD
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Content: Weather Forecast */}
                {activeTab === 'weather' && (
                  <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-200">Local Weather Forecast</h3>
                      <p className="text-sm text-slate-400">Real-time daily forecasts provided by Open-Meteo API.</p>
                    </div>

                    {isWeatherLoading ? (
                      <div className="flex flex-col items-center py-10 gap-2">
                        <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                        <span className="text-xs text-slate-500">Fetching forecast details...</span>
                      </div>
                    ) : !weather || weather.length === 0 ? (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-center text-amber-400 text-xs">
                        Weather forecast data currently unavailable.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {weather.slice(0, 4).map((day, idx) => {
                          const dateObj = new Date(day.date);
                          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                          const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          return (
                            <div key={idx} className="p-4 rounded-xl bg-slate-950/50 border border-slate-900 text-center space-y-2">
                              <span className="text-xs font-bold text-slate-400 block uppercase">{dayName}</span>
                              <span className="text-[10px] text-slate-500 block">{dateStr}</span>
                              <CloudSun className="w-8 h-8 text-indigo-400 mx-auto" />
                              <div className="text-sm font-extrabold text-slate-200">
                                {Math.round(day.temp_max)}°C <span className="text-slate-500 text-xs font-normal">/ {Math.round(day.temp_min)}°C</span>
                              </div>
                              {day.precip_probability > 0 && (
                                <span className="inline-block text-[10px] font-semibold text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded">
                                  {day.precip_probability}% Rain
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Sidebar Map & Info (1/3 width) */}
              <div className="space-y-6">
                {/* Geocoding Map Card */}
                {trip.latitude !== null && trip.longitude !== null && (
                  <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/20 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-slate-300">
                        <MapIcon className="w-5 h-5 text-purple-400" />
                        <h4 className="font-bold text-slate-200">Interactive Map</h4>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        Leaflet
                      </span>
                    </div>

                    <div className="relative w-full h-[280px] rounded-xl overflow-hidden border border-slate-800 shadow-inner z-10">
                      <div ref={mapContainer} className="w-full h-full" />
                    </div>
                    
                    <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
                      <Info className="w-3.5 h-3.5 text-purple-400" />
                      Map coordinates: {trip.latitude.toFixed(4)}, {trip.longitude.toFixed(4)}
                    </div>
                  </div>
                )}

                {/* AI Concierge Travel Tips */}
                {trip.itinerary && (
                  <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/20 space-y-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                      <h4 className="font-bold text-slate-200">AI Concierge Tips</h4>
                    </div>
                    
                    <div className="space-y-3.5">
                      {/* Read travel tips directly from the generated plan */}
                      {trip.itinerary.length > 0 && (
                        <ul className="space-y-3">
                          {/* Fallback to custom tips if Gemini returns empty tips array */}
                          {(trip.itinerary as any).travel_tips || (trip as any).travelTips || [
                            `Pack weather-appropriate clothing for ${trip.destination}.`,
                            "Respect local cultural guidelines and clothing rules.",
                            "Make sure to plan transitions between travel locations ahead of time."
                          ].slice(0, 3).map((tip: string, idx: number) => (
                            <li key={idx} className="text-xs text-slate-400 leading-relaxed flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
