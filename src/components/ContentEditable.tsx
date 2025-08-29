import React, { useEffect, useRef } from 'react'
type Props = { value: string; onChange: (v:string)=>void; className?: string; placeholder?: string; multiline?: boolean }
export default function ContentEditable({ value, onChange, className, placeholder, multiline }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(()=>{ if(ref.current && ref.current.innerText !== value) ref.current.innerText = value },[value])
  return (
    <div ref={ref} contentEditable suppressContentEditableWarning
      onInput={()=>onChange(ref.current?.innerText ?? '')}
      onPaste={(e)=>{ e.preventDefault(); const t=e.clipboardData.getData('text/plain'); document.execCommand('insertText', false, t) }}
      className={`outline-none border-b border-transparent hover:border-black/20 focus:border-black/40 transition ${multiline?'whitespace-pre-wrap':''} ${className||''}`}
      data-placeholder={placeholder} aria-label={placeholder} />
  )
}
