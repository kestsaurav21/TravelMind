import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-purple-500 selection:text-white">
      {/* Background radial gradient for premium look */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.1)_0,transparent_100%)] pointer-events-none" />

      <main className="z-10 max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-semibold tracking-wide">
            ✨ Introducing AI Travel Planner
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent">
            TravelMind
          </h1>
          
          <p className="text-slate-400 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            Your personalized, AI-powered travel assistant. Plan itineraries, manage budgets, view weather forecasts, and discover your next adventure.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setCount((c) => c + 1)}
            className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-medium shadow-lg shadow-purple-600/20 transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Interactions: {count}
          </button>
          
          <a
            href="https://github.com/vitejs/vite"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 text-slate-300 hover:text-white font-medium transition-all duration-150"
          >
            Explore Docs
          </a>
        </div>
      </main>

      <footer className="absolute bottom-6 text-xs text-slate-600 font-mono">
        Vite + React + TS + Tailwind v4
      </footer>
    </div>
  )
}

export default App
