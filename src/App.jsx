import React, { useState } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Stats } from './components/dashboard/Stats'
import { RecentInvoices } from './components/dashboard/RecentInvoices'
import { NewInvoiceForm } from './components/invoices/NewInvoiceForm'
import { InvoiceTable } from './components/invoices/InvoiceTable'
import { ClientTable } from './components/clients/ClientTable'
import { ClientForm } from './components/clients/ClientForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useStore } from './store'
import { useToast } from './components/ui/use-toast'
import { ToastProvider } from './components/ui/toast'

export default function App() {
  const [newInvoiceOpen, setNewInvoiceOpen] = useState(false)
  const [newClientOpen, setNewClientOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const addClient = useStore(state => state.addClient)
  const { toast } = useToast()

  const handleAddClient = (client) => {
    addClient(client)
    toast({
      title: "Client Added",
      description: "New client has been successfully added.",
    })
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">
        <div className="flex-col">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <div className="text-xl font-bold">Invoice Manager</div>
              <div className="ml-auto flex items-center">
                <Button onClick={() => setNewInvoiceOpen(true)}>
                  New Invoice
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="clients">Clients</TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard">
                <div className="flex items-center justify-between space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                </div>
                <div className="space-y-4">
                  <Stats />
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <RecentInvoices />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="invoices">
                <div className="flex items-center justify-between space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
                </div>
                <InvoiceTable />
              </TabsContent>
              <TabsContent value="clients">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
                  <Button onClick={() => setNewClientOpen(true)}>
                    Add Client
                  </Button>
                </div>
                <ClientTable />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <NewInvoiceForm 
          open={newInvoiceOpen}
          onOpenChange={setNewInvoiceOpen}
        />
        <ClientForm
          open={newClientOpen}
          onOpenChange={setNewClientOpen}
          onSubmit={handleAddClient}
        />
      </div>
    </ToastProvider>
  )
}
