import { ReactNode } from 'react';
import type { ClientStatus } from '../types';
import Papa from 'papaparse';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface ImportCSVProps {
  onImport: (clients: Array<{
    name: string;
    email: string;
    company: string;
    status: ClientStatus;
    notes?: string;
  }>, fileHandle?: FileSystemFileHandle) => void;
  className?: string;
  children?: ReactNode;
}

const ImportCSV = ({ onImport, className = '', children }: ImportCSVProps) => {
  const handleFileSelect = async () => {
    try {
      // Demander l'accès au fichier
      const fileHandle = await window.showOpenFilePicker({
        types: [{
          description: 'CSV Files',
          accept: { 'text/csv': ['.csv'] },
        }],
        multiple: false
      });

      if (fileHandle.length === 0) return;

      // Vérifier les permissions
      const options = {
        mode: 'readwrite' as const
      };

      const permissionStatus = await fileHandle[0].requestPermission(options);
      if (permissionStatus !== 'granted') {
        alert('Permission refusée pour modifier le fichier. Les modifications ne pourront pas être sauvegardées.');
        return;
      }

      // Lire le contenu du fichier
      const file = await fileHandle[0].getFile();
      const fileContent = await file.text();

      Papa.parse(fileContent, {
        header: true,
        complete: (results) => {
          const clients = results.data as any[];
          const validClients = clients.map((client) => {
            const name = client.name || client.nom;
            const email = client.email;
            const company = client.company || client.entreprise;
            const status = (client.status || client.statut || 'Contacté') as ClientStatus;
            const notes = client.notes;
            if (name && email && company) {
              return { name, email, company, status, notes };
            }
            return null;
          }).filter(Boolean);
          if (validClients.length > 0) {
            onImport(validClients, fileHandle[0]);
          }
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          alert('Erreur lors de l\'import du fichier CSV');
        },
      });
    } catch (error) {
      console.error('Error accessing file:', error);
      alert('Erreur lors de l\'accès au fichier. Veuillez réessayer.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleFileSelect}
      className={className || "btn-glass-blue inline-flex items-center px-4 py-2 text-sm font-medium"}
    >
      {children ? children : <><ArrowUpTrayIcon className="h-5 w-5 mr-2" />Importer CSV</>}
    </button>
  );
};

export default ImportCSV; 