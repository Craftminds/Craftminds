import { useState, useEffect, useRef } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { ExpenseList } from "./components/ExpenseList"
import { RevenueList } from "./components/RevenueList"
import { Sidebar } from "./components/ui/sidebar"
import { Toaster } from "./components/ui/toaster"
import { useToast } from "./components/ui/use-toast"
import type { Transaction } from "./types"
import { validateTransaction, sanitizeTransaction } from "./types"
import { MagnifyingGlassIcon, CloudArrowUpIcon, ArrowDownTrayIcon, ChartBarIcon } from "@heroicons/react/24/outline"
import { StatisticsPage } from "./components/StatisticsPage"

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'statistics' | 'documents'>('statistics')
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [originalFileHandle, setOriginalFileHandle] = useState<FileSystemFileHandle | null>(null)
  const [isImporting, setIsImporting] = useState(true)

  useEffect(() => {
    const loadTransactions = () => {
      try {
        const savedTransactions = localStorage.getItem('transactions')
        if (savedTransactions) {
          const parsedTransactions = JSON.parse(savedTransactions)
          setTransactions(parsedTransactions)
        }
      } catch (error) {
        console.error('Error loading transactions:', error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les transactions",
          variant: "destructive",
        })
      }
    }

    loadTransactions()
  }, [toast])

  useEffect(() => {
    const saveTransactions = () => {
      try {
        localStorage.setItem('transactions', JSON.stringify(transactions))
      } catch (error) {
        console.error('Error saving transactions:', error)
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder les transactions",
          variant: "destructive",
        })
      }
    }

    saveTransactions()
  }, [transactions, toast])

  useEffect(() => {
    const calculateTotals = () => {
      const [year, month] = selectedMonth.split('-')
      const filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate.getFullYear() === parseInt(year) &&
               transactionDate.getMonth() === parseInt(month) - 1
      })

      const revenue = filteredTransactions
        .filter(t => t.type === 'revenue')
        .reduce((sum, t) => sum + t.amount, 0)
      const expenses = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      setTotalRevenue(revenue)
      setTotalExpenses(expenses)
    }

    calculateTotals()
  }, [transactions, selectedMonth])

  const handleAddTransaction = (transaction: Transaction) => {
    const transactionWithId = { ...transaction, id: crypto.randomUUID() };
    const errors = validateTransaction(transactionWithId);
    if (errors.length > 0) {
      toast({
        title: "Erreur de validation",
        description: errors.join('\n'),
        variant: "destructive",
      });
      return;
    }

    const sanitizedTransaction = sanitizeTransaction(transactionWithId) as Transaction;
    setTransactions(prev => [...prev, sanitizedTransaction]);
    toast({
      title: "Succès",
      description: "Transaction ajoutée avec succès",
    });
  };

  const handleUpdateTransaction = (id: string, updatedTransaction: Transaction) => {
    const errors = validateTransaction(updatedTransaction)
    if (errors.length > 0) {
      toast({
        title: "Erreur de validation",
        description: errors.join('\n'),
        variant: "destructive",
      })
      return
    }

    const sanitizedTransaction = sanitizeTransaction(updatedTransaction)
    setTransactions(prev =>
      prev.map(t => (t.id === id ? sanitizedTransaction : t))
    )
    toast({
      title: "Succès",
      description: "Transaction mise à jour avec succès",
    })
  }

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
    toast({
      title: "Succès",
      description: "Transaction supprimée avec succès",
    })
  }

  const handleExportCSV = () => {
    const headers = ['id', 'type', 'description', 'amount', 'date', 'category']
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        t.id,
        t.type,
        t.description,
        t.amount,
        t.date,
        t.category
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'transactions.csv'
    link.click()
  }

  const saveToOriginalFile = async (txs: Transaction[]) => {
    if (!originalFileHandle) return;
    try {
      const headers = ['id', 'type', 'description', 'amount', 'date', 'category']
      const csvContent = [
        headers.join(','),
        ...txs.map(t => headers.map(h => t[h] ?? '').join(','))
      ].join('\n')
      const writable = await originalFileHandle.createWritable({ keepExistingData: false })
      await writable.write(csvContent)
      await writable.close()
    } catch (e) {
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder dans le CSV', variant: 'destructive' })
    }
  }

  const handleImportCSV = async () => {
    try {
      // Demander le fichier
      // @ts-ignore
      const [fileHandle] = await window.showOpenFilePicker({
        types: [{ description: 'CSV Files', accept: { 'text/csv': ['.csv'] } }],
        multiple: false
      })
      // Vérifier les permissions
      const options = { mode: 'readwrite' as const }
      const permissionStatus = await fileHandle.requestPermission(options)
      if (permissionStatus !== 'granted') {
        toast({ title: 'Permission refusée', description: 'Impossible de modifier le fichier.' })
        return
      }
      setOriginalFileHandle(fileHandle)
      // Lire le contenu
      const file = await fileHandle.getFile()
      const text = await file.text()
      const lines = text.split('\n')
      const headers = lines[0].split(',')
      const txs = lines.slice(1).filter(l => l.trim()).map(line => {
        const values = line.split(',')
        const obj: any = {}
        headers.forEach((h, i) => { obj[h] = values[i] })
        if (obj.amount !== undefined) obj.amount = parseFloat(obj.amount)
        return obj as Transaction
      })
      setTransactions(txs)
      setIsImporting(false)
      toast({ title: 'Import réussi', description: `${txs.length} transactions importées.` })
    } catch (e) {
      toast({ title: 'Erreur', description: 'Import échoué.' })
    }
  }

  useEffect(() => {
    if (originalFileHandle) {
      saveToOriginalFile(transactions)
    }
  }, [transactions])

  const getFilteredTransactions = (type: 'revenue' | 'expense') => {
    const [year, month] = selectedMonth.split('-')
    return transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return t.type === type &&
             transactionDate.getFullYear() === parseInt(year) &&
             transactionDate.getMonth() === parseInt(month) - 1
    })
  }

  const handleSidebarNavigate = (page: 'statistics' | 'documents' | 'import' | 'export') => {
    if (page === 'import') {
      handleImportCSV()
    } else if (page === 'export') {
      handleExportCSV()
    } else {
      setCurrentPage(page)
    }
  }

  if (isImporting) {
    const isFileSystemAPISupported = !!window.showOpenFilePicker;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#232946] via-[#1a1a2e] to-[#121212]">
        <div className="glass p-10 rounded-3xl shadow-2xl flex flex-col items-center animate-fade-in max-w-md w-full">
          <span className="text-5xl mb-4" style={{filter: 'drop-shadow(0 2px 8px #60a5fa)'}}>🧊</span>
          <h1 className="text-3xl font-extrabold mb-2 text-white text-center tracking-tight">Bienvenue sur Craftminds Comptabilité</h1>
          <p className="text-base text-blue-100 mb-6 text-center">Pour commencer, importe un fichier CSV qui servira de base à toutes tes modifications.<br/>Chaque changement sera sauvegardé directement dans ce fichier.</p>
          {!isFileSystemAPISupported && (
            <div className="bg-red-400/80 text-white rounded-lg px-4 py-2 mb-4 text-center">
              ⚠️ Ce navigateur ne supporte pas l'import/export direct de fichiers CSV.<br/>Utilise Chrome ou Edge pour profiter de toutes les fonctionnalités.
            </div>
          )}
          <button
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 text-lg transition-all duration-200 shadow-lg mt-2"
            onClick={handleImportCSV}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Importer un CSV
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-gray-100 antialiased" style={{
      background: 'radial-gradient(ellipse at 60% 20%, #232946 0%, #1a1a2e 60%, #121212 100%)'
    }}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar onNavigate={handleSidebarNavigate} currentPage={currentPage} />

        {/* Champ input file caché pour l'import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleImportCSV(e.target.files[0])}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="container mx-auto p-8">
            {/* Header with actions */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="input-glass"
                  />
                </div>
              </div>
            </div>

            {/* Stats cards */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="card-glass transition-all duration-200 hover:shadow-2xl hover:-translate-y-1">
                <h2 className="mb-2 text-lg font-semibold">Revenus Totaux</h2>
                <p className="text-3xl font-bold text-green-400">{totalRevenue.toFixed(2)} €</p>
              </div>
              <div className="card-glass transition-all duration-200 hover:shadow-2xl hover:-translate-y-1">
                <h2 className="mb-2 text-lg font-semibold">Dépenses Totales</h2>
                <p className="text-3xl font-bold text-red-400">{totalExpenses.toFixed(2)} €</p>
              </div>
              <div className="card-glass transition-all duration-200 hover:shadow-2xl hover:-translate-y-1">
                <h2 className="mb-2 text-lg font-semibold">Profit</h2>
                <p className={`text-3xl font-bold ${totalRevenue - totalExpenses >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(totalRevenue - totalExpenses).toFixed(2)} €
                </p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="revenue" className="space-y-4">
              <TabsList className="bg-white/5 backdrop-blur-lg border border-white/10">
                <TabsTrigger value="revenue">Revenus</TabsTrigger>
                <TabsTrigger value="expenses">Dépenses</TabsTrigger>
              </TabsList>
              <TabsContent value="revenue">
                <div className="card-glass">
                  <RevenueList
                    transactions={getFilteredTransactions('revenue')}
                    onAdd={handleAddTransaction}
                    onUpdate={handleUpdateTransaction}
                    onDelete={handleDeleteTransaction}
                    onExport={handleExportCSV}
                    onImport={handleImportCSV}
                  />
                </div>
              </TabsContent>
              <TabsContent value="expenses">
                <div className="card-glass">
                  <ExpenseList
                    transactions={getFilteredTransactions('expense')}
                    onAdd={handleAddTransaction}
                    onUpdate={handleUpdateTransaction}
                    onDelete={handleDeleteTransaction}
                    onExport={handleExportCSV}
                    onImport={handleImportCSV}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {currentPage === 'statistics' && (
              <StatisticsPage transactions={transactions} />
            )}
            {currentPage === 'documents' && (
              <div className="p-8"><h2 className="text-2xl font-bold">Documents</h2></div>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

export default App
