import { Droppable } from '@hello-pangea/dnd';
import type { Column } from '../types';
import ClientCard from './ClientCard';
import { FC } from 'react';

interface KanbanColumnProps {
  column: Column;
  ClientCardComponent?: FC<{ client: any; index: number }>;
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

const KanbanColumn = ({ column, ClientCardComponent }: KanbanColumnProps) => {
  const Card = ClientCardComponent || ClientCard;
  return (
    <div className="bg-white/5 shadow-xl border border-white/10 rounded-3xl min-w-[320px] max-w-xs flex-1 flex flex-col transition-all duration-200 hover:shadow-2xl p-[2%]">
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-lg font-bold mb-1 tracking-tight text-gray-100">{column.title}</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getBadgeColor(column.id)}`}>
          {column.clients.length} client{column.clients.length !== 1 ? 's' : ''}
        </span>
      </div>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-3 min-h-[200px] max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar"
          >
            {column.clients.map((client, index) => (
              <Card key={client.id} client={client} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn; 