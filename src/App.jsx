import { useEffect, useMemo, useState } from 'react';
import Hero from './components/Hero';
import GoalPlanner from './components/GoalPlanner';
import HabitSystem from './components/HabitSystem';
import ProgressBoard from './components/ProgressBoard';

const STORAGE_KEY = 'impossible-goals-tracker:v1';

export default function App() {
  const [goals, setGoals] = useState([]);
  const [habits, setHabits] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setGoals(data.goals || []);
        setHabits(data.habits || []);
        setRoutines(data.routines || []);
        setSelectedGoalId(data.selectedGoalId || null);
      }
    } catch (e) {
      console.error('Failed to load state', e);
    }
  }, []);

  useEffect(() => {
    const toSave = { goals, habits, routines, selectedGoalId };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error('Failed to save state', e);
    }
  }, [goals, habits, routines, selectedGoalId]);

  const selectedGoal = useMemo(() => goals.find(g => g.id === selectedGoalId) || null, [goals, selectedGoalId]);

  const addGoal = (goal) => {
    const newGoal = { ...goal, id: crypto.randomUUID(), completed: false, createdAt: new Date().toISOString() };
    setGoals(prev => [newGoal, ...prev]);
    setSelectedGoalId(newGoal.id);
  };

  const updateGoal = (id, patch) => {
    setGoals(prev => prev.map(g => (g.id === id ? { ...g, ...patch } : g)));
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    setHabits(prev => prev.filter(h => h.goalId !== id));
    setRoutines(prev => prev.filter(r => r.goalId !== id));
    if (selectedGoalId === id) setSelectedGoalId(null);
  };

  const addHabit = (goalId, habit) => {
    const newHabit = {
      id: crypto.randomUUID(),
      goalId,
      name: habit.name,
      frequencyPerWeek: Math.min(7, Math.max(1, Number(habit.frequencyPerWeek || 3))),
      completions: {}, // dateISO -> true
      createdAt: new Date().toISOString(),
    };
    setHabits(prev => [newHabit, ...prev]);
  };

  const toggleHabitForDate = (habitId, dateISO) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      const next = { ...h, completions: { ...h.completions } };
      if (next.completions[dateISO]) {
        delete next.completions[dateISO];
      } else {
        next.completions[dateISO] = true;
      }
      return next;
    }));
  };

  const deleteHabit = (habitId) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  const addRoutine = (goalId, routine) => {
    const newRoutine = {
      id: crypto.randomUUID(),
      goalId,
      name: routine.name,
      steps: (routine.steps || []).filter(Boolean),
      lastCompletedAt: null,
      createdAt: new Date().toISOString(),
    };
    setRoutines(prev => [newRoutine, ...prev]);
  };

  const completeRoutine = (routineId) => {
    setRoutines(prev => prev.map(r => (r.id === routineId ? { ...r, lastCompletedAt: new Date().toISOString() } : r)));
  };

  const deleteRoutine = (routineId) => {
    setRoutines(prev => prev.filter(r => r.id !== routineId));
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100">
      <Hero onGetStarted={() => {
        const el = document.getElementById('planner');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14 pb-24">
        <section id="planner" className="pt-10">
          <GoalPlanner
            goals={goals}
            selectedGoalId={selectedGoalId}
            onSelectGoal={setSelectedGoalId}
            onAddGoal={addGoal}
            onUpdateGoal={updateGoal}
            onDeleteGoal={deleteGoal}
          />
        </section>

        <section id="systems" className="pt-2">
          <HabitSystem
            selectedGoal={selectedGoal}
            habits={habits.filter(h => !selectedGoal || h.goalId === selectedGoal.id)}
            routines={routines.filter(r => !selectedGoal || r.goalId === selectedGoal.id)}
            onAddHabit={(habit) => selectedGoal && addHabit(selectedGoal.id, habit)}
            onToggleHabitDate={toggleHabitForDate}
            onDeleteHabit={deleteHabit}
            onAddRoutine={(routine) => selectedGoal && addRoutine(selectedGoal.id, routine)}
            onCompleteRoutine={completeRoutine}
            onDeleteRoutine={deleteRoutine}
          />
        </section>

        <section id="progress" className="pt-2">
          <ProgressBoard goals={goals} habits={habits} />
        </section>
      </main>
    </div>
  );
}
