import React, { createContext, useContext, useState, ReactNode } from 'react';

export type QuizMode = 'exam' | 'practice';

type ModeContextType = {
  mode: QuizMode;
  setMode: (m: QuizMode) => void;
};

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<QuizMode>('exam'); // mặc định
  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useQuizMode = () => {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useQuizMode must be used within ModeProvider');
  return ctx;
};
