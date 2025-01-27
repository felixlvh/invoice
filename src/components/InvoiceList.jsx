import React from 'react'
import { Table, Button, Group, Badge } from '@mantine/core'
import { format } from 'date-fns'
import { useStore } from '../store'

export function InvoiceList({ onEdit }) {
  const invoices = useStore(state => state.invoices)
  const deleteInvoice = useStore(state => state.deleteInvoice)
  const clients = useStore(state => state.clients)

  const getStatusColor = (status) => {
    const colors = {
      draft: 'gray',
      sent: 'blue',
      paid: 'green',
      overdue: 'red'
    }
    return colors[status] || 'gray'
  }

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Invoice #</Table.Th>
          <Table.Th>Client</Table.Th>
          <Table.Th>Date</Table.Th>
          <Table.Th>Due Date</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Total</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {invoices.map(invoice => (
          <Table.Tr key={invoice.id}>
            <Table.Td>{invoice.id}</Table.Td>
            <Table.Td>
              {clients.find(c => c.id === invoice.clientId)?.name}
            </Table.Td>
            <Table.Td>{format(new Date(invoice.date), 'MM/dd/yyyy')}</Table.Td>
            <Table.Td>{format(new Date(invoice.dueDate), 'MM/dd/yyyy')}</Table.Td>
            <Table.Td>
              <Badge color={getStatusColor(invoice.status)}>
                {invoice.status}
              </Badge>
            </Table.Td>
            <Table.Td>${invoice.total.toFixed(2)}</Table.Td>
            <Table.Td>
              <Group>
                <Button size="xs" onClick={() => onEdit(invoice)}>
                  Edit
                </Button>
                <Button 
                  size="xs" 
                  color="red" 
                  onClick={() => deleteInvoice(invoice.id)}
                >
                  Delete
                </Button>
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}
