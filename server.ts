import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { PUBLIC_SERVICES_CATALOG } from './src/data/servicesData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'CivicAssist AI Server',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Deterministic fallback matching based on knowledge base rules
function fallbackServiceMatch(query: string, language: string) {
  const q = query.toLowerCase().trim();
  const scored = PUBLIC_SERVICES_CATALOG.map((svc) => {
    let score = 0;
    let matchReasons: string[] = [];

    // Check keyword rules
    for (const rule of svc.whyRelevantRules) {
      if (q.includes(rule.toLowerCase())) {
        score += 30;
        matchReasons.push(`Matches keyword criteria: "${rule}"`);
      }
    }

    // Check service name or category in query
    if (q.includes(svc.category.toLowerCase())) {
      score += 20;
      matchReasons.push(`Category alignment with ${svc.category}`);
    }

    // Heuristics for common queries
    if (
      (q.includes('college') || q.includes('fees') || q.includes('फीस') || q.includes('scholarship') || q.includes('छात्रवृत्ति')) &&
      svc.id === 'post-matric-scholarship'
    ) {
      score += 45;
      matchReasons.push('Direct match for higher education financial assistance & scholarship');
    }

    if (
      (q.includes('income') || q.includes('आय') || q.includes('tehsildar') || q.includes('तहसीलदार') || q.includes('aay')) &&
      svc.id === 'income-cert'
    ) {
      score += 50;
      matchReasons.push('Direct match for official income verification certificate');
    }

    if (
      (q.includes('pension') || q.includes('पेंशन') || q.includes('old age') || q.includes('senior') || q.includes('बुजुर्ग')) &&
      svc.id === 'old-age-pension'
    ) {
      score += 50;
      matchReasons.push('Matches social security pension for senior citizens');
    }

    if (
      (q.includes('driving') || q.includes('license') || q.includes('licence') || q.includes('गाड़ी') || q.includes('ड्राइविंग')) &&
      svc.id === 'driving-licence'
    ) {
      score += 50;
      matchReasons.push('Matches Parivahan driving licence services');
    }

    if (
      (q.includes('business') || q.includes('loan') || q.includes('shop') || q.includes('दुकान') || q.includes('msme') || q.includes('udyam')) &&
      svc.id === 'udyam-msme-reg'
    ) {
      score += 50;
      matchReasons.push('Matches MSME enterprise registration & credit benefits');
    }

    if (
      (q.includes('health') || q.includes('hospital') || q.includes('इलाज') || q.includes('hospitalization') || q.includes('ayushman')) &&
      svc.id === 'pm-ayushman-bharat'
    ) {
      score += 50;
      matchReasons.push('Matches PM-JAY ₹5 Lakh cashless hospital coverage');
    }

    if (
      (q.includes('house') || q.includes('घर') || q.includes('makaan') || q.includes('awas') || q.includes('आवास')) &&
      svc.id === 'pm-awas-yojana'
    ) {
      score += 50;
      matchReasons.push('Matches PMAY affordable housing grant');
    }

    if (
      (q.includes('birth') || q.includes('जन्म') || q.includes('baby') || q.includes('बच्चे')) &&
      svc.id === 'birth-certificate-crs'
    ) {
      score += 50;
      matchReasons.push('Matches Civil Registration System birth certification');
    }

    if (
      (q.includes('domicile') || q.includes('निवास') || q.includes('residence') || q.includes('मूल निवास')) &&
      svc.id === 'domicile-cert'
    ) {
      score += 50;
      matchReasons.push('Matches state domicile and permanent residency proof');
    }

    if (
      (q.includes('caste') || q.includes('जाति') || q.includes('obc') || q.includes('sc') || q.includes('st')) &&
      svc.id === 'caste-cert'
    ) {
      score += 50;
      matchReasons.push('Matches constitutional caste/community reservation certificates');
    }

    return {
      service: svc,
      relevanceScore: Math.min(score, 98),
      whyRelevant:
        matchReasons.length > 0
          ? matchReasons.join('. ')
          : `Relevant for citizens needing ${svc.category} services.`,
    };
  });

  // Filter and sort
  const matches = scored.filter((s) => s.relevanceScore > 20).sort((a, b) => b.relevanceScore - a.relevanceScore);
  const matchedServices = matches.length > 0 ? matches.slice(0, 3) : [scored[0]];

  // Generate localized intent summary
  let intentSummary = `Identified citizen need relating to: "${query}"`;
  if (language === 'hi') {
    intentSummary = `नागरिक की आवश्यकता की पहचान की गई: "${query}"। संबंधित सार्वजनिक सेवाओं की सूची नीचे दी गई है।`;
  } else if (language === 'bn') {
    intentSummary = `নাগরিকের প্রয়োজন চিহ্নিত হয়েছে: "${query}"। প্রাসঙ্গিক সরকারি পরিষেবার তালিকা নিচে দেওয়া হলো।`;
  } else if (language === 'te') {
    intentSummary = `పౌరుడి అవసరం గుర్తించబడింది: "${query}". సంబంధిత ప్రజా సేవల జాబితా క్రింద ఇవ్వబడింది.`;
  }

  // Follow-up clarifying questions
  const suggestedQuestions = [
    'Are you a regular enrolled student in the current academic year?',
    'Which State or Union Territory is your permanent domicile?',
    'What is your approximate annual family income bracket (e.g., Below ₹2.5 Lakh, ₹2.5L - ₹8L)?',
    'Do you already possess a valid Aadhaar linked to your active mobile number?',
  ];

  const primarySvc = matchedServices[0].service;
  const missingDocName = primarySvc.requiredDocuments.find((d) => d.category === 'Income')?.name || 'Income Proof';

  const actionPlan = [
    {
      id: 1,
      title: 'Complete eligibility verification',
      description: 'Confirm state residency and family income limits as specified in the service guidelines.',
      actionType: 'check_eligibility' as const,
      isComplete: false,
    },
    {
      id: 2,
      title: `Prepare mandatory documents (e.g. ${missingDocName})`,
      description: 'Ensure original copies and digital scans of required proofs are in place.',
      actionType: 'prepare_document' as const,
      isComplete: false,
    },
    {
      id: 3,
      title: 'Open verified official government portal',
      description: `Proceed directly to ${primarySvc.source} at ${primarySvc.officialPortalUrl} without paying unauthorized agents.`,
      actionType: 'visit_portal' as const,
      isComplete: false,
    },
  ];

  return {
    intentSummary,
    matchedServices,
    suggestedQuestions,
    actionPlan,
    detectedCategory: primarySvc.category,
  };
}

// Main AI Service Discovery Endpoint
app.post('/api/analyze-need', async (req, res) => {
  const { query, language = 'en', userProfile, answers } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  // If Gemini API is available, use gemini-3.8-flash for rich multilingual intent understanding
  if (ai) {
    try {
      const catalogSummary = PUBLIC_SERVICES_CATALOG.map((s) => ({
        id: s.id,
        name: s.serviceName,
        category: s.category,
        rules: s.whyRelevantRules,
        description: s.description,
        incomeLimit: s.incomeLimitINR,
        portal: s.officialPortalUrl,
      }));

      const systemPrompt = `You are CivicAssist AI, an expert, trustworthy Indian Public Service Navigator.
Your role:
1. Understand the citizen's real-life problem expressed in natural language in any Indian language or English.
2. Match them STRICTLY to one or more relevant services from the provided Official Public Services Catalog.
3. NEVER invent fake government schemes or fabricate URLs. Use ONLY official information from the catalog.
4. Provide structured intent understanding, why each service is relevant, minimal follow-up clarifying questions (max 3-4, no sensitive PII), and "Your Next 3 Actions".
5. Return all human-facing text translated accurately into the user's requested language (${language}), preserving official government service names in native script or official title, and keeping URLs intact without translating URLs.

Services Catalog:
${JSON.stringify(catalogSummary, null, 2)}

Respond ONLY with valid JSON conforming to this schema:
{
  "intentSummary": "string in requested language summarizing citizen intent",
  "matchedServiceIds": [
    {
      "id": "service id from catalog",
      "relevanceScore": number between 60 and 99,
      "whyRelevant": "clear concise explanation in requested language"
    }
  ],
  "suggestedQuestions": [
    "clarifying question 1 in requested language",
    "clarifying question 2 in requested language",
    "clarifying question 3 in requested language"
  ],
  "actionPlan": [
    {
      "id": 1,
      "title": "Action 1 title in requested language",
      "description": "Action 1 description in requested language",
      "actionType": "check_eligibility"
    },
    {
      "id": 2,
      "title": "Action 2 title in requested language",
      "description": "Action 2 description in requested language",
      "actionType": "prepare_document"
    },
    {
      "id": 3,
      "title": "Action 3 title in requested language",
      "description": "Action 3 description in requested language",
      "actionType": "visit_portal"
    }
  ],
  "detectedCategory": "string category from catalog"
}`;

      const userPrompt = `Citizen Query: "${query}"
User Language: "${language}"
Context: ${JSON.stringify({ userProfile, answers })}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text?.trim();
      if (responseText) {
        const parsed = JSON.parse(responseText);
        
        // Map matched IDs back to full service objects
        const matchedServices = (parsed.matchedServiceIds || [])
          .map((m: { id: string; relevanceScore: number; whyRelevant: string }) => {
            const svc = PUBLIC_SERVICES_CATALOG.find((s) => s.id === m.id);
            if (!svc) return null;
            return {
              service: svc,
              relevanceScore: m.relevanceScore || 85,
              whyRelevant: m.whyRelevant || 'Relevant for citizen request.',
            };
          })
          .filter(Boolean);

        if (matchedServices.length > 0) {
          return res.json({
            intentSummary: parsed.intentSummary || `Matched service for: "${query}"`,
            matchedServices,
            suggestedQuestions: parsed.suggestedQuestions || [],
            actionPlan: parsed.actionPlan || [],
            detectedCategory: parsed.detectedCategory || matchedServices[0].service.category,
            sourceEngine: 'gemini-3.8-flash',
          });
        }
      }
    } catch (err) {
      console.error('Gemini API call failed, falling back to deterministic matching:', err);
      // Fallback executes below
    }
  }

  // Deterministic fallback matching
  const fallback = fallbackServiceMatch(query, language);
  return res.json({
    ...fallback,
    sourceEngine: 'deterministic-knowledge-engine',
  });
});

// Clarify follow-up answers endpoint
app.post('/api/clarify-answers', (req, res) => {
  const { serviceId, answers, language = 'en' } = req.body;
  const service = PUBLIC_SERVICES_CATALOG.find((s) => s.id === serviceId);

  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  // Assess eligibility based on structured conditions
  let metCount = 0;
  let totalRules = service.eligibilityConditions.length;
  const reasons: string[] = [];

  service.eligibilityConditions.forEach((cond) => {
    const ans = answers?.[cond.id];
    if (ans === true || ans === 'yes' || ans === 'eligible') {
      metCount++;
      reasons.push(`✓ Satisfies requirement: ${cond.label}`);
    } else if (ans === false || ans === 'no') {
      reasons.push(`✗ Does not satisfy: ${cond.label} (${cond.criteriaText})`);
    } else {
      reasons.push(`? Pending confirmation: ${cond.label}`);
    }
  });

  const percent = totalRules > 0 ? Math.round((metCount / totalRules) * 100) : 50;
  let status: 'likely_eligible' | 'more_info_needed' | 'not_eligible' = 'more_info_needed';

  if (percent >= 80) {
    status = 'likely_eligible';
  } else if (percent === 0 && Object.keys(answers || {}).length >= 2) {
    status = 'not_eligible';
  }

  return res.json({
    serviceId,
    status,
    scorePercent: percent,
    reasons,
    disclaimer:
      'Eligibility is an informational assessment. Final eligibility is determined by the relevant competent authority.',
  });
});

// Configure Vite middlewares in dev or serve static build in prod
async function setupApp() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CivicAssist AI Server running on http://0.0.0.0:${PORT}`);
  });
}

setupApp().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
