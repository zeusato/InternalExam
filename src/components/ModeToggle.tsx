import { useQuizMode } from '../contexts/ModeContext';

type Props = { disabled?: boolean };

export default function ModeToggle({ disabled }: Props) {
  const { mode, setMode } = useQuizMode();
  const isPractice = mode === 'practice';

  const onToggle = () => {
    if (disabled) return;
    setMode(isPractice ? 'exam' : 'practice');
  };

  return (
    <div className="mode-toggle">
      <span className={`mode-label ${!isPractice ? 'active' : ''}`}>Exam</span>

      <button
        type="button"
        onClick={onToggle}
        className={`switch ${isPractice ? 'on' : 'off'} ${disabled ? 'disabled' : ''}`}
        aria-pressed={isPractice}
        aria-label="Toggle mode"
        disabled={disabled}
      >
        <span className="knob" />
      </button>

      <span className={`mode-label ${isPractice ? 'active' : ''}`}>Practice</span>
    </div>
  );
}
