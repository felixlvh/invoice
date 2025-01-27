import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStore } from '@/store'

export function Stats() {
  const invoices = useStore(state => state.invoices)

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0)
  const overdue = invoices.filter(inv => inv.status === 'overdue').length
  const pending = invoices.filter(inv => inv.status === 'sent').length
  const paid = invoices.filter(inv => inv.status === 'paid').length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pending}</div>
          <p className="text-xs text-muted-foreground">
            {pending} invoices awaiting payment
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{overdue}</div>
          <p className="text-xs text-muted-foreground">
            {overdue} invoices overdue
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Paid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">{paid}</div>
          <p className="text-xs text-muted-foreground">
            {paid} invoices paid this month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
