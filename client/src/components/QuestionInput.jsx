import { useState } from 'react'
import { ArrowUp, LoaderCircle, Sparkles } from 'lucide-react'

const examples = ['What have I saved about…', 'Summarize my latest notes', 'What should I remember?']

export default function QuestionInput({ onAsk, asking, initialQuestion = '' }) {
  const [question, setQuestion] = useState('')
  async function submit(event) {
    event.preventDefault()
    const value = question.trim()
    if (!value || asking) return
    const succeeded = await onAsk(value)
    if (succeeded) setQuestion('')
  }
  return <section>
    <div className="mb-3 flex items-center gap-2">
      <span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-emerald-700"><Sparkles size={14} /></span>
      <h2 className="text-sm font-semibold text-stone-900">Ask your inbox</h2>
    </div>
    <form onSubmit={submit} className="rounded-2xl border border-stone-200 bg-white p-2 shadow-sm transition focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/10">
      <textarea value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={2000} rows={3} placeholder="Ask a question about what you’ve saved…" className="w-full resize-none bg-transparent px-3 py-3 text-sm leading-6 text-stone-800 outline-none placeholder:text-stone-400" />
      <div className="flex items-center justify-between gap-2 border-t border-stone-100 px-2 pt-2">
        <span className="px-1 text-[10px] text-stone-400">Answers are grounded in your sources.</span>
        <button type="submit" disabled={!question.trim() || asking} aria-label="Ask question" className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-700 text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40">
          {asking ? <LoaderCircle className="animate-spin" size={16} /> : <ArrowUp size={17} />}
        </button>
      </div>
    </form>
    <div className="mt-3 flex flex-wrap gap-2">{examples.map((example) => <button key={example} onClick={() => setQuestion(initialQuestion ? `${example.replace('…', '')} ${initialQuestion}` : example)} className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[10px] text-stone-500 transition hover:border-emerald-300 hover:text-emerald-800">{example}</button>)}</div>
  </section>
}
