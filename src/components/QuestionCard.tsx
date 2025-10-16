
import type { QuizQuestion } from '../types'

type Props = {
  index: number
  total: number
  q: QuizQuestion
  selected: Set<string>
  onToggle: (key: string) => void
  onThinkToggle: () => void
  isThink: boolean
}

export default function QuestionCard({ index, total, q, selected, onToggle, onThinkToggle, isThink }: Props) {
  return (
    <div className="card">
      <div className="row" style={{justifyContent:'space-between', alignItems: 'baseline'}}>
        <h2>Câu {index+1}/{total}</h2>
        <div className="badge">{q.type === 'single' ? '1 đáp án' : 'Nhiều đáp án'}</div>
      </div>
      <div className="space" />
      <div style={{color:'#b8c2d6', fontSize:14}}>
        Scope: <b>{q.scope || 'No Scope'}</b>
      </div>
      <div className="space" />
      <div style={{fontSize:18}}>{q.content}</div>
      <div className="space" />
      <div className="choices">
        {q.choices.map((c, i) => {
          const sel = selected.has(c.key)
          return (
            <div key={i} className={['answer', sel ? 'selected' : ''].join(' ')}
                 onClick={() => onToggle(c.key)}>
              <div className="label">{String.fromCharCode(65+i)}</div>
              <div>{c.text}</div>
            </div>
          )
        })}
      </div>
      <div className="toolbar">
        <button type="button" className="ghost" onClick={onThinkToggle}>{isThink ? 'Bỏ đánh dấu' : 'Think more'}</button>
      </div>
    </div>
  )
}
