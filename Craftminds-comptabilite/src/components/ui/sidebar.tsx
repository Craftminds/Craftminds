import { ChartBarIcon, DocumentTextIcon, CloudArrowUpIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { cn } from "../../lib/utils";

interface SidebarProps {
  onNavigate?: (page: 'statistics' | 'documents' | 'import' | 'export') => void;
  currentPage?: 'statistics' | 'documents';
}

export function Sidebar({ onNavigate, currentPage }: SidebarProps) {
  return (
    <aside className="glass flex flex-col items-center min-h-screen w-64 shadow-2xl rounded-r-3xl p-0">
      <div className="w-full flex flex-col items-center pt-6 pb-2">
        <span className="text-4xl mb-2" style={{filter: 'drop-shadow(0 2px 8px #60a5fa)'}}>🧊</span>
        <span className="text-2xl font-extrabold tracking-tight text-white mb-10 text-center" style={{textShadow: '0 2px 8px #232946'}}>Comptabilité</span>
      </div>
      <div className="flex flex-col w-full px-4 gap-4 mt-2">
        <button
          className={cn(
            "w-full flex items-center gap-3 justify-center rounded-xl bg-blue-400/30 hover:bg-blue-400/50 text-white font-bold py-3 transition-all duration-200 shadow-lg border border-white/10 backdrop-blur-md",
            currentPage === 'statistics' && 'ring-2 ring-blue-400 bg-blue-500/40 text-blue-100')}
          onClick={() => onNavigate && onNavigate('statistics')}
        >
          <ChartBarIcon className="w-6 h-6" />
          Statistiques
        </button>
        <button
          className={cn(
            "w-full flex items-center gap-3 justify-center rounded-xl bg-violet-400/30 hover:bg-violet-400/50 text-white font-bold py-3 transition-all duration-200 shadow-lg border border-white/10 backdrop-blur-md",
            currentPage === 'documents' && 'ring-2 ring-violet-400 bg-violet-500/40 text-violet-100')}
          onClick={() => onNavigate && onNavigate('documents')}
        >
          <DocumentTextIcon className="w-6 h-6" />
          Documents
        </button>
        <button
          className="w-full flex items-center gap-3 justify-center rounded-xl bg-orange-400/30 hover:bg-orange-400/50 text-white font-bold py-3 mt-2 transition-all duration-200 shadow-lg border border-white/10 backdrop-blur-md"
          onClick={() => onNavigate && onNavigate('import')}
        >
          <CloudArrowUpIcon className="w-6 h-6" />
          Importer
        </button>
        <button
          className="w-full flex items-center gap-3 justify-center rounded-xl bg-green-400/30 hover:bg-green-400/50 text-white font-bold py-3 transition-all duration-200 shadow-lg border border-white/10 backdrop-blur-md"
          onClick={() => onNavigate && onNavigate('export')}
        >
          <ArrowDownTrayIcon className="w-6 h-6" />
          Exporter
        </button>
      </div>
    </aside>
  );
} 