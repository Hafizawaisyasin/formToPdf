import { useCallback, useRef, useState } from 'react';
import { selectOptions } from '../data/fieldOptions';
import { translateEnToUr } from '../utils/translate';
import FieldInput from './FieldInput';
import './AutoTranslatePair.css';

function UrduFieldFooter({ urKey, isOverridden, isTranslating, onSync }) {
  if (isTranslating) {
    return <span className="auto-urdu-hint auto-urdu-hint--loading">Translating to Urdu…</span>;
  }

  if (isOverridden) {
    return (
      <button type="button" className="auto-urdu-sync" onClick={() => onSync(urKey)}>
        ↻ Auto-fill Urdu from English
      </button>
    );
  }

  return <span className="auto-urdu-hint">Auto-filled from English — edit anytime</span>;
}

export function SelectBilingualPair({
  enField,
  urField,
  data,
  onBatchChange,
  onEnglishChange,
  onUrduChange,
  urOverrides,
  translatingUrKey,
  onSyncUrdu,
}) {
  const options = selectOptions[enField.select] || [];
  const enValue = data[enField.key] ?? '';
  const urValue = data[urField.key] ?? '';
  const listEnValue = options.some((opt) => opt.en === enValue) ? enValue : '';

  return (
    <div className="bilingual-pair bilingual-pair--select">
      <div className="bilingual-pair__label">
        {enField.label}
        {enField.required !== false && <span className="required-mark">*</span>}
      </div>

      <label className="field-block" htmlFor={`${enField.key}-select`}>
        <span className="lang-badge lang-badge--en">Quick pick from list</span>
        <select
          id={`${enField.key}-select`}
          className="field-control"
          value={listEnValue}
          onChange={(e) => {
            const selected = options.find((opt) => opt.en === e.target.value);
            if (selected) {
              onBatchChange({ [enField.key]: selected.en, [urField.key]: selected.ur }, urField.key);
            }
          }}
        >
          <option value="">Select…</option>
          {options.map((opt) => (
            <option key={opt.en} value={opt.en}>{opt.en}</option>
          ))}
        </select>
      </label>

      <p className="manual-entry-divider">Or type manually</p>

      <div className="bilingual-pair__inputs">
        <label className="field-block" htmlFor={enField.key}>
          <span className="lang-badge lang-badge--en">English</span>
          <input
            id={enField.key}
            type="text"
            className="field-control"
            value={enValue}
            placeholder={enField.placeholder || 'Type in English…'}
            onChange={(e) => onEnglishChange(enField.key, urField.key, e.target.value)}
          />
        </label>
        <label className="field-block" htmlFor={urField.key}>
          <span className="lang-badge lang-badge--ur">اردو</span>
          <input
            id={urField.key}
            type="text"
            className="field-control"
            dir="rtl"
            value={urValue}
            placeholder={urField.placeholder || 'اردو میں لکھیں…'}
            onChange={(e) => onUrduChange(urField.key, e.target.value)}
          />
          <UrduFieldFooter
            urKey={urField.key}
            isOverridden={Boolean(urOverrides[urField.key])}
            isTranslating={translatingUrKey === urField.key}
            onSync={onSyncUrdu}
          />
        </label>
      </div>
    </div>
  );
}

export function BilingualPair({
  enField,
  urField,
  data,
  onChange,
  onBatchChange,
  onEnglishChange,
  onUrduChange,
  urOverrides,
  translatingUrKey,
  onSyncUrdu,
}) {
  if (enField.select) {
    return (
      <SelectBilingualPair
        enField={enField}
        urField={urField}
        data={data}
        onBatchChange={onBatchChange}
        onEnglishChange={onEnglishChange}
        onUrduChange={onUrduChange}
        urOverrides={urOverrides}
        translatingUrKey={translatingUrKey}
        onSyncUrdu={onSyncUrdu}
      />
    );
  }

  return (
    <div className="bilingual-pair">
      <div className="bilingual-pair__label">
        {enField.label}
        {enField.required !== false && <span className="required-mark">*</span>}
      </div>
      <div className="bilingual-pair__inputs">
        <label className="field-block" htmlFor={enField.key}>
          <span className="lang-badge lang-badge--en">English</span>
          <FieldInput
            field={enField}
            value={data[enField.key]}
            onChange={(key, value) =>
              onEnglishChange(key, urField.key, value, enField.type === 'textarea' ? 1200 : 700)
            }
            onBatchChange={onBatchChange}
            data={data}
          />
        </label>
        <label className="field-block" htmlFor={urField.key}>
          <span className="lang-badge lang-badge--ur">اردو</span>
          <FieldInput
            field={urField}
            value={data[urField.key]}
            onChange={(key, value) => onUrduChange(key, value)}
            onBatchChange={onBatchChange}
            data={data}
          />
          <UrduFieldFooter
            urKey={urField.key}
            isOverridden={Boolean(urOverrides[urField.key])}
            isTranslating={translatingUrKey === urField.key}
            onSync={onSyncUrdu}
          />
        </label>
      </div>
    </div>
  );
}

export function useAutoUrduTranslate(data, onChange) {
  const [urOverrides, setUrOverrides] = useState({});
  const [translatingUrKey, setTranslatingUrKey] = useState(null);
  const debounceRefs = useRef({});
  const overridesRef = useRef(urOverrides);
  overridesRef.current = urOverrides;

  const clearOverrides = useCallback(() => setUrOverrides({}), []);

  const onUrduChange = useCallback(
    (urKey, value) => {
      setUrOverrides((prev) => ({ ...prev, [urKey]: true }));
      onChange((prev) => ({ ...prev, [urKey]: value }));
    },
    [onChange],
  );

  const onEnglishChange = useCallback(
    (enKey, urKey, value, delay = 700) => {
      onChange((prev) => ({ ...prev, [enKey]: value }));

      if (overridesRef.current[urKey]) return;

      clearTimeout(debounceRefs.current[urKey]);

      if (!value.trim()) {
        onChange((prev) => ({ ...prev, [urKey]: '' }));
        setTranslatingUrKey(null);
        return;
      }

      setTranslatingUrKey(urKey);
      debounceRefs.current[urKey] = setTimeout(async () => {
        const ur = await translateEnToUr(value);
        setTranslatingUrKey(null);

        if (overridesRef.current[urKey]) return;

        onChange((prev) => ({ ...prev, [urKey]: ur }));
      }, delay);
    },
    [onChange],
  );

  const onBatchChange = useCallback(
    (patch, urKeyToUnlock) => {
      if (urKeyToUnlock) {
        setUrOverrides((prev) => ({ ...prev, [urKeyToUnlock]: false }));
      }
      onChange((prev) => ({ ...prev, ...patch }));
    },
    [onChange],
  );

  const onSyncUrdu = useCallback(
    async (urKey) => {
      const enKey = urKey.replace(/Ur$/, 'En');
      const english = data[enKey] ?? '';

      setUrOverrides((prev) => ({ ...prev, [urKey]: false }));
      setTranslatingUrKey(urKey);

      const ur = await translateEnToUr(english);
      setTranslatingUrKey(null);
      onChange((prev) => ({ ...prev, [urKey]: ur }));
    },
    [data, onChange],
  );

  return {
    urOverrides,
    translatingUrKey,
    clearOverrides,
    onEnglishChange,
    onUrduChange,
    onBatchChange,
    onSyncUrdu,
  };
}
