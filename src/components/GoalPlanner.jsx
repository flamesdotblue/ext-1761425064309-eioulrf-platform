import { useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Plus, Trash2 } from 'lucide-react';

export default function GoalPlanner({ goals, selectedGoalId, onSelectGoal, onAddGoal, onUpdateGoal, onDeleteGoal }) {
  const [form, setForm] = useState({ title: '', metric: '', targetDate: '', why: '' });

  const sorted = useMemo(() => {
    return [...goals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [goals]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onAddGoal(form);
    setForm({ title: '', metric: '', targetDate: '', why: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3 space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-xl font-semibold">Create an impossible goal</h2>
          <p className="text-zinc-400 text-sm mt-1">Aim higher than seems reasonable. Systems will bridge the gap.</p>

          <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm text-zinc-300">Goal</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="e.g., Launch a world-class app" />
            </div>
            <div>
              <label className="text-sm text-zinc-300">Success metric</label>
              <input value={form.metric} onChange={(e) => setForm({ ...form, metric: e.target.value })} className="mt-1 w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="e.g., 10,000 users" />
            </div>
            <div>
              <label className="text-sm text-zinc-300">Target date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} className="mt-1 w-full rounded-md bg-zinc-950 border border-zinc-800 pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-zinc-300">Why it matters</label>
              <textarea value={form.why} onChange={(e) => setForm({ ...form, why: e.target.value })} rows={3} className="mt-1 w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="The deeper reason that pulls you forward" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-sky-500 px-4 py-2 text-white hover:bg-sky-400 transition">
                <Plus className="h-4 w-4" />
                Add goal
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h3 className="font-semibold mb-3">Your goals</h3>
          {sorted.length === 0 ? (
            <p className="text-zinc-400 text-sm">No goals yet. Create your first impossible goal above.</p>
          ) : (
            <ul className="space-y-3">
              {sorted.map(g => (
                <li key={g.id} className={`flex flex-col sm:flex-row sm:items-center gap-3 justify-between rounded-lg border ${selectedGoalId === g.id ? 'border-sky-600' : 'border-zinc-800'} bg-zinc-950/50 p-4`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <button onClick={() => onUpdateGoal(g.id, { completed: !g.completed })} className={`rounded-full p-1 ${g.completed ? 'text-green-400' : 'text-zinc-400'} hover:bg-zinc-800`} title="Toggle complete">
                        <CheckCircle2 className="h-5 w-5" />
                      </button>
                      <p className="font-medium">{g.title}</p>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">Metric: {g.metric || '—'} • Target: {g.targetDate || '—'}</p>
                    {g.why ? <p className="text-sm text-zinc-300 mt-2">{g.why}</p> : null}
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button onClick={() => onSelectGoal(g.id)} className={`rounded-md px-3 py-1.5 text-sm ring-1 ${selectedGoalId === g.id ? 'bg-sky-600 text-white ring-sky-600' : 'bg-zinc-900 text-zinc-200 ring-zinc-700 hover:bg-zinc-800'}`}>Focus</button>
                    <button onClick={() => onDeleteGoal(g.id)} className="rounded-md px-3 py-1.5 text-sm bg-red-600/90 text-white hover:bg-red-600 inline-flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <aside className="lg:col-span-2 space-y-4">
        <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/60 p-5">
          <h3 className="font-semibold">Principle: Systems over outcomes</h3>
          <p className="text-sm text-zinc-300 mt-2">Your goal sets direction. Your habits, routines, and systems make success inevitable. Build a process you can win daily.</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h4 className="font-semibold">Focus goal</h4>
          {selectedGoalId ? (
            <p className="text-sm text-zinc-300 mt-2">You are focusing on one goal to reduce cognitive load and compound momentum. Add habits and routines below.</p>
          ) : (
            <p className="text-sm text-zinc-400 mt-2">Select a goal to focus your systems on.</p>
          )}
        </div>
      </aside>
    </div>
  );
}
