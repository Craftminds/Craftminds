export type TransactionType = 'revenue' | 'expense'

export interface Transaction {
  type: TransactionType
  date: string
  client: string
  service: string
  montant: number
}

// Constantes de validation
export const MAX_AMOUNT = 1000000 // 1 million d'euros
export const MAX_CLIENT_LENGTH = 100
export const MAX_SERVICE_LENGTH = 200
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

// Fonctions de validation
export function validateTransaction(transaction: Partial<Transaction>): string[] {
  const errors: string[] = []

  // Validation du type
  if (!transaction.type || !['revenue', 'expense'].includes(transaction.type)) {
    errors.push('Le type doit être "revenue" ou "expense"')
  }

  // Validation de la date
  if (!transaction.date || !DATE_REGEX.test(transaction.date)) {
    errors.push('La date doit être au format YYYY-MM-DD')
  } else {
    const date = new Date(transaction.date)
    if (isNaN(date.getTime())) {
      errors.push('La date n\'est pas valide')
    }
  }

  // Validation du client
  if (transaction.client && transaction.client.length > MAX_CLIENT_LENGTH) {
    errors.push(`Le nom du client ne doit pas dépasser ${MAX_CLIENT_LENGTH} caractères`)
  }

  // Validation du service
  if (!transaction.service) {
    errors.push('Le service est requis')
  } else if (transaction.service.length > MAX_SERVICE_LENGTH) {
    errors.push(`La description du service ne doit pas dépasser ${MAX_SERVICE_LENGTH} caractères`)
  }

  // Validation du montant
  if (typeof transaction.montant !== 'number' || isNaN(transaction.montant)) {
    errors.push('Le montant doit être un nombre')
  } else if (transaction.montant <= 0) {
    errors.push('Le montant doit être supérieur à 0')
  } else if (transaction.montant > MAX_AMOUNT) {
    errors.push(`Le montant ne doit pas dépasser ${MAX_AMOUNT.toLocaleString('fr-FR')} €`)
  }

  return errors
}

// Fonction de nettoyage des données
export function sanitizeTransaction(transaction: Partial<Transaction>): Partial<Transaction> {
  return {
    ...transaction,
    client: transaction.client?.trim().slice(0, MAX_CLIENT_LENGTH),
    service: transaction.service?.trim().slice(0, MAX_SERVICE_LENGTH),
    montant: typeof transaction.montant === 'number' ? 
      Math.min(Math.max(0, transaction.montant), MAX_AMOUNT) : 
      undefined
  }
} 