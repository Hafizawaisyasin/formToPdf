import { formatCnic, getFieldError } from './fieldUtils';
import { isValidCnic } from '../utils/validation';
import { certDateToIso, isoToCertDate, todayCertDate } from '../utils/dateFormat';

export default function FieldInput({ field, value, onChange, onBatchChange, data }) {
  const isUrdu = field.lang === 'ur' || field.dir === 'rtl';
  const error = getFieldError(field, value);
  const displayValue = value ?? '';

  if (field.date) {
    return (
      <div className="date-field">
        <input
          id={field.key}
          type="date"
          className={`field-control${error ? ' field-control--error' : ''}`}
          value={certDateToIso(displayValue)}
          onChange={(e) => onChange(field.key, isoToCertDate(e.target.value))}
        />
        <span className="date-preview">{displayValue || 'Pick a date ↑'}</span>
        {!displayValue && (
          <button type="button" className="mini-btn" onClick={() => onChange(field.key, todayCertDate())}>
            Use today
          </button>
        )}
        {field.copyFrom && (
          <button
            type="button"
            className="mini-btn"
            onClick={() => onChange(field.key, data[field.copyFrom] || '')}
            disabled={!data[field.copyFrom]}
          >
            {field.copyLabel || 'Copy from previous'}
          </button>
        )}
        {error && <span className="field-error">{error}</span>}
      </div>
    );
  }

  const commonProps = {
    id: field.key,
    value: displayValue,
    placeholder: field.placeholder || '',
    dir: isUrdu ? 'rtl' : 'ltr',
    inputMode: field.inputMode,
    className: `field-control${error ? ' field-control--error' : ''}`,
    onChange: (e) => {
      let next = e.target.value;
      if (field.cnic) next = formatCnic(next);
      onChange(field.key, next);
    },
  };

  return (
    <>
      {field.type === 'textarea' ? (
        <textarea {...commonProps} rows={3} />
      ) : (
        <input type="text" {...commonProps} />
      )}
      {field.cnic && displayValue && (
        <span className={`cnic-status${isValidCnic(displayValue) ? ' cnic-status--ok' : ''}`}>
          {isValidCnic(displayValue) ? '✓ Valid CNIC format' : `${displayValue.replace(/\D/g, '').length}/13 digits`}
        </span>
      )}
      {error && <span className="field-error">{error}</span>}
    </>
  );
}
