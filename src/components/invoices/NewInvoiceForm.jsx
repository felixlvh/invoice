import React from 'react'
import { useForm } from '@/lib/hooks/use-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStore } from '@/store'
import { useToast } from '@/components/ui/use-toast'
import { getNextInvoiceNumber } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { format } from 'date-fns'

export function NewInvoiceForm({ open, onOpenChange }) {
  const { addInvoice, invoices, clients, settings } = useStore()
  const { toast } = useToast()

  const nextInvoiceNumber = React.useMemo(() => 
    getNextInvoiceNumber(invoices, settings),
    [invoices, settings]
  )

  const form = useForm({
    initialValues: {
      items: [{ description: '', quantity: 1, price: 0 }],
      date: format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      status: 'draft',
      clientId: '',
      number: nextInvoiceNumber
    },
    validate: {
      clientId: (value) => {
        if (!value) return 'Client is required'
        return null
      },
      items: (items) => {
        if (!items?.length) return 'At least one item is required'
        for (const item of items) {
          if (!item.description) return 'Item description is required'
          if (item.quantity <= 0) return 'Quantity must be greater than 0'
          if (item.price < 0) return 'Price cannot be negative'
        }
        return null
      },
      date: (value) => {
        if (!value) return 'Date is required'
        return null
      },
      dueDate: (value, values) => {
        if (!value) return 'Due date is required'
        if (new Date(value) < new Date(values.date)) {
          return 'Due date cannot be before invoice date'
        }
        return null
      }
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const isValid = form.validate()
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive"
      })
      return
    }

    try {
      const total = form.values.items.reduce((sum, item) => 
        sum + (item.quantity * item.price), 0
      )

      const invoice = {
        ...form.values,
        total,
        status: 'draft',
        createdAt: new Date().toISOString()
      }

      addInvoice(invoice)
      
      toast({
        title: "Success",
        description: "Invoice created successfully"
      })
      
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating invoice:', error)
      toast({
        title: "Error",
        description: "Failed to create invoice. Please try again.",
        variant: "destructive"
      })
    }
  }

  const addItem = () => {
    form.setFieldValue('items', [
      ...form.values.items,
      { description: '', quantity: 1, price: 0 }
    ])
  }

  const removeItem = (index) => {
    form.setFieldValue('items', 
      form.values.items.filter((_, i) => i !== index)
    )
  }

  const updateItem = (index, field, value) => {
    const newItems = [...form.values.items]
    newItems[index] = {
      ...newItems[index],
      [field]: value
    }
    form.setFieldValue('items', newItems)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Client</label>
              <select
                {...form.getInputProps('clientId')}
                className="w-full border rounded-md p-2"
              >
                <option value="">Select Client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              {form.errors.clientId && (
                <p className="text-red-500 text-sm mt-1">{form.errors.clientId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Invoice Number</label>
              <Input
                {...form.getInputProps('number')}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input
                type="date"
                {...form.getInputProps('date')}
              />
              {form.errors.date && (
                <p className="text-red-500 text-sm mt-1">{form.errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <Input
                type="date"
                {...form.getInputProps('dueDate')}
              />
              {form.errors.dueDate && (
                <p className="text-red-500 text-sm mt-1">{form.errors.dueDate}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Items</h3>
              <Button type="button" onClick={addItem} variant="outline">
                Add Item
              </Button>
            </div>

            {form.values.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-start">
                <div className="col-span-6">
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeItem(index)}
                    disabled={form.values.items.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            {form.errors.items && (
              <p className="text-red-500 text-sm">{form.errors.items}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Invoice</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
