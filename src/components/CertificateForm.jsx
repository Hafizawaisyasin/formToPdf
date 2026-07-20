import { useMemo, useState } from 'react';
import {
  BilingualPair,
  useAutoUrduTranslate,
} from './AutoTranslatePair';
import FieldInput from './FieldInput';
import {
  clearSectionData,
  formSections,
  getCompletionStats,
  getSectionCompletion,
} from '../data/defaultCertificate';
import { getFieldIssues } from '../utils/validation';
import './AutoTranslatePair.css';
import './CertificateForm.css';

function renderSectionFields(section, data, handlers, autoUrdu, highlightedKey) {
  const { handleChange, handleBatchChange } = handlers;
  const rendered = new Set();
  const nodes = [];

  section.fields.forEach((field) => {
    if (rendered.has(field.key)) return;

    const highlight = highlightedKey === field.key ? ' field-block--highlight' : '';

    if (field.lang === 'en' && field.pairKey) {
      const urField = section.fields.find((f) => f.key === field.pairKey);
      if (urField) {
        rendered.add(field.key);
        rendered.add(urField.key);
        nodes.push(
          <div key={field.key} className={highlight ? 'field-block--highlight' : undefined}>
            <BilingualPair
              enField={field}
              urField={urField}
              data={data}
              onChange={handleChange}
              onBatchChange={autoUrdu.onBatchChange}
              onEnglishChange={autoUrdu.onEnglishChange}
              onUrduChange={autoUrdu.onUrduChange}
              urOverrides={autoUrdu.urOverrides}
              translatingUrKey={autoUrdu.translatingUrKey}
              onSyncUrdu={autoUrdu.onSyncUrdu}
            />
          </div>,
        );
        return;
      }
    }

    if (field.lang === 'ur' && field.pairKey) return;

    rendered.add(field.key);
    nodes.push(
      <label
        key={field.key}
        className={`field-block${field.fullWidth ? ' field-block--full' : ''}${highlight}`}
        htmlFor={field.key}
      >
        <span className="field-label">
          {field.label}
          {field.required !== false && <span className="required-mark">*</span>}
          {field.lang === 'ur' && <span className="lang-badge lang-badge--ur inline">اردو</span>}
        </span>
        <FieldInput field={field} value={data[field.key]} onChange={handleChange} onBatchChange={handleBatchChange} data={data} />
        {field.hint && <span className="field-hint">{field.hint}</span>}
      </label>,
    );
  });

  return nodes;
}

function CertificateForm({
  data,
  onChange,
  onReset,
  onClearAll,
  syncQrWithTracking,
  onSyncQrChange,
  onGoToIssue,
}) {
  const [activeSectionId, setActiveSectionId] = useState(formSections[0].id);
  const [search, setSearch] = useState('');
  const [showTips, setShowTips] = useState(true);

  const autoUrdu = useAutoUrduTranslate(data, onChange);

  const stats = useMemo(() => getCompletionStats(data), [data]);
  const issues = useMemo(() => getFieldIssues(data), [data]);

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];

    return formSections.flatMap((section) =>
      section.fields
        .filter(
          (field) =>
            field.label.toLowerCase().includes(q) ||
            field.key.toLowerCase().includes(q) ||
            String(data[field.key] ?? '').toLowerCase().includes(q),
        )
        .map((field) => ({ section, field })),
    );
  }, [search, data]);

  const activeSection = formSections.find((s) => s.id === activeSectionId) ?? formSections[0];
  const activeIndex = formSections.findIndex((s) => s.id === activeSectionId);
  const sectionIssues = issues.filter((issue) => issue.sectionId === activeSectionId);

  const handleChange = (key, value) => {
    onChange((prev) => {
      const next = { ...prev, [key]: value };
      if (syncQrWithTracking && key === 'trackingId') {
        next.qrValue = value;
      }
      return next;
    });
  };

  const handleBatchChange = (patch) => {
    onChange((prev) => ({ ...prev, ...patch }));
  };

  const goToField = (sectionId, fieldKey) => {
    setActiveSectionId(sectionId);
    setSearch('');
    requestAnimationFrame(() => {
      document.getElementById(fieldKey)?.focus();
      document.getElementById(fieldKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const handleClearSection = () => {
    if (window.confirm(`Clear all fields in "${activeSection.title}"?`)) {
      onChange(clearSectionData(activeSection, data));
    }
  };

  const handleNext = () => {
    if (activeIndex < formSections.length - 1) {
      setActiveSectionId(formSections[activeIndex + 1].id);
    }
  };

  return (
    <div className="certificate-form">
      <div className="form-header-card">
        <div className="form-header-top">
          <div>
            <h2>Fill Certificate Data</h2>
            <p>Required fields marked with <span className="required-mark">*</span> — saved automatically</p>
          </div>
          <div className="header-actions">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                autoUrdu.clearOverrides();
                onClearAll();
              }}
              title="Start with empty form"
            >
              Clear all
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                autoUrdu.clearOverrides();
                onReset();
              }}
              title="Load sample data"
            >
              Sample data
            </button>
          </div>
        </div>

        <div className="progress-block">
          <div className="progress-meta">
            <span>{stats.requiredFilled} of {stats.requiredTotal} required fields</span>
            <span className="progress-percent">{stats.percent}% ready</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${stats.percent}%` }} />
          </div>
        </div>

        {issues.length > 0 && (
          <div className="issues-banner">
            <strong>{issues.length} field{issues.length > 1 ? 's need' : ' needs'} fixing</strong>
            <button type="button" className="link-btn" onClick={() => goToField(issues[0].sectionId, issues[0].key)}>
              Go to {issues[0].label} →
            </button>
          </div>
        )}

        {showTips && (
          <div className="tips-banner">
            <div>
              <strong>Quick tips</strong>
              <ul>
                <li>Type in English — Urdu auto-translates (you can edit Urdu anytime)</li>
                <li>Use dropdowns for common options, or type custom values manually</li>
                <li>CNIC formats itself as you type (13 digits)</li>
              </ul>
            </div>
            <button type="button" className="tips-close" onClick={() => setShowTips(false)} aria-label="Dismiss tips">×</button>
          </div>
        )}

        <div className="search-box">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            className="search-input"
            placeholder="Search any field (name, CNIC, tracking…)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {search && (
          <div className="search-results">
            {searchResults.length === 0 ? (
              <p className="search-empty">No matching fields</p>
            ) : (
              searchResults.slice(0, 8).map(({ section, field }) => (
                <button
                  key={`${section.id}-${field.key}`}
                  type="button"
                  className="search-result-item"
                  onClick={() => goToField(section.id, field.key)}
                >
                  <span className="search-result-section">{section.title}</span>
                  <span className="search-result-label">{field.label}</span>
                  <span className="search-result-value">{data[field.key] || '— empty —'}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="form-layout">
        <nav className="section-nav" aria-label="Form sections">
          {formSections.map((section) => {
            const { filled, total } = getSectionCompletion(section, data);
            const isActive = section.id === activeSectionId;
            const isComplete = filled === total;

            return (
              <button
                key={section.id}
                type="button"
                className={`section-nav-item${isActive ? ' section-nav-item--active' : ''}${isComplete ? ' section-nav-item--done' : ''}`}
                onClick={() => setActiveSectionId(section.id)}
              >
                <span className="section-nav-icon">{section.icon}</span>
                <span className="section-nav-text">
                  <span className="section-nav-title">{section.title}</span>
                  <span className="section-nav-meta">{filled}/{total} required</span>
                </span>
                <span className={`section-nav-dot${isComplete ? ' section-nav-dot--done' : ''}`} />
              </button>
            );
          })}
        </nav>

        <div className="section-panel">
          <div className="section-panel-header">
            <div>
              <span className="section-panel-icon">{activeSection.icon}</span>
              <h3>{activeSection.title}</h3>
              <p>{activeSection.description}</p>
            </div>
            <span className="section-step">Step {activeIndex + 1} / {formSections.length}</span>
          </div>

          {activeSection.id === 'metadata' && (
            <label className="sync-toggle">
              <input
                type="checkbox"
                checked={syncQrWithTracking}
                onChange={(e) => onSyncQrChange(e.target.checked)}
              />
              <span>Keep QR code synced with Tracking ID</span>
            </label>
          )}

          {sectionIssues.length > 0 && (
            <div className="section-issues">
              {sectionIssues.map((issue) => (
                <button
                  key={issue.key}
                  type="button"
                  className="section-issue-item"
                  onClick={() => goToField(issue.sectionId, issue.key)}
                >
                  {issue.label}: {issue.message}
                </button>
              ))}
            </div>
          )}

          <div className="section-fields">
            {renderSectionFields(
              activeSection,
              data,
              { handleChange, handleBatchChange },
              autoUrdu,
            )}
          </div>

          <div className="section-nav-buttons">
            <button
              type="button"
              className="btn-outline"
              disabled={activeIndex === 0}
              onClick={() => setActiveSectionId(formSections[activeIndex - 1].id)}
            >
              ← Previous
            </button>

            <button type="button" className="btn-ghost section-clear" onClick={handleClearSection}>
              Clear section
            </button>

            {activeIndex === formSections.length - 1 ? (
              <button type="button" className="btn-primary-soft" onClick={onGoToIssue}>
                Review &amp; Download →
              </button>
            ) : (
              <button type="button" className="btn-outline btn-outline--primary" onClick={handleNext}>
                Save &amp; Continue →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertificateForm;
