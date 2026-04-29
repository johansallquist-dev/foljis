import jsPDF from "jspdf";
import { AppState, todayKey } from "./types";
import { ACHIEVEMENTS } from "./achievements";
import { SPECIES } from "@/components/Companion";
import { FEELINGS } from "./tips";

function last7Dates(): string[] {
  const out: string[] = [];
  for (let i = 6; i >= 0; i--) {
    out.push(todayKey(new Date(Date.now() - i * 86400000)));
  }
  return out;
}

const WEEKDAYS = ["sön", "mån", "tis", "ons", "tor", "fre", "lör"];

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${WEEKDAYS[d.getDay()]} ${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function buildReportText(state: AppState): string {
  const species = SPECIES.find(s => s.id === state.companionSpecies);
  const days = last7Dates();
  const morningStats = days.map(d => {
    const h = state.routineHistory.find(x => x.date === d);
    return { date: d, done: h?.itemIds.length ?? 0, total: state.routine.length };
  });
  const eveningStats = days.map(d => {
    const h = state.eveningHistory.find(x => x.date === d);
    return { date: d, done: h?.itemIds.length ?? 0, total: state.eveningRoutine.length };
  });

  // Mood last 7 days
  const recentMoods = state.moodEntries.filter(m => {
    const day = m.date.slice(0, 10);
    return days.includes(day);
  });
  const avgMood = recentMoods.length
    ? (recentMoods.reduce((a, b) => a + b.mood, 0) / recentMoods.length).toFixed(1)
    : "–";

  // Feeling counts
  const feelingCounts: Record<string, number> = {};
  recentMoods.forEach(m => {
    if (m.feeling) feelingCounts[m.feeling] = (feelingCounts[m.feeling] ?? 0) + 1;
  });
  const topFeelings = Object.entries(feelingCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Lesson ratings last 7 days
  const recentLessons = state.lessonCompletions.filter(c => days.includes(c.date));
  const ratings = { good: 0, ok: 0, bad: 0, none: 0 };
  recentLessons.forEach(c => {
    if (c.rating === "good") ratings.good++;
    else if (c.rating === "ok") ratings.ok++;
    else if (c.rating === "bad") ratings.bad++;
    else ratings.none++;
  });

  const unlocked = ACHIEVEMENTS.filter(a => state.unlockedAchievements.includes(a.id));

  const lines: string[] = [];
  lines.push(`Sammanställning – ${state.companionName}`);
  lines.push(`Skapad: ${formatDate(new Date().toISOString())}`);
  lines.push("");
  lines.push("Översikt");
  lines.push(`• Följis: ${state.companionName} (${species?.name ?? ""})`);
  lines.push(`• Följispoäng: ${state.points}`);
  lines.push(`• Streak: ${state.streak} dagar`);
  lines.push(`• Achievements: ${unlocked.length} av ${ACHIEVEMENTS.length}`);
  lines.push("");

  lines.push("Morgonrutin – senaste 7 dagarna");
  morningStats.forEach(s => {
    const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
    lines.push(`• ${formatDate(s.date)}: ${s.done}/${s.total} (${pct}%)`);
  });
  lines.push("");

  lines.push("Kvällsrutin – senaste 7 dagarna");
  eveningStats.forEach(s => {
    const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
    lines.push(`• ${formatDate(s.date)}: ${s.done}/${s.total} (${pct}%)`);
  });
  lines.push("");

  lines.push("Mående – senaste 7 dagarna");
  lines.push(`• Antal incheckningar: ${recentMoods.length}`);
  lines.push(`• Snittmående (1–5): ${avgMood}`);
  if (topFeelings.length) {
    lines.push(`• Vanligaste känslor:`);
    topFeelings.forEach(([f, n]) => {
      const fInfo = FEELINGS.find(x => x.value === f);
      lines.push(`   – ${fInfo?.emoji ?? ""} ${f}: ${n} ggr`);
    });
  }
  lines.push("");

  lines.push("Aktiviteter – hur det kändes (senaste 7 dagarna)");
  lines.push(`• Bra: ${ratings.good}`);
  lines.push(`• Mittemellan: ${ratings.ok}`);
  lines.push(`• Dåligt: ${ratings.bad}`);
  lines.push(`• Utan betyg: ${ratings.none}`);
  lines.push("");

  if (unlocked.length) {
    lines.push("Achievements upplåsta");
    unlocked.forEach(a => lines.push(`• ${a.title} – ${a.description}`));
    lines.push("");
  }

  // Recent mood notes
  const notes = recentMoods.filter(m => m.note && m.note.trim()).slice(0, 5);
  if (notes.length) {
    lines.push("Egna anteckningar (senaste)");
    notes.forEach(n => {
      lines.push(`• ${formatDate(n.date.slice(0, 10))}: "${n.note}"`);
    });
    lines.push("");
  }

  lines.push("—");
  lines.push("Den här sammanställningen är skapad av eleven själv i appen Följis och");
  lines.push("är tänkt att delas med vårdnadshavare eller mentor som ett samtalsunderlag.");

  return lines.join("\n");
}

export function generateReportPdf(state: AppState): Blob {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const species = SPECIES.find(s => s.id === state.companionSpecies);
  const today = formatDate(new Date().toISOString());

  // Header band
  doc.setFillColor(255, 237, 213); // warm peach
  doc.rect(0, 0, pageWidth, 90, "F");
  doc.setTextColor(60, 40, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(`Sammanställning – ${state.companionName}`, margin, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Skapad ${today} · Följis: ${species?.name ?? ""}`, margin, 70);
  y = 120;

  doc.setTextColor(20, 20, 20);

  const writeHeading = (text: string) => {
    if (y > pageHeight - margin - 40) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(text, margin, y);
    y += 8;
    doc.setDrawColor(220, 200, 180);
    doc.line(margin, y, pageWidth - margin, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
  };

  const writeLine = (text: string, indent = 0) => {
    const wrapped = doc.splitTextToSize(text, maxWidth - indent);
    wrapped.forEach((line: string) => {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin + indent, y);
      y += 15;
    });
  };

  // Översikt – stat boxes
  writeHeading("Översikt");
  const stats = [
    { label: "Följispoäng", value: String(state.points) },
    { label: "Streak", value: `${state.streak} d` },
    { label: "Achievements", value: `${state.unlockedAchievements.length}/${ACHIEVEMENTS.length}` },
    { label: "Mående-check", value: String(state.moodEntries.length) },
  ];
  const boxW = (maxWidth - 24) / 4;
  stats.forEach((s, i) => {
    const x = margin + i * (boxW + 8);
    doc.setFillColor(247, 240, 232);
    doc.roundedRect(x, y, boxW, 56, 8, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(40, 30, 20);
    doc.text(s.value, x + 12, y + 26);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(110, 100, 90);
    doc.text(s.label, x + 12, y + 44);
  });
  y += 72;
  doc.setTextColor(20, 20, 20);

  // Routines
  const days = last7Dates();
  const renderRoutine = (title: string, history: typeof state.routineHistory, total: number) => {
    writeHeading(title);
    days.forEach(d => {
      const h = history.find(x => x.date === d);
      const done = h?.itemIds.length ?? 0;
      const pct = total ? Math.round((done / total) * 100) : 0;
      // Date + text
      doc.text(`${formatDate(d)}`, margin, y);
      doc.text(`${done}/${total}`, margin + 110, y);
      // Progress bar
      const barX = margin + 160;
      const barW = maxWidth - 200;
      doc.setFillColor(235, 230, 220);
      doc.roundedRect(barX, y - 9, barW, 12, 3, 3, "F");
      doc.setFillColor(150, 200, 160);
      doc.roundedRect(barX, y - 9, (barW * pct) / 100, 12, 3, 3, "F");
      doc.text(`${pct}%`, barX + barW + 8, y);
      y += 18;
    });
    y += 6;
  };
  renderRoutine("Morgonrutin (senaste 7 dagarna)", state.routineHistory, state.routine.length);
  renderRoutine("Kvällsrutin (senaste 7 dagarna)", state.eveningHistory, state.eveningRoutine.length);

  // Mood
  writeHeading("Mående – senaste 7 dagarna");
  const recentMoods = state.moodEntries.filter(m => days.includes(m.date.slice(0, 10)));
  const avgMood = recentMoods.length
    ? (recentMoods.reduce((a, b) => a + b.mood, 0) / recentMoods.length).toFixed(1)
    : "–";
  writeLine(`Antal incheckningar: ${recentMoods.length}`);
  writeLine(`Snittmående (1–5): ${avgMood}`);
  const feelingCounts: Record<string, number> = {};
  recentMoods.forEach(m => {
    if (m.feeling) feelingCounts[m.feeling] = (feelingCounts[m.feeling] ?? 0) + 1;
  });
  const topFeelings = Object.entries(feelingCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (topFeelings.length) {
    writeLine("Vanligaste känslor:");
    topFeelings.forEach(([f, n]) => writeLine(`• ${f} – ${n} ggr`, 10));
  }
  y += 4;

  // Activity ratings
  writeHeading("Aktiviteter – hur det kändes");
  const recentLessons = state.lessonCompletions.filter(c => days.includes(c.date));
  const ratings = { good: 0, ok: 0, bad: 0, none: 0 };
  recentLessons.forEach(c => {
    if (c.rating === "good") ratings.good++;
    else if (c.rating === "ok") ratings.ok++;
    else if (c.rating === "bad") ratings.bad++;
    else ratings.none++;
  });
  writeLine(`Bra: ${ratings.good}    Mittemellan: ${ratings.ok}    Dåligt: ${ratings.bad}    Utan betyg: ${ratings.none}`);
  y += 6;

  // Per-activity breakdown by colour
  const lessonById = new Map(state.schedule.map(l => [l.id, l]));
  const buckets: Record<"good" | "ok" | "bad", { name: string; date: string }[]> = {
    good: [], ok: [], bad: [],
  };
  recentLessons.forEach(c => {
    if (!c.rating || c.rating === "none") return;
    const lesson = lessonById.get(c.lessonId);
    const name = lesson ? `${lesson.emoji} ${lesson.subject}` : "Okänd aktivitet";
    buckets[c.rating].push({ name, date: c.date });
  });

  const renderBucket = (
    label: string,
    color: [number, number, number],
    items: { name: string; date: string }[],
  ) => {
    if (y > pageHeight - margin - 30) { doc.addPage(); y = margin; }
    // Color dot
    doc.setFillColor(color[0], color[1], color[2]);
    doc.circle(margin + 5, y - 4, 5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    doc.text(`${label} (${items.length})`, margin + 16, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    if (items.length === 0) {
      doc.setTextColor(140, 140, 140);
      writeLine("Inga aktiviteter markerade.", 16);
      doc.setTextColor(20, 20, 20);
    } else {
      // Group by activity name with count
      const counts = new Map<string, number>();
      items.forEach(i => counts.set(i.name, (counts.get(i.name) ?? 0) + 1));
      Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .forEach(([name, n]) => writeLine(`• ${name} – ${n} ggr`, 16));
    }
    y += 4;
  };

  renderBucket("🟢 Bra", [120, 180, 130], buckets.good);
  renderBucket("🟡 Mittemellan", [230, 200, 90], buckets.ok);
  renderBucket("🔴 Dåligt", [220, 110, 110], buckets.bad);
  y += 4;

  // Notes
  const notes = recentMoods.filter(m => m.note && m.note.trim()).slice(0, 5);
  if (notes.length) {
    writeHeading("Egna anteckningar");
    notes.forEach(n => writeLine(`${formatDate(n.date.slice(0, 10))}: "${n.note}"`));
  }

  // Achievements
  const unlocked = ACHIEVEMENTS.filter(a => state.unlockedAchievements.includes(a.id));
  if (unlocked.length) {
    writeHeading(`Achievements upplåsta (${unlocked.length})`);
    unlocked.forEach(a => writeLine(`• ${a.title} – ${a.description}`));
  }

  // Footer note
  if (y > pageHeight - margin - 60) {
    doc.addPage();
    y = margin;
  } else {
    y += 12;
  }
  doc.setDrawColor(220, 200, 180);
  doc.line(margin, y, pageWidth - margin, y);
  y += 16;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(110, 100, 90);
  const footer =
    "Den här sammanställningen är skapad av eleven själv i appen Följis och är tänkt som ett samtalsunderlag att dela med vårdnadshavare eller mentor.";
  doc.splitTextToSize(footer, maxWidth).forEach((line: string) => {
    doc.text(line, margin, y);
    y += 12;
  });

  return doc.output("blob");
}

export async function shareReport(state: AppState) {
  const blob = generateReportPdf(state);
  const filename = `foljis-sammanstallning-${state.companionName.toLowerCase().replace(/\s+/g, "-")}-${todayKey()}.pdf`;
  const file = new File([blob], filename, { type: "application/pdf" });

  // Try Web Share API with files first (mobile)
  const navAny = navigator as Navigator & {
    canShare?: (data: { files?: File[] }) => boolean;
    share?: (data: { files?: File[]; title?: string; text?: string }) => Promise<void>;
  };
  if (navAny.canShare && navAny.canShare({ files: [file] }) && navAny.share) {
    try {
      await navAny.share({
        files: [file],
        title: `Sammanställning från ${state.companionName}`,
        text: "Min sammanställning från Följis-appen.",
      });
      return "shared";
    } catch (e) {
      // User cancelled or failed – fall through to download
    }
  }

  // Fallback: download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return "downloaded";
}
