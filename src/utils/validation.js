import { formSections } from '../data/defaultCertificate';

export function isValidCnic(value) {
  if (!value?.trim()) return true;
  return /^\d{5}-\d{7}-\d$/.test(value.trim());
}

export function isValidCertDate(value) {
  if (!value?.trim()) return true;
  return /^\d{1,2}-[A-Za-z]{3}-\d{4}$/.test(value.trim());
}

export function getRequiredFields() {
  return formSections.flatMap((section) =>
    section.fields.filter((field) => field.required).map((field) => ({
      ...field,
      sectionId: section.id,
      sectionTitle: section.title,
    })),
  );
}

export function getMissingRequiredFields(data) {
  return getRequiredFields().filter((field) => !String(data[field.key] ?? '').trim());
}

export function getFieldIssues(data) {
  const issues = [];

  formSections.forEach((section) => {
    section.fields.forEach((field) => {
      const value = String(data[field.key] ?? '').trim();
      if (!value) return;

      if (field.cnic && !isValidCnic(value)) {
        issues.push({
          key: field.key,
          sectionId: section.id,
          label: field.label,
          message: 'CNIC must be 35202-1234567-1 format (13 digits)',
        });
      }

      if (field.date && !isValidCertDate(value)) {
        issues.push({
          key: field.key,
          sectionId: section.id,
          label: field.label,
          message: 'Use format like 04-Jul-2026',
        });
      }
    });
  });

  return issues;
}

export function canExport(data) {
  return getMissingRequiredFields(data).length === 0 && getFieldIssues(data).length === 0;
}
