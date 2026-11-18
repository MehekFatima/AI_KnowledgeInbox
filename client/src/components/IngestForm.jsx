import { useState } from 'react'
import { ArrowUpRight, FileText, Link2, LoaderCircle } from 'lucide-react'

export default function IngestForm({ onSave, saving }) {
  const [kind, setKind] = useState('note')
  const [value, setValue] = useState('')

  async function submit(event) {
    event.preventDefault()
    const content = value.trim()
    if (saving) return
    if (!content) {
      window.alert(kind === 'note' ? 'A note cannot be empty.' : 'A URL cannot be empty.')
      return
    }
    const saved = await onSave(kind, content)
    if (saved) setValue('')
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-stone-900">Add to your inbox</p>
          <p className="mt-1 text-xs text-stone-500">Save a thought or bring in a page.</p>
        </div>
        <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><ArrowUpRight size={18} /></span>
      </div>

      <div className="mt-5 inline-flex rounded-lg bg-stone-100 p-1" role="tablist" aria-label="Content type">
        <button type="button" role="tab" aria-selected={kind === 'note'} onClick={() => setKind('note')} className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition ${kind === 'note' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}>
          <FileText size={14} /> Note
        </button>
        <button type="button" role="tab" aria-selected={kind === 'url'} onClick={() => setKind('url')} className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition ${kind === 'url' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}>
          <Link2 size={14} /> Link
        </button>
      </div>

      {kind === 'note' ? (
        <textarea value={value} onChange={(event) => setValue(event.target.value)} maxLength={50_000} rows={5} placeholder="A thought, a meeting note, something to remember…" className="mt-3 min-h-32 w-full resize-y rounded-xl border border-stone-200 bg-stone-50/60 px-4 py-3 text-sm leading-6 text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"/>
      ) : (
        <div className="mt-3 flex min-h-32 items-center rounded-xl border border-stone-200 bg-stone-50/60 px-4 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
          <Link2 className="mr-3 shrink-0 text-stone-400" size={17} />
          <input type="url" value={value} onChange={(event) => setValue(event.target.value)} placeholder="https://example.com/article" className="w-full bg-transparent py-4 text-sm text-stone-800 outline-none placeholder:text-stone-400" />
        </div>
      )}
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-[11px] text-stone-400">{kind === 'note' ? `${value.length.toLocaleString()} / 50,000` : 'Page text is extracted automatically'}</span>
        <button type="submit" disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-lg bg-stone-900 px-4 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-45">
          {saving ? <LoaderCircle className="animate-spin" size={15} /> : <ArrowUpRight size={15} />}
          {saving ? 'Saving…' : 'Save to inbox'}
        </button>
      </div>
    </form>
  )
}
