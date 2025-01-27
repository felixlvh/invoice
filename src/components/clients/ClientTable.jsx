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
import { Edit2, Trash2, Mail, Phone } from 'lucide-react'
import { ClientForm } from './ClientForm'
import { useToast } from '@/components/ui/use-toast'

export function ClientTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [editingClient, setEditingClient] = useState(null)
  const clients = useStore(state => state.clients)
  const updateClient = useStore(state => state.updateClient)
  const deleteClient = useStore(state => state.deleteClient)
  const { toast } = useToast()

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (client) => {
    setEditingClient(client)
  }

  const handleUpdate = (updatedClient) => {
    updateClient(editingClient.id, updatedClient)
    setEditingClient(null)
    toast({
      title: "Client Updated",
      description: "Client information has been successfully updated.",
    })
  }

  const handleDelete = (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteClient(clientId)
      toast({
        title: "Client Deleted",
        description: "Client has been successfully removed.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map(client => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{client.email}</span>
                    </div>
                    {client.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{client.phone}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{client.company || '-'}</TableCell>
                <TableCell>{client.address || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(client)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(client.id)}
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

      <ClientForm
        open={!!editingClient}
        onOpenChange={(open) => !open && setEditingClient(null)}
        onSubmit={handleUpdate}
        initialValues={editingClient}
      />
    </div>
  )
}
