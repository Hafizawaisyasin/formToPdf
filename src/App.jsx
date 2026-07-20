import { useCallback, useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import CertificateForm from './components/CertificateForm';
import Login from './components/Login';
import WelcomeBanner from './components/WelcomeBanner';
import PreviewPanel from './components/PreviewPanel';
import { defaultCertificateData } from './data/defaultCertificate';
import { getWelcomeName, isAuthenticated, logout } from './utils/auth';
import { downloadCertificatePdf } from './utils/pdfExport';
import { clearSavedData, loadSavedData, saveData } from './utils/storage';
import { canExport, getMissingRequiredFields } from './utils/validation';
import './App.css';

function emptyData() {
  return Object.fromEntries(Object.keys(defaultCertificateData).map((key) => [key, '']));
}

function App() {
  const [authed, setAuthed] = useState(() => isAuthenticated());
  const [welcomeName, setWelcomeName] = useState(() => getWelcomeName());
  const [freshLogin, setFreshLogin] = useState(false);

  const handleLoginSuccess = () => {
    setWelcomeName(getWelcomeName());
    setFreshLogin(true);
    setAuthed(true);
  };

  const handleLogout = () => {
    logout();
    setAuthed(false);
  };

  if (!authed) {
    return <Login onSuccess={handleLoginSuccess} />;
  }

  return (
    <CertificateApp
      welcomeName={welcomeName}
      freshLogin={freshLogin}
      onFreshLoginHandled={() => setFreshLogin(false)}
      onLogout={handleLogout}
    />
  );
}

function CertificateApp({ welcomeName, freshLogin, onFreshLoginHandled, onLogout }) {
  const [data, setData] = useState(() => loadSavedData(defaultCertificateData));
  const [syncQrWithTracking, setSyncQrWithTracking] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [mobileView, setMobileView] = useState('split');
  const [toast, setToast] = useState('');
  const [showExportBlocker, setShowExportBlocker] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const printRef = useRef(null);
  const previewRef = useRef(null);

  const showToast = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3200);
  }, []);

  useEffect(() => {
    if (freshLogin) {
      showToast(`Welcome, ${welcomeName}!`);
      onFreshLoginHandled();
    }
  }, [freshLogin, welcomeName, showToast, onFreshLoginHandled]);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const missingRequired = getMissingRequiredFields(data);
  const readyToExport = canExport(data);

  const guardExport = useCallback(() => {
    if (readyToExport) return true;
    setShowExportBlocker(true);
    return false;
  }, [readyToExport]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Birth Registration Certificate',
    pageStyle: `
      @page { size: letter portrait; margin: 0; }
      @media print { html, body { margin: 0; padding: 0; } }
    `,
    onAfterPrint: () => showToast('Print dialog opened'),
  });

  const onPrintClick = () => {
    if (!guardExport()) return;
    handlePrint();
  };

  const handleDownload = async () => {
    if (!guardExport() || !printRef.current) return;
    setIsExporting(true);
    try {
      await downloadCertificatePdf(printRef.current);
      showToast('PDF downloaded successfully');
    } catch {
      showToast('PDF export failed — please try again');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSyncQrChange = (enabled) => {
    setSyncQrWithTracking(enabled);
    if (enabled) {
      setData((prev) => ({ ...prev, qrValue: prev.trackingId }));
      showToast('QR code synced with Tracking ID');
    }
  };

  const scrollToPreview = () => {
    setMobileView('preview');
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <img src="/assets/extracted_img_1.png" alt="" className="brand-logo" aria-hidden="true" />
          <div>
            <p className="brand-kicker">Government of Punjab · Pakistan</p>
            <h1>Birth Registration Certificate</h1>
            <p className="brand-sub">Bilingual certificate generator · Fill, preview, print or download</p>
          </div>
        </div>

        <div className="header-status">
          <span className="user-badge">Welcome, {welcomeName}</span>
          <span className={`ready-badge${readyToExport ? ' ready-badge--ok' : ''}`}>
            {readyToExport ? '✓ Ready to export' : `${missingRequired.length} required field${missingRequired.length === 1 ? '' : 's'} left`}
          </span>
        </div>

        <div className="app-actions">
          <button type="button" className="btn btn-secondary" onClick={onPrintClick}>
            <span aria-hidden="true">🖨</span> Print
          </button>
          <button type="button" className="btn btn-primary" onClick={handleDownload} disabled={isExporting}>
            <span aria-hidden="true">⬇</span> {isExporting ? 'Generating…' : 'Download PDF'}
          </button>
          <button type="button" className="btn btn-logout" onClick={onLogout} title="Sign out">
            Sign Out
          </button>
        </div>
      </header>

      {showWelcome && (
        <WelcomeBanner welcomeName={welcomeName} onDismiss={() => setShowWelcome(false)} />
      )}

      <main className="app-main" data-mobile-view={mobileView}>
        <aside className="app-sidebar">
          <CertificateForm
            data={data}
            onChange={setData}
            syncQrWithTracking={syncQrWithTracking}
            onSyncQrChange={handleSyncQrChange}
            onReset={() => {
              setData(defaultCertificateData);
              saveData(defaultCertificateData);
              showToast('Sample data loaded');
            }}
            onClearAll={() => {
              if (window.confirm('Clear all fields? Your saved draft will be removed.')) {
                const blank = emptyData();
                setData(blank);
                clearSavedData();
                showToast('Form cleared — start fresh');
              }
            }}
            onGoToIssue={scrollToPreview}
          />
        </aside>

        <section className="app-preview" ref={previewRef}>
          <PreviewPanel
            printRef={printRef}
            data={data}
            mobileView={mobileView}
            onMobileViewChange={setMobileView}
            readyToExport={readyToExport}
            missingCount={missingRequired.length}
            onDownload={handleDownload}
            onPrint={onPrintClick}
            isExporting={isExporting}
          />
        </section>
      </main>

      <footer className="app-footer">
        <span>Birth Registration Certificate Generator</span>
        <span>Government of Punjab · Pakistan</span>
      </footer>

      {showExportBlocker && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="export-blocker-title">
          <div className="modal-card">
            <h3 id="export-blocker-title">Complete required fields first</h3>
            <p>Please fill these before printing or downloading:</p>
            <ul className="missing-list">
              {missingRequired.slice(0, 8).map((field) => (
                <li key={field.key}>{field.sectionTitle} → {field.label}</li>
              ))}
              {missingRequired.length > 8 && <li>…and {missingRequired.length - 8} more</li>}
            </ul>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowExportBlocker(false)}>
                Continue editing
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

export default App;
