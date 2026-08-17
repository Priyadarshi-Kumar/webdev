import type { jsPDF } from "jspdf";
import { SITE } from "../site/config";
import { profile } from "./data";

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN_X = 54;
const MARGIN_Y = 50;
const MAX_W = PAGE_W - MARGIN_X * 2;
const LINE = 13;
const INK: [number, number, number] = [24, 24, 27];
const MUTED: [number, number, number] = [82, 82, 91];

function clean(value: string) {
  return value
    .replace(/—/g, "-")
    .replace(/–/g, "-")
    .replace(/·/g, "|")
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
  const bottom = PAGE_H - 48;
  let y = MARGIN_Y;
  const siteUrl = SITE.url.replace(/\/$/, "");
  const keywords = [
    ...profile.stack,
    ...profile.technicalSkills.flatMap((group) => group.skills),
    "Full-Stack",
    "Lead Software Engineer",
  ]
    .filter((item, index, list) => list.indexOf(item) === index)
    .join(", ");

  doc.setProperties({
    title: `${profile.name} Resume`,
    author: profile.name,
    subject: "Resume",
    keywords,
    creator: siteUrl,
  });

  function ensure(space: number) {
    if (y + space <= bottom) return;
    doc.addPage();
    y = MARGIN_Y;
  }

  function setType(size: number, style: "normal" | "bold", color: [number, number, number] = INK) {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  }

  function wrap(text: string, size: number, width = MAX_W) {
    doc.setFontSize(size);
    return doc.splitTextToSize(clean(text), width) as string[];
  }

  function section(title: string) {
    y += 12;
    ensure(26);
    setType(11, "bold");
    doc.text(title.toUpperCase(), MARGIN_X, y);
    y += 5;
    doc.setDrawColor(...INK);
    doc.setLineWidth(0.6);
    doc.line(MARGIN_X, y, PAGE_W - MARGIN_X, y);
    y += 14;
  }

  function linkedLine(label: string, url: string) {
    const rows = wrap(label, 10);
    setType(10, "normal");
    for (const [index, row] of rows.entries()) {
      ensure(LINE);
      if (index === 0) doc.textWithLink(row, MARGIN_X, y, { url });
      else doc.text(row, MARGIN_X, y);
      y += LINE;
    }
  }

  setType(20, "bold");
  doc.text(clean(profile.name), MARGIN_X, y);
  y += 16;
  setType(11, "normal");
  doc.text(clean(profile.headline), MARGIN_X, y);
  y += 14;
  setType(10, "normal", MUTED);
  doc.text(clean(`${profile.location} | ${profile.availability}`), MARGIN_X, y);
  y += 16;

  linkedLine(SITE.email, `mailto:${SITE.email}`);
  linkedLine(siteUrl, siteUrl);
  linkedLine(SITE.socials.linkedin, SITE.socials.linkedin);
  linkedLine(SITE.socials.github, SITE.socials.github);
  y += 4;

  for (const paragraph of profile.bio) {
    const rows = wrap(paragraph, 10);
    setType(10, "normal");
    for (const row of rows) {
      ensure(LINE);
      doc.text(row, MARGIN_X, y);
      y += LINE;
    }
    y += 4;
  }

  section("Experience");
  for (const job of profile.experience) {
    ensure(48);
    setType(11, "bold");
    doc.text(clean(job.company), MARGIN_X, y);
    setType(10, "normal", MUTED);
    doc.text(clean(job.period), PAGE_W - MARGIN_X, y, { align: "right" });
    y += 14;
    setType(10, "normal");
    doc.text(clean(`${job.role} | ${job.location}`), MARGIN_X, y);
    y += 13;
    for (const item of job.highlights) {
      const rows = wrap(`- ${item}`, 10, MAX_W);
      setType(10, "normal");
      for (const row of rows) {
        ensure(LINE);
        doc.text(row, MARGIN_X, y);
        y += LINE;
      }
      y += 2;
    }
    y += 8;
  }

  section("Skills");
  const labelW = 150;
  for (const group of profile.technicalSkills) {
    const skillRows = wrap(group.skills.join(", "), 10, MAX_W - labelW);
    ensure(skillRows.length * LINE + 4);
    setType(10, "bold");
    doc.text(`${clean(group.label)}:`, MARGIN_X, y);
    setType(10, "normal");
    for (const [index, row] of skillRows.entries()) {
      if (index > 0) ensure(LINE);
      doc.text(row, MARGIN_X + labelW, y);
      y += LINE;
    }
    y += 4;
  }

  section("Education");
  for (const item of profile.education) {
    ensure(36);
    setType(11, "bold");
    doc.text(clean(item.school), MARGIN_X, y);
    setType(10, "normal", MUTED);
    doc.text(clean(item.period), PAGE_W - MARGIN_X, y, { align: "right" });
    y += 14;
    setType(10, "normal");
    doc.text(clean(`${item.degree} | ${item.location}`), MARGIN_X, y);
    y += 8;
  }

  doc.save(resumeFilename());
}
