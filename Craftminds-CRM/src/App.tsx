import { useState, useEffect, useRef } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import type { Client, ClientStatus, Column } from './types';
import KanbanColumn from './components/KanbanColumn';
import AddClientForm, { ClientFormModal } from './components/AddClientForm.tsx';
import ImportCSV from './components/ImportCSV.tsx';
import ExportCSV from './components/ExportCSV.tsx';
import ClientCard from './components/ClientCard';
import { MagnifyingGlassIcon, CloudArrowUpIcon, UserPlusIcon, ArrowPathIcon, ArrowDownTrayIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const initialColumns: Column[] = [
  { id: 'Contacté', title: 'Contacté', clients: [] },
  { id: 'Relancé', title: 'Relancé', clients: [] },
  { id: 'Signé', title: 'Signé', clients: [] },
];

function App() {
  const [columns, setColumns] = useState<Column[]>(() => {
    const savedColumns = localStorage.getItem('crm-columns');
    return savedColumns ? JSON.parse(savedColumns) : initialColumns;
  });
  const [search, setSearch] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const originalFileHandle = useRef<FileSystemFileHandle | null>(null);
  const initialColumnsRef = useRef<Column[]>([]);

  // Fonction de sauvegarde explicite
  const saveToLocalStorage = (newColumns: Column[]) => {
    try {
      localStorage.setItem('crm-columns', JSON.stringify(newColumns));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde des données. Veuillez vérifier l\'espace de stockage disponible.');
    }
  };

  // Fonction de réinitialisation
  const resetApplication = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser l\'application ? Toutes les données seront supprimées.')) {
      setColumns(initialColumns);
      saveToLocalStorage(initialColumns);
    }
  };

  useEffect(() => {
    saveToLocalStorage(columns);
  }, [columns]);

  // Fonction pour vérifier les modifications
  const checkForChanges = (newColumns: Column[]) => {
    const hasModifications = JSON.stringify(newColumns) !== JSON.stringify(initialColumnsRef.current);
    setHasChanges(hasModifications);
  };

  // Fonction pour sauvegarder dans le fichier original
  const saveToOriginalFile = async () => {
    if (!originalFileHandle.current) {
      alert('Aucun fichier original n\'a été importé. Veuillez d\'abord importer un fichier CSV.');
      return;
    }

    try {
      const allClients = columns.flatMap(col => col.clients);
      const headers = ['name', 'email', 'company', 'status', 'notes', 'createdAt', 'updatedAt'];
      const csvContent = [
        headers.join(','),
        ...allClients.map(client => 
          headers.map(header => {
            const value = client[header as keyof Client];
            return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          }).join(',')
        )
      ].join('\n');

      // Créer un nouveau FileSystemWritableFileStream
      const writable = await originalFileHandle.current.createWritable({
        keepExistingData: false // Important : on écrase complètement le fichier
      });

      // Écrire le contenu
      await writable.write(csvContent);
      
      // Fermer le stream
      await writable.close();

      // Mettre à jour la référence après la sauvegarde
      initialColumnsRef.current = JSON.parse(JSON.stringify(columns));
      setHasChanges(false);
      alert('Modifications sauvegardées avec succès dans le fichier original !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde dans le fichier original. Veuillez réessayer.');
    }
  };

  // Modifier la fonction d'import pour stocker correctement le handle du fichier
  const handleImport = async (clients: Array<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>, fileHandle?: FileSystemFileHandle) => {
    if (fileHandle) {
      // Vérifier les permissions
      const options = {
        mode: 'readwrite' as const
      };
      
      // Demander les permissions explicites
      const permissionStatus = await fileHandle.requestPermission(options);
      if (permissionStatus === 'granted') {
        originalFileHandle.current = fileHandle;
      } else {
        alert('Permission refusée pour modifier le fichier. Les modifications ne pourront pas être sauvegardées.');
        return;
      }
    }
    
    addClients(clients);
    // Mettre à jour la référence après l'import
    setTimeout(() => {
      initialColumnsRef.current = JSON.parse(JSON.stringify(columns));
      setHasChanges(false);
    }, 0);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === destination.droppableId) {
      const column = columns.find(col => col.id === source.droppableId);
      if (!column) return;

      const newClients = Array.from(column.clients);
      const [removed] = newClients.splice(source.index, 1);
      newClients.splice(destination.index, 0, removed);

      const newColumns = columns.map(col => 
        col.id === source.droppableId 
          ? { ...col, clients: newClients }
          : col
      );
      setColumns(newColumns);
      checkForChanges(newColumns);
    } else {
      const sourceColumn = columns.find(col => col.id === source.droppableId);
      const destColumn = columns.find(col => col.id === destination.droppableId);
      
      if (!sourceColumn || !destColumn) return;

      const sourceClients = Array.from(sourceColumn.clients);
      const destClients = Array.from(destColumn.clients);
      const [removed] = sourceClients.splice(source.index, 1);
      
      removed.status = destination.droppableId as ClientStatus;
      destClients.splice(destination.index, 0, removed);

      const newColumns = columns.map(col => {
        if (col.id === source.droppableId) {
          return { ...col, clients: sourceClients };
        }
        if (col.id === destination.droppableId) {
          return { ...col, clients: destClients };
        }
        return col;
      });
      setColumns(newColumns);
      checkForChanges(newColumns);
    }
  };

  const addClients = (clients: Array<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const newClients = clients.map(client => ({
      ...client,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    const grouped: Record<string, Client[]> = {};
    newClients.forEach(client => {
      if (!grouped[client.status]) grouped[client.status] = [];
      grouped[client.status].push(client);
    });
    const newColumns = columns.map(col => {
      if (grouped[col.id]) {
        return {
          ...col,
          clients: [...col.clients, ...grouped[col.id]],
        };
      }
      return col;
    });
    setColumns(newColumns);
    saveToLocalStorage(newColumns);
  };

  const addClient = (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    addClients([client]);
  };

  // Fonction pour mettre à jour un client (édition)
  const updateClient = (updated: Client) => {
    setColumns(columns => {
      let removed: Client | undefined;
      let newColumns = columns.map(col => {
        const filtered = col.clients.filter(c => {
          if (c.id === updated.id) {
            removed = c;
            return false;
          }
          return true;
        });
        return { ...col, clients: filtered };
      });
      newColumns = newColumns.map(col => {
        if (col.id === updated.status) {
          return { ...col, clients: [...col.clients, { ...updated, updatedAt: new Date().toISOString() }] };
        }
        return col;
      });
      checkForChanges(newColumns);
      return newColumns;
    });
  };

  // Filtrage des clients selon la recherche
  const getFilteredColumns = () => {
    if (!search.trim()) return columns;
    const lower = search.toLowerCase();
    return columns.map(col => ({
      ...col,
      clients: col.clients.filter(client =>
        client.name.toLowerCase().includes(lower) ||
        client.email.toLowerCase().includes(lower) ||
        client.company.toLowerCase().includes(lower) ||
        (client.notes?.toLowerCase().includes(lower) ?? false)
      )
    }));
  };

  // Fonction pour exporter les données en CSV
  const exportToCSV = () => {
    // Récupérer tous les clients de toutes les colonnes
    const allClients = columns.flatMap(col => col.clients);
    
    // Créer le contenu CSV
    const headers = ['name', 'email', 'company', 'status', 'notes', 'createdAt', 'updatedAt'];
    const csvContent = [
      headers.join(','),
      ...allClients.map(client => 
        headers.map(header => {
          const value = client[header as keyof Client];
          // Échapper les virgules et les guillemets dans les valeurs
          return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        }).join(',')
      )
    ].join('\n');

    // Créer et télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `crm_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen w-full flex flex-row bg-gradient-to-br from-[#232946] via-[#1a1a2e] to-[#121212]">
      {/* Menu latéral dark glassmorphism */}
      <aside className="glass flex flex-col items-center gap-10 py-10 px-4 min-h-screen w-64 shadow-2xl rounded-r-3xl">
        <span className="text-3xl font-extrabold tracking-tight text-blue-400 mb-2">🧊</span>
        <span className="text-2xl font-extrabold tracking-tight text-gray-100 mb-8 text-center">Craftminds CRM</span>
        <ImportCSV onImport={handleImport} className="btn-glass-blue flex items-center gap-3 w-full px-5 py-3 text-base font-semibold group" >
          <CloudArrowUpIcon className="w-6 h-6 text-blue-300 group-hover:text-blue-200 transition-colors" />
          <span>Importer CSV</span>
        </ImportCSV>
        {hasChanges && (
          <button
            onClick={saveToOriginalFile}
            className="btn-glass-green flex items-center gap-3 w-full px-5 py-3 text-base font-semibold group animate-pulse"
          >
            <CheckCircleIcon className="w-6 h-6 text-green-300 group-hover:text-green-200 transition-colors" />
            <span>Sauvegarder les modifications</span>
          </button>
        )}
        <AddClientForm onAdd={addClient} customButtonClass="btn-glass-violet flex items-center gap-3 w-full px-5 py-3 text-base font-semibold group" customButtonContent={
          <>
            <UserPlusIcon className="w-6 h-6 text-violet-300 group-hover:text-violet-200 transition-colors" />
            <span>Ajouter un client</span>
          </>
        } />
        <button
          onClick={resetApplication}
          className="btn-glass-red flex items-center gap-3 w-full px-5 py-3 text-base font-semibold group"
        >
          <ArrowPathIcon className="w-6 h-6 text-red-300 group-hover:text-red-200 transition-colors" />
          <span>Réinitialiser</span>
        </button>
      </aside>
      {/* Zone principale dark uniforme */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Barre de recherche glass centrée */}
        <div className="flex justify-center pt-12 pb-8">
          <div className="glass flex items-center gap-2 px-8 py-4 rounded-full shadow max-w-lg w-full">
            <MagnifyingGlassIcon className="h-5 w-5 text-blue-300" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un client..."
              className="input-glass flex-1 border-0 bg-transparent shadow-none focus:ring-0"
            />
          </div>
        </div>
        {/* Colonnes Kanban glassmorphism dark */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-8 pb-12 flex gap-10 items-start justify-center pt-8">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-1 gap-10 items-start justify-center">
              {getFilteredColumns().map((column) => (
                <KanbanColumn key={column.id} column={{...column}} ClientCardComponent={props => <ClientCard {...props} onEdit={updateClient} />} />
              ))}
            </div>
          </DragDropContext>
        </main>
      </div>
      </div>
  );
}

export default App;
