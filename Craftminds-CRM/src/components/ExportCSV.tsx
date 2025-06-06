import { ReactNode } from 'react';
import type { Client } from '../types';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface ExportCSVProps {
  onExport: () => void;
  className?: string;
  children?: ReactNode;
}

const ExportCSV = ({ onExport, className = '', children }: ExportCSVProps) => {
  return (
    <button
      onClick={onExport}
      type="button"
      className={className || "btn-glass-green inline-flex items-center px-4 py-2 text-sm font-medium"}
    >
      {children ? children : <><ArrowDownTrayIcon className="h-5 w-5 mr-2" />Exporter CSV</>}
    </button>
  );
};

export default ExportCSV; 