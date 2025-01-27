import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function generateInvoiceNumber(prefix, lastNumber) {
  // Extract the numeric part and increment
  const currentNumber = lastNumber ? parseInt(lastNumber.replace(/[^\d]/g, '')) : 0
  const nextNumber = currentNumber + 1
  
  // Pad with zeros to ensure 3 digits
  return `${prefix}${String(nextNumber).padStart(3, '0')}`
}

export function validateInvoiceNumber(number, existingNumbers) {
  if (!number) return false
  if (existingNumbers.includes(number)) return false
  
  // Check format (e.g., INV-001)
  const pattern = /^[A-Z]+-\d{3,}$/
  return pattern.test(number)
}

export function getNextInvoiceNumber(invoices, settings) {
  const numbers = invoices.map(inv => inv.number)
  const lastNumber = numbers.length > 0 ? 
    numbers.sort((a, b) => {
      const aNum = parseInt(a.replace(/[^\d]/g, ''))
      const bNum = parseInt(b.replace(/[^\d]/g, ''))
      return bNum - aNum
    })[0] : null
    
  return generateInvoiceNumber(settings.invoicePrefix, lastNumber)
}
