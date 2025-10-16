import { useState } from 'react'
import './styles.css'
import DepartmentPicker from './components/DepartmentPicker'
import Quiz from './components/Quiz'
import ReviewPage from './components/ReviewPage'
import type { Department, QuizQuestion } from './types'
import ModeToggle from './components/ModeToggle'

export default function App() {
  const [dept, setDept] = useState<Department | null>(null)
  const [reviewData, setReviewData] = useState<{ questions: QuizQuestion[], answers: Map<number, Set<string>> } | null>(null)

  function handleStart(d: Department) {
    setDept(d)
    setReviewData(null)
  }

  function handleExit() {
    setDept(null)
    setReviewData(null)
  }

  function handleReview(qs: QuizQuestion[], answers: Map<number, Set<string>>) {
    setDept(null)
    setReviewData({ questions: qs, answers })
  }

  const toggleDisabled = !!dept || !!reviewData; // vào bài hoặc đang review -> khóa toggle

  return (
    <div className="container">
      <header className="row app-header" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h1>Internal Quiz</h1>
        <ModeToggle disabled={toggleDisabled} />
      </header>

      {!dept && !reviewData && <DepartmentPicker onStart={handleStart} />}
      {dept && !reviewData && <Quiz dept={dept} onExit={handleExit} onReview={handleReview} />}
      {reviewData && !dept && (
        <ReviewPage
          questions={reviewData.questions}
          userAnswers={reviewData.answers}
          onExit={() => setReviewData(null)}
        />
      )}

      <footer className="mt-6 text-center text-sm opacity-70">
        © Internal Quiz • Built with React + Vite
      </footer>
    </div>
  )
}
