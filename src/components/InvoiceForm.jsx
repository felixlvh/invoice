import React, { useState } from 'react'
import { useForm } from '@mantine/form'
import { DateInput } from '@mantine/dates'
import { 
  TextInput, 
  NumberInput, 
  Button, 
  Stack, 
  Group,
  Select,
  Table
} from '@mantine/core'
import { useStore } from '../store'

export function InvoiceForm({ onSubmit, initialValues }) {
  const [items, setItems] = useState(initialValues?.items || [])
  const clients = useStore(state => state.clients)

  const form = useForm({
    initialValues: {
      clientId: initialValues?.clientId || '',
      date: initialValues?.date || new Date(),
      dueDate: initialValues?.dueDate || new Date(),
      status: initialValues?.status || 'draft',
      ...initialValues
    },
    validate: {
      clientId: (value) => !value ? 'Client is required' : null,
    }
  })

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }])
  }

  const updateItem = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  }

  const handleSubmit = (values) => {
    onSubmit({
      ...values,
      items,
      total: calculateTotal()
    })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Select
          label="Client"
          data={clients.map(c => ({ value: c.id, label: c.name }))}
          {...form.getInputProps('clientId')}
        />
        
        <Group grow>
          <DateInput
            label="Invoice Date"
            {...form.getInputProps('date')}
          />
          <DateInput
            label="Due Date"
            {...form.getInputProps('dueDate')}
          />
        </Group>

        <Select
          label="Status"
          data={[
            { value: 'draft', label: 'Draft' },
            { value: 'sent', label: 'Sent' },
            { value: 'paid', label: 'Paid' },
            { value: 'overdue', label: 'Overdue' }
          ]}
          {...form.getInputProps('status')}
        />

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Description</Table.Th>
              <Table.Th>Quantity</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Total</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {items.map((item, index) => (
              <Table.Tr key={index}>
                <Table.Td>
                  <TextInput
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                  />
                </Table.Td>
                <Table.Td>
                  <NumberInput
                    value={item.quantity}
                    onChange={(value) => updateItem(index, 'quantity', value)}
                    min={1}
                  />
                </Table.Td>
                <Table.Td>
                  <NumberInput
                    value={item.price}
                    onChange={(value) => updateItem(index, 'price', value)}
                    min={0}
                    precision={2}
                  />
                </Table.Td>
                <Table.Td>
                  {(item.quantity * item.price).toFixed(2)}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Button onClick={addItem} variant="outline">
          Add Item
        </Button>

        <Group justify="space-between">
          <div>Total: ${calculateTotal().toFixed(2)}</div>
          <Button type="submit">Save Invoice</Button>
        </Group>
      </Stack>
    </form>
  )
}
