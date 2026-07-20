import { isValidCertDate, isValidCnic } from '../utils/validation';

export function formatCnic(value) {
  const digits = value.replace(/\D/g, '').slice(0, 13);
  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}

export function getFieldError(field, value) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return '';

  if (field.cnic && !isValidCnic(trimmed)) {
    return 'Enter 13 digits — format: 35202-1234567-1';
  }
  if (field.date && !isValidCertDate(trimmed)) {
    return 'Invalid date on certificate';
  }
  return '';
}
