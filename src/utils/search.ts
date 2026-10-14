import { Creator, AIPersona, Domain, Specialization, ToolItem } from '../types';
import seedData from '../data/seed.json';

const searchConfig = seedData.searchConfig;
const domains = seedData.domains as Domain[];
const specializations = seedData.specializations as Specialization[];
const tools = seedData.tools as ToolItem[];

export interface SearchResult<T> {
  item: T;
  score: number;
  whyThisMatch: string[];
  isFallback?: boolean;
}

export function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isAiInfluencerQuery(rawQuery: string): boolean {
  const q = normalizeQuery(rawQuery);
  if (!q) return false;
  return searchConfig.aiInfluencerTriggers.some(trigger => {
    const normTrigger = normalizeQuery(trigger);
    return q.includes(normTrigger);
  });
}

export function extractMatchedDomains(normalizedQuery: string): Domain[] {
  const matched: Domain[] = [];
  const words = normalizedQuery.split(' ');

  for (const domain of domains) {
    let hit = false;
    for (const kw of domain.keywords) {
      const normKw = normalizeQuery(kw);
      if (!normKw) continue;
      // Multi-word phrase or single word exact match
      if (normKw.includes(' ')) {
        if (normalizedQuery.includes(normKw)) {
          hit = true;
          break;
        }
      } else {
        if (words.includes(normKw)) {
          hit = true;
          break;
        }
      }
    }
    if (hit) {
      matched.push(domain);
    }
  }
  return matched;
}

export function extractMatchedSpecializations(normalizedQuery: string): Specialization[] {
  const matched: Specialization[] = [];
  const words = normalizedQuery.split(' ');

  for (const spec of specializations) {
    let hit = false;
    for (const kw of spec.keywords) {
      const normKw = normalizeQuery(kw);
      if (!normKw) continue;
      if (normKw.includes(' ')) {
        if (normalizedQuery.includes(normKw)) {
          hit = true;
          break;
        }
      } else {
        if (words.includes(normKw)) {
          hit = true;
          break;
        }
      }
    }
    if (hit) {
      matched.push(spec);
    }
  }
  return matched;
}

export function searchCreators(
  query: string,
  creators: Creator[],
  filters?: {
    domain?: string;
    specialization?: string;
    tool?: string;
    contentType?: string;
    aspectRatio?: string;
    priceBand?: string;
    availability?: string;
    turnaroundDays?: number;
    language?: string;
    experienceLevel?: string;
    commercialUseReady?: boolean;
    verifiedOnly?: boolean;
    sort?: string;
  }
): SearchResult<Creator>[] {
  const normalizedQuery = normalizeQuery(query);
  const matchedDomains = normalizedQuery ? extractMatchedDomains(normalizedQuery) : [];
  const matchedSpecs = normalizedQuery ? extractMatchedSpecializations(normalizedQuery) : [];
  const queryTokens = normalizedQuery
    ? normalizedQuery.split(' ').filter(t => !searchConfig.stopwords.includes(t) && t.length > 1)
    : [];

  const wantsInfluencer = isAiInfluencerQuery(query);

  const results: SearchResult<Creator>[] = [];

  for (const creator of creators) {
    let score = 0;
    const whyThisMatch: string[] = [];

    // Filter checks
    if (filters?.domain && !creator.domains.includes(filters.domain)) continue;
    if (filters?.specialization && !creator.specializations.includes(filters.specialization)) continue;
    if (filters?.tool && !creator.tools.includes(filters.tool)) continue;
    if (filters?.contentType && !creator.contentTypes.includes(filters.contentType)) continue;
    if (filters?.aspectRatio && !creator.preferredFormats.includes(filters.aspectRatio)) continue;
    if (filters?.availability && creator.availability !== filters.availability) continue;
    if (filters?.language && !creator.languages.includes(filters.language)) continue;
    if (filters?.experienceLevel && creator.experienceLevel !== filters.experienceLevel) continue;
    if (filters?.commercialUseReady && !creator.commercialUseReady) continue;
    if (filters?.verifiedOnly && (!creator.verification.tools.verified && !creator.verification.workflow.verified)) continue;
    if (filters?.turnaroundDays && creator.turnaroundDays > filters.turnaroundDays) continue;
    if (filters?.priceBand) {
      const band = (seedData.filters.priceBands as { id: string; min: number; max: number }[]).find(b => b.id === filters.priceBand);
      if (band && (creator.rateFromUSD < band.min || creator.rateFromUSD > band.max)) continue;
    }

    if (!normalizedQuery) {
      // Default score based on completeness & rating
      score = (creator.trustScore || 50) + (creator.stats.rating || 4) * 5;
      results.push({ item: creator, score, whyThisMatch: ['Featured AI Creator'] });
      continue;
    }

    // 1. Domain Match
    const matchedDomainNames: string[] = [];
    for (const d of matchedDomains) {
      if (creator.domains.includes(d.id)) {
        score += searchConfig.weights.domainMatch;
        matchedDomainNames.push(d.label);
      }
    }
    if (matchedDomainNames.length > 0) {
      whyThisMatch.push(`Domain: ${matchedDomainNames.join(', ')}`);
    }

    // 2. Specialization Match
    const matchedSpecNames: string[] = [];
    for (const s of matchedSpecs) {
      if (creator.specializations.includes(s.id)) {
        score += searchConfig.weights.specializationMatch;
        matchedSpecNames.push(s.label);
      }
    }
    if (matchedSpecNames.length > 0) {
      whyThisMatch.push(`Specializes in ${matchedSpecNames.join(', ')}`);
    }

    // 3. Language Match
    const matchedLanguages: string[] = [];
    for (const lang of creator.languages) {
      const normLang = lang.toLowerCase();
      if (queryTokens.includes(normLang) || normalizedQuery.includes(normLang)) {
        score += searchConfig.weights.languageMatch;
        matchedLanguages.push(lang);
      }
    }
    if (matchedLanguages.length > 0) {
      whyThisMatch.push(`Speaks ${matchedLanguages.join(', ')}`);
    }

    // 4. Tool Name Match
    const matchedTools: string[] = [];
    for (const tId of creator.tools) {
      const toolObj = tools.find(t => t.id === tId);
      if (toolObj) {
        const normTool = normalizeQuery(toolObj.name);
        if (queryTokens.some(tok => normTool.includes(tok)) || normalizedQuery.includes(normTool)) {
          score += searchConfig.weights.toolNameMatch;
          matchedTools.push(toolObj.name);
        }
      }
    }
    if (matchedTools.length > 0) {
      whyThisMatch.push(`Uses ${matchedTools.slice(0, 3).join(', ')}`);
    }

    // 5. Headline / Skills tokens
    const textHeadlineSkills = `${creator.headline} ${creator.skills.join(' ')}`.toLowerCase();
    for (const token of queryTokens) {
      if (textHeadlineSkills.includes(token)) {
        score += searchConfig.weights.tokenInHeadlineOrSkills;
      }
    }

    // 6. Bio tokens
    const textBio = creator.bio.toLowerCase();
    for (const token of queryTokens) {
      if (textBio.includes(token)) {
        score += searchConfig.weights.tokenInBioOrPortfolioText;
      }
    }

    // 7. Virtual Influencer Boost
    if (wantsInfluencer && creator.offersAIPersonas) {
      if (matchedDomains.length === 0 || matchedDomainNames.length > 0) {
        score += searchConfig.weights.virtualInfluencerBoost;
        whyThisMatch.push(`Offers AI Influencers & Virtual Personas`);
      }
    }

    // 8. Verified & Available Boosts
    if (score > 0) {
      if (creator.verification.tools.verified || creator.verification.workflow.verified) {
        score += searchConfig.weights.verifiedBoost;
      }
      if (creator.availability === 'available') {
        score += searchConfig.weights.availableBoost;
      }
    }

    if (score > 0) {
      results.push({ item: creator, score, whyThisMatch });
    }
  }

  // Sort by score descending or user requested sort
  sortResults(results, filters?.sort);

  // If fewer than 6 creators score above 0, fill with nearest matches
  if (results.length < 6 && normalizedQuery) {
    const existingIds = new Set(results.map(r => r.item.id));
    const fallbackCandidates: Creator[] = [];

    for (const creator of creators) {
      if (existingIds.has(creator.id)) continue;

      let relevance = 0;
      const reasons: string[] = [];

      // Check shared domain
      for (const d of matchedDomains) {
        if (creator.domains.includes(d.id)) {
          relevance += 4;
          reasons.push(`Domain: ${d.label}`);
        }
      }
      // Check shared specialization
      for (const s of matchedSpecs) {
        if (creator.specializations.includes(s.id)) {
          relevance += 2;
          reasons.push(`Specialization: ${s.label}`);
        }
      }

      if (relevance > 0) {
        fallbackCandidates.push(creator);
        results.push({
          item: creator,
          score: relevance,
          whyThisMatch: reasons.length ? reasons : ['Closest domain match'],
          isFallback: true,
        });
      }
    }

    // If still less than 6, fill with top-rated available creators
    if (results.length < 6) {
      const remaining = creators
        .filter(c => !existingIds.has(c.id) && !results.some(r => r.item.id === c.id))
        .sort((a, b) => (b.trustScore || 0) - (a.trustScore || 0))
        .slice(0, 6 - results.length);

      for (const c of remaining) {
        results.push({
          item: c,
          score: 1,
          whyThisMatch: ['Popular creator on platform'],
          isFallback: true,
        });
      }
    }
  }

  return results;
}

export function searchPersonas(
  query: string,
  personas: AIPersona[],
  filters?: {
    domain?: string;
    language?: string;
    platform?: string;
    sort?: string;
  }
): SearchResult<AIPersona>[] {
  const normalizedQuery = normalizeQuery(query);
  const matchedDomains = normalizedQuery ? extractMatchedDomains(normalizedQuery) : [];
  const queryTokens = normalizedQuery
    ? normalizedQuery.split(' ').filter(t => !searchConfig.stopwords.includes(t) && t.length > 1)
    : [];

  const results: SearchResult<AIPersona>[] = [];

  for (const persona of personas) {
    let score = 0;
    const whyThisMatch: string[] = [];

    if (filters?.domain && !persona.domains.includes(filters.domain)) continue;
    if (filters?.language && !persona.languages.includes(filters.language)) continue;
    if (filters?.platform && !persona.platforms.includes(filters.platform)) continue;

    if (!normalizedQuery) {
      results.push({ item: persona, score: 10, whyThisMatch: ['Verified Persona'] });
      continue;
    }

    // 1. Domain match (weight 6)
    const matchedDomainNames: string[] = [];
    for (const d of matchedDomains) {
      if (persona.domains.includes(d.id)) {
        score += searchConfig.personaWeights.domainMatch;
        matchedDomainNames.push(d.label);
      }
    }
    if (matchedDomainNames.length > 0) {
      whyThisMatch.push(`Domain: ${matchedDomainNames.join(', ')}`);
    }

    // 2. Token in Tagline or Pillars or Personality or Name (weight 2)
    const personaText = `${persona.name} ${persona.tagline} ${persona.personality} ${persona.visualStyle} ${persona.contentPillars.join(' ')}`.toLowerCase();
    for (const token of queryTokens) {
      if (personaText.includes(token)) {
        score += searchConfig.personaWeights.tokenInTaglineOrPillars;
      }
    }

    // 3. Language match (weight 3)
    const matchedLanguages: string[] = [];
    for (const lang of persona.languages) {
      const normLang = lang.toLowerCase();
      if (queryTokens.includes(normLang) || normalizedQuery.includes(normLang)) {
        score += searchConfig.personaWeights.languageMatch;
        matchedLanguages.push(lang);
      }
    }
    if (matchedLanguages.length > 0) {
      whyThisMatch.push(`Speaks ${matchedLanguages.join(', ')}`);
    }

    if (score > 0) {
      if (!whyThisMatch.length) {
        whyThisMatch.push('Matched personality & creative focus');
      }
      results.push({ item: persona, score, whyThisMatch });
    }
  }

  // Sort
  results.sort((a, b) => b.score - a.score);

  // Fallback if empty and query exists
  if (results.length === 0 && personas.length > 0) {
    for (const p of personas.slice(0, 4)) {
      results.push({
        item: p,
        score: 1,
        whyThisMatch: ['Featured virtual persona'],
        isFallback: true,
      });
    }
  }

  return results;
}

function sortResults<T>(results: SearchResult<T>[], sortOption?: string) {
  if (!sortOption || sortOption === 'relevance') {
    results.sort((a, b) => b.score - a.score);
    return;
  }
  if (sortOption === 'price-low') {
    results.sort((a: any, b: any) => (a.item.rateFromUSD || 0) - (b.item.rateFromUSD || 0));
  } else if (sortOption === 'price-high') {
    results.sort((a: any, b: any) => (b.item.rateFromUSD || 0) - (a.item.rateFromUSD || 0));
  } else if (sortOption === 'most-verified') {
    results.sort((a: any, b: any) => (b.item.trustScore || 0) - (a.item.trustScore || 0));
  } else if (sortOption === 'fastest') {
    results.sort((a: any, b: any) => (a.item.turnaroundDays || 99) - (b.item.turnaroundDays || 99));
  } else if (sortOption === 'newest') {
    results.sort((a: any, b: any) => (b.item.experienceYears || 0) - (a.item.experienceYears || 0));
  }
}
