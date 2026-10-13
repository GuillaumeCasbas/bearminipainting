import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAlmostThereUnitsUseCase } from '@/di/container';
import { Unit } from '@/core/entities/Unit';
import { ProgressBar } from '@/ui/components/ProgressBar';
import { useProjectStore } from '@/ui/stores/projectStore';

function getRemainingTodos(unit: Unit) {
  return unit.todos.filter((todo) => todo.status === 'TODO').sort((a, b) => a.order - b.order);
}

function RemainingTodoList({ unit }: { unit: Unit }) {
  const remainingTodos = getRemainingTodos(unit);
  if (remainingTodos.length === 0) return null;
  return (
    <ul>
      {remainingTodos.map((todo) => (
        <li key={todo.id}>{todo.label}</li>
      ))}
    </ul>
  );
}

export function AlmostThereSection() {
  const { projects } = useProjectStore();
  const [almostThereUnits, setAlmostThereUnits] = useState<Unit[]>([]);

  useEffect(() => {
    let cancelled = false;

    const allUnits: Unit[] = projects.flatMap((project) => project.units);
    getAlmostThereUnitsUseCase.execute(allUnits).then((units) => {
      if (!cancelled) {
        setAlmostThereUnits(units);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [projects]);

  return (
    <section
      className="relative bg-green-600 rounded-xl p-6 mt-8 overflow-visible"
      aria-label="Almost there"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="absolute -top-6 -right-4 w-28 h-28 text-white opacity-25 pointer-events-none sm:w-40 sm:h-40"
      >
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16zm0 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm0 2.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" />
      </svg>
      <h2 className="text-xl font-semibold text-white mb-2">Almost there!</h2>
      <p className="italic text-white mb-4">
        <em>
          Almost done! Finishing these miniatures means less resin and plastic waiting in boxes —
          and more room on your shelf for what you love.
        </em>
      </p>
      {almostThereUnits.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Nothing that close yet. Push a miniature to the final stretch!
        </p>
      ) : (
        <ul className="space-y-4">
          {almostThereUnits.map((unit) => (
            <li
              key={unit.id}
              data-testid="almost-there-card"
              // UI-only styling rule: units above 80% completion get highlighted (cosmetic, not business logic)
              className={`rounded-lg shadow p-4 hover:shadow-md transition-shadow ${
                unit.getCompletionRate() > 80 ? 'bg-green-50 border-2 border-green-600' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <Link
                  to={`/units/${unit.id}`}
                  className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                >
                  {unit.name}
                </Link>
                <div className="w-40">
                  <ProgressBar completionRate={unit.getCompletionRate()} withLabel />
                </div>
              </div>
              <RemainingTodoList unit={unit} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
