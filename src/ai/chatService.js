const { retrieve } = require('./retrieval');
const { createProvider } = require('./provider');

function deterministicAnswer(message, sources) {
  if (!sources.length) return 'This information is unavailable in your workspace context.';
  const excerpts = sources.slice(0, 3).map((source) => `${source.title}: ${source.snippet.trim()}`).join(' ');
  if (/\b(summary|summarize|overview|brief)\b/i.test(message)) {
    return `Here is a summary based on your workspace context: ${excerpts}`;
  }
  return `Based on your workspace context: ${excerpts}`;
}

async function chat(message, userId) {
  const sources = await retrieve(userId, message);
  const safeSources = sources.map(({ type, id, title, snippet, score: relevance }) => ({ type, id, title, snippet: snippet.slice(0, 500), relevance }));
  let response = null;
  const provider = createProvider();
  if (provider && safeSources.length) {
    try { response = await provider.answer(message, safeSources); } catch { response = null; }
  }
  const messageText = response || deterministicAnswer(message, safeSources);
  const suggestions = safeSources.length
    ? ['Ask about a specific document or task', 'Ask for a summary of the retrieved context']
    : ['Upload a document', 'Create a task or project'];
  return {
    message: messageText,
    sources: safeSources,
    suggestions,
    actions: []
  };
}

module.exports = { chat, deterministicAnswer };
