import React from 'react'
import { useForm } from '@/lib/hooks/use-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStore } from '@/store'
import { useToast } from '@/components/ui/use-toast'
import { format } from 'date-fns'

export function EditInvoiceForm({ invoice, onClose }) {
  const updateInvoice = useStore(state => state.updateInvoice)
  const clients = useStore(state => state.clients)
  const { toast } = useToast()

  const form = useForm({
    initialValues: {
      items: invoice.items || [],
      date: format(new Date(invoice.date), 'yyyy-MM-dd'),
      dueDate: format(new Date(invoice.dueDate), 'yyyy-MM-dd'),
      status: invoice.status,
      clientId: invoice.clientId,
      number: invoice.number
    },
    validate: {
      clientId: (value) => !value ? 'Client is required' : null,
      items: (items) => {
        if (items.length === 0) return 'At least one item is required'
        for (let i = 0; i < items.length; i++) {
          if (!items[i].description) return `Description is required for item ${i + 1}`
          if (!items[i].quantity || items[i].quantity < 1) return `Valid quantity is required for item ${i + 1}`
          if (!items[i].price || items[i].price < 0) return `Valid price is required for item ${i + 1}`
        }
        return null
      },
      date: (value) => !value ? 'Invoice date is required' : null,
      dueDate: (value, values) => {
        if (!value) return 'Due date is required'
        if (new Date(value) < new Date(values.date)) return 'Due date must be after invoice date'
        return null
      },
      number: (value) => !value ? 'Invoice number is required' : null
    }
  })

  const addItem = () => {
    form.setFieldValue('items', [
      ...form.values.items,
      { description: '', quantity: 1, price: 0 }
    ])
  }

  const removeItem = (index) => {
    const newItems = [...form.values.items]
    newItems.splice(index, 1)
    form.setFieldValue('items', newItems)
  }

  const updateItem = (index, field, value) => {
    const newItems = [...form.values.items]
    newItems[index][field] = value
    form.setFieldValue('items', newItems)
  }

  const calculateTotal = () => {
    return form.values.items.reduce((sum, item) => 
      sum + (item.quantity * item.price), 0
    )
  }

  const validateItems = () => {
    const itemsError = form.validate('items')
    if (itemsError) {
      toast({
        title: "Validation Error",
        description: itemsError,
        variant: "destructive"
      })
      return false
    }
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate all fields
    if (!form.validate()) {
      const errors = Object.values(form.errors).filter(Boolean)
      toast({
        title: "Validation Error",
        description: errors[0],
        variant: "destructive"
      })
      return
    }

    // Additional validation for items
    if (!validateItems()) return

    try {
      const total = calculateTotal()
      const updatedInvoice = {
        ...invoice,
        ...form.values,
        total,
        updatedAt: new Date().toISOString()
      }
      
      updateInvoice(invoice.id, updatedInvoice)
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update invoice",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Invoice Number</label>
          <Input
            {...form.getInputProps('number')}
            readOnly
            className="bg-gray-50"
          />
          {form.errors.number && (
            <p className="text-sm text-red-500 mt-1">{form.errors.number}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Client</label>
          <select
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            {...form.getInputProps('clientId')}
          >
            <option value="">Select a client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {form.errors.clientId && (
            <p className="text-sm text-red-500 mt-1">{form.errors.clientId}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Date</label>
          <Input
            type="date"
            {...form.getInputProps('date')}
            className="border-gray-200 focus:border-blue-500"
          />
          {form.errors.date && (
            <p className="text-sm text-red-500 mt-1">{form.errors.date}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Due Date</label>
          <Input
            type="date"
            {...form.getInputProps('dueDate')}
            className="border-gray-200 focus:border-blue-500"
          />
          {form.errors.dueDate && (
            <p className="text-sm text-red-500 mt-1">{form.errors.dueDate}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">Items</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            Add Item
          </Button>
        </div>
        <div className="space-y-3">
          {form.values.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-3 rounded-lg">
              <div className="col-span-6">
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  min="1"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                  className="bg-white"
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                  className="bg-white"
                />
              </div>
              <div className="col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    ${(item.quantity * item.price).toFixed(2)}
                  </span>
                  {form.values.items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                      onClick={() => removeItem(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {form.errors.items && (
          <p className="text-sm text-red-500 mt-1">{form.errors.items}</p>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <div className="space-x-3">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            {...form.getInputProps('status')}
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <div className="text-xl font-bold text-gray-900">
          Total: ${calculateTotal().toFixed(2)}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          className="text-gray-700 border-gray-200 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Update Invoice
        </Button>
      </div>
    </form>
  )
}
