import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ensureFontsReady } from './fonts';

export async function downloadCertificatePdf(element, filename = 'birth-certificate.pdf') {
  // Wait for the Urdu webfont to finish loading before rasterizing —
  // otherwise html2canvas can capture the fallback-font layout mid-swap.
  await ensureFontsReady();

  // The live preview always sits inside `.preview-paper-wrap`, which has
  // a `transform: scale(...)` applied (it's how the app fits the letter-
  // size certificate into the panel at different screen widths — see
  // PreviewPanel.css). html2canvas has a long-standing bug where it
  // measures an element's layout through a scaled ancestor but then
  // paints its contents using the original, unscaled CSS values. The
  // mismatch is exactly what caused label/value text to run together in
  // the downloaded PDF, even though the on-screen preview and native
  // Print (which clones the node into a separate, unscaled iframe) both
  // render it correctly.
  //
  // The fix: clone the certificate node into an off-screen container
  // attached directly to <body>, completely outside the scaled wrapper,
  // and capture that clone instead.
  const clone = element.cloneNode(true);
  clone.style.transform = 'none';

  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.top = '0';
  // Positioned off-screen with plain offsets rather than a CSS transform
  // — the wrapper is the direct ancestor of the clone we're capturing,
  // so giving IT a transform would reintroduce the exact bug we're
  // working around.
  wrapper.style.left = '-100000px';
  wrapper.style.zIndex = '-1';
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    const canvas = await html2canvas(clone, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter',
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 612, 792);
    pdf.save(filename);
  } finally {
    document.body.removeChild(wrapper);
  }
}
