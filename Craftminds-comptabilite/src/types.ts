// Types
type TransactionType = 'revenue' | 'expense'

export type Transaction = {
  id: string
  type: TransactionType
  description: string
  amount: number
  date: string
  category: string
}

// Validation
export function validateTransaction(transaction: Partial<Transaction>): string[] {
  const errors: string[] = []

  // Vérifier l'ID
  if (!transaction.id) {
    errors.push('L\'ID est requis')
  }

  // Vérifier le type
  if (!transaction.type || !['revenue', 'expense'].includes(transaction.type)) {
    errors.push('Le type doit être "revenue" ou "expense"')
  }

  // Vérifier la description
  if (!transaction.description) {
    errors.push('La description est requise')
  }

  // Vérifier le montant
  if (typeof transaction.amount !== 'number' || isNaN(transaction.amount)) {
    errors.push('Le montant doit être un nombre')
  } else if (transaction.amount <= 0) {
    errors.push('Le montant doit être supérieur à 0')
  }

  // Vérifier la date
  if (!transaction.date) {
    errors.push('La date est requise')
  } else {
    const date = new Date(transaction.date)
    if (isNaN(date.getTime())) {
      errors.push('La date est invalide')
    }
  }

  // Vérifier la catégorie
  if (!transaction.category) {
    errors.push('La catégorie est requise')
  }

  return errors
}

// Sanitization
export function sanitizeTransaction(transaction: Partial<Transaction>): Partial<Transaction> {
  const sanitized: Partial<Transaction> = { ...transaction }

  // Nettoyer l'ID
  if (sanitized.id) {
    sanitized.id = sanitized.id.trim()
  }

  // Nettoyer le type
  if (sanitized.type) {
    sanitized.type = sanitized.type.toLowerCase() as TransactionType
  }

  // Nettoyer la description
  if (sanitized.description) {
    sanitized.description = sanitized.description.trim()
  }

  // Nettoyer le montant
  if (typeof sanitized.amount === 'string') {
    sanitized.amount = parseFloat(sanitized.amount)
  }

  // Nettoyer la date
  if (sanitized.date) {
    const date = new Date(sanitized.date)
    if (!isNaN(date.getTime())) {
      sanitized.date = date.toISOString().split('T')[0]
    }
  }

  // Nettoyer la catégorie
  if (sanitized.category) {
    sanitized.category = sanitized.category.trim()
  }

  return sanitized
} 