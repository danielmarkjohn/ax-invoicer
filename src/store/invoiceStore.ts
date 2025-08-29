import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { InvoiceData, LineItem } from '@/types'
const today = new Date().toISOString().slice(0,10)
const initial: InvoiceData = {
  invoiceTitle: 'INVOICE', invoiceNumber: 'INV-001', date: today, dueDate: today,
  seller: { name: 'Your Company', email: 'you@example.com', phone: '', address: 'Street, City' },
  buyer: { name: 'Client Name', email: 'client@example.com', address: 'Client Address' },
  items: [{ id:'1', description:'Service A', quantity:1, unitPrice:100, taxRate:0 },{ id:'2', description:'Service B', quantity:2, unitPrice:75, taxRate:0.18 }],
  notes: 'Thank you!', terms: 'Payment due within 15 days.', currency: 'USD'
}
interface State {
  data: InvoiceData; templateId: string;
  setTemplate: (id: string) => void; update: (patch: Partial<InvoiceData>) => void; setLogo: (dataUrl?: string) => void;
  addItem: () => void; updateItem: (id: string, patch: Partial<LineItem>) => void; deleteItem: (id: string) => void;
  reset: () => void; load: (data: InvoiceData) => void
}
export const useInvoice = create<State>()(persist((set,get)=> ({
  data: initial, templateId: 'classic',
  setTemplate: (id)=>set({ templateId:id }),
  update: (patch)=>set({ data: { ...get().data, ...patch } }),
  setLogo: (logo)=>set({ data: { ...get().data, logoDataUrl: logo } }),
  addItem: ()=>set({ data: { ...get().data, items: [...get().data.items, { id: (Math.random()*1e9|0).toString(), description:'', quantity:1, unitPrice:0, taxRate:0 }] } }),
  updateItem: (id,patch)=>set({ data: { ...get().data, items: get().data.items.map(i=>i.id===id?{...i,...patch}:i) } }),
  deleteItem: (id)=>set({ data: { ...get().data, items: get().data.items.filter(i=>i.id!==id) } }),
  reset: ()=>set({ data: initial }), load: (d)=>set({ data: d })
}), { name: 'invoice-builder:v1' }))
