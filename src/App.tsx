import { useState } from 'react'
import './styles.css'
import DepartmentPicker from './components/DepartmentPicker'
import Quiz from './components/Quiz'
import ReviewPage from './components/ReviewPage'
import type { Department, QuizQuestion } from './types'

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
    // Quan trọng: clear dept để block Quiz và hiển thị ReviewPage
    setDept(null)
    setReviewData({ questions: qs, answers })
  }

  return (
    <div className="container">
      {!dept && !reviewData && <DepartmentPicker onStart={handleStart} />}
      {dept && !reviewData && <Quiz dept={dept} onExit={handleExit} onReview={handleReview} />}
      {reviewData && !dept && (
        <ReviewPage questions={reviewData.questions} userAnswers={reviewData.answers} onExit={() => setReviewData(null)} />
      )}
      <footer>© Internal Quiz • Built with React + Vite</footer>
    </div>
  )
}
