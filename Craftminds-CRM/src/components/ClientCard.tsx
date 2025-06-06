import { Draggable } from '@hello-pangea/dnd';
import type { Client } from '../types';
import { PencilIcon, TrashIcon, EnvelopeIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { ClientFormModal } from './AddClientForm';

interface ClientCardProps {
  client: Client;
  index: number;
  onUpdate: (client: Client) => void;
}

export default function ClientCard({ client, index, onUpdate }: ClientCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      onUpdate({ ...client, status: 'Contacté' }); // On le déplace dans la colonne "Contacté" pour le supprimer
    }
  };

  return (
    <>
      <Draggable draggableId={client.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`card-glass group relative ${
              snapshot.isDragging ? 'shadow-2xl' : ''
            }`}
          >
            <button
              className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-900/30 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100"
              onClick={handleEdit}
              title="Éditer"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              className="absolute top-2 right-10 p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/30 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100"
              onClick={handleDelete}
              title="Supprimer"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-100 text-base">{client.name}</h3>
              <div className="flex items-center text-xs text-gray-400 space-x-2">
                <EnvelopeIcon className="h-4 w-4" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center text-xs text-gray-400 space-x-2">
                <BuildingOfficeIcon className="h-4 w-4" />
                <span>{client.company}</span>
              </div>
              {client.notes && (
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <p className="text-xs italic text-gray-300 line-clamp-2">{client.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>

      {isEditModalOpen && (
        <ClientFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(updatedClient) => {
            onUpdate({
              ...client,
              ...updatedClient,
              updatedAt: new Date().toISOString()
            });
            setIsEditModalOpen(false);
          }}
          initialValues={client}
        />
      )}
    </>
  );
} 