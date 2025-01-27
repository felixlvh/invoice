import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { getNextInvoiceNumber } from './lib/utils'

export const useStore = create(
  persist(
    (set, get) => ({
      invoices: [],
      clients: [],
      settings: {
        companyName: '',
        logo: '',
        address: '',
        invoicePrefix: 'INV-',
        lastInvoiceNumber: null
      },
      addInvoice: (invoice) => {
        const state = get()
        const nextNumber = getNextInvoiceNumber(state.invoices, state.settings)
        
        set(state => ({
          invoices: [...state.invoices, {
            ...invoice,
            id: uuidv4(),
            number: nextNumber,
            createdAt: new Date().toISOString()
          }],
          settings: {
            ...state.settings,
            lastInvoiceNumber: nextNumber
          }
        }))
      },
      updateInvoice: (id, invoice) => set(state => ({
        invoices: state.invoices.map(inv => 
          inv.id === id ? { ...inv, ...invoice, updatedAt: new Date().toISOString() } : inv
        )
      })),
      deleteInvoice: (id) => set(state => ({
        invoices: state.invoices.filter(inv => inv.id !== id)
      })),
      addClient: (client) => set(state => ({
        clients: [...state.clients, { ...client, id: uuidv4() }]
      })),
      updateClient: (id, client) => set(state => ({
        clients: state.clients.map(c => 
          c.id === id ? { ...c, ...client } : c
        )
      })),
      deleteClient: (id) => set(state => ({
        clients: state.clients.filter(c => c.id !== id)
      })),
      updateSettings: (settings) => set(state => ({
        settings: { ...state.settings, ...settings }
      }))
    }),
    {
      name: 'invoice-storage',
      version: 2, // Increment version for store schema updates
      migrate: (persistedState, version) => {
        if (version === 1) {
          // Migration logic for adding lastInvoiceNumber
          return {
            ...persistedState,
            settings: {
              ...persistedState.settings,
              lastInvoiceNumber: null
            }
          }
        }
        return persistedState
      }
    }
  )
)
