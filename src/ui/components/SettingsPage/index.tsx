import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjectStore } from '@/ui/stores/projectStore';
import { Modal } from '@/ui/components/Modal';

export function SettingsPage() {
  const { exportData, importData, addToast } = useProjectStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const buildExportFilename = (): string => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    return `minipaint-export-${date}.json`;
  };

  const handleExport = async () => {
    try {
      const rawData = await exportData();
      const blob = new Blob([rawData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = buildExportFilename();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      addToast('success', 'Data exported successfully');
    } catch {
      addToast('error', 'Failed to export data');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setPendingFile(file);
  };

  const cancelImport = () => {
    setPendingFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const readFile = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });

  const confirmImport = async () => {
    if (!pendingFile) return;
    setIsImporting(true);
    try {
      const rawData = await readFile(pendingFile);
      const success = await importData(rawData);
      if (success) {
        addToast('success', 'Data imported successfully');
      }
    } catch {
      addToast('error', 'Failed to import data');
    } finally {
      setIsImporting(false);
      cancelImport();
    }
  };

  return (
    <div>
      <nav className="text-sm mb-6" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Projects
            </Link>
            <span className="mx-2 text-gray-400">{'>'}</span>
          </li>
          <li>
            <span className="text-gray-600">Settings</span>
          </li>
        </ol>
      </nav>

      <h1 className="text-4xl font-bold text-gray-900 mb-6">Settings</h1>

      {/* Export section */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Export data</h2>
        <p className="text-gray-600 mb-4">
          Download all your painting data (projects, units and todos) as a JSON file, so you can
          keep a backup or restore it on another device or browser.
        </p>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Export data
        </button>
      </section>

      {/* Import section */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Import data</h2>
        <p className="text-gray-600 mb-4">
          Restore your painting data from a previously exported JSON backup file.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          aria-label="Choose a JSON file to import"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </section>

      {/* Import confirmation modal */}
      <Modal isOpen={pendingFile !== null} onClose={cancelImport} title="Confirm import">
        <p className="text-gray-700 mb-2">
          You are about to import <span className="font-medium">{pendingFile?.name}</span>.
        </p>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-sm text-red-700">
            Warning: ALL your current data will be replaced by the file's data. This action cannot
            be undone.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            disabled={isImporting}
            onClick={confirmImport}
            className="px-4 py-2 border border-transparent rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Replace all data
          </button>
          <button
            type="button"
            disabled={isImporting}
            onClick={cancelImport}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
