import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function downloadCertificatePdf(element, filename = 'birth-certificate.pdf') {
  const canvas = await html2canvas(element, {
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
}
