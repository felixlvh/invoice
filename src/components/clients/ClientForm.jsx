import React from 'react'
import { useForm } from '@/lib/hooks/use-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

export function ClientForm({ open, onOpenChange, onSubmit, initialValues }) {
  const defaultValues = {
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
  }

  const form = useForm({
    initialValues: initialValues || defaultValues,
    validate: {
      name: (value) => !value ? 'Name is required' : null,
      email: (value) => {
        if (!value) return 'Email is required'
        if (!/^\S+@\S+$/.test(value)) return 'Invalid email address'
        return null
      }
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.validate()) {
      onSubmit(form.values)
      form.reset()
      onOpenChange(false)
    }
  }

  React.useEffect(() => {
    if (initialValues) {
      Object.keys(initialValues).forEach(key => {
        form.setFieldValue(key, initialValues[key])
      })
    }
  }, [initialValues])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialValues ? 'Edit Client' : 'Add New Client'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name *</label>
            <Input {...form.getInputProps('name')} />
            {form.errors.name && (
              <p className="text-sm text-red-500">{form.errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email *</label>
            <Input type="email" {...form.getInputProps('email')} />
            {form.errors.email && (
              <p className="text-sm text-red-500">{form.errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input type="tel" {...form.getInputProps('phone')} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Company</label>
            <Input {...form.getInputProps('company')} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <Input {...form.getInputProps('address')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {initialValues ? 'Update Client' : 'Add Client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
