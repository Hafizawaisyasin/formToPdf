import { SYSTEM_BRIEF } from '../utils/auth';
import './WelcomeBanner.css';

function WelcomeBanner({ welcomeName, onDismiss }) {
  return (
    <div className="welcome-banner">
      <div className="welcome-banner__content">
        <p className="welcome-banner__greeting">Welcome, {welcomeName} 👋</p>
        <h2>{SYSTEM_BRIEF.title}</h2>
        <p className="welcome-banner__summary">{SYSTEM_BRIEF.summary}</p>
        <div className="welcome-banner__features">
          {SYSTEM_BRIEF.features.map((item) => (
            <span key={item} className="welcome-banner__chip">{item}</span>
          ))}
        </div>
      </div>
      <button type="button" className="welcome-banner__close" onClick={onDismiss} aria-label="Dismiss welcome message">
        ×
      </button>
    </div>
  );
}

export default WelcomeBanner;
