import Spline from '@splinetool/react-spline';
import { Rocket, Target } from 'lucide-react';

export default function Hero({ onGetStarted }) {
  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-zinc-950/60 to-zinc-950 pointer-events-none" />

      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/70 px-3 py-1 ring-1 ring-zinc-700/60 backdrop-blur">
              <Target className="h-4 w-4 text-sky-300" />
              <span className="text-xs text-zinc-300">Impossible Goals Tracker</span>
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
              Design your best self with goals, habits, routines, and systems
            </h1>
            <p className="mt-4 text-zinc-300 text-lg">
              Turn audacious dreams into daily process. Set an impossible goal, build systems, and track the compounding momentum.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={onGetStarted} className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-white hover:bg-sky-400 transition">
                <Rocket className="h-4 w-4" />
                Get started
              </button>
              <a href="#progress" className="inline-flex items-center gap-2 rounded-lg bg-zinc-900/70 px-4 py-2 text-zinc-100 ring-1 ring-zinc-700 hover:bg-zinc-900 transition">
                View progress
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
