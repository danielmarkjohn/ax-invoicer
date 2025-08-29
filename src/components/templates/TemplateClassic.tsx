import React from 'react'
import { useInvoice } from '@/store/invoiceStore'
import ContentEditable from '@/components/ContentEditable'
export default function TemplateClassic() {
  const { data, update, setLogo, addItem, updateItem } = useInvoice()
  const currency = data.currency
  const fmt = (n:number)=> new Intl.NumberFormat(undefined,{style:'currency',currency}).format(n)
  const sub = data.items.reduce((a,i)=>a+i.quantity*i.unitPrice,0)
  const tax = data.items.reduce((a,i)=>a+(i.taxRate||0)*i.quantity*i.unitPrice,0)
  const total = sub + tax
  return (
    <div className="bg-white text-black p-8 rounded-xl shadow max-w-[794px] mx-auto" id="invoice-preview">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {data.logoDataUrl ? <img src={data.logoDataUrl} className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400">Logo</span>}
          </div>
          <div>
            <div className="text-2xl font-bold"><ContentEditable value={data.seller.name} onChange={(v)=>update({ seller: { ...data.seller, name: v } })} placeholder="Company Name" /></div>
            <div className="text-sm text-gray-600"><ContentEditable value={data.seller.address||''} onChange={(v)=>update({ seller: { ...data.seller, address: v } })} placeholder="Address" /></div>
            <div className="text-sm text-gray-600"><ContentEditable value={data.seller.email||''} onChange={(v)=>update({ seller: { ...data.seller, email: v } })} placeholder="Email" /></div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold tracking-wide"><ContentEditable value={data.invoiceTitle} onChange={(v)=>update({ invoiceTitle: v })} /></div>
          <div className="text-sm text-gray-600">No: <ContentEditable value={data.invoiceNumber} onChange={(v)=>update({ invoiceNumber: v })} /></div>
          <div className="text-sm text-gray-600">Date: <ContentEditable value={data.date} onChange={(v)=>update({ date: v })} /></div>
          <div className="text-sm text-gray-600">Due: <ContentEditable value={data.dueDate} onChange={(v)=>update({ dueDate: v })} /></div>
          <label className="text-xs text-blue-600 underline cursor-pointer mt-2 inline-block">Upload Logo
            <input type="file" accept="image/*" className="hidden" onChange={(e)=>{const f=e.target.files?.[0]; if(!f)return; const r=new FileReader(); r.onload=()=>setLogo(r.result as string); r.readAsDataURL(f)}} />
          </label>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div>
          <div className="font-semibold mb-1">Bill From</div>
          <div className="text-sm text-gray-700">
            <ContentEditable value={data.seller.phone||''} onChange={(v)=>update({ seller: { ...data.seller, phone: v } })} placeholder="Phone" />
            <ContentEditable value={data.seller.gstin||''} onChange={(v)=>update({ seller: { ...data.seller, gstin: v } })} placeholder="GSTIN / Tax ID" />
          </div>
        </div>
        <div>
          <div className="font-semibold mb-1">Bill To</div>
          <div className="text-base font-semibold"><ContentEditable value={data.buyer.name} onChange={(v)=>update({ buyer: { ...data.buyer, name: v } })} placeholder="Client Name" /></div>
          <div className="text-sm text-gray-700">
            <ContentEditable value={data.buyer.address||''} onChange={(v)=>update({ buyer: { ...data.buyer, address: v } })} placeholder="Client Address" />
            <ContentEditable value={data.buyer.email||''} onChange={(v)=>update({ buyer: { ...data.buyer, email: v } })} placeholder="Client Email" />
          </div>
        </div>
      </div>
      <table className="w-full mt-8 border-t border-b">
        <thead><tr className="text-left text-sm text-gray-600">
          <th className="py-2">Description</th><th className="py-2 w-20">Qty</th><th className="py-2 w-32">Unit Price</th><th className="py-2 w-24">Tax</th><th className="py-2 w-32 text-right">Amount</th>
        </tr></thead>
        <tbody>
          {data.items.map(i => (
            <tr key={i.id} className="border-t">
              <td className="py-2"><input className="w-full outline-none" value={i.description} onChange={e=>updateItem(i.id,{ description: e.target.value })} placeholder="Item description" /></td>
              <td className="py-2"><input type="number" className="w-full outline-none" value={i.quantity} onChange={e=>updateItem(i.id,{ quantity: Number(e.target.value) })} /></td>
              <td className="py-2"><input type="number" className="w-full outline-none" value={i.unitPrice} onChange={e=>updateItem(i.id,{ unitPrice: Number(e.target.value) })} /></td>
              <td className="py-2"><input type="number" className="w-full outline-none" value={i.taxRate ?? 0} step={0.01} onChange={e=>updateItem(i.id,{ taxRate: Number(e.target.value) })} /></td>
              <td className="py-2 text-right">{fmt(i.quantity*i.unitPrice*(1+(i.taxRate||0)))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 ml-auto w-72">
        <div className="flex justify-between py-1"><span>Subtotal</span><span>{fmt(sub)}</span></div>
        <div className="flex justify-between py-1"><span>Tax</span><span>{fmt(tax)}</span></div>
        <div className="flex justify-between py-2 text-lg font-semibold border-t mt-2"><span>Total</span><span>{fmt(total)}</span></div>
      </div>
      <div className="mt-6">
        <div className="font-semibold">Notes</div>
        <ContentEditable value={data.notes||''} onChange={(v)=>update({ notes: v })} placeholder="Notes..." multiline className="text-sm text-gray-700" />
      </div>
      <div className="mt-4">
        <div className="font-semibold">Terms</div>
        <ContentEditable value={data.terms||''} onChange={(v)=>update({ terms: v })} placeholder="Terms..." multiline className="text-sm text-gray-700" />
      </div>
    </div>
  )
}
