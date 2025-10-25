import { Award, Flame, TrendingUp } from 'lucide-react';

function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday=0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getCurrentWeekDates() {
  const start = startOfWeek(new Date());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export default function ProgressBoard({ goals, habits }) {
  const weekDates = getCurrentWeekDates();
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.completed).length;
  const activeGoals = totalGoals - completedGoals;

  const totalChecks = habits.reduce((sum, h) => sum + weekDates.reduce((acc, d) => acc + (h.completions[formatISO(d)] ? 1 : 0), 0), 0);
  const totalSlots = habits.length * 7;
  const adherence = totalSlots === 0 ? 0 : Math.round((totalChecks / totalSlots) * 100);

  // Simple streak: max days in a row with at least one habit checked
  const datesBack = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  let streak = 0;
  for (let i = 0; i < datesBack.length; i++) {
    const dayIso = formatISO(datesBack[i]);
    const any = habits.some(h => h.completions[dayIso]);
    if (any) {
      streak += 1;
    } else {
      break;
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5">
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-amber-300" />
            <div>
              <p className="text-sm text-zinc-400">Goals</p>
              <p className="text-lg font-semibold">{completedGoals} completed / {totalGoals} total</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-sky-300" />
            <div>
              <p className="text-sm text-zinc-400">Weekly adherence</p>
              <p className="text-lg font-semibold">{adherence}%</p>
            </div>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-full bg-sky-500" style={{ width: `${adherence}%` }} />
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5">
          <div className="flex items-center gap-3">
            <Flame className="h-8 w-8 text-orange-400" />
            <div>
              <p className="text-sm text-zinc-400">Consistency streak</p>
              <p className="text-lg font-semibold">{streak} day{streak === 1 ? '' : 's'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="font-semibold mb-3">Signal vs. noise</h3>
          <p className="text-sm text-zinc-300">Track what moves the needle. Keep your system simple, consistent, and relentlessly focused on the highest-leverage actions.</p>
        </div>
        <div className="">
          <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-sky-950/40 to-zinc-900/60 p-5">
            <p className="font-medium">Quick tip</p>
            <p className="text-sm text-zinc-300 mt-1">When in doubt, reduce scope and increase frequency. Small wins compound into impossible outcomes.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-zinc-300">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
          <p className="font-medium">Active goals</p>
          <p className="text-2xl font-semibold mt-1">{activeGoals}</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
          <p className="font-medium">Habits tracked this week</p>
          <p className="text-2xl font-semibold mt-1">{totalChecks}</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
          <p className="font-medium">Slots available</p>
          <p className="text-2xl font-semibold mt-1">{totalSlots}</p>
        </div>
      </div>
    </div>
  );
}
