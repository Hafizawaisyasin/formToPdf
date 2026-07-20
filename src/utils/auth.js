export const AUTH_USER = {
  username: 'Mukhtar',
  firstName: 'Mukhtar',
  displayName: 'Mukhtar Butt',
  password: 'Butt@1234',
};

export const SYSTEM_BRIEF = {
  title: 'Birth Registration Certificate System',
  summary:
    'Create official Punjab birth registration certificates online. Fill bilingual English & Urdu details, preview the exact layout live, then print or download as PDF.',
  features: [
    'Bilingual form — English & Urdu side by side',
    'Live certificate preview with official layout',
    'Print directly or download as PDF',
    'Auto-save draft — your work is never lost',
    'CNIC formatting, date picker & smart dropdowns',
  ],
};

const SESSION_KEY = 'punjab-cert-auth-session';

export function login(username, password) {
  const normalized = username.trim().toLowerCase();
  if (normalized === AUTH_USER.username.toLowerCase() && password === AUTH_USER.password) {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        user: AUTH_USER.displayName,
        firstName: AUTH_USER.firstName,
        username: AUTH_USER.username,
        at: Date.now(),
      }),
    );
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated() {
  try {
    return Boolean(localStorage.getItem(SESSION_KEY));
  } catch {
    return false;
  }
}

export function getSessionUser() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    return session?.user || AUTH_USER.displayName;
  } catch {
    return AUTH_USER.displayName;
  }
}

export function getWelcomeName() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    return session?.firstName || AUTH_USER.firstName;
  } catch {
    return AUTH_USER.firstName;
  }
}
