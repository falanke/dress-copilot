import type { VisionRequest, VisionResponse } from '../types';

export async function callZhipuVision(apiKey: string, req: VisionRequest): Promise<VisionResponse> {
  console.log('Calling Zhipu GLM-4.6V...');

  try {
    const response = await fetch('https://api.z.ai/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'GLM-4.6V',
        messages: [{
          role: 'user',
          content: [
            { 
              type: 'image_url', 
              image_url: { 
                url: req.image.startsWith('data:') ? req.image : `data:image/jpeg;base64,${req.image}` 
              } 
            },
            { type: 'text', text: req.prompt }
          ]
        }],
        temperature: 0.1,
        top_p: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Zhipu API Error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    if (!data.choices?.length || !data.choices[0].message?.content) {
      throw new Error('Zhipu API returned an unexpected response: no choices available');
    }
    return {
      content: data.choices[0].message.content,
      usage: data.usage
    };
  } catch (error) {
    console.error('Zhipu API Call Failed:', error);
    throw error;
  }
}
