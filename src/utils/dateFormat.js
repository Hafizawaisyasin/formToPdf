const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function certDateToIso(certDate) {
  if (!certDate?.trim()) return '';
  const match = certDate.trim().match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
  if (!match) return '';

  const day = match[1].padStart(2, '0');
  const monthIndex = MONTHS.findIndex((m) => m.toLowerCase() === match[2].toLowerCase());
  if (monthIndex === -1) return '';

  const month = String(monthIndex + 1).padStart(2, '0');
  return `${match[3]}-${month}-${day}`;
}

export function isoToCertDate(isoDate) {
  if (!isoDate?.trim()) return '';
  const match = isoDate.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return certDateToIso(isoDate) ? isoDate : '';

  const monthIndex = parseInt(match[2], 10) - 1;
  if (monthIndex < 0 || monthIndex > 11) return '';

  return `${parseInt(match[3], 10)}-${MONTHS[monthIndex]}-${match[1]}`;
}

export function todayCertDate() {
  return isoToCertDate(new Date().toISOString().slice(0, 10));
}
