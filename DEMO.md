# Kroma Creative Marketplace — Demo Script & Presentation Outline

---

## Part 1: 3-Minute Live Demo Script

### **[0:00 - 0:35] The Hook & Problem**
> *"Every brand today wants cinematic video, festive shorts, or synthetic virtual ambassadors. But if you go to traditional freelance sites, you enter a black box. You have no idea if the creator actually knows how to keep a character consistent across 20 cuts, what tools they used, whether their Midjourney or Kling subscription even covers commercial rights, or how to handle 50 AI video iterations. Enter **Kroma Creative**—the world’s first AI-native creative marketplace."*

### **[0:35 - 1:15] Discovery & AI Influencer Matching**
> *"Let's search. If a brand types **'AI influencer for skincare brand'**, notice what happens: our search engine detects the synthetic persona trigger instantly, switches to the AI Influencer view, and brings up **Hana Seol** and **Jin-woo Park**. We see the transparent AI disclosure badge, content pillars, dewy visual style, and the link to the human artist who runs her. If we search **'Telugu farming explainer video'**, it matches **Ravi Teja**, scoring his Telugu language fluency, agricultural domain expertise, and Kling AI stack."*

### **[1:15 - 1:55] Verifiable Workflows & Trust Score**
> *"Let's open **Aanya Reddy's** profile. She has a **100/100 Trust Score**. Hovering reveals the breakdown: 30 points for Verified Tools (export receipts), 30 points for Verified Workflow (screen recording), 25 points for Verified Past Work (live client campaign URL), and 15 points for profile completeness.
> When we open her Saree Lookbook film, we don't just see a video—we see the **verifiable pipeline**: Step 1 in Midjourney for look-dev, Step 2 in Google Veo for 14 image-to-video takes, Step 3 in ElevenLabs for voiceover, and Step 4 in DaVinci Resolve for swatch grading. Plus an explicit commercial clearing statement."*

### **[1:55 - 2:35] AI-Assisted Brief Builder & Recommended Creators**
> *"Now let's switch to a brand like **Nakshatra Weaves**. We click **'Post Brief with AI Builder'**. We type a messy thought: *'Need a 45s festive reel with real handloom texture'*. Gemini automatically turns that into a structured production brief with deliverables, budget, and platform aspect ratios, while flagging commercial considerations. The brief immediately computes recommended creators with an AI match score and clear reasons."*

### **[2:35 - 3:00] Engagements, Iterations & Delivery**
> *"Finally, the Engagement workspace. Engagement #eg-01 enforces a strict state machine from Kickoff to Completed. We see mock escrow milestones, versioned deliverable history—v1 had change requests, v2 resolved them with real fabric swatches—and the final Delivery Certificate disclosing all models and voice actor consent. Everything is tested and verified on our live **/qa** evaluation page with 28 passing benchmark queries."*

---

## Part 2: 6–8 Slide Presentation Outline

### **Slide 1: Title & Vision**
- **Title:** Kroma Creative — The AI-Native Creative Marketplace
- **Subtitle:** Connecting generative filmmakers, animators & virtual personas with enterprise brands.
- **Visual:** High-contrast dark mode hero interface showing creator cards and trust badges.

### **Slide 2: The Problem**
- **The Freelance Gap:** Traditional marketplaces treat video as generic human labor.
- **The AI Creative Trilemma:**
  1. *Fidelity Risk:* Off-model characters and hallucinated product geometries.
  2. *Licensing Trap:* Ambiguous commercial terms across multi-tool chains.
  3. *Iteration Chaos:* No versioned prompt checkpoints or revision tracking.

### **Slide 3: The Kroma Insight**
- **Verifiable AI Pipelines:** Don't just verify the creator's identity; verify their tools, prompts, and screen-recorded workflow.
- **Synthetic Media Native:** Built-in virtual influencer licensing, persona bibles, and regulatory disclosure badges.

### **Slide 4: Product Architecture & Discovery Engine**
- **26 Specialized Domains:** Spanning fashion, beauty, agritech, luxury, and regional Indian languages (Telugu, Hindi, Tamil, Bengali, Punjabi).
- **Dual-Mode Search:** Deterministic weighted keyword matching + optional server-side Gemini semantic reasoning with 2.5s fail-safe fallback.

### **Slide 5: The 100-Point Trust Score**
- **Deterministic Trust Breakdown:**
  - `30 pts` — Verified Tool Subscription Receipts
  - `30 pts` — Verified Screen-Recorded Workflow
  - `25 pts` — Verified Client Live Campaign Links
  - `15 pts` — Profile Completeness
- Live Admin review queue with real-time badge updates.

### **Slide 6: AI Brief Builder & Delivery Workspace**
- **Rough Idea → Production Brief:** Gemini-powered structuring with Zod schema validation.
- **Milestone Escrow & Versioned Deliverables:** v1, v2, v3 tracking with revision counters and mock escrow releases.
- **Final Rights Pack:** Tool disclosure certificate & voice talent consent receipts.

### **Slide 7: Verification & Robustness**
- **Dual-Adapter Data Layer:** Firestore persistence with seamless in-memory/localStorage seed fallback.
- **Automated `/qa` Suite:** All 28 benchmark queries passing 100%.

### **Slide 8: Roadmap & Business Model**
- **Commission Model:** 10% take rate on completed escrow milestones.
- **Enterprise Features:** Direct Adobe Firefly & Google Cloud Veo API integration receipts; automated watermarking; team agency workspaces.
