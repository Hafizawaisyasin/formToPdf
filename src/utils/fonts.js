// The certificate mixes system fonts (Calibri/Arial) with a webfont
// (Noto Nastaliq Urdu, loaded via Google Fonts with `display=swap`).
// `display=swap` means the browser paints the fallback font first and
// swaps in the real font whenever it finishes downloading. If a print or
// PDF export is triggered during that window, the export captures the
// fallback-font layout — which has very different character widths for
// Urdu — and rows/columns that were sized for Nastaliq end up with text
// spilling into neighboring cells (the "overlapping text" bug).
//
// Explicitly requesting + awaiting the exact font faces before any
// export/print guarantees the real font is applied first.
const CERT_FONTS = [
  '400 16px "Noto Nastaliq Urdu"',
  '700 16px "Noto Nastaliq Urdu"',
];

export async function ensureFontsReady() {
  if (typeof document === 'undefined' || !document.fonts) return;
  try {
    await Promise.all(CERT_FONTS.map((font) => document.fonts.load(font)));
    await document.fonts.ready;
  } catch {
    // If font loading fails for any reason, fall back to whatever is
    // available rather than blocking the print/export action.
  }
}
