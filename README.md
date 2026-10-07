# CivicAssist AI (सिविकअसिस्ट एआई)
### Smart Public Service Navigator for Indian Citizens

> **Statutory Disclosure:** CivicAssist AI is an independent citizen-assistance platform. It is not an official government website or an official portal of the Government of India.

---

## 1. Project Overview

**CivicAssist AI** is an AI-powered Smart Public Service Navigator designed specifically for Indian citizens. Unlike generic AI chatbots that simply provide text answers to questions, CivicAssist AI structures the complete citizen journey:

$$\text{Real-Life Problem} \longrightarrow \text{Statutory Service} \longrightarrow \text{Rule-Based Eligibility} \longrightarrow \text{Required Documents} \longrightarrow \text{Missing Document Identification} \longrightarrow \text{Smart Action Plan} \longrightarrow \text{Direct Official Portal} \longrightarrow \text{Journey Tracking}$$

It addresses real barriers faced by Indian citizens:
- Complex departmental jurisdictions (Central vs. State Revenue vs. Municipal).
- Application rejection due to missing statutory documents (e.g. income affidavit, parental land registry).
- Fraudulent private agent portals charging illegal fees for free government schemes.
- Linguistic barriers across non-English speaking citizens.

---

## 2. Key Features

1. **Mandatory Secure Authentication Flow**
   - Citizen login with email or 10-digit mobile number.
   - Interactive Google authentication option.
   - 3-Step signup flow capturing basic details, language preference, and confirmation.
   - Strictly collects **zero unnecessary sensitive PII** (no Aadhaar numbers or banking credentials stored).

2. **Multilingual Architecture (23 Languages)**
   - All 22 constitutionally recognized languages in the Eighth Schedule of the Indian Constitution + English:
     1. Assamese (অসমীয়া)
     2. Bengali (বাংলা)
     3. Bodo (बड़ो)
     4. Dogri (डोगरी)
     5. Gujarati (ગુજરાતી)
     6. Hindi (हिन्दी)
     7. Kannada (ಕನ್ನಡ)
     8. Kashmiri (كٲشُر)
     9. Konkani (कोंकणी)
     10. Maithili (मैथिली)
     11. Malayalam (മലയാളം)
     12. Manipuri (মৈতৈলোন্)
     13. Marathi (मराठी)
     14. Nepali (नेपाली)
     15. Odia (ଓଡ଼ିଆ)
     16. Punjabi (ਪੰਜਾਬੀ)
     17. Sanskrit (संस्कृतम्)
     18. Santali (ᱥᱟᱱᱛᱟᱲᱤ)
     19. Sindhi (سنڌي / सिंधी)
     20. Tamil (தமிழ்)
     21. Telugu (తెలుగు)
     22. Urdu (اُردُو)
     23. English
   - Dynamic interface translation, localized input placeholders, and native script rendering.

3. **AI Service Discovery & Intent Understanding**
   - Understands colloquial citizen queries in any Indian language.
   - Matches intent against verified statutory schemes in the structured knowledge base.
   - Generates minimal clarifying follow-up questions to resolve ambiguities without collecting PII.

4. **Document Readiness Engine**
   - Classifies each required document as **✓ Ready**, **⚠ Missing**, or **? Not Sure**.
   - Computes dynamic readiness score: *"2 of 4 documents ready"*.
   - Generates actionable guidance: *"Obtain your income proof before starting the application."*
   - Explains verified issuers (e.g. DigiLocker, Tehsildar, Commercial Bank).

5. **Rule-Based Eligibility Engine**
   - Evaluates multi-condition criteria: state residency, annual family income thresholds, age minimums, and category quotas.
   - Outputs: 🟢 **Likely Eligible**, 🟡 **More Information Needed**, 🔴 **Does Not Meet Current Criteria**.
   - Mandatory disclaimer: *"Eligibility is an informational assessment. Final eligibility is determined by the relevant authority."*

6. **Smart Action Plan ("Your Next 3 Actions")**
   - Actionable 3-step prioritized roadmap tailored to citizen readiness.

7. **Application Tracker ("My Applications")**
   - 6-stage lifecycle tracking:
     1. Service Identified
     2. Eligibility Checked
     3. Documents Prepared
     4. Application Pending / Submitted
     5. Verification
     6. Completed
   - Docket reference number logging and incomplete step reminders.

8. **Admin / Public Insights Dashboard**
   - Anonymous aggregated intelligence: query volume, service category demand, top missing documents, and language distribution.
   - Zero citizen PII exposure.

9. **Voice Input & Document Need Scanner**
   - Speech capture in native languages.
   - Document upload simulator extracting needs from fee notices or utility bills.

---

## 3. Architecture

```
User (Citizen)
      │
      ▼
React 19 SPA (Vite + Tailwind CSS)
      │
      ▼
Full-Stack Server (server.ts / Express on Port 3000)
      ├── /api/analyze-need ──► Server-Side Gemini API (gemini-3.8-flash)
      │                               │
      │                               ▼
      │                      Public Services Catalog (Knowledge Base)
      │                               │
      │                               ▼
      ├── /api/clarify-answers ──► Structured Eligibility Engine
      │
      ▼
Client-Side Stores (Auth, Language i18n, LocalStorage Journey Tracker)
```

---

## 4. Environment Variables

Create `.env` using `.env.example`:

```env
# GEMINI_API_KEY: Injected by Google AI Studio
GEMINI_API_KEY="your_gemini_api_key_here"

# APP_URL: Cloud Run deployment URL
APP_URL="http://localhost:3000"

# PORT: Server listening port (default 3000)
PORT=3000
```

---

## 5. Setup & Development Instructions

### Prerequisites
- Node.js 20+
- npm 9+

### Installation
```bash
# Clone repository and install dependencies
npm install

# Start full-stack development server
npm run dev
```

The application runs on `http://localhost:3000`.

### Building for Production
```bash
# Build Vite client assets
npm run build

# Start production server
npm run start
```

---

## 6. AI Integration & Anti-Hallucination Design

CivicAssist AI follows strict anti-hallucination principles:
1. **Server-Side Only**: All `@google/genai` calls execute exclusively in `server.ts`. No API keys or SDK tokens are ever exposed to the client.
2. **Grounding in Official Catalog**: Gemini is prompted strictly with the validated public services catalog. It is forbidden from fabricating government schemes or inventing URLs.
3. **Deterministic Fallback Engine**: If the Gemini API is unreachable or rate-limited, the built-in deterministic matching engine smoothly takes over, ensuring 100% platform availability.

---

## 7. Public Service Knowledge Base Structure

Each service record contains:
- `id`: Unique identifier (e.g. `income-cert`, `post-matric-scholarship`)
- `serviceName`: Official name in English and Hindi / regional terminology
- `category`: Certificates, Scholarships, Healthcare, Pension, Transport, Business, etc.
- `state`: Central / State Revenue Jurisdiction
- `department`: Competent statutory ministry
- `eligibilityConditions`: Array of boolean, income, age, and residency rules
- `incomeLimitINR`: Statutory income ceiling
- `requiredDocuments`: Mandatory and optional proofs with issuance guidance
- `applicationSteps`: 5-step government portal workflow
- `officialPortalUrl`: Real, verified `.gov.in` or `.nic.in` portal URL
- `lastVerified`: Verification timestamp

---

## 8. Demo Scenario (Step-by-Step)

1. **Authentication**:
   - Click "Create New Account".
   - Step 1: Enter Name (e.g. *Amit Sharma*), Email, Mobile, Password.
   - Step 2: Select Language **Hindi (हिन्दी)**.
   - Step 3: Confirm and click "Create Account".
2. **Language Transformation**:
   - The entire UI immediately updates to Hindi.
3. **Problem Input**:
   - Enter: *“मुझे कॉलेज की फीस के लिए आर्थिक सहायता चाहिए।”*
   - Click *“सिविकअसिस्ट से पूछें”*.
4. **Structured Recommendation**:
   - AI matches *Post-Matric Scholarship for Higher Education* and *Income Certificate*.
   - Explains *Why this service?*
   - Displays *Your Next 3 Actions*.
5. **Document Readiness**:
   - Inspect required documents and mark Income Proof as *Missing*.
   - System displays: *"Obtain your income proof before starting the application."*
6. **Switch Language**:
   - Click top language selector and switch to **English**. The entire interface switches seamlessly.
7. **Application Tracker**:
   - Open **My Applications** to view the 6-stage journey, enter a reference docket ID, and advance stages.
8. **Admin Dashboard**:
   - Open **Admin Analytics** to review anonymous aggregated metrics and the citizen funnel.
