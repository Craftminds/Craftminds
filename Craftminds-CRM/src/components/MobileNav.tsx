import { PlusIcon, ArrowUpTrayIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface MobileNavProps {
  onAddClient: () => void;
  onImport: () => void;
  onExport: () => void;
}

export default function MobileNav({ onAddClient, onImport, onExport }: MobileNavProps) {
  return (
    <div className="lg:hidden">
      {/* Barre de navigation fixe en bas */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 p-3 flex justify-around items-center">
        <button
          onClick={onAddClient}
          className="flex flex-col items-center text-violet-300 hover:text-violet-200 transition-colors"
        >
          <div className="p-2 rounded-full hover:bg-violet-500/20 transition-colors">
            <PlusIcon className="h-6 w-6" />
          </div>
          <span className="text-xs mt-1">Ajouter</span>
        </button>
        <button
          onClick={onImport}
          className="flex flex-col items-center text-blue-300 hover:text-blue-200 transition-colors"
        >
          <div className="p-2 rounded-full hover:bg-blue-500/20 transition-colors">
            <ArrowUpTrayIcon className="h-6 w-6" />
          </div>
          <span className="text-xs mt-1">Importer</span>
        </button>
        <button
          onClick={onExport}
          className="flex flex-col items-center text-green-300 hover:text-green-200 transition-colors"
        >
          <div className="p-2 rounded-full hover:bg-green-500/20 transition-colors">
            <ArrowDownTrayIcon className="h-6 w-6" />
          </div>
          <span className="text-xs mt-1">Exporter</span>
        </button>
      </div>
    </div>
  );
} 