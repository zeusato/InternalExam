
type Props = {
  total: number
  answeredSet: Set<number>
  thinkSet: Set<number>
  current: number
  onJump: (index: number) => void
}

export default function QuestionMap({ total, answeredSet, thinkSet, current, onJump }: Props) {
  const cells = Array.from({ length: total }, (_, i) => i)
  return (
    <div className="map">
      {cells.map(i => {
        const cls = [
          'cell',
          answeredSet.has(i) ? 'answered' : '',
          thinkSet.has(i) ? 'think' : '',
          i === current ? 'current' : '',
        ].join(' ').trim()
        return (
          <div key={i} className={cls} onClick={() => onJump(i)} title={`Câu ${i+1}`}>
            {i+1}
          </div>
        )
      })}
    </div>
  )
}
