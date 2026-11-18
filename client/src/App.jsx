import { useCallback, useEffect, useState } from 'react'
import { ArrowDownRight, BookOpen, Check, CircleHelp, Command, Inbox, RefreshCw } from 'lucide-react'
import AnswerPanel from './components/AnswerPanel.jsx'
import IngestForm from './components/IngestForm.jsx'
import ItemsList from './components/ItemsList.jsx'
import QuestionInput from './components/QuestionInput.jsx'
import { askQuestion, getErrorMessage, getItems, saveNote, saveUrl } from './services/api.js'

export default function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [asking, setAsking] = useState(false)
  const [answer, setAnswer] = useState(null)
  const [notice, setNotice] = useState(null)

  const refreshItems = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getItems()
      setItems(data.items || [])
      setNotice(null)
    } catch (error) {
      setNotice({ type: 'error', text: `Could not load your inbox. ${getErrorMessage(error)}` })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { Promise.resolve().then(refreshItems) }, [refreshItems])

  async function handleSave(kind, value) {
    setSaving(true)
    setNotice(null)
    try {
      if (kind === 'note') await saveNote(value)
      else await saveUrl(value)
      await refreshItems()
      setNotice({ type: 'success', text: kind === 'note' ? 'Note saved to your inbox.' : 'Page imported and saved.' })
      return true
    } catch (error) {
      setNotice({ type: 'error', text: getErrorMessage(error) })
      return false
    } finally {
      setSaving(false)
    }
  }

  async function handleAsk(question) {
    setAsking(true)
    setNotice(null)
    try {
      const result = await askQuestion(question)
      setAnswer(result)
      return true
    } catch (error) {
      setNotice({ type: 'error', text: getErrorMessage(error) })
      return false
    } finally {
      setAsking(false)
    }
  }

  return <div className="min-h-screen bg-[#f7f7f4] text-stone-900">
    <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-[#f7f7f4]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Knowledge Inbox home">
          <span className="grid size-8 place-items-center rounded-xl bg-emerald-800 text-white"><Inbox size={16} strokeWidth={2.2} /></span>
          <span className="text-sm font-semibold tracking-tight">knowledge<span className="text-emerald-800">inbox</span></span>
        </a>
        <div className="flex items-center gap-2">
          
          <button onClick={refreshItems} title="Refresh library" aria-label="Refresh library" className="grid size-9 place-items-center rounded-lg text-stone-500 transition hover:bg-white hover:text-stone-900"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} /></button>
          <span className="grid size-8 place-items-center rounded-full bg-[#e6d9c8] text-[10px] font-bold text-stone-700">KI</span>
        </div>
      </div>
    </header>

    <main id="top" className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pt-11 lg:px-8">
      <section className="relative mb-8 overflow-hidden rounded-3xl bg-[#163e34] px-6 py-7 text-white sm:px-9 sm:py-9">
        <div className="pointer-events-none absolute -right-10 -top-24 size-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-2 -top-16 size-56 rounded-full border border-white/10" />
        <div className="relative max-w-xl">
          
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Keep what matters.<br className="hidden sm:block" /> Find it when you need it.</h1>
          <p className="mt-3 max-w-md text-xs leading-5 text-emerald-100/75 sm:text-sm">Save notes and useful pages. Ask a question later and get an answer grounded in your own library.</p>
        </div>
        <div className="relative mt-6 flex items-center gap-2 text-[10px] text-emerald-100/70 sm:absolute sm:bottom-8 sm:right-9 sm:mt-0"><BookOpen size={13} /> {loading ? 'Syncing your library' : `${items.length} ${items.length === 1 ? 'item' : 'items'} in your library`} <ArrowDownRight size={13} /></div>
      </section>

      {notice && <div role="status" className={`mb-5 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-xs ${notice.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
        {notice.type === 'error' ? <CircleHelp className="mt-0.5 shrink-0" size={15} /> : <Check className="mt-0.5 shrink-0" size={15} />}
        <span>{notice.text}</span>
      </div>}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.9fr)]">
        <div className="space-y-6">
          <IngestForm onSave={handleSave} saving={saving} />
          <ItemsList items={items} loading={loading} onAsk={(title) => handleAsk(`What should I know about ${title}?`)} />
        </div>
        <aside className="space-y-4 lg:sticky lg:top-24">
          <QuestionInput onAsk={handleAsk} asking={asking} />
          <AnswerPanel result={answer} />
        </aside>
      </div>

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-stone-200 pt-5 text-[10px] text-stone-400">
        <span className="inline-flex items-center gap-1.5"><Command size={11} /> Notes and links, made searchable.</span>
      </footer>
    </main>
  </div>
}
