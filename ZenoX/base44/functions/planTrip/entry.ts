import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

const ITINERARY_SCHEMA = {
  type: 'object',
  properties: {
    destination: { type: 'string', description: 'Primary destination name, e.g. "Kyoto, Japan"' },
    title: { type: 'string', description: 'A short, evocative trip title' },
    summary: { type: 'string', description: 'A 2-3 sentence narrative overview of the trip' },
    duration_days: { type: 'number', description: 'Number of days in the itinerary' },
    budget_currency: { type: 'string', description: 'ISO currency code, e.g. USD' },
    budget_total: { type: 'number', description: 'Estimated total trip cost in the chosen currency' },
    budget_breakdown: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category: { type: 'string', description: 'e.g. Flights, Lodging, Food, Activities, Transport, Misc' },
          amount: { type: 'number' },
          notes: { type: 'string' }
        },
        required: ['category', 'amount']
      }
    },
    constraints: {
      type: 'object',
      properties: {
        travelers: { type: 'number' },
        budget_limit: { type: 'string' },
        dates: { type: 'string' },
        preferences: { type: 'array', items: { type: 'string' } }
      }
    },
    weather: {
      type: 'array',
      description: 'Daily forecast for the destination during the trip dates if known, else typical seasonal weather',
      items: {
        type: 'object',
        properties: {
          day: { type: 'number' },
          date: { type: 'string' },
          condition: { type: 'string', description: 'e.g. Sunny, Partly Cloudy, Rain' },
          temp_high: { type: 'number' },
          temp_low: { type: 'number' },
          icon: { type: 'string', description: 'one of: sunny, cloudy, partly-cloudy, rain, snow, storm, fog' }
        },
        required: ['day', 'condition', 'temp_high', 'temp_low']
      }
    },
    days: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          day: { type: 'number' },
          title: { type: 'string', description: 'A short themed title for the day' },
          theme: { type: 'string', description: 'e.g. "Old Town & Temples"' },
          activities: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                time: { type: 'string', description: 'e.g. "09:00"' },
                title: { type: 'string' },
                description: { type: 'string' },
                location: { type: 'string' },
                duration: { type: 'string', description: 'e.g. "2 hours"' },
                cost: { type: 'number' },
                category: { type: 'string', description: 'e.g. sightseeing, nature, food, culture, relaxation' }
              },
              required: ['time', 'title', 'description']
            }
          },
          dining: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                meal: { type: 'string', description: 'Breakfast, Lunch, Dinner, Snack' },
                name: { type: 'string' },
                cuisine: { type: 'string' },
                price_range: { type: 'string', description: 'e.g. $, $$, $$$' }
              },
              required: ['meal', 'name']
            }
          },
          accommodation: { type: 'string' },
          transportation: { type: 'string' }
        },
        required: ['day', 'title', 'activities']
      }
    },
    sources: {
      type: 'array',
      description: 'Real, verifiable source URLs you found via web search that back the recommendations',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          url: { type: 'string' },
          snippet: { type: 'string' }
        },
        required: ['title', 'url']
      }
    },
    tips: { type: 'array', items: { type: 'string' } }
  },
  required: ['destination', 'title', 'summary', 'duration_days', 'days', 'budget_total', 'sources']
};

function buildPrompt(query) {
  return `You are RouteWise, an expert AI travel planner. A user wants a trip planned.

User request: """${query}"""

Using real-time web search results, design a complete, source-backed itinerary.
- Infer reasonable constraints from the request (number of travelers, budget, dates, preferences). If something is unspecified, make sensible assumptions and note them in constraints.
- Choose an appropriate trip length (default 5 days if unspecified, max 7).
- For each day provide a themed title, a sequence of timed activities (with location, duration, estimated cost, category), dining suggestions (meal, name, cuisine, price range), accommodation, and transportation notes.
- Provide a realistic budget breakdown by category and a total, in a sensible currency.
- Provide a daily weather forecast (condition, high/low temps, icon). Use real forecast data when the dates are known and near; otherwise give typical seasonal weather for the destination.
- Include at least 4 real, verifiable source URLs (official tourism sites, reputable guides, booking sites) that support your recommendations, each with a short snippet.
- Add 4-6 practical travel tips.
Be accurate, specific, and inspiring. Return ONLY the JSON matching the schema.`;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    let user = null;
    try { user = await base44.auth.me(); } catch { user = null; }

    const body = await req.json().catch(() => ({}));
    const query = (body?.query || '').trim();
    if (!query || query.length < 3) {
      return Response.json({ error: 'Please describe the trip you have in mind.' }, { status: 400 });
    }

    const prompt = buildPrompt(query);

    const [llmResult, imageResult] = await Promise.all([
      base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
        model: 'gemini_3_8_flash',
        response_json_schema: ITINERARY_SCHEMA
      }),
      base44.asServiceRole.integrations.Core.GenerateImage({
        prompt: `A breathtaking, cinematic travel photograph evoking this trip: "${query}". Golden hour light, sweeping landscape, professional travel photography, ultra detailed, no text, no watermark.`
      }).catch(() => null)
    ]);

    const plan = llmResult || {};
    const cover_image_url = imageResult?.url || null;

    const saved = await base44.entities.Itinerary.create({
      query,
      destination: plan.destination || 'Your destination',
      title: plan.title || 'Your Trip',
      summary: plan.summary || '',
      duration_days: plan.duration_days || (plan.days ? plan.days.length : 0),
      budget_currency: plan.budget_currency || 'USD',
      budget_total: plan.budget_total || 0,
      budget_breakdown: plan.budget_breakdown || [],
      constraints: plan.constraints || {},
      weather: plan.weather || [],
      days: plan.days || [],
      sources: plan.sources || [],
      tips: plan.tips || [],
      cover_image_url
    });

    return Response.json({ itinerary: saved });
  } catch (error) {
    return Response.json({ error: error.message || 'Failed to plan trip' }, { status: 500 });
  }
}