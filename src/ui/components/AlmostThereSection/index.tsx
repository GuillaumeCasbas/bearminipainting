import { Link } from 'react-router-dom';
import { GetAlmostThereUnitsUseCase } from '@/core/usecases/get-almost-there-units.usecase';
import { Unit } from '@/core/entities/Unit';
import { ProgressBar } from '@/ui/components/ProgressBar';
import { useProjectStore } from '@/ui/stores/projectStore';

const getAlmostThereUnits = new GetAlmostThereUnitsUseCase();

export function AlmostThereSection() {
  const { projects } = useProjectStore();
  const allUnits: Unit[] = projects.flatMap((project) => project.units);
  const almostThereUnits = getAlmostThereUnits.execute(allUnits);

  return (
    <section className="mt-8" aria-label="Almost there">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Almost there!</h2>
      {almostThereUnits.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Nothing above 75% yet. Push a miniature to the final stretch!
        </p>
      ) : (
        <ul className="space-y-4">
          {almostThereUnits.map((unit) => (
            <li
              key={unit.id}
              data-testid="almost-there-card"
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
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
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
