
import type { QuizQuestion } from '../types'

type Props = {
  questions: QuizQuestion[]
  userAnswers: Map<number, Set<string>>
  onExit: () => void
}

export default function ReviewPage({ questions, userAnswers, onExit }: Props) {
  const isCorrect = (q: QuizQuestion, set: Set<string>) => {
    if (q.type === 'single') return set.size === 1 && q.correctKeys.has(Array.from(set)[0])
    if (set.size !== q.correctKeys.size) return false
    for (const k of set) if (!q.correctKeys.has(k)) return false
    return true
  }

  return (
    <div className="card review">
      <h2>Chi tiết bài làm</h2>
      <div className="space" />
      {questions.map((q, idx) => {
        const ua = userAnswers.get(idx) || new Set<string>()
        const correct = isCorrect(q, ua)
        return (
          <div key={q.id} className="q">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div><b>Câu {idx+1}.</b> {q.content} <span className="badge">{q.scope || 'No Scope'}</span></div>
              <div className="badge">{correct ? 'Đúng' : 'Sai'}</div>
            </div>
            <div className="space" />
            {q.choices.map((c, i) => {
              const isCorrectKey = q.correctKeys.has(c.key)
              const userSelected = ua.has(c.key)
              const cls = ['ans', isCorrectKey ? 'correct' : '', (!isCorrectKey && userSelected) ? 'user-wrong' : ''].join(' ').trim()
              return (
                <div key={i} className={cls}>
                  <div className="label">{String.fromCharCode(65+i)}</div>
                  <div>{c.text}</div>
                  <div style={{marginLeft:'auto'}}>
                    {isCorrectKey && '✓'}
                    {!isCorrectKey && userSelected && '✗'}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
      <div className="row" style={{justifyContent:'flex-end'}}>
        <button className="secondary" onClick={onExit}>Đóng</button>
      </div>
    </div>
  )
}
