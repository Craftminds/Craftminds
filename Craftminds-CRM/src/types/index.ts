export type ClientStatus = 'Contacté' | 'Relancé' | 'Signé';

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: ClientStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: ClientStatus;
  title: string;
  clients: Client[];
} 