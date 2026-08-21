import type { jsPDF } from "jspdf";
import { SITE } from "../site/config";
import { profile } from "./data";

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN_X = 54;
const MARGIN_TOP = 50;
const MARGIN_BOTTOM = 50;
const CONTENT_W = PAGE_W - MARGIN_X * 2;
const LINE = 13;
const INK: [number, number, number] = [17, 17, 17];
const MUTED: [number, number, number] = [55, 55, 55];

function clean(value: string) {
  return value
    .replace(/—/g, "-")
    .replace(/–/g, "-")
    .replace(/·/g, "|")
    .replace(/×/g, "x")
    .replace(/’/g, "'")
    .replace(/“|”/g, '"')
    .replace(/\{notesCount\}/g, "30+")
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

  doc.setProperties({
    title: `${profile.name} Resume`,
    author: profile.name,
    subject: "Resume",
    keywords: profile.stack.join(", "),
    creator: siteUrl,
  });

  function ensure(space: number) {
    if (y + space <= PAGE_H - MARGIN_BOTTOM) return;
    doc.addPage();
    y = MARGIN_TOP;
  }

  function setType(size: number, style: "normal" | "bold", color: [number, number, number] = INK) {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  }

  function linesOf(text: string, size: number, width: number, style: "normal" | "bold" = "normal") {
    setType(size, style);
    return doc.splitTextToSize(clean(text), width) as string[];
  }

  function writeLines(
    rows: string[],
    size: number,
    style: "normal" | "bold" = "normal",
    color: [number, number, number] = INK,
    x = MARGIN_X,
  ) {
    setType(size, style, color);
    for (const row of rows) {
      ensure(LINE);
      doc.text(row, x, y);
      y += LINE;
    }
  }

  function paragraph(text: string, size = 10) {
    writeLines(linesOf(text, size, CONTENT_W), size);
    y += 3;
  }

  function section(title: string) {
    y += 8;
    ensure(28);
    setType(11, "bold");
    doc.text(title.toUpperCase(), MARGIN_X, y);
    y += 6;
    doc.setDrawColor(...INK);
    doc.setLineWidth(0.6);
    doc.line(MARGIN_X, y, PAGE_W - MARGIN_X, y);
    y += 14;
  }

  function headingWithDate(left: string, right: string, size = 11) {
    setType(10, "normal", MUTED);
    const date = clean(right);
    const dateWidth = doc.getTextWidth(date);
    const leftWidth = Math.max(120, CONTENT_W - dateWidth - 16);
    const leftRows = linesOf(left, size, leftWidth, "bold");

    ensure(LINE * leftRows.length);
    setType(size, "bold");
    doc.text(leftRows[0]!, MARGIN_X, y);
    setType(10, "normal", MUTED);
    doc.text(date, PAGE_W - MARGIN_X, y, { align: "right" });
    y += LINE;
    if (leftRows.length > 1) writeLines(leftRows.slice(1), size, "bold");
  }

  function bullet(text: string) {
    const indent = 14;
    const rows = linesOf(text, 10, CONTENT_W - indent);
    setType(10, "normal");
    for (let index = 0; index < rows.length; index += 1) {
      ensure(LINE);
      if (index === 0) doc.text("-", MARGIN_X, y);
      doc.text(rows[index]!, MARGIN_X + indent, y);
      y += LINE;
    }
    y += 1;
  }

  function nameRowIcons(afterX: number, baseline: number) {
    const size = 11;
    const gap = 7;
    const top = baseline - 9;
    const white: [number, number, number] = [255, 255, 255];
    const links = [
      {
        url: siteUrl,
        mark: (x: number) => {
          const cx = x + size / 2;
          const cy = top + size / 2;
          doc.setDrawColor(...white);
          doc.setLineWidth(0.65);
          doc.circle(cx, cy, 3.2, "S");
          doc.ellipse(cx, cy, 1.3, 3.2, "S");
          doc.line(cx - 3.2, cy, cx + 3.2, cy);
        },
      },
      {
        url: SITE.socials.linkedin,
        mark: (x: number) => {
          setType(7, "bold", white);
          doc.text("in", x + size / 2, top + size * 0.74, { align: "center" });
        },
      },
    ];

    links.forEach((item, index) => {
      const x = afterX + index * (size + gap);
      doc.setFillColor(...INK);
      doc.roundedRect(x, top, size, size, 2, 2, "F");
      item.mark(x);
      doc.link(x - 1, top - 1, size + 2, size + 2, { url: item.url });
    });
  }

  setType(20, "bold");
  const name = clean(profile.name);
  doc.text(name, MARGIN_X, y);
  nameRowIcons(MARGIN_X + doc.getTextWidth(name) + 10, y);
  y += 18;
  paragraph(profile.headline, 11);
  setType(10, "normal", MUTED);
  ensure(LINE);
  const phone = profile.phone;
  const phoneSep = " | ";
  doc.textWithLink(phone, MARGIN_X, y, { url: `tel:+91${phone}` });
  const afterPhone = MARGIN_X + doc.getTextWidth(phone);
  doc.text(phoneSep, afterPhone, y);
  doc.textWithLink(SITE.email, afterPhone + doc.getTextWidth(phoneSep), y, { url: `mailto:${SITE.email}` });
  y += LINE + 3;
  paragraph(profile.location, 10);

  section("Experience");
  for (const [jobIndex, job] of profile.experience.entries()) {
    const preview =
      LINE * 3 +
      job.highlights.reduce((sum, item) => sum + linesOf(item, 10, CONTENT_W - 14).length * LINE, 0);
    ensure(Math.min(preview, 72));
    headingWithDate(job.company, job.period);
    paragraph(`${job.role} | ${job.location}`, 10);
    for (const item of job.highlights) bullet(item);
    y += jobIndex < profile.experience.length - 1 ? 6 : 0;
  }

  section("Skills");
  for (const group of profile.technicalSkills) {
    paragraph(`${group.label}: ${group.skills.join(", ")}`, 10);
  }

  section("Education");
  for (const item of profile.education) {
    headingWithDate(item.school, item.period);
    paragraph(`${item.degree} | ${item.location}`, 10);
  }

  doc.save(resumeFilename());
}
