export const selectOptions = {
  gender: [
    { en: 'Male', ur: 'مرد' },
    { en: 'Female', ur: 'عورت' },
    { en: 'Other', ur: 'دیگر' },
  ],
  religion: [
    { en: 'Islam', ur: 'اسلام' },
    { en: 'Christianity', ur: 'عیسائیت' },
    { en: 'Hinduism', ur: 'ہندو مذہب' },
    { en: 'Sikhism', ur: 'سکھ مذہب' },
    { en: 'Other', ur: 'دیگر' },
  ],
  nationality: [
    { en: 'Pakistani', ur: 'پاکستانی' },
    { en: 'Afghan', ur: 'افغان' },
    { en: 'Other', ur: 'دیگر' },
  ],
  entryStatus: [
    { en: 'Normal', ur: 'نارمل' },
    { en: 'Late', ur: 'تاخیر شدہ' },
    { en: 'Corrected', ur: 'درست شدہ' },
  ],
  relation: [
    { en: 'Father', ur: 'والد' },
    { en: 'Mother', ur: 'والدہ' },
    { en: 'Grand Son (Maternal)', ur: 'نواسا' },
    { en: 'Grand Son (Paternal)', ur: 'پوتا' },
    { en: 'Grand Daughter (Maternal)', ur: 'نواسی' },
    { en: 'Grand Daughter (Paternal)', ur: 'پوتی' },
    { en: 'Uncle (Paternal)', ur: 'چچا' },
    { en: 'Uncle (Maternal)', ur: 'ماموں' },
    { en: 'Other', ur: 'دیگر' },
  ],
};

/** Old/wrong Urdu values → corrected (for saved drafts) */
export const urduValueCorrections = {
  اسلم: 'اسلام',
  عیسایت: 'عیسائیت',
  'ہندو مت': 'ہندو مذہب',
  'سکھ مت': 'سکھ مذہب',
  'تاخیر سے': 'تاخیر شدہ',
  'چacha / ماموں': 'چچا',
};

export function correctUrduValue(value) {
  if (!value?.trim()) return value;
  return urduValueCorrections[value.trim()] ?? value;
}

export function migrateUrduFields(data) {
  const next = { ...data };

  Object.keys(next).forEach((key) => {
    if (key.endsWith('Ur') && typeof next[key] === 'string') {
      const corrected = correctUrduValue(next[key]);
      if (corrected !== next[key]) next[key] = corrected;
    }
  });

  Object.values(selectOptions).flat().forEach(({ en, ur }) => {
    Object.keys(next).forEach((enKey) => {
      if (!enKey.endsWith('En') || next[enKey] !== en) return;
      const urKey = enKey.replace(/En$/, 'Ur');
      if (next[urKey] && urduValueCorrections[next[urKey]]) {
        next[urKey] = ur;
      }
    });
  });

  if (next.relationEn === 'Uncle') {
    next.relationEn = 'Uncle (Paternal)';
    if (!next.relationUr || /chacha|چacha/i.test(next.relationUr)) {
      next.relationUr = 'چچا';
    }
  }

  return next;
}
