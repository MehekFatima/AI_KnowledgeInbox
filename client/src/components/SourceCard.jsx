import { ExternalLink, FileText, Globe2 } from 'lucide-react'

export default function SourceCard({ source, index }) {
  const isUrl = source.type === 'url'
  const Icon = isUrl ? Globe2 : FileText
  const label = source.sourceId || `S${index + 1}`
  return <article className="rounded-xl border border-stone-200 bg-white p-4">
    <div className="flex items-start gap-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-stone-100 text-stone-600"><Icon size={15} /></span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="min-w-0 truncate text-xs font-semibold text-stone-800">{source.title || 'Saved source'}</h3>
          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-800">[{label}]</span>
        </div>
        {source.url && <a href={source.url} target="_blank" rel="noreferrer" className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-[10px] text-stone-400 hover:text-emerald-700">{source.url}<ExternalLink size={10} /></a>}
      </div>
    </div>
    {source.snippet && <p className="mt-3 line-clamp-4 text-[11px] leading-5 text-stone-600">{source.snippet}</p>}
  </article>
}
