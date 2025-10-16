
import { useEffect, useState } from 'react'
import type { Department, DepartmentsPayload } from '../types'

type Props = {
  onStart: (dept: Department) => void
}

export default function DepartmentPicker({ onStart }: Props) {
  const [data, setData] = useState<DepartmentsPayload | null>(null)
  const [deptId, setDeptId] = useState('')

  useEffect(() => {
    async function load() {
      const res = await fetch(`${import.meta.env.BASE_URL}data/departments.json`)
      const json = await res.json()
      setData(json)
    }
    load()
  }, [])

  if (!data) return <div className="card">Đang tải danh sách bộ phận...</div>

  const dept = data.departments.find(d => d.id === deptId) || null

  return (
    <div className="card">
      <h1>Chọn bộ phận để bắt đầu</h1>
      <div className="space" />
      <select value={deptId} onChange={e => setDeptId(e.target.value)}>
        <option value="">-- Chọn bộ phận --</option>
        {data.departments.map(d => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>
      {dept && (
        <>
          <div className="space" />
          <div className="badge">Số scope: {dept.scopes.length}</div>
          <div className="space" />
          <div style={{fontSize:14, color:'#b8c2d6'}}>Bao gồm: {dept.scopes.join(' • ')}</div>
        </>
      )}
      <div className="space" />
      <button disabled={!dept} onClick={() => dept && onStart(dept)}>Bắt đầu làm bài</button>
      <div className="space" />
      <footer>50 câu • 25 phút • Câu hỏi phân bổ đều theo scope</footer>
    </div>
  )
}
