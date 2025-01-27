import React, { useState } from 'react'
import { useStore } from '@/store'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Edit2, Printer, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EditInvoiceForm } from './EditInvoiceForm'
import { PrintInvoice } from './PrintInvoice'

export function InvoiceTable() {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })
  const [filters, setFilters] = useState({ status: 'all' })
  const [searchTerm, setSearchTerm] = useState('')
  const [editDialog, setEditDialog] = useState({ open: false, invoice: null })
  const [printDialog, setPrintDialog] = useState({ open: false, invoice: null })
  
  const invoices = useStore(state => state.invoices)
  const clients = useStore(state => state.clients)
  const settings = useStore(state => state.settings)
  const deleteInvoice = useStore(state => state.deleteInvoice)

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-500',
      sent: 'bg-blue-500',
      paid: 'bg-green-500',
      overdue: 'bg-red-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const sortedInvoices = React.useMemo(() => {
    let filtered = [...invoices]
    
    if (searchTerm) {
      filtered = filtered.filter(invoice => {
        const client = clients.find(c => c.id === invoice.clientId)
        return (
          invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client?.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === filters.status)
    }

    return filtered.sort((a, b) => {
      if (sortConfig.key === 'date' || sortConfig.key === 'dueDate') {
        const dateA = new Date(a[sortConfig.key])
        const dateB = new Date(b[sortConfig.key])
        return sortConfig.direction === 'asc' 
          ? dateA - dateB 
          : dateB - dateA
      }
      
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' 
          ? a.total - b.total 
          : b.total - a.total
      }

      const compareA = a[sortConfig.key]
      const compareB = b[sortConfig.key]
      if (sortConfig.direction === 'asc') {
        return compareA > compareB ? 1 : -1
      }
      return compareA < compareB ? 1 : -1
    })
  }, [invoices, sortConfig, filters, searchTerm, clients])

  const handleEdit = (invoice) => {
    setEditDialog({ open: true, invoice: { ...invoice } })
  }

  const handlePrint = (invoice) => {
    setPrintDialog({ open: true, invoice })
  }

  const handleDelete = (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(invoiceId)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[250px]"
          />
          <select
            className="rounded-md border border-input bg-background px-3 py-2"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('number')}
              >
                Invoice #
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('date')}
              >
                Date
              </TableHead>
              <TableHead>Customer</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                Amount
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('dueDate')}
              >
                Due Date
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedInvoices.map(invoice => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.number}</TableCell>
                <TableCell>
                  {format(new Date(invoice.date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  {clients.find(c => c.id === invoice.clientId)?.name}
                </TableCell>
                <TableCell>${invoice.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(invoice)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePrint(invoice)}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(invoice.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog 
        open={editDialog.open} 
        onOpenChange={(open) => setEditDialog({ open, invoice: null })}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Invoice #{editDialog.invoice?.number}</DialogTitle>
          </DialogHeader>
          {editDialog.invoice && (
            <EditInvoiceForm 
              invoice={editDialog.invoice}
              onClose={() => setEditDialog({ open: false, invoice: null })}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={printDialog.open}
        onOpenChange={(open) => setPrintDialog({ open, invoice: null })}
      >
        <DialogContent className="max-w-5xl h-[90vh]">
          <DialogHeader>
            <DialogTitle>Print Invoice #{printDialog.invoice?.number}</DialogTitle>
          </DialogHeader>
          {printDialog.invoice && (
            <PrintInvoice
              invoice={printDialog.invoice}
              company={settings}
              client={clients.find(c => c.id === printDialog.invoice.clientId)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
