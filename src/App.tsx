import React from 'react'
import Toolbar from '@/components/Toolbar'
import TemplateClassic from '@/components/templates/TemplateClassic'
import TemplateMinimal from '@/components/templates/TemplateMinimal'
import TemplateModern from '@/components/templates/TemplateModern'
import { useInvoice } from '@/store/invoiceStore'

export default function App() {
  const { templateId } = useInvoice()
  const render = () => {
    switch (templateId) {
      case 'classic': return <TemplateClassic />
      case 'minimal': return <TemplateMinimal />
      case 'modern': return <TemplateModern />
      default: return <TemplateClassic />
    }
  }
  return (
    <div className="min-h-screen bg-black">
      <Toolbar />
      <div className="max-w-6xl mx-auto p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">{render()}</div>
        <div className="lg:col-span-1">
          <div className="p-5 rounded-xl border border-white/10">
            <div className="font-semibold mb-2">How it works</div>
            <ol className="list-decimal list-inside text-sm text-white/80 space-y-1">
              <li>Pick a template from the top bar.</li>
              <li>Edit text directly on the invoice preview.</li>
              <li>Add line items, taxes, and your logo.</li>
              <li>Export PDF or save/load JSON drafts.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
