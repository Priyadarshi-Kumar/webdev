import type { jsPDF } from "jspdf";
import { SITE } from "../site/config";
import { profile } from "./data";
import { resumeContent } from "./resume-data";

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN_X = 54;
const MARGIN_TOP = 44;
const MARGIN_BOTTOM = 48;
const CONTENT_W = PAGE_W - MARGIN_X * 2;
const LINE = 12;
const BULLET_X = MARGIN_X + 2;
const TEXT_X = MARGIN_X + 12;

const INK: [number, number, number] = [24, 24, 27];
const MUTED: [number, number, number] = [82, 82, 91];
const ACCENT: [number, number, number] = [3, 105, 161];
const RULE: [number, number, number] = [212, 212, 216];

function clean(value: string) {
  return value
    .replace(/—/g, "-")
    .replace(/–/g, "-")
    .replace(/·/g, " | ")
    .replace(/×/g, "x")
    .replace(/’/g, "'")
    .replace(/“|”/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function resumeFilename() {
  return `${profile.name.replace(/\s+/g, "-")}-Resume.pdf`;
}

export function downloadResume() {
  if (typeof window === "undefined") return;
  void import("jspdf/dist/jspdf.es.min.js").then((mod: { jsPDF?: typeof jsPDF; default?: typeof jsPDF }) => {
    const Ctor = mod.jsPDF ?? mod.default;
    if (Ctor) writeResumePdf(Ctor);
  });
}

function writeResumePdf(JsPDF: typeof jsPDF) {
  const doc = new JsPDF({ unit: "pt", format: "letter" });
  const siteUrl = SITE.url.replace(/\/$/, "");
  let y = MARGIN_TOP;
  let page = 1;

  doc.setProperties({
    title: `${profile.name} - Resume`,
    author: profile.name,
    subject: "Resume",
    keywords: profile.stack.join(", "),
    creator: siteUrl,
  });

  function bottomLimit() {
    return PAGE_H - MARGIN_BOTTOM;
  }

  function ensure(space: number) {
    if (y + space <= bottomLimit()) return;
    drawFooter();
    doc.addPage();
    page += 1;
    y = MARGIN_TOP;
  }

  function setType(size: number, style: "normal" | "bold" | "italic", color: [number, number, number] = INK) {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  }

  function wrap(text: string, size: number, width = CONTENT_W) {
    doc.setFontSize(size);
    return doc.splitTextToSize(clean(text), width) as string[];
  }

  function drawFooter() {
    setType(8, "normal", MUTED);
    doc.text(`${profile.name}  |  Page ${page}`, PAGE_W / 2, PAGE_H - 24, { align: "center" });
  }

  function drawRule(gapBefore = 8, gapAfter = 10) {
    y += gapBefore;
    ensure(gapAfter + 2);
    doc.setDrawColor(...RULE);
    doc.setLineWidth(0.5);
    doc.line(MARGIN_X, y, PAGE_W - MARGIN_X, y);
    y += gapAfter;
  }

  function section(title: string) {
    drawRule();
    setType(8.5, "bold", ACCENT);
    doc.text(title.toUpperCase(), MARGIN_X, y);
    y += 13;
  }

  function textBlock(text: string, size = 10, width = CONTENT_W, gapAfter = 5) {
    const rows = wrap(text, size, width);
    setType(size, "normal");
    for (const row of rows) {
      ensure(LINE);
      doc.text(row, MARGIN_X, y);
      y += LINE;
    }
    y += gapAfter;
  }

  function drawBullet(text: string) {
    const rows = wrap(text, 9.5, CONTENT_W - 14);
    setType(9.5, "normal");
    for (let index = 0; index < rows.length; index += 1) {
      ensure(LINE);
      if (index === 0) {
        doc.text("\u2022", BULLET_X, y);
        doc.text(rows[index]!, TEXT_X, y);
      } else {
        doc.text(rows[index]!, TEXT_X, y);
      }
      y += LINE;
    }
    y += 2;
  }

  function drawContactRow() {
    const items = [
      { label: SITE.email, url: `mailto:${SITE.email}` },
      { label: "LinkedIn", url: SITE.socials.linkedin },
      { label: "GitHub", url: SITE.socials.github },
      { label: siteUrl.replace(/^https?:\/\//, ""), url: siteUrl },
    ];

    const separator = "  |  ";
    let lineX = MARGIN_X;
    let lineStarted = false;

    setType(9, "normal", ACCENT);

    for (let index = 0; index < items.length; index += 1) {
      const item = items[index]!;
      const piece = (lineStarted ? separator : "") + item.label;
      const pieceWidth = doc.getTextWidth(piece);

      if (lineX + pieceWidth > PAGE_W - MARGIN_X && lineStarted) {
        y += LINE;
        ensure(LINE);
        lineX = MARGIN_X;
        lineStarted = false;
      }

      if (!lineStarted) {
        doc.textWithLink(item.label, lineX, y, { url: item.url });
        lineX += doc.getTextWidth(item.label);
        lineStarted = true;
      } else {
        setType(9, "normal", MUTED);
        doc.text(separator, lineX, y);
        lineX += doc.getTextWidth(separator);
        setType(9, "normal", ACCENT);
        doc.textWithLink(item.label, lineX, y, { url: item.url });
        lineX += doc.getTextWidth(item.label);
      }
    }

    y += 16;
  }

  // Header
  setType(20, "bold");
  doc.text(clean(profile.name), MARGIN_X, y);
  y += 18;

  setType(10.5, "normal", MUTED);
  doc.text(clean(profile.headline), MARGIN_X, y);
  y += 14;

  setType(9, "normal", MUTED);
  doc.text(clean(`${profile.location}  |  ${profile.availability}`), MARGIN_X, y);
  y += 13;

  drawContactRow();
  drawRule(0, 12);

  // Summary
  section("Summary");
  textBlock(resumeContent.summary, 9.5);

  // Highlights
  section("Selected highlights");
  for (const highlight of resumeContent.highlights) {
    drawBullet(highlight);
  }
  y += 2;

  // Experience
  section("Experience");
  for (const [jobIndex, job] of resumeContent.experience.entries()) {
    ensure(36);
    setType(10.5, "bold");
    doc.text(clean(job.company), MARGIN_X, y);
    setType(9, "normal", MUTED);
    doc.text(clean(job.period), PAGE_W - MARGIN_X, y, { align: "right" });
    y += 12;

    setType(9.5, "normal");
    doc.text(clean(`${job.role}  |  ${job.location}`), MARGIN_X, y);
    y += 11;

    for (const bullet of job.bullets) {
      drawBullet(bullet);
    }

    y += jobIndex < resumeContent.experience.length - 1 ? 4 : 0;
  }

  // Skills
  section("Technical skills");
  for (const group of resumeContent.skills) {
    ensure(LINE * 2);
    setType(9.5, "bold");
    const label = `${clean(group.label)}: `;
    const labelWidth = doc.getTextWidth(label);
    doc.text(label, MARGIN_X, y);

    const rows = wrap(group.skills.join(", "), 9.5, CONTENT_W - labelWidth);
    setType(9.5, "normal");
    for (let index = 0; index < rows.length; index += 1) {
      if (index > 0) {
        ensure(LINE);
        y += LINE;
      }
      doc.text(rows[index]!, MARGIN_X + (index === 0 ? labelWidth : 0), y);
    }
    y += LINE + 1;
  }

  // Education
  section("Education");
  for (const item of profile.education) {
    ensure(28);
    setType(10.5, "bold");
    doc.text(clean(item.school), MARGIN_X, y);
    setType(9, "normal", MUTED);
    doc.text(clean(item.period), PAGE_W - MARGIN_X, y, { align: "right" });
    y += 12;

    setType(9.5, "normal");
    doc.text(clean(`${item.degree}  |  ${item.location}`), MARGIN_X, y);
    y += 8;
  }

  drawFooter();
  doc.save(resumeFilename());
}
