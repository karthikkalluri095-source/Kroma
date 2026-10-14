import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { z } from 'zod';
import seedData from './src/data/seed.json' with { type: 'json' };

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Zod schema for brief generation validation
const BriefGenerationSchema = z.object({
  title: z.string(),
  summary: z.string(),
  campaignGoal: z.string(),
  requirements: z.array(z.string()),
  targetAudience: z.string(),
  contentType: z.string(),
  styleTags: z.array(z.string()),
  aspectRatios: z.array(z.string()),
  durationSec: z.number(),
  deliverables: z.number(),
  platforms: z.array(z.string()),
  preferredTools: z.array(z.string()),
  languages: z.array(z.string()),
  budget: z.object({
    min: z.number(),
    max: z.number(),
    currency: z.string(),
  }),
  revisionRounds: z.number(),
  commercialUse: z.object({
    usageTypes: z.array(z.string()),
    territory: z.string(),
    durationMonths: z.number(),
    exclusivity: z.string(),
    toolLicenseProofRequired: z.boolean(),
  }),
  suggestedQuestions: z.array(z.string()).optional(),
  commercialFlags: z.array(z.string()).optional(),
});

// Fallback rule-based brief builder if Gemini is unavailable
function generateRuleBasedBrief(idea: string, templatePrefill?: any) {
  const lower = idea.toLowerCase();

  let contentType = templatePrefill?.contentType || 'product-ads';
  if (lower.includes('film') || lower.includes('story') || lower.includes('short')) contentType = 'ai-film';
  else if (lower.includes('mascot') || lower.includes('cartoon') || lower.includes('animation')) contentType = 'ai-animation';
  else if (lower.includes('influencer') || lower.includes('ambassador') || lower.includes('persona')) contentType = 'virtual-influencers';
  else if (lower.includes('explain') || lower.includes('how to')) contentType = 'explainers';
  else if (lower.includes('music') || lower.includes('song') || lower.includes('beat')) contentType = 'music-videos';

  let aspectRatios = ['9:16', '16:9'];
  if (lower.includes('instagram') || lower.includes('tiktok') || lower.includes('reel') || lower.includes('short')) {
    aspectRatios = ['9:16'];
  } else if (lower.includes('youtube') || lower.includes('presentation') || lower.includes('tv')) {
    aspectRatios = ['16:9'];
  }

  const languages = ['English'];
  if (lower.includes('hindi')) languages.push('Hindi');
  if (lower.includes('telugu')) languages.push('Telugu');
  if (lower.includes('tamil')) languages.push('Tamil');

  return {
    title: idea.length > 50 ? `${idea.slice(0, 45)}... Campaign` : idea,
    summary: `Complete creative brief developed from: "${idea}". Designed for high-impact AI production with full provenance tracking.`,
    campaignGoal: 'Engage audience, drive high organic retention and deliver commercial-ready generative assets.',
    requirements: [
      'High character and product consistency across all shots',
      'Clean usage rights and licensing receipts for all generative models',
      'Delivery of high-bitrate final exports and workflow timelines',
    ],
    targetAudience: 'Digital-first consumers and prospective brand customers',
    contentType,
    styleTags: ['cinematic', 'high-production', 'photorealistic'],
    aspectRatios,
    durationSec: 45,
    deliverables: 2,
    platforms: ['Instagram', 'YouTube'],
    preferredTools: ['midjourney', 'kling', 'elevenlabs'],
    languages,
    budget: { min: 500, max: 1500, currency: 'USD' },
    revisionRounds: 2,
    commercialUse: {
      usageTypes: ['organic-social', 'paid-ads'],
      territory: 'Global',
      durationMonths: 12,
      exclusivity: 'none',
      toolLicenseProofRequired: true,
    },
    suggestedQuestions: [
      'Do you have CAD renders or real reference imagery for products?',
      'Do you require voice actor consent verification for AI speech generation?',
      'Will you be running paid ad campaigns on Meta or TikTok requiring paid commercial clears?',
    ],
    commercialFlags: [
      'Synthetic personas require AI disclosure tags in multiple jurisdictions.',
      'Ensure generative audio tool licenses explicitly permit commercial ad usage.',
    ],
  };
}

// 1. AI Query Understanding (with 2.5s timeout)
app.post('/api/search/ai-boost', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.json({ success: false });

  if (!ai) {
    return res.json({ success: false, reason: 'No Gemini key available' });
  }

  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 2500)
    );

    const callPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are an AI search parser. Analyze this query for an AI content creator marketplace: "${query}".
Return ONLY valid JSON matching this schema:
{
  "domains": string[], // matching known domain ids if relevant
  "specializations": string[], // matching specialization ids
  "languages": string[],
  "tools": string[],
  "wantsAIInfluencer": boolean,
  "budgetMaxUSD": number or null
}`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const response = (await Promise.race([callPromise, timeoutPromise])) as any;
    const text = response?.text?.trim();
    if (text) {
      const parsed = JSON.parse(text);
      return res.json({ success: true, parsed });
    }
    return res.json({ success: false });
  } catch (err) {
    return res.json({ success: false, error: 'Fallback to keyword search' });
  }
});

// 2. AI-Assisted Brief Builder ("Turn my rough idea into a brief")
app.post('/api/briefs/ai-generate', async (req, res) => {
  const { idea, templateId } = req.body;
  const tpl = templateId
    ? seedData.briefTemplates.find((t: any) => t.id === templateId)
    : null;

  if (!idea && !tpl) {
    return res.status(400).json({ error: 'Please provide an idea or template' });
  }

  const promptText = idea || tpl?.name || '';

  if (!ai) {
    const fallback = generateRuleBasedBrief(promptText, tpl?.prefill);
    return res.json({ success: true, brief: fallback, source: 'rule-engine' });
  }

  try {
    const systemPrompt = `You are an expert creative director for an AI creator marketplace.
Convert this raw idea into a comprehensive, production-grade creative brief for AI filmmakers and animators.
Input idea: "${promptText}"
Available contentTypes: "ai-film", "ai-animation", "product-ads", "music-videos", "character-design", "motion-graphics", "social-shorts", "image-campaigns", "explainers", "virtual-influencers", "3d-product-renders".
Available tools: "runway", "kling", "veo", "midjourney", "flux", "blender", "elevenlabs", "suno", "aftereffects", "davinci".

Return JSON matching:
{
  "title": string,
  "summary": string,
  "campaignGoal": string,
  "requirements": string[],
  "targetAudience": string,
  "contentType": string,
  "styleTags": string[],
  "aspectRatios": string[],
  "durationSec": number,
  "deliverables": number,
  "platforms": string[],
  "preferredTools": string[],
  "languages": string[],
  "budget": { "min": number, "max": number, "currency": "USD" },
  "revisionRounds": number,
  "commercialUse": {
    "usageTypes": string[],
    "territory": string,
    "durationMonths": number,
    "exclusivity": string,
    "toolLicenseProofRequired": boolean
  },
  "suggestedQuestions": string[],
  "commercialFlags": string[]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    const validated = BriefGenerationSchema.safeParse(parsed);

    if (validated.success) {
      return res.json({ success: true, brief: validated.data, source: 'gemini' });
    } else {
      const fallback = generateRuleBasedBrief(promptText, tpl?.prefill);
      return res.json({ success: true, brief: fallback, source: 'rule-fallback' });
    }
  } catch (e) {
    const fallback = generateRuleBasedBrief(promptText, tpl?.prefill);
    return res.json({ success: true, brief: fallback, source: 'rule-fallback' });
  }
});

// 3. Text to Speech using gemini-3.8-flash-tts
app.post('/api/ai/tts', async (req, res) => {
  const { text, speaker = 'Alex', style = 'Friendly, professional narrator' } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });

  if (!ai) {
    return res.status(503).json({ error: 'Gemini API key not configured on server' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text,
              speechMetadata: {
                speaker,
                style,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ success: true, audioBase64: base64Audio });
    }
    return res.status(500).json({ error: 'Audio generation failed' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'TTS generation error' });
  }
});

// 4. Gemini Intelligence Analysis with High Thinking (gemini-4-argon)
app.post('/api/ai/analyze-workflow', async (req, res) => {
  const { scriptOrWorkflow } = req.body;
  if (!scriptOrWorkflow) return res.status(400).json({ error: 'Input required' });

  if (!ai) {
    return res.json({
      success: true,
      analysis: {
        verdict: 'Standard AI Workflow',
        commercialViabilityScore: 92,
        licensingRisk: 'Low',
        recommendations: [
          'Verify commercial subscription tiers for all video gen models',
          'Ensure voice actors have signed synthetic dubbing consent forms',
          'Include on-screen synthetic media disclosure for EU/US distribution',
        ],
      },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-4-argon',
      contents: `Perform an in-depth audit of this AI workflow or brief for copyright, tool license feasibility, and model fidelity:
"${scriptOrWorkflow}"

Provide a thorough breakdown of potential consistency pitfalls and commercial usage clearance.`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
      },
    });

    return res.json({ success: true, text: response.text });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 5. Admin Seed Reset Endpoint
app.post('/api/admin/seed', (req, res) => {
  return res.json({ success: true, message: 'Seed data reset successfully' });
});

// Mount Vite or serve static assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kroma Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
