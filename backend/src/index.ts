import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { callZhipuVision, callZhipuMultiImage } from './services/ai';
import {
  authMiddleware,
  createUser,
  getUserByEmail,
  getUserById,
  hashPassword,
  verifyPassword,
  generateToken,
} from './auth';
import db from './db';

const app = new Hono();

app.use('/*', cors());

// Platform API Key (configured by admin)
const PLATFORM_API_KEY = process.env.ZHIPU_API_KEY || '';

app.get('/', (c) => c.json({ status: 'ok', service: 'DressCopilot API', version: '0.2.0' }));

// Auth Routes
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(2),
});

app.post('/api/auth/register', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ success: false, error: 'Invalid input' }, 400);
    }

    const { email, password, username } = parsed.data;

    // Check if user exists
    if (getUserByEmail(email)) {
      return c.json({ success: false, error: 'Email already registered' }, 400);
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const user = createUser(email, username, passwordHash);
    const token = generateToken(user);

    return c.json({ success: true, token, user });
  } catch (error: any) {
    console.error('Register error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

app.post('/api/auth/login', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ success: false, error: 'Invalid input' }, 400);
    }

    const { email, password } = parsed.data;

    // Get user
    const userWithPassword = getUserByEmail(email);
    if (!userWithPassword) {
      return c.json({ success: false, error: 'Invalid credentials' }, 401);
    }

    // Verify password
    const isValid = await verifyPassword(password, userWithPassword.password_hash);
    if (!isValid) {
      return c.json({ success: false, error: 'Invalid credentials' }, 401);
    }

    const user = { id: userWithPassword.id, email: userWithPassword.email, username: userWithPassword.username };
    const token = generateToken(user);

    return c.json({ success: true, token, user });
  } catch (error: any) {
    console.error('Login error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get('/api/auth/me', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const user = getUserById(userId);

  if (!user) {
    return c.json({ success: false, error: 'User not found' }, 404);
  }

  return c.json({ success: true, user });
});

// Analysis Routes (Protected)
const analyzeMultiSchema = z.object({
  stylePhotos: z.array(z.string()).min(1).max(5),
  screenshot: z.string().min(1),
  query: z.string().min(1),
});

app.post('/api/analyze', authMiddleware, async (c) => {
  try {
    if (!PLATFORM_API_KEY) {
      return c.json({ success: false, error: 'Platform API key not configured' }, 500);
    }

    const body = await c.req.json();
    const parsed = analyzeMultiSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ success: false, error: 'Invalid request' }, 400);
    }

    const { stylePhotos, screenshot, query } = parsed.data;

    // Build enhanced prompt with style references
    const prompt = `你是一位专业的时尚顾问。用户提供了 ${stylePhotos.length} 张他们喜欢的穿搭风格参考照片。

用户需求: ${query}

请分析当前电商页面截图，找出最符合以下要求的商品：
1. 符合用户提供的风格参考照片的整体风格
2. 满足用户的具体需求描述
3. 价格合理、性价比高

请返回 JSON 格式：
{
  "recommendations": [
    {
      "index": 0,
      "title": "商品标题",
      "brand": "品牌名",
      "price": "价格",
      "match_reason": "推荐理由，说明为什么符合用户风格 (30字以内)",
      "style_match_score": 95
    }
  ]
}

只返回 JSON，不要有其他文字。`;

    // Call multi-image AI vision API
    const result = await callZhipuMultiImage(PLATFORM_API_KEY, {
      images: [...stylePhotos, screenshot],
      prompt,
    });

    // Parse recommendations
    try {
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return c.json({ success: true, recommendations: parsed.recommendations || [] });
      }
      return c.json({ success: false, error: 'Failed to parse AI response' }, 500);
    } catch {
      return c.json({ success: false, error: 'Invalid AI response format' }, 500);
    }
  } catch (error: any) {
    console.error('Analysis error:', error);
    return c.json({ success: false, error: error.message || 'Internal server error' }, 500);
  }
});

// History Routes (Protected)
app.get('/api/history', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const stmt = db.prepare('SELECT * FROM search_history WHERE user_id = ? ORDER BY timestamp DESC LIMIT 50');
    const rows = stmt.all(userId) as any[];

    const history = rows.map((row) => ({
      id: row.id,
      query: row.query,
      results: JSON.parse(row.results),
      stylePhotos: row.style_photos ? JSON.parse(row.style_photos) : [],
      timestamp: row.timestamp,
    }));

    return c.json(history);
  } catch (error: any) {
    console.error('History fetch error:', error);
    return c.json({ error: error.message }, 500);
  }
});

const historySchema = z.object({
  query: z.string(),
  results: z.array(z.any()),
  timestamp: z.number(),
  stylePhotos: z.array(z.string()).optional(),
});

app.post('/api/history', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const body = await c.req.json();
    const parsed = historySchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: 'Invalid request' }, 400);
    }

    const { query, results, timestamp, stylePhotos } = parsed.data;
    const id = randomUUID();

    const stmt = db.prepare(
      'INSERT INTO search_history (id, user_id, query, results, style_photos, timestamp) VALUES (?, ?, ?, ?, ?, ?)'
    );
    stmt.run(
      id,
      userId,
      query,
      JSON.stringify(results),
      stylePhotos ? JSON.stringify(stylePhotos) : null,
      timestamp
    );

    return c.json({ success: true, id });
  } catch (error: any) {
    console.error('History save error:', error);
    return c.json({ error: error.message }, 500);
  }
});

import { serve } from '@hono/node-server';

const port = 3000;
console.log(`DressCopilot API running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
