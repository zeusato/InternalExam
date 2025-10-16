import { useState, useEffect } from 'react'
import type { QuizQuestion } from '../types'
import { useQuizMode } from '../contexts/ModeContext'

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
  const { mode } = useQuizMode()
  const [revealed, setRevealed] = useState(false)

  // ✅ Reset trạng thái Check khi đổi câu (Next/Back) hoặc đổi mode
  useEffect(() => {
    setRevealed(false)
  }, [q.id, index, mode])

  const hasSelection = selected.size > 0

  const onCheck = () => {
    if (mode !== 'practice') return
    if (!hasSelection) return
    setRevealed(true)
  }

  // Đổi đáp án sau khi Check -> ẩn highlight cũ để thử lại
  const handleToggle = (k: string) => {
    if (mode === 'practice' && revealed) setRevealed(false)
    onToggle(k)
  }

  return (
    <div className="card mb-2">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>{index + 1}. {q.content}</h3>
        <div style={{ color: '#b8c2d6', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>{index + 1}/{total}</span>
          {q.scope && <span className="badge">{q.scope}</span>}
        </div>
      </div>

      <div className="answers">
        {q.choices.map((c, i) => {
          const sel = selected.has(c.key)
          const isCorrect = q.correctKeys.has(c.key)
          let cls = 'answer'
          if (sel) cls += ' selected'
          if (mode === 'practice' && revealed) {
            if (isCorrect) cls += ' correct'
            if (sel && !isCorrect) cls += ' wrong'
          }
          return (
            <div key={c.key} className={cls} onClick={() => handleToggle(c.key)}>
              <div className="label">{String.fromCharCode(65 + i)}</div>
              <div>{c.text}</div>
            </div>
          )
        })}
      </div>

      <div className="toolbar">
        <button type="button" className="ghost" onClick={onThinkToggle}>
          {isThink ? 'Bỏ đánh dấu' : 'Think more'}
        </button>

        {mode === 'practice' && (
          <button
            type="button"
            onClick={onCheck}
            disabled={!hasSelection}
            style={{ marginLeft: 'auto' }}
          >
            Check
          </button>
        )}
      </div>

      {mode === 'practice' && revealed && (
        <div className="card" style={{ background: '#0f1624', border: '1px solid #1f2a3d', marginTop: 12 }}>
          <div className="row" style={{ alignItems: 'baseline', marginBottom: 6 }}>
            <div className="badge" style={{ background: 'transparent', color: '#5ad776', border: '1px solid #2c3e50' }}>
              Đáp án đúng
            </div>
          </div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {q.choices.filter(c => q.correctKeys.has(c.key)).map(c => (
              <li key={c.key} style={{ marginBottom: 6 }}>{c.text}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
