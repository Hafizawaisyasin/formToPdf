import { useState } from 'react';
import CertificatePreview from './CertificatePreview';
import './PreviewPanel.css';

function PreviewPanel({
  printRef,
  data,
  mobileView,
  onMobileViewChange,
  readyToExport,
  missingCount,
  onDownload,
  onPrint,
  isExporting,
}) {
  const [zoom, setZoom] = useState(null);

  const zoomStyle = zoom ? { transform: `scale(${zoom})` } : undefined;

  return (
    <div className="preview-panel">
      <div className="preview-toolbar">
        <div className="preview-toolbar-left">
          <h2>Live Preview</h2>
          <span className={`preview-badge${readyToExport ? ' preview-badge--ok' : ''}`}>
            {readyToExport ? 'Ready to print' : `${missingCount} fields missing`}
          </span>
        </div>

        <div className="preview-toolbar-right">
          <div className="zoom-control desktop-only">
            <button type="button" className="icon-btn" onClick={() => setZoom((z) => Math.max(0.45, (z ?? 0.78) - 0.05))} aria-label="Zoom out">−</button>
            <input
              type="range"
              min="45"
              max="100"
              value={Math.round((zoom ?? 0.78) * 100)}
              onChange={(e) => setZoom(Number(e.target.value) / 100)}
              aria-label="Preview zoom"
            />
            <button type="button" className="icon-btn" onClick={() => setZoom((z) => Math.min(1, (z ?? 0.78) + 0.05))} aria-label="Zoom in">+</button>
          </div>

          <div className="mobile-view-toggle" role="tablist" aria-label="Layout view">
            {[
              { id: 'form', label: 'Form' },
              { id: 'split', label: 'Split' },
              { id: 'preview', label: 'Preview' },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={mobileView === id}
                className={mobileView === id ? 'view-btn active' : 'view-btn'}
                onClick={() => onMobileViewChange(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="preview-stage">
        <div className="preview-paper-wrap" style={zoomStyle}>
          <div className="preview-paper-shadow">
            <CertificatePreview ref={printRef} data={data} />
          </div>
        </div>
      </div>

      <div className="preview-footer">
        <p>{readyToExport ? 'Certificate looks complete. Export when ready.' : 'Fill all required fields in the form to unlock export.'}</p>
        <div className="preview-footer-actions">
          <button type="button" className="btn-outline" onClick={onPrint}>Print</button>
          <button type="button" className="btn-primary-soft" onClick={onDownload} disabled={isExporting}>
            {isExporting ? 'Generating…' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreviewPanel;
