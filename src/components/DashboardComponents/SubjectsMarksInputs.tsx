import styles from "../../styles/DashboardPages/CreateResult.module.scss";
// SubjectMarksInput.tsx
const SubjectMarksInput = ({
  label,
  value,
  maxValue,
  onChange,
  step = 1,
  disabled = false,
}: {
  label: string;
  value: number;
  maxValue: number;
  onChange: (value: number) => void;
  step?: number;
  disabled?: boolean;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return; // ✅ Prevent changes if disabled
    let newValue = Number(e.target.value);
    if (isNaN(newValue)) newValue = 0;
    if (newValue < 0) newValue = 0;
    if (newValue > maxValue) newValue = maxValue;
    if (step === 0.5) {
      newValue = Math.round(newValue * 2) / 2;
    }
    onChange(newValue);
  };

  return (
    <div className={styles.marksInput}>
      <label>
        {label} ({maxValue})
      </label>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        min={0}
        max={maxValue}
        step={step}
        disabled={disabled}
      />
    </div>
  );
};

export default SubjectMarksInput;
