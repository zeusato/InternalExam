
import type { RawQuestion, QuizQuestion } from './types'

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function toQuizQuestion(raw: RawQuestion): QuizQuestion {
  const choices = Object.entries(raw.choices).map(([key, text]) => ({ key, text }))
  const shuffled = shuffle(choices)
  return {
    id: uid(),
    scope: raw.scope,
    content: raw.content,
    type: raw.type,
    choices: shuffled,
    correctKeys: new Set(raw.answers.map(a => a.toLowerCase())),
  }
}

export function sample<T>(items: T[], n: number): T[] {
  if (n >= items.length) return shuffle(items)
  return shuffle(items).slice(0, n)
}
