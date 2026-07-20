export const defaultCertificateData = {
  trackingId: '91100091761714',
  crmsNo: 'B130317876',
  oldRegNo: 'BR-4123',
  oldCrmsNo: '',
  officeBlock: 'NEELAM BLOCK_301277',
  unionCouncilNo: '219',
  secretaryTitleUr: 'سیکرٹری یونین کونسل نب',
  officeUr: 'نیلم بلاک لاہور',

  childNameEn: 'Muhammad Hussain',
  childNameUr: 'محمد حسین',
  dateOfBirth: '10-Sep-2025',
  genderEn: 'Male',
  genderUr: 'مرد',
  religionEn: 'Islam',
  religionUr: 'اسلام',
  districtOfBirthEn: 'Lahore',
  districtOfBirthUr: 'لہور',

  fatherNameEn: 'Muhammad Umar But',
  fatherNameUr: 'محمد عمر بٹ',
  fatherNationalityEn: 'Pakistani',
  fatherNationalityUr: 'پاکستانی',
  fatherCnic: '35202-8698810-5',

  motherNameEn: 'Farah',
  motherNameUr: 'فرح',
  motherNationalityEn: 'Pakistani',
  motherNationalityUr: 'پاکستانی',
  motherCnic: '35202-2709555-4',

  grandfatherNameEn: 'Asghar Hussain',
  grandfatherNameUr: 'اصغر حسین',
  grandfatherCnic: '35202-2667312-5',

  addressEn: ', House No. 21/A , Street 2 , Muhallah Clifon colony , City Lahore',
  addressUr: 'مکان نمبر 21/اے ، اسٹریٹ 2 ، محلہ کلفٹن کالونی ، شہر لہور',
  tehsilEn: 'Lahore City',
  tehsilUr: 'لہور',
  districtEn: 'Lahore',
  districtUr: 'لہور',

  applicantNameEn: 'Khalid Mahmood',
  applicantNameUr: 'خالد محمود',
  applicantCnic: '35202-2551832-1',
  relationEn: 'Grand Son (Maternal)',
  relationUr: 'نواسا',

  entryDate: '04-Jul-2026',
  issueDate: '04-Jul-2026',
  entryStatusEn: 'Normal',
  entryStatusUr: 'نارمل',

  qrValue: '91100091761714',
};

export const formSections = [
  {
    id: 'metadata',
    title: 'Certificate Info',
    icon: '📋',
    description: 'Official tracking numbers shown at the top of the certificate',
    fields: [
      { key: 'trackingId', label: 'Tracking ID', placeholder: '91100091761714', required: true, hint: 'Top-left on certificate' },
      { key: 'crmsNo', label: 'CRMS No.', placeholder: 'B130317876', required: true },
      { key: 'oldRegNo', label: 'OLD/M REG #', placeholder: 'BR-4123' },
      { key: 'oldCrmsNo', label: 'Old CRMS No.', placeholder: 'Leave blank if not applicable', required: false },
      { key: 'officeBlock', label: 'Office Block', placeholder: 'NEELAM BLOCK_301277', required: true },
      { key: 'qrValue', label: 'QR Code Value', placeholder: 'Usually same as Tracking ID', hint: 'Auto-sync available below', required: false },
    ],
  },
  {
    id: 'child',
    title: "Child's Details",
    icon: '👶',
    description: 'Basic information about the child',
    fields: [
      { key: 'childNameEn', label: 'Name', lang: 'en', pairKey: 'childNameUr', placeholder: 'Muhammad Hussain', required: true },
      { key: 'childNameUr', label: 'Name', lang: 'ur', pairKey: 'childNameEn', placeholder: 'محمد حسین', required: true },
      { key: 'dateOfBirth', label: 'Date of Birth', date: true, required: true, fullWidth: true },
      { key: 'genderEn', label: 'Gender', lang: 'en', pairKey: 'genderUr', select: 'gender', required: true },
      { key: 'genderUr', label: 'Gender', lang: 'ur', pairKey: 'genderEn', select: 'gender', required: true },
      { key: 'religionEn', label: 'Religion', lang: 'en', pairKey: 'religionUr', select: 'religion', required: true },
      { key: 'religionUr', label: 'Religion', lang: 'ur', pairKey: 'religionEn', select: 'religion', required: true },
      { key: 'districtOfBirthEn', label: 'District of Birth', lang: 'en', pairKey: 'districtOfBirthUr', placeholder: 'Lahore', required: true },
      { key: 'districtOfBirthUr', label: 'District of Birth', lang: 'ur', pairKey: 'districtOfBirthEn', placeholder: 'لہور', required: true },
    ],
  },
  {
    id: 'parents',
    title: 'Parental Info',
    icon: '👨‍👩‍👦',
    description: 'Father, mother, and grandfather with CNIC numbers',
    fields: [
      { key: 'fatherNameEn', label: "Father's Name", lang: 'en', pairKey: 'fatherNameUr', placeholder: 'Muhammad Umar But', required: true },
      { key: 'fatherNameUr', label: "Father's Name", lang: 'ur', pairKey: 'fatherNameEn', placeholder: 'محمد عمر بٹ', required: true },
      { key: 'fatherNationalityEn', label: 'Father Nationality', lang: 'en', pairKey: 'fatherNationalityUr', select: 'nationality', required: true },
      { key: 'fatherNationalityUr', label: 'Father Nationality', lang: 'ur', pairKey: 'fatherNationalityEn', select: 'nationality', required: true },
      { key: 'fatherCnic', label: "Father's CNIC", placeholder: '35202-8698810-5', inputMode: 'numeric', cnic: true, required: true, fullWidth: true },
      { key: 'motherNameEn', label: "Mother's Name", lang: 'en', pairKey: 'motherNameUr', placeholder: 'Farah', required: true },
      { key: 'motherNameUr', label: "Mother's Name", lang: 'ur', pairKey: 'motherNameEn', placeholder: 'فرح', required: true },
      { key: 'motherNationalityEn', label: 'Mother Nationality', lang: 'en', pairKey: 'motherNationalityUr', select: 'nationality', required: true },
      { key: 'motherNationalityUr', label: 'Mother Nationality', lang: 'ur', pairKey: 'motherNationalityEn', select: 'nationality', required: true },
      { key: 'motherCnic', label: "Mother's CNIC", placeholder: '35202-2709555-4', inputMode: 'numeric', cnic: true, required: true, fullWidth: true },
      { key: 'grandfatherNameEn', label: "Grandfather's Name", lang: 'en', pairKey: 'grandfatherNameUr', placeholder: 'Asghar Hussain', required: true },
      { key: 'grandfatherNameUr', label: "Grandfather's Name", lang: 'ur', pairKey: 'grandfatherNameEn', placeholder: 'اصغر حسین', required: true },
      { key: 'grandfatherCnic', label: "Grandfather's CNIC", placeholder: '35202-2667312-5', inputMode: 'numeric', cnic: true, required: true, fullWidth: true },
    ],
  },
  {
    id: 'address',
    title: 'Address',
    icon: '📍',
    description: 'Full residential address in both languages',
    fields: [
      { key: 'addressEn', label: 'Address', lang: 'en', type: 'textarea', placeholder: 'House No., Street, Mohallah, City...', required: true },
      { key: 'addressUr', label: 'Address', lang: 'ur', type: 'textarea', placeholder: 'مکان نمبر، اسٹریٹ، محلہ، شہر...', required: true },
      { key: 'tehsilEn', label: 'Tehsil', lang: 'en', pairKey: 'tehsilUr', placeholder: 'Lahore City', required: true },
      { key: 'tehsilUr', label: 'Tehsil', lang: 'ur', pairKey: 'tehsilEn', placeholder: 'لہور', required: true },
      { key: 'districtEn', label: 'District', lang: 'en', pairKey: 'districtUr', placeholder: 'Lahore', required: true },
      { key: 'districtUr', label: 'District', lang: 'ur', pairKey: 'districtEn', placeholder: 'لہور', required: true },
    ],
  },
  {
    id: 'applicant',
    title: 'Applicant',
    icon: '📝',
    description: 'Who is submitting this certificate request',
    fields: [
      { key: 'applicantNameEn', label: 'Applicant Name', lang: 'en', pairKey: 'applicantNameUr', placeholder: 'Khalid Mahmood', required: true },
      { key: 'applicantNameUr', label: 'Applicant Name', lang: 'ur', pairKey: 'applicantNameEn', placeholder: 'خالد محمود', required: true },
      { key: 'applicantCnic', label: 'Applicant CNIC', placeholder: '35202-2551832-1', inputMode: 'numeric', cnic: true, required: true, fullWidth: true },
      { key: 'relationEn', label: 'Relation to Child', lang: 'en', pairKey: 'relationUr', select: 'relation', required: true },
      { key: 'relationUr', label: 'Relation to Child', lang: 'ur', pairKey: 'relationEn', select: 'relation', required: true },
    ],
  },
  {
    id: 'dates',
    title: 'Dates & Status',
    icon: '📅',
    description: 'Registration and issue dates',
    fields: [
      { key: 'entryDate', label: 'Entry Date', date: true, required: true },
      { key: 'issueDate', label: 'Issue Date', date: true, required: true, copyFrom: 'entryDate', copyLabel: 'Same as Entry Date' },
      { key: 'entryStatusEn', label: 'Entry Status', lang: 'en', pairKey: 'entryStatusUr', select: 'entryStatus', required: true },
      { key: 'entryStatusUr', label: 'Entry Status', lang: 'ur', pairKey: 'entryStatusEn', select: 'entryStatus', required: true },
    ],
  },
  {
    id: 'signature',
    title: 'Signature Footer',
    icon: '✍️',
    description: 'Union council secretary line at bottom-left',
    fields: [
      { key: 'unionCouncilNo', label: 'Union Council No.', placeholder: '219', required: true },
      { key: 'secretaryTitleUr', label: 'Secretary Title', lang: 'ur', dir: 'rtl', placeholder: 'سیکرٹری یونین کونسل نب', required: true, fullWidth: true },
      { key: 'officeUr', label: 'Office / Block Name', lang: 'ur', dir: 'rtl', placeholder: 'نیلم بلاک لاہور', required: true, fullWidth: true },
    ],
  },
];

export function getAllFieldKeys() {
  return formSections.flatMap((section) => section.fields.map((field) => field.key));
}

export function getCompletionStats(data) {
  const required = getAllFieldKeys().filter((key) => {
    const field = formSections.flatMap((s) => s.fields).find((f) => f.key === key);
    return field?.required !== false;
  });
  const optional = getAllFieldKeys().filter((key) => {
    const field = formSections.flatMap((s) => s.fields).find((f) => f.key === key);
    return field?.required === false;
  });

  const filledRequired = required.filter((key) => String(data[key] ?? '').trim().length > 0).length;
  const filledOptional = optional.filter((key) => String(data[key] ?? '').trim().length > 0).length;

  return {
    filled: filledRequired + filledOptional,
    total: getAllFieldKeys().length,
    requiredFilled: filledRequired,
    requiredTotal: required.length,
    percent: required.length ? Math.round((filledRequired / required.length) * 100) : 100,
  };
}

export function getSectionCompletion(section, data) {
  const requiredFields = section.fields.filter((f) => f.required !== false);
  const filled = requiredFields.filter((field) => String(data[field.key] ?? '').trim().length > 0).length;
  return { filled, total: requiredFields.length };
}

export function getSectionById(id) {
  return formSections.find((section) => section.id === id);
}

export function clearSectionData(section, data) {
  const next = { ...data };
  section.fields.forEach((field) => {
    next[field.key] = '';
  });
  return next;
}
