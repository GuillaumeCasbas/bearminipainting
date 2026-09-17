import { useUiPreferencesStore } from '@/ui/stores/uiPreferencesStore';

export function ToggleDoneTodos() {
  const { hideDoneTodos, setHideDoneTodos } = useUiPreferencesStore();

  return (
    <button
      type="button"
      onClick={() => setHideDoneTodos(!hideDoneTodos)}
      aria-pressed={hideDoneTodos}
      aria-label="Hide completed todos"
      title="Hide completed todos"
      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    >
      <span
        className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full transition-colors ${
          hideDoneTodos ? 'bg-blue-600' : 'bg-gray-300'
        }`}
        aria-hidden="true"
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            hideDoneTodos ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </span>
      Hide completed todos
    </button>
  );
}
