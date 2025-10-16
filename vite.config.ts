import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Đặt base = '/InternalExam/' đúng tên repo
export default defineConfig({
  plugins: [react()],
  base: '/InternalExam/',
})
