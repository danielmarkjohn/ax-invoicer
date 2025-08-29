import React, { useRef } from 'react'
import { useInvoice } from '@/store/invoiceStore'
import { exportPreviewToPDF } from '@/utils/pdf'
import { Currency } from '@/types'
export default function Toolbar() {
  const { templateId, setTemplate, data, load, reset, update } = useInvoice()
  const fileRef = useRef<HTMLInputElement>(null)
  function exportJSON() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' })
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`invoice-${data.invoiceNumber||'draft'}.json`; a.click(); URL.revokeObjectURL(url)
  }
  function importJSON(file: File) {
    const r = new FileReader()
    r.onload = () => {
      try {
        load(JSON.parse(r.result as string))
      } catch {
        alert('Invalid JSON file. You can only import files that were previously exported as JSON from this app.')
      }
    }
    r.readAsText(file)
  }
  async function exportPDF() {
    const el = document.getElementById('invoice-preview'); if(!el) return
    await exportPreviewToPDF(el, `invoice-${data.invoiceNumber||'draft'}.pdf`)
  }
  return (
    <div className="sticky top-0 z-20 bg-black/80 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-white/60">Template</span>
          <select className="bg-transparent border border-white/10 rounded px-3 py-2" value={templateId} onChange={(e)=>setTemplate(e.target.value)}>
            <option value="classic">Classic</option>
            <option value="minimal">Minimal</option>
            <option value="modern">Modern</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-white/60">Currency</span>
          <select 
            className="bg-transparent border border-white/10 rounded px-3 py-2" 
            value={data.currency} 
            onChange={(e) => update({ currency: e.target.value as Currency })}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="INR">INR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <div className="flex-1" />
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded bg-white/10 hover:bg-white/15" onClick={exportPDF}>PDF</button>
          <button className="px-4 py-2 rounded bg-white/10 hover:bg-white/15" onClick={exportJSON}>Export JSON</button>
          <button 
            className="px-4 py-2 rounded bg-white/10 hover:bg-white/15" 
            onClick={() => fileRef.current?.click()}
          >
            Import
          </button>
          <input 
            ref={fileRef} 
            type="file" 
            accept="application/json" 
            className="hidden" 
            onChange={(e) => { const f = e.target.files?.[0]; if(f) importJSON(f) }} 
          />
          <button className="px-4 py-2 rounded bg-white/10 hover:bg-white/15" onClick={reset}>Reset</button>
        </div>
      </div>
    </div>
  )
}
