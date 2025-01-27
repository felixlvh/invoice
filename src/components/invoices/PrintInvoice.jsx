import React, { useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'

export function PrintInvoice({ invoice, company, client }) {
  const { toast } = useToast()

  const validateInvoiceData = (invoice, client) => {
    const missingFields = []
    
    // Invoice validation
    if (!invoice) {
      missingFields.push('Invoice Data')
      return missingFields
    }

    if (!invoice?.id) missingFields.push('Invoice ID')
    if (!invoice?.number) missingFields.push('Invoice Number')
    if (!invoice?.date) missingFields.push('Invoice Date')
    if (!Array.isArray(invoice?.items) || invoice.items.length === 0) missingFields.push('Invoice Items')
    
    // Client validation
    if (!client) {
      missingFields.push('Client Data')
      return missingFields
    }

    if (!client?.id) missingFields.push('Client ID')
    if (!client?.name || typeof client.name !== 'string' || client.name.trim() === '') {
      missingFields.push('Client Name')
    }
    if (!client?.address || typeof client.address !== 'string' || client.address.trim() === '') {
      missingFields.push('Client Address')
    }
    
    return missingFields
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch (error) {
      return dateString
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Move validation to useEffect to prevent render loop
  const missingFields = validateInvoiceData(invoice, client)
  
  useEffect(() => {
    if (missingFields.length > 0) {
      toast({
        title: "Invalid Invoice Data",
        description: `Missing required fields: ${missingFields.join(', ')}`,
        variant: "destructive"
      })
    }
  }, [missingFields.length]) // Only run when missingFields changes

  if (missingFields.length > 0) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-600 font-medium">Unable to generate invoice</h3>
        <p className="text-red-500 mt-2">Missing required fields:</p>
        <ul className="list-disc list-inside mt-2">
          {missingFields.map((field, index) => (
            <li key={index} className="text-red-500">{field}</li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="print-invoice bg-white p-8 max-w-4xl mx-auto">
      <div className="border-b pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
            <p className="text-gray-600 mt-1">#{invoice.number}</p>
          </div>
          {company && (
            <div className="text-right">
              {company.name && (
                <h2 className="text-xl font-semibold text-gray-900">{company.name}</h2>
              )}
              {company.address && (
                <p className="text-gray-600 whitespace-pre-line">{company.address}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-gray-600 font-medium mb-2">Bill To:</h3>
          <div className="text-gray-900">
            <p className="font-semibold">{client.name}</p>
            <p className="whitespace-pre-line">{client.address}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice Date:</span>
              <span className="text-gray-900">{formatDate(invoice.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Due Date:</span>
              <span className="text-gray-900">{formatDate(invoice.dueDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 text-left text-gray-600">Description</th>
            <th className="py-3 text-right text-gray-600">Quantity</th>
            <th className="py-3 text-right text-gray-600">Price</th>
            <th className="py-3 text-right text-gray-600">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-4 text-gray-900">{item.description}</td>
              <td className="py-4 text-right text-gray-900">{item.quantity}</td>
              <td className="py-4 text-right text-gray-900">{formatCurrency(item.price)}</td>
              <td className="py-4 text-right text-gray-900">
                {formatCurrency(item.quantity * item.price)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="py-4 text-right font-medium">Total:</td>
            <td className="py-4 text-right text-lg font-bold text-gray-900">
              {formatCurrency(invoice.total)}
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="border-t pt-6">
        <div className="text-gray-600">
          <h3 className="font-medium mb-2">Notes:</h3>
          <p>{invoice.notes || 'Thank you for your business!'}</p>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>Payment Terms: Net {invoice.paymentTerms || 30} days</p>
          <p>Please include invoice number on your payment</p>
        </div>
      </div>
    </div>
  )
}
