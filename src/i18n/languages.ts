export interface LanguageInfo {
  code: string;
  nameEn: string;
  nativeName: string;
  script: string;
  isConstitutionallyRecognized: boolean;
}

export const INDIAN_LANGUAGES: LanguageInfo[] = [
  { code: 'en', nameEn: 'English', nativeName: 'English', script: 'Latin', isConstitutionallyRecognized: false },
  { code: 'hi', nameEn: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', isConstitutionallyRecognized: true },
  { code: 'bn', nameEn: 'Bengali', nativeName: 'বাংলা', script: 'Bengali', isConstitutionallyRecognized: true },
  { code: 'te', nameEn: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu', isConstitutionallyRecognized: true },
  { code: 'mr', nameEn: 'Marathi', nativeName: 'मराठी', script: 'Devanagari', isConstitutionallyRecognized: true },
  { code: 'ta', nameEn: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil', isConstitutionallyRecognized: true },
  { code: 'ur', nameEn: 'Urdu', nativeName: 'اُردُو', script: 'Perso-Arabic', isConstitutionallyRecognized: true },
  { code: 'gu', nameEn: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati', isConstitutionallyRecognized: true },
  { code: 'kn', nameEn: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada', isConstitutionallyRecognized: true },
  { code: 'ml', nameEn: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam', isConstitutionallyRecognized: true },
  { code: 'or', nameEn: 'Odia', nativeName: 'ଓଡ଼ିଆ', script: 'Odia', isConstitutionallyRecognized: true },
  { code: 'pa', nameEn: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', isConstitutionallyRecognized: true },
  { code: 'as', nameEn: 'Assamese', nativeName: 'অসমীয়া', script: 'Bengali-Assamese', isConstitutionallyRecognized: true },
  { code: 'ma', nameEn: 'Maithili', nativeName: 'मैथिली', script: 'Devanagari', isConstitutionallyRecognized: true },
  { code: 'sa', nameEn: 'Sanskrit', nativeName: 'संस्कृतम्', script: 'Devanagari', isConstitutionallyRecognized: true },
  { code: 'ks', nameEn: 'Kashmiri', nativeName: 'کٲشُر', script: 'Perso-Arabic', isConstitutionallyRecognized: true },
  { code: 'ne', nameEn: 'Nepali', nativeName: 'नेपाली', script: 'Devanagari', isConstitutionallyRecognized: true },
  { code: 'sd', nameEn: 'Sindhi', nativeName: 'سنڌي / सिंधी', script: 'Perso-Arabic / Devanagari', isConstitutionallyRecognized: true },
  { code: 'kok', nameEn: 'Konkani', nativeName: 'कोंकणी', script: 'Devanagari', isConstitutionallyRecognized: true },
  { code: 'doi', nameEn: 'Dogri', nativeName: 'डोगरी', script: 'Devanagari', isConstitutionallyRecognized: true },
  { code: 'mni', nameEn: 'Manipuri', nativeName: 'মৈতৈলোন্', script: 'Meitei Mayek / Bengali', isConstitutionallyRecognized: true },
  { code: 'brx', nameEn: 'Bodo', nativeName: 'बड़ो', script: 'Devanagari', isConstitutionallyRecognized: true },
  { code: 'sat', nameEn: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', script: 'Ol Chiki', isConstitutionallyRecognized: true },
];

export const DEFAULT_LANGUAGE = 'en';

export const getLanguageByCode = (code: string): LanguageInfo => {
  return INDIAN_LANGUAGES.find((lang) => lang.code === code) || INDIAN_LANGUAGES[0];
};
