import { useState, ReactNode } from 'react';
import type { ClientStatus, Client } from '../types';
import { PlusIcon } from '@heroicons/react/24/outline';
import { createPortal } from 'react-dom';

interface AddClientFormProps {
  onAdd: (client: {
    name: string;
    email: string;
    company: string;
    status: ClientStatus;
    notes?: string;
  }) => void;
  customButtonClass?: string;
  customButtonContent?: ReactNode;
}

interface ClientFormModalProps {
  initialValues: Partial<Client>;
  onClose: () => void;
  onSubmit: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  title: string;
  submitLabel: string;
}

const ClientFormModal = ({ initialValues, onClose, onSubmit, title, submitLabel }: ClientFormModalProps) => {
  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    email: initialValues.email || '',
    company: initialValues.company || '',
    status: (initialValues.status as ClientStatus) || 'Contacté',
    notes: initialValues.notes || '',
  });
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="glass rounded-3xl p-8 max-w-md w-full shadow-2xl relative z-10 overflow-y-auto max-h-[90vh] border border-white/10">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-xl font-bold"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">{title}</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit(formData);
            onClose();
          }}
          className="space-y-5"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">Nom</label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="input-glass w-full"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">Email</label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="input-glass w-full"
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-200 mb-1">Entreprise</label>
            <input
              type="text"
              id="company"
              required
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
              className="input-glass w-full"
            />
          </div>
          <div className="relative">
            <label htmlFor="status" className="block text-sm font-medium text-gray-200 mb-1">Statut</label>
            <select
              id="status"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as ClientStatus })}
              className="input-glass w-full bg-[#232946] text-gray-100 pr-10 appearance-none"
            >
              <option value="Contacté">Contacté</option>
              <option value="Relancé">Relancé</option>
              <option value="Signé">Signé</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-9 flex items-center h-5">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </span>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-200 mb-1">Notes</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="input-glass w-full rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="btn-glass-neutral px-6 py-2 text-sm font-medium">Annuler</button>
            <button type="submit" className="btn-glass-violet px-6 py-2 text-sm font-medium">{submitLabel}</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

const AddClientForm = ({ onAdd, customButtonClass = '', customButtonContent }: AddClientFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={customButtonClass || "w-full h-full flex items-center justify-center"}
        title="Ajouter un client"
        type="button"
      >
        {customButtonContent ? customButtonContent : <PlusIcon className="h-6 w-6 text-violet-300" />}
      </button>
    );
  }

  return (
    <ClientFormModal
      initialValues={{}}
      onClose={() => setIsOpen(false)}
      onSubmit={onAdd}
      title="Ajouter un client"
      submitLabel="Ajouter"
    />
  );
};

export default AddClientForm;
export { ClientFormModal }; 