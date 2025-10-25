import { useMemo, useState } from 'react';
import { CheckSquare, ListChecks, Plus, Trash2 } from 'lucide-react';

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

export default function HabitSystem({ selectedGoal, habits, routines, onAddHabit, onToggleHabitDate, onDeleteHabit, onAddRoutine, onCompleteRoutine, onDeleteRoutine }) {
  const [habitForm, setHabitForm] = useState({ name: '', frequencyPerWeek: 4 });
  const [routineForm, setRoutineForm] = useState({ name: '', stepsRaw: '' });

  const weekDates = useMemo(() => getCurrentWeekDates(), []);

  const weeklyStats = useMemo(() => {
    const all = habits;
    const target = all.length * 7;
    const completed = all.reduce((sum, h) => {
      const c = weekDates.reduce((acc, d) => acc + (h.completions[formatISO(d)] ? 1 : 0), 0);
      return sum + c;
    }, 0);
    const pct = target === 0 ? 0 : Math.round((completed / target) * 100);
    return { completed, target, pct };
  }, [habits, weekDates]);

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!selectedGoal) return;
    if (!habitForm.name.trim()) return;
    onAddHabit({ name: habitForm.name, frequencyPerWeek: Number(habitForm.frequencyPerWeek) });
    setHabitForm({ name: '', frequencyPerWeek: 4 });
  };

  const handleAddRoutine = (e) => {
    e.preventDefault();
    if (!selectedGoal) return;
    if (!routineForm.name.trim()) return;
    const steps = routineForm.stepsRaw.split('\n').map(s => s.trim()).filter(Boolean);
    onAddRoutine({ name: routineForm.name, steps });
    setRoutineForm({ name: '', stepsRaw: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3 space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Habits</h2>
              <p className="text-sm text-zinc-400 mt-1">Daily actions that compound toward your goal. Track this week.</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-300">Weekly adherence</p>
              <p className="text-2xl font-semibold text-sky-400">{weeklyStats.pct}%</p>
            </div>
          </div>

          <form onSubmit={handleAddHabit} className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-3">
            <input value={habitForm.name} onChange={(e) => setHabitForm({ ...habitForm, name: e.target.value })} className="sm:col-span-3 w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="e.g., 30m deep work" />
            <div className="sm:col-span-1">
              <input type="number" min={1} max={7} value={habitForm.frequencyPerWeek} onChange={(e) => setHabitForm({ ...habitForm, frequencyPerWeek: e.target.value })} className="w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="/week" />
            </div>
            <button type="submit" className="sm:col-span-1 inline-flex items-center justify-center gap-2 rounded-md bg-sky-500 px-3 py-2 text-white hover:bg-sky-400 transition">
              <Plus className="h-4 w-4" />
              Add
            </button>
          </form>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-zinc-400">
                  <th className="text-left font-medium px-2 py-2">Habit</th>
                  {weekDates.map((d, idx) => (
                    <th key={idx} className="font-medium px-2 py-2 text-center">{d.toLocaleDateString(undefined, { weekday: 'short' })}</th>
                  ))}
                  <th className="px-2 py-2" />
                </tr>
              </thead>
              <tbody>
                {habits.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-zinc-400 text-center py-6">No habits yet. Add one above.</td>
                  </tr>
                ) : (
                  habits.map(h => (
                    <tr key={h.id} className="border-t border-zinc-800">
                      <td className="px-2 py-2 font-medium">{h.name} <span className="text-xs text-zinc-500">({h.frequencyPerWeek}/wk)</span></td>
                      {weekDates.map((d, idx) => {
                        const iso = formatISO(d);
                        const checked = !!h.completions[iso];
                        return (
                          <td key={idx} className="px-2 py-2 text-center">
                            <button onClick={() => onToggleHabitDate(h.id, iso)} className={`inline-flex items-center justify-center rounded-md px-2 py-1.5 ring-1 ${checked ? 'bg-emerald-500/20 ring-emerald-500 text-emerald-300' : 'bg-zinc-950 ring-zinc-800 text-zinc-400 hover:bg-zinc-900'} transition`}>
                              <CheckSquare className={`h-4 w-4 ${checked ? 'text-emerald-300' : ''}`} />
                            </button>
                          </td>
                        );
                      })}
                      <td className="px-2 py-2 text-right">
                        <button onClick={() => onDeleteHabit(h.id)} className="inline-flex items-center gap-1 rounded-md bg-red-600/90 px-2 py-1.5 text-white hover:bg-red-600">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-xl font-semibold flex items-center gap-2"><ListChecks className="h-5 w-5 text-sky-300" /> Routines & systems</h2>
          <p className="text-sm text-zinc-400 mt-1">Define the repeatable process that makes results inevitable.</p>

          <form onSubmit={handleAddRoutine} className="mt-4 space-y-3">
            <input value={routineForm.name} onChange={(e) => setRoutineForm({ ...routineForm, name: e.target.value })} className="w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="e.g., Morning Execution Ritual" />
            <textarea value={routineForm.stepsRaw} onChange={(e) => setRoutineForm({ ...routineForm, stepsRaw: e.target.value })} rows={4} className="w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder={'List steps, one per line.\nExample:\n• Review the plan\n• 90m focus block\n• Quick recap' } />
            <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-sky-500 px-4 py-2 text-white hover:bg-sky-400 transition">
              <Plus className="h-4 w-4" />
              Add routine
            </button>
          </form>

          <div className="mt-5 space-y-3">
            {routines.length === 0 ? (
              <p className="text-zinc-400 text-sm">No routines yet. Create your first system above.</p>
            ) : (
              routines.map(r => (
                <div key={r.id} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{r.name}</p>
                      <ul className="mt-2 list-disc list-inside text-sm text-zinc-300 space-y-1">
                        {r.steps.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                      {r.lastCompletedAt ? (
                        <p className="text-xs text-zinc-400 mt-2">Last completed: {new Date(r.lastCompletedAt).toLocaleString()}</p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => onCompleteRoutine(r.id)} className="rounded-md bg-emerald-600/90 px-3 py-1.5 text-white hover:bg-emerald-600">Mark done</button>
                      <button onClick={() => onDeleteRoutine(r.id)} className="rounded-md bg-red-600/90 px-3 py-1.5 text-white hover:bg-red-600">Delete</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-sky-950/50 to-zinc-900/60 p-5">
          <h3 className="font-semibold">Focus</h3>
          {selectedGoal ? (
            <div className="mt-2 text-sm">
              <p className="text-zinc-300">Current goal</p>
              <p className="font-medium">{selectedGoal.title}</p>
              <p className="text-zinc-400">Metric: {selectedGoal.metric || '—'} • Target: {selectedGoal.targetDate || '—'}</p>
            </div>
          ) : (
            <p className="text-sm text-zinc-400 mt-2">Select a focus goal above to attach habits and routines.</p>
          )}
        </div>
      </div>
    </div>
  );
}
