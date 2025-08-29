export type Currency = 'USD' | 'EUR' | 'INR' | 'GBP'
export interface LineItem { id: string; description: string; quantity: number; unitPrice: number; taxRate?: number }
export interface Party { name: string; email?: string; phone?: string; address?: string; gstin?: string }
export interface InvoiceData {
  logoDataUrl?: string; invoiceTitle: string; invoiceNumber: string; date: string; dueDate: string;
  seller: Party; buyer: Party; items: LineItem[]; notes?: string; terms?: string; currency: Currency
}
