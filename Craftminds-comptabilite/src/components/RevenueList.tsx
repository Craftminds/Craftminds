import { useState } from 'react'
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import type { Transaction } from '../types'
import { PlusIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

interface RevenueListProps {
  transactions: Transaction[]
  onAdd: (transaction: Transaction) => void
}

export function RevenueList({ transactions, onAdd }: RevenueListProps) {
  const [newRevenue, setNewRevenue] = useState({
    client: '',
    service: '',
    montant: '',
    date: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRevenue.client || !newRevenue.service || !newRevenue.montant) return

    onAdd({
      type: 'revenue',
      description: `${newRevenue.client} - ${newRevenue.service}`,
      amount: parseFloat(newRevenue.montant),
      date: newRevenue.date,
      category: 'Revenus',
    })

    setNewRevenue({
      client: '',
      service: '',
      montant: '',
      date: new Date().toISOString().split('T')[0]
    })
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            placeholder="Client"
            value={newRevenue.client}
            onChange={(e) => setNewRevenue({ ...newRevenue, client: e.target.value })}
            className="input-glass"
          />
          <input
            placeholder="Service"
            value={newRevenue.service}
            onChange={(e) => setNewRevenue({ ...newRevenue, service: e.target.value })}
            className="input-glass"
          />
          <input
            type="number"
            placeholder="Montant"
            value={newRevenue.montant}
            onChange={(e) => setNewRevenue({ ...newRevenue, montant: e.target.value })}
            className="input-glass"
          />
          <input
            type="date"
            value={newRevenue.date}
            onChange={(e) => setNewRevenue({ ...newRevenue, date: e.target.value })}
            className="input-glass"
          />
        </div>
        <button
          type="submit"
          className="w-full btn-glass bg-blue-600/80 hover:bg-blue-700/90 text-white text-base font-semibold py-3 flex items-center justify-center gap-2 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5" />
          Ajouter une prestation
        </button>
      </form>

      <div className="space-y-2">
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="group flex items-center gap-4 bg-white/10 backdrop-blur-md border-l-4 border-green-400 rounded-xl p-4 shadow transition-all duration-200 hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="flex-shrink-0">
              <ArrowTrendingUpIcon className="h-8 w-8 text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-white truncate">{transaction.description}</span>
                <span className="font-bold text-2xl text-green-300 ml-4">{transaction.amount.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-300">
                <span>{new Date(transaction.date).toLocaleDateString('fr-FR')}</span>
                <span className="px-2 py-0.5 rounded bg-green-900/40 text-green-200 text-xs">{transaction.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 