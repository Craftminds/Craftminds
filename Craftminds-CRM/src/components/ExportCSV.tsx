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
      className={className || "inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"}
    >
      {children ? children : <><ArrowDownTrayIcon className="h-5 w-5 mr-2" />Exporter CSV</>}
    </button>
  );
};

export default ExportCSV; 