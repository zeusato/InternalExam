import { useEffect, useMemo, useRef, useState } from 'react'
import type { Department, RawQuestion, QuizQuestion } from '../types'
import { toQuizQuestion, sample, shuffle } from '../utils'
import QuestionCard from './QuestionCard'
import QuestionMap from './QuestionMap'
import ResultsModal from './ResultsModal'

type Props = {
  dept: Department
  onExit: () => void
  onReview: (questions: QuizQuestion[], answers: Map<number, Set<string>>) => void
}

const TOTAL_QUESTIONS = 50
const TOTAL_SECONDS = 25 * 60

function normScope(s: string | null | undefined) {
  return (s ?? '').trim().toLowerCase()
}

export default function Quiz({ dept, onExit, onReview }: Props) {
  // ✅ Không dùng null nữa
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Map<number, Set<string>>>(new Map())
  const [thinkSet, setThinkSet] = useState<Set<number>>(new Set())
  const [seconds, setSeconds] = useState(TOTAL_SECONDS)
  const [showResult, setShowResult] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      const res = await fetch(`${import.meta.env.BASE_URL}data/questions.json`)
      const raw: RawQuestion[] = await res.json()

      // Chuẩn hoá scope
      const deptScopesNorm = dept.scopes.map(normScope)
      const rawWithNorm = raw.map(q => ({ ...q, scope: q.scope, _normScope: normScope(q.scope) } as RawQuestion & { _normScope: string }))

      // Tạo pool theo scope (dùng scope đã chuẩn hoá)
      const perScope = new Map<string, (RawQuestion & { _normScope: string })[]>()
      for (const s of deptScopesNorm) perScope.set(s, [])
      for (const q of rawWithNorm) {
        if (!q._normScope) continue
        if (perScope.has(q._normScope)) perScope.get(q._normScope)!.push(q)
      }

      // Phân bổ
      const scopes = deptScopesNorm.length > 0 ? deptScopesNorm : []
      let picked: (RawQuestion & { _normScope: string })[] = []

      if (scopes.length > 0) {
        const base = Math.floor(TOTAL_QUESTIONS / scopes.length)
        let remainder = TOTAL_QUESTIONS - base * scopes.length

        for (const s of scopes) {
          const pool = perScope.get(s) || []
          const need = base
          const pack = sample(pool, Math.min(need, pool.length))
          picked = picked.concat(pack)
        }

        // Rải phần dư
        const shuffledScopes = shuffle(scopes)
        for (let i = 0; i < remainder; i++) {
          const s = shuffledScopes[i % shuffledScopes.length]
          const pool = (perScope.get(s) || []).filter(x => !picked.includes(x))
          const add = sample(pool, 1)
          if (add.length) picked.push(add[0])
        }

        // Nếu vẫn thiếu, backfill từ tất cả câu thuộc các scope của bộ phận
        while (picked.length < TOTAL_QUESTIONS) {
          const globalPool = rawWithNorm.filter(x => scopes.includes(x._normScope) && !picked.includes(x))
          if (globalPool.length === 0) break
          picked.push(sample(globalPool, 1)[0])
        }
      }

      // Fallback cuối: nếu vẫn trống (scope không khớp), lấy toàn bộ đề
      if (picked.length === 0) {
        const backup = sample(rawWithNorm, Math.min(TOTAL_QUESTIONS, rawWithNorm.length))
        picked = backup
      }

      // Cắt đúng 50
      picked = picked.slice(0, Math.min(TOTAL_QUESTIONS, picked.length))

      const quiz = picked.map(q => toQuizQuestion(q))
      setQuestions(quiz)
      setIdx(0)
      setAnswers(new Map())
      setThinkSet(new Set())
      setSeconds(TOTAL_SECONDS)
      setShowResult(false)
      setIsLoading(false)
    }
    load()
  }, [dept])

  // Đếm ngược
  useEffect(() => {
    if (isLoading) return
    if (seconds <= 0) {
      handleSubmit(true)
      return
    }
    timerRef.current = window.setTimeout(() => setSeconds(s => s - 1), 1000) as unknown as number
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [seconds, isLoading])

  const answeredSet = useMemo(() => {
    return new Set(Array.from(answers.entries()).filter(([i, set]) => set.size > 0).map(([i]) => i))
  }, [answers])

  if (isLoading) return <div className="card">Đang chuẩn bị đề thi...</div>

  if (questions.length === 0) {
    return (
      <div className="card">
        <h2>Không tìm thấy câu hỏi phù hợp</h2>
        <div className="space" />
        <div style={{ color: '#b8c2d6' }}>
          Có thể tên scope trong bộ câu hỏi không khớp với scope của bộ phận đã chọn.
        </div>
        <div className="space" />
        <button className="ghost" onClick={onExit}>Quay lại</button>
      </div>
    )
  }

  const current = questions[idx]
  const selected = answers.get(idx) || new Set<string>()
  const formatTime = (t: number) => {
    const m = Math.floor(t / 60).toString().padStart(2, '0')
    const s = (t % 60).toString().padStart(2, '0')
    return m + ':' + s
  }

  function toggle(key: string) {
    setAnswers(prev => {
      const next = new Map(prev)
      const s = new Set(next.get(idx) || [])
      if (current.type === 'single') {
        s.clear()
        s.add(key)
      } else {
        if (s.has(key)) s.delete(key); else s.add(key)
      }
      next.set(idx, s)
      return next
    })
  }

  function toggleThink() {
    setThinkSet(prev => {
      const n = new Set(prev)
      if (n.has(idx)) n.delete(idx); else n.add(idx)
      return n
    })
  }

  function jump(i: number) { setIdx(i) }

  function grade() {
    let correct = 0
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const ua = answers.get(i) || new Set<string>()
      if (q.type === 'single') {
        if (ua.size === 1 && q.correctKeys.has(Array.from(ua)[0])) correct++
      } else {
        if (ua.size === q.correctKeys.size) {
          let ok = true
          for (const k of ua) if (!q.correctKeys.has(k)) { ok = false; break }
          if (ok) correct++
        }
      }
    }
    return correct
  }

  function handleSubmit(auto = false) {
    if (!auto) {
      const ok = confirm('Xác nhận nộp bài? Bạn sẽ không thể chỉnh sửa sau khi nộp.')
      if (!ok) return
    }
    setShowResult(true)
  }

  function exitToHome() {
    setShowResult(false)
    onExit()
  }

  function goReview() {
    setShowResult(false)
    // ✅ questions là QuizQuestion[] chắc chắn
    onReview(questions, answers)
  }

  const correct = grade()

  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr 320px' }}>
      <div style={{ display: 'grid', gap: 12 }}>
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><b>{dept.name}</b></div>
          <div>Thời gian còn lại: <span className="timer">{formatTime(seconds)}</span></div>
        </div>
        <QuestionCard
          index={idx}
          total={questions.length}
          q={current}
          selected={selected}
          onToggle={toggle}
          onThinkToggle={toggleThink}
          isThink={thinkSet.has(idx)}
        />
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <button className="ghost" onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}>← Back</button>
          <div className="row">
            <button className="secondary" onClick={() => setIdx(i => Math.min(questions.length - 1, i + 1))} disabled={idx === questions.length - 1}>Next →</button>            
          </div>
        </div>
      </div>
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div><b>Question Map</b></div>
          <div className="badge">{answeredSet.size}/{questions.length} đã trả lời</div>
        </div>
        <div className="space" />
        <QuestionMap total={questions.length} answeredSet={answeredSet} thinkSet={thinkSet} current={idx} onJump={jump} />
        <div className="divider" />
        <div className="row" style={{ justifyContent: 'space-between' }}>
          {/* <button className="ghost" onClick={onExit}>Thoát</button> */}
          <div style={{ color: '#b8c2d6', fontSize: 12 }}>• Xám: chưa làm • Xanh: đã chọn • Cam: Think more</div>
        </div>
        <div className="row" style={{ justifyContent: 'space-between', marginTop: 'auto' }}>
          <button onClick={() => handleSubmit(false)}>Nộp bài</button>
          <button className="ghost" onClick={onExit}>Thoát</button>
        </div>
      </div>
      <ResultsModal open={showResult} correct={correct} total={questions.length} onClose={exitToHome} onReview={goReview} />
    </div>
  )
}
