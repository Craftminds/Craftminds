import { useState } from 'react'
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import type { Transaction } from '../types'
import { PlusIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'

interface ExpenseListProps {
  transactions: Transaction[]
  onAdd: (transaction: Transaction) => void
}

export function ExpenseList({ transactions, onAdd }: ExpenseListProps) {
  const [newExpense, setNewExpense] = useState({
    service: '',
    montant: '',
    date: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newExpense.service || !newExpense.montant) return

    onAdd({
      type: 'expense',
      description: newExpense.service,
      amount: parseFloat(newExpense.montant),
      date: newExpense.date,
      category: 'Dépenses',
    })

    setNewExpense({
      service: '',
      montant: '',
      date: new Date().toISOString().split('T')[0]
    })
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            placeholder="Type de dépense"
            value={newExpense.service}
            onChange={(e) => setNewExpense({ ...newExpense, service: e.target.value })}
            className="input-glass"
          />
          <input
            type="number"
            placeholder="Montant"
            value={newExpense.montant}
            onChange={(e) => setNewExpense({ ...newExpense, montant: e.target.value })}
            className="input-glass"
          />
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            className="input-glass"
          />
        </div>
        <button
          type="submit"
          className="w-full btn-glass bg-red-600/80 hover:bg-red-700/90 text-white text-base font-semibold py-3 flex items-center justify-center gap-2 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5" />
          Ajouter une dépense
        </button>
      </form>

      <div className="space-y-2">
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="group flex items-center gap-4 bg-white/10 backdrop-blur-md border-l-4 border-red-400 rounded-xl p-4 shadow transition-all duration-200 hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="flex-shrink-0">
              <ArrowTrendingDownIcon className="h-8 w-8 text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-white truncate">{transaction.description}</span>
                <span className="font-bold text-2xl text-red-300 ml-4">{transaction.amount.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-300">
                <span>{new Date(transaction.date).toLocaleDateString('fr-FR')}</span>
                <span className="px-2 py-0.5 rounded bg-red-900/40 text-red-200 text-xs">{transaction.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 