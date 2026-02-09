import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';
import { callZhipuVision } from './services/ai';

const app = new Hono();

app.use('/*', cors());

app.get('/', (c) => c.json({ status: 'ok', service: 'DressCopilot API', version: '0.1.0' }));

const analyzeSchema = z.object({
  image: z.string().min(1),
  prompt: z.string().min(1),
  apiKey: z.string().min(1),
});

app.post('/api/analyze', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = analyzeSchema.safeParse(body);

    if (!parsed.success) {
      const missing = parsed.error.issues.map(i => i.path.join('.')).join(', ');
      return c.json({ error: `Invalid request: missing or empty fields: ${missing}` }, 400);
    }

    const { image, prompt, apiKey } = parsed.data;
    const result = await callZhipuVision(apiKey, { image, prompt });

    return c.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return c.json({ success: false, error: error.message || 'Internal server error' }, 500);
  }
});

import { serve } from '@hono/node-server';

const port = 3000;
console.log(`DressCopilot API running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
