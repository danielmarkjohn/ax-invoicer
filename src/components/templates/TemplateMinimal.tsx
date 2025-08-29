import React from 'react'
import { useInvoice } from '@/store/invoiceStore'
import ContentEditable from '@/components/ContentEditable'
export default function TemplateMinimal() {
  const { data, update, addItem, updateItem } = useInvoice()
  const currency = data.currency
  const fmt = (n:number)=> new Intl.NumberFormat(undefined,{style:'currency',currency}).format(n)
  const sub = data.items.reduce((a,i)=>a+i.quantity*i.unitPrice,0)
  const tax = data.items.reduce((a,i)=>a+(i.taxRate||0)*i.quantity*i.unitPrice,0)
  const total = sub+tax
  return (
    <div className="bg-white text-black p-10 rounded-xl shadow max-w-[794px] mx-auto" id="invoice-preview">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-3xl font-bold"><ContentEditable value={data.invoiceTitle} onChange={(v)=>update({ invoiceTitle: v })} /></div>
          <div className="text-sm text-gray-600">No. <ContentEditable value={data.invoiceNumber} onChange={(v)=>update({ invoiceNumber: v })} /></div>
        </div>
        <div className="text-right text-sm text-gray-600">
          <div>Date: <ContentEditable value={data.date} onChange={(v)=>update({ date: v })} /></div>
          <div>Due: <ContentEditable value={data.dueDate} onChange={(v)=>update({ dueDate: v })} /></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 mt-8 text-sm">
        <div><div className="uppercase text-gray-500 text-xs">From</div>
          <div className="font-semibold"><ContentEditable value={data.seller.name} onChange={(v)=>update({ seller: { ...data.seller, name: v } })} /></div>
          <ContentEditable value={data.seller.address||''} onChange={(v)=>update({ seller: { ...data.seller, address: v } })} placeholder="Address" />
        </div>
        <div><div className="uppercase text-gray-500 text-xs">To</div>
          <div className="font-semibold"><ContentEditable value={data.buyer.name} onChange={(v)=>update({ buyer: { ...data.buyer, name: v } })} /></div>
          <ContentEditable value={data.buyer.address||''} onChange={(v)=>update({ buyer: { ...data.buyer, address: v } })} placeholder="Address" />
        </div>
      </div>
      <table className="w-full mt-8">
        <thead className="text-left text-xs uppercase text-gray-500">
          <tr><th className="py-2">Item</th><th className="py-2 w-24">Qty</th><th className="py-2 w-32">Price</th><th className="py-2 w-20">Tax</th><th className="py-2 w-32 text-right">Total</th></tr>
        </thead>
        <tbody>
          {data.items.map(i => (
            <tr key={i.id} className="border-t">
              <td className="py-2"><input className="w-full outline-none" value={i.description} onChange={e=>updateItem(i.id,{ description: e.target.value })} placeholder="Item" /></td>
              <td className="py-2"><input type="number" className="w-full outline-none" value={i.quantity} onChange={e=>updateItem(i.id,{ quantity: Number(e.target.value) })} /></td>
              <td className="py-2"><input type="number" className="w-full outline-none" value={i.unitPrice} onChange={e=>updateItem(i.id,{ unitPrice: Number(e.target.value) })} /></td>
              <td className="py-2"><input type="number" className="w-full outline-none" value={i.taxRate ?? 0} step={0.01} onChange={e=>updateItem(i.id,{ taxRate: Number(e.target.value) })} /></td>
              <td className="py-2 text-right">{fmt(i.quantity*i.unitPrice*(1+(i.taxRate||0)))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="text-blue-600 underline mt-2" onClick={addItem}>+ Add Item</button>
      <div className="mt-6 w-72 ml-auto">
        <div className="flex justify-between"><span>Subtotal</span><span>{fmt(sub)}</span></div>
        <div className="flex justify-between"><span>Tax</span><span>{fmt(tax)}</span></div>
        <div className="flex justify-between text-lg font-semibold border-t mt-2 pt-2"><span>Total</span><span>{fmt(total)}</span></div>
      </div>
    </div>
  )
}
