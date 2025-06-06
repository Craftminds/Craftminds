import { Droppable } from '@hello-pangea/dnd';
import type { Column as ColumnType, Client } from '../types';
import ClientCard from './ClientCard';

interface KanbanColumnProps {
  column: ColumnType;
  onUpdateClient: (client: Client) => void;
}

const getBadgeColor = (status: string) => {
  switch (status) {
    case 'Contacté':  
      return 'bg-blue-700/60 text-blue-200';
    case 'Relancé':
      return 'bg-pink-700/60 text-pink-200';
    case 'Signé':
      return 'bg-green-700/60 text-green-200';
    default:
      return 'bg-gray-700/60 text-gray-200';
  }
};

export default function KanbanColumn({ column, onUpdateClient }: KanbanColumnProps) {
  return (
    <div className="bg-white/5 shadow-xl border border-white/10 rounded-3xl min-w-[320px] max-w-xs flex-1 flex flex-col transition-all duration-200 hover:shadow-2xl p-[2%]">
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-lg font-bold mb-1 tracking-tight text-gray-100">{column.title}</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getBadgeColor(column.id)}`}>
          {column.clients.length} client{column.clients.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-[200px] max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar ${
              snapshot.isDraggingOver ? 'bg-white/10' : ''
            }`}
          >
            <div className="space-y-3">
              {column.clients.map((client, index) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  index={index}
                  onUpdate={onUpdateClient}
                />
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
} 