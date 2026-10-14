# Kroma Creative — AI Content Creator & Virtual Persona Marketplace

> **The AI-native marketplace connecting generative filmmakers, animators, and virtual brand ambassadors with global brands and creative agencies.**

---

## 🌟 The Problem Kroma Solves

Traditional freelance platforms (Upwork, Fiverr) were built for human craft conventions—hourly rates, single file submissions, and generic portfolios. They fail fundamentally for generative and AI-native creative work:
1. **Provenance Black Box:** Brands can't verify which models or workflows produced a clip versus generic stock footage.
2. **Licensing & Commercial Use Fog:** Generative tools carry differing commercial terms depending on subscription plans, inputs, and voice clone rights.
3. **Multi-Take & Iteration Hell:** AI video requires prompt iterations, style LoRAs, and seed conditioning across dozens of takes.
4. **Virtual Persona Management:** Virtual influencers and synthetic brand ambassadors require disclosure kits, face-locking bibles, and distinctive platform licensing.

**Kroma** solves this with **verifiable workflow pipelines**, **a 100-point Trust Score**, **AI-assisted creative briefs**, and **milestone escrow workspaces with versioned deliverable tracking**.

---

## 🚀 Quick Exploration (Demo Accounts)

Explore every flow instantly without signup using the header role switcher or landing page buttons:

| Demo Role | Display Name | Associated Entity | Focus Flow |
| :--- | :--- | :--- | :--- |
| **Brand** | Nakshatra Weaves | `brand-nakshatra-weaves` | Post briefs with AI, evaluate proposals, review version cuts |
| **Creator** | Aanya Reddy | `cr-aanya-frames` | Edit AI stack, upload cuts with workflow receipts, earn badges |
| **Admin** | Verification Admin | `admin` | Review evidence artifacts & approve verification requests |

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion.
- **Backend / API:** Node.js Express server running with Vite middleware mode on port `3000`.
- **AI Engine:** Google Gemini API (`@google/genai` TypeScript SDK):
  - `gemini-3.8-flash`: Rapid query understanding & AI-assisted creative brief parsing.
  - `gemini-3.8-flash-tts`: Text-to-speech voice generation.
  - `gemini-4-argon`: Deep copyright, model fidelity, and workflow reasoning with `ThinkingLevel.HIGH`.
- **Data Layer:** `DataService` interface with dual-adapter architecture:
  - `FirestoreAdapter`: Persistent Google Cloud Firestore integration.
  - `SeedAdapter`: In-memory and local storage backed adapter initialized from `seed.json` (35 creators, 70 portfolio items, 11 AI personas, 26 domains, 15 briefs, 42 proposals, 68 reviews).
  - *Zero broken state guarantee:* If Firestore is disconnected or read fails, seamlessly falls back to SeedAdapter.

---

## 🔑 Environment Variables

Defined in `.env.example`:
```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
```
*Note: The Gemini API key is strictly server-side and never exposed to the browser.*

---

## 🧪 Automated QA Suite (`/qa`)

Kroma includes an automated `/qa` evaluation suite accessible in the footer and navigation:
- Validates all seed counts across 10 collections.
- Monitors active data adapter status.
- Evaluates **28 benchmark search queries** directly against ranking rules (`searchCreators` and `searchPersonas`), guaranteeing 100% PASS rate.
