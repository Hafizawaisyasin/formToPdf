# Birth Registration Certificate Generator

React app to fill, preview, print, and download a **Government of Punjab Birth Registration Certificate** matching your sample PDF layout (bilingual English/Urdu, Punjab monogram, Quaid-e-Azam watermark, QR code).

## Features

- Editable form for all certificate fields (English + Urdu)
- Live preview matching official layout
- **Print Certificate** — direct browser print
- **Download PDF** — exports as letter-size PDF

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build for deployment

```bash
npm run build
```

Deploy the `dist` folder for free on:

- [Vercel](https://vercel.com) — import repo, build command `npm run build`, output `dist`
- [Netlify](https://netlify.com) — same settings
- [Cloudflare Pages](https://pages.cloudflare.com) — same settings

## Assets

Images were extracted from your sample PDF:

- Punjab government monogram
- Quaid-e-Azam watermark portrait
- Header barcode (static image from sample)

## Notes

- Urdu uses **Noto Nastaliq Urdu** (web font). The original PDF uses `URDUTypesetting`; for pixel-perfect Urdu you can add that font file to `public/fonts/` and reference it in CSS.
- The top barcode is currently the sample image. If you need a **dynamic PDF417 barcode** from Tracking ID, that can be added with a barcode library.
- QR code updates automatically from the **QR Code Value** field (defaults to Tracking ID).

## Project structure

```
src/
  components/   CertificatePreview, CertificateForm
  data/         default field values & form config
  utils/        PDF export helper
public/assets/  monogram, watermark, barcode images
```
