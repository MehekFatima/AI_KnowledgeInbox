import { BookOpenText, Sparkles } from 'lucide-react'
import SourceCard from './SourceCard.jsx'

export default function AnswerPanel({ result }) {
  if (!result) return <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50/60 px-6 py-8 text-center">
    <div className="mx-auto grid size-10 place-items-center rounded-xl bg-white text-emerald-700 shadow-sm"><BookOpenText size={18} /></div>
    <p className="mt-3 text-xs font-medium text-stone-700">Your answers will show up here</p>
    <p className="mx-auto mt-1 max-w-56 text-[11px] leading-5 text-stone-400">Ask anything about your saved notes and pages. Sources are included with every answer.</p>
  </div>

  return <section aria-live="polite" className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50/60">
    <div className="flex items-center gap-2 border-b border-stone-200 bg-white px-5 py-4">
      <span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-emerald-700"><Sparkles size={14} /></span>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Answer</span>
    </div>
    <div className="px-5 py-5">
      <p className="mb-3 text-[11px] font-medium text-stone-400">{result.question}</p>
      <p className="whitespace-pre-wrap text-[13px] leading-6 text-stone-800">{result.answer}</p>
      {result.sources?.length > 0 && <div className="mt-5">
        <div className="mb-2.5 flex items-center justify-between">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">Sources</h3>
          <span className="text-[10px] text-stone-400">{result.sources.length} found</span>
        </div>
        <div className="space-y-2">{result.sources.map((source, index) => <SourceCard key={source.chunkId || source.sourceId || index} source={source} index={index} />)}</div>
      </div>}
    </div>
  </section>
}
