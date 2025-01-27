import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStore } from '@/store'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'

export function RecentInvoices() {
  const invoices = useStore(state => state.invoices)
  const clients = useStore(state => state.clients)

  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-500',
      sent: 'bg-blue-500',
      paid: 'bg-green-500',
      overdue: 'bg-red-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  return (
    <Card className="col-span-4 md:col-span-3">
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentInvoices.map(invoice => (
            <div key={invoice.id} className="flex items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {clients.find(c => c.id === invoice.clientId)?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(invoice.date), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-4">
                <div className="text-sm font-medium">
                  ${invoice.total.toFixed(2)}
                </div>
                <Badge className={getStatusColor(invoice.status)}>
                  {invoice.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
