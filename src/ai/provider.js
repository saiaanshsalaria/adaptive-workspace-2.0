const env = require('../config/env');

function createProvider() {
  if (!env.AI_API_KEY || !env.AI_API_URL || typeof fetch !== 'function') return null;
  return {
    async answer(message, sources) {
      const response = await fetch(env.AI_API_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${env.AI_API_KEY}` },
        body: JSON.stringify({
          messages: [{ role: 'system', content: 'Answer only from the supplied context. If it does not answer the question, say it is unavailable. Do not invent facts.' }, { role: 'user', content: `${message}\n\nContext:\n${sources.map((source) => `[${source.title}] ${source.snippet}`).join('\n')}` }]
        })
      });
      if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
      const data = await response.json();
      return data.message || data.text || data.choices?.[0]?.message?.content || null;
    }
  };
}

module.exports = { createProvider };
