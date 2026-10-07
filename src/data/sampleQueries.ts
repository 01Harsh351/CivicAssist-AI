export interface SampleCitizenQuery {
  id: string;
  langCode: string;
  langName: string;
  queryText: string;
  expectedServiceId: string;
  tag: string;
}

export const SAMPLE_CITIZEN_QUERIES: SampleCitizenQuery[] = [
  {
    id: 'q-hi-fee',
    langCode: 'hi',
    langName: 'हिन्दी',
    queryText: 'मुझे कॉलेज की फीस के लिए आर्थिक सहायता चाहिए।',
    expectedServiceId: 'post-matric-scholarship',
    tag: 'शिक्षा एवं छात्रवृत्ति',
  },
  {
    id: 'q-hi-income',
    langCode: 'hi',
    langName: 'हिन्दी',
    queryText: 'मुझे कॉलेज स्कॉलरशिप के लिए आय प्रमाण पत्र चाहिए।',
    expectedServiceId: 'income-cert',
    tag: 'राजस्व प्रमाण पत्र',
  },
  {
    id: 'q-te-income',
    langCode: 'te',
    langName: 'తెలుగు',
    queryText: 'నా కాలేజ్ స్కాలర్షిప్ కోసం ఆదాయ ధృవీకరణ పత్రం కావాలి.',
    expectedServiceId: 'income-cert',
    tag: 'సర్టిఫికేట్లు',
  },
  {
    id: 'q-bn-scholarship',
    langCode: 'bn',
    langName: 'বাংলা',
    queryText: 'কলেজে ভর্তির জন্য স্কলারশিপ এবং আর্থিক সাহায্য পেতে চাই।',
    expectedServiceId: 'post-matric-scholarship',
    tag: 'শিক্ষা বৃত্তি',
  },
  {
    id: 'q-en-scholarship',
    langCode: 'en',
    langName: 'English',
    queryText: 'I need financial help for my college education.',
    expectedServiceId: 'post-matric-scholarship',
    tag: 'Higher Education',
  },
  {
    id: 'q-en-pension',
    langCode: 'en',
    langName: 'English',
    queryText: 'How to apply for monthly old age pension for my elderly parents?',
    expectedServiceId: 'old-age-pension',
    tag: 'Social Security',
  },
  {
    id: 'q-en-business',
    langCode: 'en',
    langName: 'English',
    queryText: 'I want to start a small grocery store and get a business loan.',
    expectedServiceId: 'udyam-msme-reg',
    tag: 'MSME & Business',
  },
  {
    id: 'q-en-driving',
    langCode: 'en',
    langName: 'English',
    queryText: 'I turned 18 and want to get my two wheeler driving licence.',
    expectedServiceId: 'driving-licence',
    tag: 'Transport',
  },
];
