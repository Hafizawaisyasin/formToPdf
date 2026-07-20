import { useState } from 'react';
import { AUTH_USER, login, SYSTEM_BRIEF } from '../utils/auth';
import './Login.css';

function Login({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    window.setTimeout(() => {
      if (login(username, password)) {
        onSuccess();
      } else {
        setError('Invalid username or password. Please try again.');
        setIsSubmitting(false);
      }
    }, 350);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <img src="/assets/extracted_img_1.png" alt="Government of Punjab" className="login-logo" />
          <p className="login-kicker">Government of Punjab · Pakistan</p>
          <h1>Birth Registration Certificate</h1>
          <p className="login-tagline">Official bilingual certificate generator</p>
        </div>

        <div className="login-brief">
          <h3>{SYSTEM_BRIEF.title}</h3>
          <p>{SYSTEM_BRIEF.summary}</p>
          <ul>
            {SYSTEM_BRIEF.features.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Sign in to continue</h2>
          <p className="login-sub">Enter your credentials to access the certificate generator.</p>

          <label className="login-field">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Mukhtar"
              autoComplete="username"
              required
            />
          </label>

          <label className="login-field">
            <span>Password</span>
            <div className="password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          {error && <p className="login-error" role="alert">{error}</p>}

          <button type="submit" className="login-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <footer className="login-footer">
          <span>© {new Date().getFullYear()} · Government of Punjab Certificate System</span>
        </footer>
      </div>
    </div>
  );
}

export default Login;
