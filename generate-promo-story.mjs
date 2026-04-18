import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FONTS_DIR = path.join(__dirname, '.claude/skills/canvas-design/canvas-fonts');

// Canvas: 1080x1920 px @ 72dpi = 15" x 26.667" but we'll work in px directly
// PDFKit uses points (72pt = 1 inch). 1080x1920px at 96dpi → 810x1440 pt
const W = 810;
const H = 1440;

const doc = new PDFDocument({
  size: [W, H],
  margin: 0,
  info: {
    Title: 'Plantilla Promocional - Historia de Producto',
    Author: 'Geras Media'
  }
});

const outputPath = path.join(__dirname, 'promo-historia-producto.pdf');
doc.pipe(fs.createWriteStream(outputPath));

// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
const WHITE       = '#FFFFFF';
const OFF_WHITE   = '#F9F8F6';
const LIGHT_GREY  = '#EBEBEB';
const MID_GREY    = '#B8B8B8';
const DARK_GREY   = '#2A2A2A';
const NEAR_BLACK  = '#141414';
const ACCENT_BLUE = '#4A7FA5';  // dusty steel blue
const ACCENT_WARM = '#C8A882';  // warm sand gold
const ACCENT_PALE = '#D8E8F0';  // pale ice blue

// ─── BACKGROUND ───────────────────────────────────────────────────────────────
// Pure white base
doc.rect(0, 0, W, H).fill(WHITE);

// Very subtle warm gradient top panel
doc.save();
const topGrad = doc.linearGradient(0, 0, 0, H * 0.18);
topGrad.stop(0, '#F0EDE8').stop(1, WHITE);
doc.rect(0, 0, W, H * 0.18).fill(topGrad);
doc.restore();

// Subtle bottom gradient
doc.save();
const bottomGrad = doc.linearGradient(0, H * 0.82, 0, H);
bottomGrad.stop(0, WHITE).stop(1, '#EEF4F8');
doc.rect(0, H * 0.82, W, H * 0.18).fill(bottomGrad);
doc.restore();

// ─── STRUCTURAL LINES ─────────────────────────────────────────────────────────
// Top horizontal rule
doc.save();
doc.moveTo(60, 78).lineTo(W - 60, 78)
  .lineWidth(0.5).strokeColor(ACCENT_BLUE, 0.35).stroke();
doc.restore();

// Bottom horizontal rule
doc.save();
doc.moveTo(60, H - 78).lineTo(W - 60, H - 78)
  .lineWidth(0.5).strokeColor(ACCENT_BLUE, 0.35).stroke();
doc.restore();

// Left accent thin bar
doc.save();
doc.rect(48, 120, 2, H - 240).fill(ACCENT_BLUE, 0.12);
doc.restore();

// Right accent thin bar
doc.save();
doc.rect(W - 50, 120, 2, H - 240).fill(ACCENT_BLUE, 0.12);
doc.restore();

// ─── TOP BRAND AREA ───────────────────────────────────────────────────────────
// Brand name / logo placeholder area
const brandFont = path.join(FONTS_DIR, 'Jura-Light.ttf');
const boldFont = path.join(FONTS_DIR, 'BricolageGrotesque-Bold.ttf');
const regularFont = path.join(FONTS_DIR, 'BricolageGrotesque-Regular.ttf');
const serifFont = path.join(FONTS_DIR, 'InstrumentSerif-Italic.ttf');
const monoFont = path.join(FONTS_DIR, 'Outfit-Regular.ttf');
const monoBold = path.join(FONTS_DIR, 'Outfit-Bold.ttf');
const lightFont = path.join(FONTS_DIR, 'WorkSans-Regular.ttf');
const lightBoldFont = path.join(FONTS_DIR, 'WorkSans-Bold.ttf');

// Register fonts
doc.registerFont('Jura', brandFont);
doc.registerFont('Bricolage-Bold', boldFont);
doc.registerFont('Bricolage', regularFont);
doc.registerFont('Serif-Italic', serifFont);
doc.registerFont('Outfit', monoFont);
doc.registerFont('Outfit-Bold', monoBold);
doc.registerFont('WorkSans', lightFont);
doc.registerFont('WorkSans-Bold', lightBoldFont);

// TOP: small label "NUEVA LLEGADA" or category pill
const pillX = W / 2 - 80;
const pillY = 30;
doc.save();
doc.roundedRect(pillX, pillY, 160, 30, 15).fill(ACCENT_PALE);
doc.font('Jura').fontSize(9).fillColor(ACCENT_BLUE)
  .text('NUEVA LLEGADA', pillX, pillY + 10, { width: 160, align: 'center' });
doc.restore();

// Brand name placeholder
doc.font('Outfit-Bold').fontSize(18).fillColor(NEAR_BLACK)
  .text('NOMBRE DE LA TIENDA', 68, 84, { width: W - 136, align: 'center', characterSpacing: 2 });

// ─── PRODUCT IMAGE ZONE ───────────────────────────────────────────────────────
const imgZoneX = 80;
const imgZoneY = 148;
const imgZoneW = W - 160;
const imgZoneH = 420;

// Soft shadow behind image zone
doc.save();
doc.rect(imgZoneX + 8, imgZoneY + 8, imgZoneW, imgZoneH)
  .fill('#D8D8D8', 0.25);
doc.restore();

// Image zone background (subtle off-white)
doc.save();
const imgBg = doc.linearGradient(imgZoneX, imgZoneY, imgZoneX + imgZoneW, imgZoneY + imgZoneH);
imgBg.stop(0, '#F7F5F2').stop(0.5, WHITE).stop(1, '#F2F5F7');
doc.roundedRect(imgZoneX, imgZoneY, imgZoneW, imgZoneH, 8).fill(imgBg);
doc.restore();

// Very thin border on image zone
doc.save();
doc.roundedRect(imgZoneX, imgZoneY, imgZoneW, imgZoneH, 8)
  .lineWidth(0.5).strokeColor(LIGHT_GREY).stroke();
doc.restore();

// "Foto del producto" placeholder text inside image zone
doc.font('Outfit').fontSize(11).fillColor(MID_GREY)
  .text('[ FOTO DEL PRODUCTO ]', imgZoneX, imgZoneY + imgZoneH / 2 - 8,
    { width: imgZoneW, align: 'center' });

// Small diagonal lines pattern in image zone (subtle texture)
doc.save();
doc.rect(imgZoneX + 1, imgZoneY + 1, imgZoneW - 2, imgZoneH - 2).clip();
for (let i = 0; i < imgZoneW + imgZoneH; i += 28) {
  doc.moveTo(imgZoneX + i, imgZoneY)
     .lineTo(imgZoneX, imgZoneY + i)
     .lineWidth(0.3).strokeColor('#E8E8E8').stroke();
}
doc.restore();

// ─── PRODUCT NAME ─────────────────────────────────────────────────────────────
const prodNameY = imgZoneY + imgZoneH + 38;

// Overline accent
doc.save();
doc.moveTo(W / 2 - 40, prodNameY - 12).lineTo(W / 2 + 40, prodNameY - 12)
  .lineWidth(1.5).strokeColor(ACCENT_WARM).stroke();
doc.restore();

doc.font('Bricolage-Bold').fontSize(32).fillColor(NEAR_BLACK)
  .text('NOMBRE DEL PRODUCTO', 60, prodNameY, { width: W - 120, align: 'center' });

// Subtitle / model / SKU
doc.font('Serif-Italic').fontSize(14).fillColor(MID_GREY)
  .text('Modelo / Variante / SKU', 60, prodNameY + 44, { width: W - 120, align: 'center' });

// ─── DIVIDER ──────────────────────────────────────────────────────────────────
const divY = prodNameY + 82;
doc.save();
doc.moveTo(60, divY).lineTo(W - 60, divY)
  .lineWidth(0.4).strokeColor(LIGHT_GREY).stroke();
// Small diamond at center
const dX = W / 2;
doc.polygon([dX, divY - 5], [dX + 5, divY], [dX, divY + 5], [dX - 5, divY])
  .fill(ACCENT_BLUE, 0.5);
doc.restore();

// ─── FEATURES SECTION ─────────────────────────────────────────────────────────
const featuresTitle = divY + 28;

doc.font('Jura').fontSize(9).fillColor(ACCENT_BLUE)
  .text('CARACTERÍSTICAS PRINCIPALES', 60, featuresTitle,
    { width: W - 120, align: 'center', characterSpacing: 2.5 });

const features = [
  { icon: '◈', text: 'Alta calidad de materiales' },
  { icon: '◈', text: 'Garantía incluida' },
  { icon: '◈', text: 'Envío rápido y seguro' },
  { icon: '◈', text: 'Atención personalizada' },
];

const featStartY = featuresTitle + 36;
const featRowH = 58;

features.forEach((feat, i) => {
  const fy = featStartY + i * featRowH;

  // Row background (alternating subtlety)
  if (i % 2 === 0) {
    doc.save();
    doc.rect(62, fy - 6, W - 124, featRowH - 8).fill('#F8F8F8');
    doc.restore();
  }

  // Left accent bar per row
  doc.save();
  doc.rect(62, fy - 6, 3, featRowH - 8).fill(ACCENT_BLUE, 0.6);
  doc.restore();

  // Icon circle
  const iconX = 80;
  const iconCY = fy + (featRowH - 8) / 2 - 8;
  doc.save();
  doc.circle(iconX + 14, iconCY + 8, 14).fill(ACCENT_PALE);
  doc.font('Outfit-Bold').fontSize(12).fillColor(ACCENT_BLUE)
    .text(feat.icon, iconX + 5, iconCY + 2, { width: 20, align: 'center' });
  doc.restore();

  // Feature text
  doc.font('WorkSans-Bold').fontSize(13.5).fillColor(DARK_GREY)
    .text(feat.text, 116, fy + 4, { width: W - 180 });

  // Subtle underline
  if (i < features.length - 1) {
    doc.save();
    doc.moveTo(116, fy + featRowH - 12).lineTo(W - 64, fy + featRowH - 12)
      .lineWidth(0.3).strokeColor('#E0E0E0').stroke();
    doc.restore();
  }
});

// ─── PRICE AREA ───────────────────────────────────────────────────────────────
const priceAreaY = featStartY + features.length * featRowH + 24;

// Price badge background
doc.save();
const priceBg = doc.linearGradient(80, priceAreaY - 10, W - 80, priceAreaY + 70);
priceBg.stop(0, '#EEF4F8').stop(1, '#E8F0F6');
doc.roundedRect(80, priceAreaY - 10, W - 160, 80, 6).fill(priceBg);
doc.roundedRect(80, priceAreaY - 10, W - 160, 80, 6)
  .lineWidth(0.4).strokeColor(ACCENT_BLUE, 0.2).stroke();
doc.restore();

// "PRECIO" label
doc.font('Jura').fontSize(9).fillColor(ACCENT_BLUE, 0.8)
  .text('PRECIO', 80, priceAreaY + 2, { width: W - 160, align: 'center', characterSpacing: 2 });

// Price value
doc.font('Bricolage-Bold').fontSize(38).fillColor(NEAR_BLACK)
  .text('$000.00', 80, priceAreaY + 16, { width: W - 160, align: 'center' });

// ─── CTA BUTTON ───────────────────────────────────────────────────────────────
const ctaY = priceAreaY + 100;
const ctaX = W / 2 - 190;
const ctaW = 380;
const ctaH = 56;

// Button shadow
doc.save();
doc.roundedRect(ctaX + 4, ctaY + 4, ctaW, ctaH, 28).fill('#B0C8D8', 0.4);
doc.restore();

// Button fill
doc.save();
const ctaBg = doc.linearGradient(ctaX, ctaY, ctaX + ctaW, ctaY + ctaH);
ctaBg.stop(0, ACCENT_BLUE).stop(1, '#3A6A8F');
doc.roundedRect(ctaX, ctaY, ctaW, ctaH, 28).fill(ctaBg);
doc.restore();

// Button text
doc.font('WorkSans-Bold').fontSize(14).fillColor(WHITE)
  .text('Ver más en nuestra tienda →', ctaX, ctaY + 20, { width: ctaW, align: 'center' });

// ─── BOTTOM AREA ──────────────────────────────────────────────────────────────
const bottomY = ctaY + ctaH + 32;

// Contact / handle placeholder
doc.font('Jura').fontSize(9.5).fillColor(MID_GREY)
  .text('@usuario  ·  linktr.ee/tienda  ·  WhatsApp', 60, bottomY + 12,
    { width: W - 120, align: 'center', characterSpacing: 1 });

// Final bottom rule + tagline
doc.save();
doc.moveTo(60, H - 88).lineTo(W - 60, H - 88)
  .lineWidth(0.4).strokeColor(LIGHT_GREY).stroke();
doc.restore();

doc.font('Serif-Italic').fontSize(11).fillColor(MID_GREY, 0.7)
  .text('Calidad · Confianza · Compromiso', 60, H - 76,
    { width: W - 120, align: 'center' });

// ─── CORNER ACCENTS ───────────────────────────────────────────────────────────
// Top-left geometric corner
doc.save();
doc.moveTo(20, 20).lineTo(55, 20).lineWidth(1).strokeColor(ACCENT_WARM, 0.6).stroke();
doc.moveTo(20, 20).lineTo(20, 55).lineWidth(1).strokeColor(ACCENT_WARM, 0.6).stroke();
doc.restore();

// Top-right geometric corner
doc.save();
doc.moveTo(W - 20, 20).lineTo(W - 55, 20).lineWidth(1).strokeColor(ACCENT_WARM, 0.6).stroke();
doc.moveTo(W - 20, 20).lineTo(W - 20, 55).lineWidth(1).strokeColor(ACCENT_WARM, 0.6).stroke();
doc.restore();

// Bottom-left geometric corner
doc.save();
doc.moveTo(20, H - 20).lineTo(55, H - 20).lineWidth(1).strokeColor(ACCENT_WARM, 0.6).stroke();
doc.moveTo(20, H - 20).lineTo(20, H - 55).lineWidth(1).strokeColor(ACCENT_WARM, 0.6).stroke();
doc.restore();

// Bottom-right geometric corner
doc.save();
doc.moveTo(W - 20, H - 20).lineTo(W - 55, H - 20).lineWidth(1).strokeColor(ACCENT_WARM, 0.6).stroke();
doc.moveTo(W - 20, H - 20).lineTo(W - 20, H - 55).lineWidth(1).strokeColor(ACCENT_WARM, 0.6).stroke();
doc.restore();

// Finalize
doc.end();
console.log('✓ PDF generated at:', outputPath);
console.log('  Dimensions: 810 x 1440 pt (equivalent 9:16 — 1080 x 1920 px at 96dpi)');
