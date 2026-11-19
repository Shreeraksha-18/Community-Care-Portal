import { jsPDF } from 'jspdf';

const GREEN = '#0a3d24';
const LIGHT_GREEN = '#16a34a';
const LIGHT_BG = '#f0fdf4';

// ── Volunteer Certificate ─────────────────────────────────────────────────────
export function downloadCertificate({ name, activity, hours, date, category }) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, H, 'F');

  // Dark green border frame
  doc.setDrawColor(10, 61, 36);
  doc.setLineWidth(3);
  doc.rect(8, 8, W - 16, H - 16);
  doc.setLineWidth(0.5);
  doc.rect(11, 11, W - 22, H - 22);

  // Header band
  doc.setFillColor(10, 61, 36);
  doc.rect(8, 8, W - 16, 28, 'F');

  // Brand name in header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('COMMUNITY CARE PORTAL', W / 2, 20, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Empowering Communities Through Collective Action', W / 2, 28, { align: 'center' });

  // Certificate title
  doc.setTextColor(10, 61, 36);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICATE OF PARTICIPATION', W / 2, 60, { align: 'center' });

  // Decorative line
  doc.setDrawColor(22, 163, 74);
  doc.setLineWidth(1);
  doc.line(W / 2 - 60, 65, W / 2 + 60, 65);

  // "This is to certify that"
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('This is to certify that', W / 2, 80, { align: 'center' });

  // Volunteer Name
  doc.setTextColor(10, 61, 36);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text(name || 'Volunteer', W / 2, 95, { align: 'center' });

  // Underline name
  const nameWidth = doc.getTextWidth(name || 'Volunteer');
  doc.setDrawColor(10, 61, 36);
  doc.setLineWidth(0.5);
  doc.line(W / 2 - nameWidth / 2, 97, W / 2 + nameWidth / 2, 97);

  // Description
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('has successfully participated as a volunteer in', W / 2, 110, { align: 'center' });

  // Activity name
  doc.setTextColor(10, 61, 36);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`"${activity || 'Community Service'}"`, W / 2, 122, { align: 'center' });

  // Details row
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text(`Category: ${category || 'Community Support'}     |     Hours Contributed: ${hours || 0} hrs     |     Date: ${date || new Date().toLocaleDateString('en-IN')}`, W / 2, 134, { align: 'center' });

  // Green info box
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(22, 163, 74);
  doc.setLineWidth(0.5);
  doc.roundedRect(W / 2 - 60, 140, 120, 16, 3, 3, 'FD');
  doc.setTextColor(10, 61, 36);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Thank you for making a difference in your community!', W / 2, 150, { align: 'center' });

  // Footer
  doc.setFillColor(10, 61, 36);
  doc.rect(8, H - 30, W - 16, 22, 'F');

  // Signature lines
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.3);
  doc.line(40, H - 16, 100, H - 16);
  doc.line(W - 100, H - 16, W - 40, H - 16);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Volunteer Coordinator', 70, H - 11, { align: 'center' });
  doc.text('Programme Director', W - 70, H - 11, { align: 'center' });

  // Certificate ID
  const certId = `CERT-${Date.now().toString().slice(-8)}`;
  doc.setFontSize(7);
  doc.setTextColor(200, 230, 200);
  doc.text(`Certificate ID: ${certId}  |  Issued: ${new Date().toLocaleDateString('en-IN')}  |  communitycare.org`, W / 2, H - 11, { align: 'center' });

  doc.save(`Certificate_${(name || 'Volunteer').replace(/\s+/g, '_')}_${activity?.replace(/\s+/g, '_') || 'Activity'}.pdf`);
}

// ── Donor Receipt ─────────────────────────────────────────────────────────────
export function downloadReceipt({ receiptId, donorName, donorEmail, campaign, amount, date, pan }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(10, 61, 36);
  doc.rect(0, 0, W, 42, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Community Care Portal', 20, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Donation Receipt — Section 80G Tax Exemption', 20, 26);
  doc.text('communitycare.org  |  support@communitycare.org', 20, 33);

  // Receipt ID badge (top right)
  doc.setFillColor(22, 163, 74);
  doc.roundedRect(W - 55, 10, 45, 22, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('RECEIPT NO.', W - 32, 18, { align: 'center' });
  doc.setFontSize(9);
  doc.text(receiptId || '#REC-0000', W - 32, 26, { align: 'center' });

  // Title
  doc.setTextColor(10, 61, 36);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL DONATION RECEIPT', 20, 58);

  doc.setDrawColor(22, 163, 74);
  doc.setLineWidth(0.8);
  doc.line(20, 61, W - 20, 61);

  // Donor details section
  doc.setFillColor(248, 252, 248);
  doc.rect(20, 66, W - 40, 44, 'F');
  doc.setDrawColor(220, 240, 220);
  doc.setLineWidth(0.3);
  doc.rect(20, 66, W - 40, 44);

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('DONOR INFORMATION', 25, 74);

  const details = [
    ['Donor Name', donorName || 'Donor'],
    ['Email Address', donorEmail || '—'],
    ['PAN Number', pan || 'Not provided'],
    ['Date of Donation', date || new Date().toLocaleDateString('en-IN')],
  ];

  details.forEach(([label, value], i) => {
    const y = 82 + i * 9;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text(label + ':', 25, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(String(value), 80, y);
  });

  // Donation details
  doc.setTextColor(10, 61, 36);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Donation Details', 20, 122);

  doc.setDrawColor(22, 163, 74);
  doc.setLineWidth(0.5);
  doc.line(20, 125, W - 20, 125);

  // Table header
  doc.setFillColor(10, 61, 36);
  doc.rect(20, 128, W - 40, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Campaign / Fund', 25, 135);
  doc.text('Payment Mode', 110, 135);
  doc.text('Amount (INR)', W - 25, 135, { align: 'right' });

  // Table row
  doc.setFillColor(240, 253, 244);
  doc.rect(20, 138, W - 40, 12, 'F');
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(campaign || 'General Fund', 25, 146);
  doc.text('Online Payment', 110, 146);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 61, 36);
  doc.text(`Rs. ${Number(amount || 0).toLocaleString('en-IN')}`, W - 25, 146, { align: 'right' });

  // Total box
  doc.setFillColor(10, 61, 36);
  doc.rect(20, 152, W - 40, 14, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Amount Donated:', 25, 161);
  doc.text(`Rs. ${Number(amount || 0).toLocaleString('en-IN')}/-`, W - 25, 161, { align: 'right' });

  // Amount in words
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text(`Amount in words: ${numberToWords(Number(amount || 0))} Rupees Only`, 20, 174);

  // 80G Notice
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(22, 163, 74);
  doc.setLineWidth(0.5);
  doc.roundedRect(20, 180, W - 40, 24, 3, 3, 'FD');

  doc.setTextColor(10, 61, 36);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('80G TAX EXEMPTION', 25, 188);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(8);
  doc.text('This donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961.', 25, 195);
  doc.text('Please retain this receipt for your Income Tax Return filing.', 25, 201);

  // Footer
  doc.setFillColor(10, 61, 36);
  doc.rect(0, 262, W, 35, 'F');

  doc.setDrawColor(22, 163, 74);
  doc.setLineWidth(0.3);
  doc.line(W / 2, 270, W / 2, 288);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Authorised Signatory', 55, 278, { align: 'center' });
  doc.text('For Community Care Portal', W - 55, 278, { align: 'center' });

  doc.setDrawColor(200, 230, 200);
  doc.line(20, 283, 90, 283);
  doc.line(W - 90, 283, W - 20, 283);

  doc.setFontSize(7);
  doc.setTextColor(180, 220, 180);
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')}  |  Receipt: ${receiptId}  |  This is a system-generated receipt`, W / 2, 293, { align: 'center' });

  doc.save(`Receipt_${receiptId || 'donation'}_${(donorName || 'donor').replace(/\s+/g, '_')}.pdf`);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function numberToWords(num) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';
  if (num < 20) return ones[num];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
  return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numberToWords(num % 10000000) : '');
}
