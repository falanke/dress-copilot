import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { callZhipuVision } from './services/ai';

const app = new Hono();

app.use('/*', cors());

app.get('/', (c) => c.json({ status: 'ok', service: 'DressCopilot API', version: '0.1.0' }));

app.post('/api/analyze', async (c) => {
  try {
    const { image, prompt, apiKey } = await c.req.json();
    
    if (!image || !prompt) {
      return c.json({ error: 'Missing image or prompt' }, 400);
    }
    
    if (!apiKey) {
      return c.json({ error: 'API Key is required' }, 401);
    }

    const result = await callZhipuVision(apiKey, { image, prompt });
    
    return c.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return c.json({ success: false, error: error.message || 'Internal server error' }, 500);
  }
});

export default {
  port: 3000,
  fetch: app.fetch,
};
