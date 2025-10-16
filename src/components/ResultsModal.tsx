
type Props = {
  open: boolean
  correct: number
  total: number
  onClose: () => void
  onReview: () => void
}

export default function ResultsModal({ open, correct, total, onClose, onReview }: Props) {
  if (!open) return null
  const wrong = total - correct
  const score = Math.round((correct / total) * 100)
  return (
    <div className="modal-backdrop">
      <div className="card modal">
        <h2>Kết quả</h2>
        <div className="space" />
        <div className="row">
          <div className="badge">Đúng: <b>{correct}</b></div>
          <div className="badge">Sai: <b>{wrong}</b></div>
          <div className="badge">Điểm: <b>{score}/100</b></div>
        </div>
        <div className="space" />
        <div className="row" style={{justifyContent:'flex-end'}}>
          <button className="ghost" onClick={onClose}>Kết thúc</button>
          <button className="secondary" onClick={onReview}>Xem chi tiết</button>
        </div>
      </div>
    </div>
  )
}
