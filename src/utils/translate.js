const cache = new Map();

export async function translateEnToUr(text) {
  const trimmed = text?.trim();
  if (!trimmed) return '';

  if (cache.has(trimmed)) {
    return cache.get(trimmed);
  }

  let translated = '';

  try {
    const response = await fetch(`/api/translate?text=${encodeURIComponent(trimmed)}`);
    if (response.ok) {
      const payload = await response.json();
      translated = payload.text?.trim() || '';
    }
  } catch {
    // fall through to direct API for local dev
  }

  if (!translated) {
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=en|ur`,
      );
      const payload = await response.json();
      translated = payload?.responseData?.translatedText?.trim() || '';
    } catch {
      translated = '';
    }
  }

  if (translated) {
    cache.set(trimmed, translated);
  }

  return translated;
}
