import { useMemo, useState } from 'react'
import { FileText, Globe2, Search, Sparkles } from 'lucide-react'

function formatDate(value) {
  if (!value) return 'Recently added'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recently added'
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date)
}

export default function ItemsList({ items, loading, onAsk }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const shown = useMemo(() => items.filter((item) => {
    const matchesType = filter === 'all' || item.type === filter
    const matchesText = `${item.title || ''} ${item.sourceUrl || ''}`.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesText
  }), [filter, items, search])

  return (
    <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-5 py-5 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-stone-900">Your library</h2>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-500">{items.length}</span>
          </div>
          <p className="mt-1 text-xs text-stone-500">Everything you’ve saved, in one place.</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-stone-100 p-1">
          {[['all', 'All'], ['note', 'Notes'], ['url', 'Links']].map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)} className={`rounded-md px-2.5 py-1.5 text-[11px] font-medium transition ${filter === key ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}>{label}</button>
          ))}
        </div>
      </div>

      {items.length > 0 && <div className="relative border-b border-stone-100 px-5 py-3 sm:px-6">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a saved item…" className="w-full bg-transparent py-1 pl-7 text-xs text-stone-700 outline-none placeholder:text-stone-400" />
      </div>}

      <div className="divide-y divide-stone-100">
        {loading ? <div className="space-y-3 p-5">{[0, 1, 2].map((key) => <div key={key} className="flex animate-pulse gap-3"><div className="size-9 rounded-lg bg-stone-100" /><div className="flex-1 space-y-2 py-1"><div className="h-3 w-2/3 rounded bg-stone-100" /><div className="h-2.5 w-1/3 rounded bg-stone-100" /></div></div>)}</div>
          : shown.length ? shown.map((item) => {
            const isLink = item.type === 'url'
            const Icon = isLink ? Globe2 : FileText
            return <article key={item.id} className="group flex items-start gap-3 px-5 py-4 transition hover:bg-stone-50/70 sm:px-6">
              <div className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg ${isLink ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'}`}><Icon size={16} /></div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[13px] font-medium text-stone-800">{item.title || 'Untitled note'}</h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-stone-400">
                  <span>{isLink ? 'Web page' : 'Note'}</span><span aria-hidden="true">·</span><span>{formatDate(item.createdAt)}</span>
                  {item.chunkCount > 0 && <><span aria-hidden="true">·</span><span>{item.chunkCount} {item.chunkCount === 1 ? 'chunk' : 'chunks'}</span></>}
                </div>
                {item.sourceUrl && <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="mt-1 block truncate text-[10px] text-emerald-700 hover:underline">{item.sourceUrl}</a>}
              </div>
              <button onClick={() => onAsk(item.title || '')} aria-label={`Ask about ${item.title || 'this item'}`} title="Ask about this" className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg text-stone-300 opacity-100 transition hover:bg-emerald-50 hover:text-emerald-700 sm:opacity-0 sm:group-hover:opacity-100"><Sparkles size={15} /></button>
            </article>
          }) : <div className="px-6 py-10 text-center">
            <div className="mx-auto grid size-10 place-items-center rounded-xl bg-stone-100 text-stone-400"><Search size={17} /></div>
            <p className="mt-3 text-xs font-medium text-stone-700">{items.length ? 'No matches found' : 'Your library is ready'}</p>
            <p className="mt-1 text-[11px] text-stone-400">{items.length ? 'Try another search or filter.' : 'Save a note or link to get started.'}</p>
          </div>}
      </div>
    </section>
  )
}
