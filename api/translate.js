export default async function handler(request) {
  const url = new URL(request.url);
  const text = url.searchParams.get('text');

  if (!text?.trim()) {
    return Response.json({ text: '' });
  }

  try {
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=en|ur`;
    const response = await fetch(apiUrl);
    const payload = await response.json();
    const translated = payload?.responseData?.translatedText?.trim() || '';

    return Response.json({ text: translated });
  } catch {
    return Response.json({ text: '' }, { status: 500 });
  }
}
