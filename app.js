/* Sculptor's Playbook v2
   No build step: React 18 + htm, loaded in index.html. */
"use strict";
(function () {
const { useState, useEffect, useMemo, useRef, useCallback } = React;
const html = htm.bind(React.createElement);

/* ------------------------------------------------------------------ */
/* Movement library. History and PRs are stored per movement, so a    */
/* lift keeps its history wherever it appears in the week.             */
/* inc = the weight jump suggested once you top the rep range.         */
/* ------------------------------------------------------------------ */
const M = {
  // Glutes and legs
  "hip-thrust":         { name: "Barbell hip thrust", inc: 2.5 },
  "smith-hip-thrust":   { name: "Smith machine hip thrust", inc: 2.5 },
  "machine-hip-thrust": { name: "Hip thrust machine", inc: 5 },
  "sl-hip-thrust":      { name: "Single-leg hip thrust", inc: 2.5 },
  "bss":                { name: "Bulgarian split squat", inc: 2 },
  "reverse-lunge":      { name: "Deficit reverse lunge", inc: 2 },
  "walking-lunge":      { name: "Walking lunge", inc: 2 },
  "leg-press":          { name: "Leg press, feet high and wide", inc: 5 },
  "hack-squat":         { name: "Hack squat", inc: 5 },
  "smith-squat":        { name: "Smith squat, feet forward", inc: 2.5 },
  "rdl":                { name: "Romanian deadlift", inc: 2.5 },
  "db-rdl":             { name: "Dumbbell Romanian deadlift", inc: 2 },
  "sumo":               { name: "Sumo deadlift", inc: 2.5 },
  "b-stance-rdl":       { name: "B-stance RDL", inc: 2 },
  "hyperext":           { name: "45° hyperextension", inc: 2.5, bwOk: true },
  "pull-through":       { name: "Cable pull-through", inc: 2.5 },
  "seated-curl":        { name: "Seated leg curl", inc: 5 },
  "lying-curl":         { name: "Lying leg curl", inc: 5 },
  "lateral-step-up":    { name: "Lateral step-up", inc: 2 },
  "step-up":            { name: "High step-up", inc: 2 },
  "machine-abduction":  { name: "Hip abduction machine", inc: 5 },
  "cable-abduction":    { name: "Standing cable abduction", inc: 1.25 },
  "kickback":           { name: "Cable kickback", inc: 1.25 },
  // Back and rear delts
  "lat-pulldown":       { name: "Lat pulldown", inc: 2.5 },
  "neutral-pulldown":   { name: "Neutral-grip pulldown", inc: 2.5 },
  "pull-up":            { name: "Pull-up", inc: 2.5, bwOk: true },
  "sa-pulldown":        { name: "Single-arm cable pulldown", inc: 1.25 },
  "sa-db-row":          { name: "Single-arm dumbbell row", inc: 2 },
  "sa-cable-row":       { name: "Single-arm cable row", inc: 2.5 },
  "meadows":            { name: "Meadows row", inc: 2.5 },
  "cs-db-row":          { name: "Chest-supported dumbbell row", inc: 2 },
  "cs-row":             { name: "Chest-supported T-bar row", inc: 2.5 },
  "seal-row":           { name: "Seal row", inc: 2.5 },
  "machine-row":        { name: "Machine row", inc: 5 },
  "cable-row":          { name: "Seated cable row", inc: 2.5 },
  "barbell-row":        { name: "Barbell row", inc: 2.5 },
  "pendlay":            { name: "Pendlay row", inc: 2.5 },
  "straight-arm":       { name: "Straight-arm pulldown", inc: 1.25 },
  "face-pull":          { name: "Face pull", inc: 1.25 },
  "rear-delt-fly":      { name: "Reverse pec deck", inc: 2.5 },
  "cable-rear-delt":    { name: "Cable rear-delt fly", inc: 1.25 },
  // Shoulders
  "ohp":                { name: "Seated dumbbell shoulder press", inc: 2 },
  "machine-press":      { name: "Machine shoulder press", inc: 2.5 },
  "cable-lateral":      { name: "Cable lateral raise", inc: 1.25 },
  "db-lateral":         { name: "Dumbbell lateral raise", inc: 1 },
  "machine-lateral":    { name: "Machine lateral raise", inc: 2.5 },
  "y-raise":            { name: "Cable Y-raise", inc: 1.25 },
  "lean-lateral":       { name: "Lean-away lateral raise", inc: 1 },
  // Abs
  "cable-crunch":       { name: "Cable crunch", inc: 2.5 },
  "decline-crunch":     { name: "Weighted decline crunch", inc: 2.5, bwOk: true },
  "hlr":                { name: "Hanging leg raise", inc: 0, bw: true },
  "ab-wheel":           { name: "Ab wheel rollout", inc: 0, bw: true },
  "pallof":             { name: "Pallof press", inc: 1.25 },
  "copenhagen":         { name: "Copenhagen plank", inc: 0, bw: true },
};

/* ------------------------------------------------------------------ */
/* The week. Same six-day split, rebuilt for glute and back growth.    */
/* moves[0] is the default; the rest are swaps.                        */
/* ------------------------------------------------------------------ */
const DAYS = [
  { id: 1, dow: 1, name: "Back", focus: "Width",
    intro: "Lats lead today. Pulldowns go first while you're fresh.",
    cardio: "Rowing pairs well with back day.",
    slots: [
      { id: "1a", moves: ["lat-pulldown", "pull-up", "sa-pulldown"], sets: 4, reps: [6, 10], rest: 150, main: true,
        cue: "Full stretch at the top, then drive your elbows down towards your back pockets. Think lats, not biceps." },
      { id: "1b", moves: ["sa-db-row", "sa-cable-row", "meadows"], sets: 3, reps: [8, 12], rest: 120, uni: "side",
        cue: "Knee and hand on the bench. Pull the dumbbell towards your hip in an arc to keep it on the lats." },
      { id: "1c", moves: ["cs-db-row", "machine-row", "cable-row"], sets: 3, reps: [10, 12], rest: 120,
        cue: "Chest stays on the pad. Squeeze your shoulder blades together and pause for a beat." },
      { id: "1d", moves: ["straight-arm"], sets: 3, reps: [12, 15], rest: 60,
        cue: "Arms long, slight hinge. Sweep the bar to your thighs using only your lats." },
      { id: "1e", moves: ["cable-lateral", "db-lateral", "machine-lateral"], sets: 3, reps: [12, 20], rest: 60,
        cue: "Extra side-delt work for shoulder width. Lead with the elbow, stop at shoulder height, no shrug." },
      { id: "1f", moves: ["face-pull", "rear-delt-fly", "cable-rear-delt"], sets: 3, reps: [15, 20], rest: 60,
        cue: "Pull towards your eyebrows with elbows high, then rotate your hands back." },
    ] },
  { id: 2, dow: 2, name: "Glutes heavy", focus: "Hip thrust",
    intro: "Your heaviest glute lift of the week, then deep single-leg work.",
    cardio: "Stairmaster or incline walk.",
    slots: [
      { id: "2a", moves: ["hip-thrust", "smith-hip-thrust", "machine-hip-thrust"], sets: 4, reps: [6, 10], rest: 180, main: true,
        cue: "Chin tucked, ribs down, shins vertical at the top. One-second squeeze at lockout. This is the lift to push hardest all week." },
      { id: "2b", moves: ["bss", "reverse-lunge", "walking-lunge"], sets: 3, reps: [8, 12], rest: 120, uni: "leg",
        cue: "Long stance, torso leaning forward, sink until the back knee nearly touches. The deep stretch is what builds the glute." },
      { id: "2c", moves: ["leg-press", "hack-squat", "smith-squat"], sets: 3, reps: [10, 15], rest: 120,
        cue: "Feet high and wide. Lower as deep as you can before your pelvis starts to tuck under." },
      { id: "2d", moves: ["machine-abduction", "cable-abduction"], sets: 3, reps: [12, 20], rest: 60,
        cue: "Lean forward over your thighs to bias the upper glutes. Pause wide, control the return." },
    ] },
  { id: 3, dow: 3, name: "Shoulders and abs", focus: "Side delts",
    intro: "Shoulder width comes from the side delts, so they get most of today's sets.",
    cardio: "Steady incline walk.",
    slots: [
      { id: "3a", moves: ["ohp", "machine-press"], sets: 3, reps: [6, 10], rest: 150, main: true,
        cue: "Lower under control to ear level, then press. Ribs down, no arching." },
      { id: "3b", moves: ["cable-lateral", "machine-lateral", "db-lateral"], sets: 4, reps: [12, 20], rest: 60,
        cue: "Lead with the elbow and stop at shoulder height. No swinging." },
      { id: "3c", moves: ["y-raise", "lean-lateral"], sets: 3, reps: [12, 15], rest: 60,
        cue: "Low pulleys crossed. Raise into a Y slightly in front of you. Light and strict." },
      { id: "3d", moves: ["rear-delt-fly", "cable-rear-delt", "face-pull"], sets: 3, reps: [15, 20], rest: 60,
        cue: "Arms nearly straight, sweep wide. Stop when your arms line up with your body." },
      { id: "3e", moves: ["cable-crunch", "decline-crunch"], sets: 3, reps: [10, 15], rest: 60,
        cue: "Hips stay still. Curl your ribs towards your pelvis and hold the squeeze." },
      { id: "3f", moves: ["hlr", "ab-wheel"], sets: 3, reps: [8, 15], rest: 60,
        cue: "No swinging. Curl your pelvis up at the top and lower slowly." },
    ] },
  { id: 4, dow: 4, name: "Glutes hinge", focus: "Stretch",
    intro: "One heavy hinge, then glutes and hamstrings trained in the stretch.",
    cardio: "Stairmaster. Try a few minutes sideways.",
    slots: [
      { id: "4a", moves: ["rdl", "db-rdl", "sumo"], sets: 4, reps: [6, 10], rest: 180, main: true,
        cue: "Soft knees. Push your hips back until you feel a deep hamstring stretch, then drive through the floor. Neutral spine, bar close." },
      { id: "4b", moves: ["hyperext"], sets: 3, reps: [10, 15], rest: 90,
        cue: "Toes out, upper back slightly rounded, drive your hips into the pad. Stop at a straight line. Hold a plate once bodyweight gets easy." },
      { id: "4c", moves: ["seated-curl", "lying-curl"], sets: 3, reps: [10, 15], rest: 90,
        cue: "Lean your torso forward to put the hamstrings on stretch. Slow on the way back." },
      { id: "4d", moves: ["lateral-step-up", "step-up"], sets: 3, reps: [10, 12], rest: 90, uni: "leg",
        cue: "Box at knee height, stand side-on. No push from the bottom foot, three seconds down." },
      { id: "4e", moves: ["cable-abduction", "machine-abduction"], sets: 2, reps: [15, 20], rest: 60, uni: "leg",
        cue: "Ankle strap on the low pulley, lean towards the stack, sweep out and slightly back." },
    ] },
  { id: 5, dow: 5, name: "Back and abs", focus: "Thickness",
    intro: "Mid-back thickness. Every row is supported, so your lower back gets a rest.",
    cardio: "Rowing or cycling.",
    slots: [
      { id: "5a", moves: ["cs-row", "seal-row", "machine-row", "pendlay"], sets: 4, reps: [6, 10], rest: 150, main: true,
        cue: "Chest glued to the pad. Row your elbows back and squeeze your shoulder blades for a beat." },
      { id: "5b", moves: ["cable-row", "sa-cable-row"], sets: 3, reps: [8, 12], rest: 120,
        cue: "Sit tall, reach fully forward for the stretch, row to your stomach." },
      { id: "5c", moves: ["neutral-pulldown", "lat-pulldown", "pull-up"], sets: 3, reps: [8, 12], rest: 120,
        cue: "Second vertical pull of the week. Full stretch at the top every rep." },
      { id: "5d", moves: ["db-lateral", "cable-lateral", "machine-lateral"], sets: 3, reps: [12, 20], rest: 60,
        cue: "Slight forward lean, little fingers level with thumbs, no shrug." },
      { id: "5e", moves: ["ab-wheel", "hlr"], sets: 3, reps: [6, 12], rest: 60,
        cue: "Ribs down, glutes squeezed. Roll out only as far as you can without your lower back sagging." },
      { id: "5f", moves: ["pallof"], sets: 2, reps: [10, 12], rest: 45, uni: "side",
        cue: "Press straight out and hold for two seconds without letting the cable twist you." },
    ] },
  { id: 6, dow: 6, name: "Glutes pump", focus: "Upper glutes",
    intro: "Lighter thrusts, then the most abduction of your week for the shelf.",
    cardio: "Stairmaster or incline walk.",
    slots: [
      { id: "6a", moves: ["smith-hip-thrust", "machine-hip-thrust", "hip-thrust"], sets: 3, reps: [10, 15], rest: 120, main: true,
        cue: "Lighter than Tuesday. Constant tension and a two-second squeeze every rep." },
      { id: "6b", moves: ["reverse-lunge", "bss", "walking-lunge"], sets: 3, reps: [8, 12], rest: 90, uni: "leg",
        cue: "Front foot on a plate, step back long, lean in slightly. Push through the front heel." },
      { id: "6c", moves: ["machine-abduction", "cable-abduction"], sets: 4, reps: [15, 25], rest: 60,
        cue: "Two sets leaning forward, two sitting tall. Finish the last set with partial reps." },
      { id: "6d", moves: ["kickback"], sets: 3, reps: [12, 15], rest: 45, uni: "leg",
        cue: "Hinge forward, kick back and slightly out. Squeeze, don't swing." },
    ] },
];

/* Old exercise IDs from v1, mapped to movements so history carries over. */
const LEGACY = {
  "1a": "hip-thrust", "1b": "bss", "1c": "rdl", "1d": "step-up", "1e": "kickback",
  "2a": "barbell-row", "2b": "meadows", "2c": "cs-db-row", "2d": "lat-pulldown", "2e": "straight-arm", "2f": "face-pull",
  "3a": "ohp", "3b": "cable-lateral", "3c": "rear-delt-fly", "3d": "db-lateral", "3e": "cable-crunch", "3f": "hlr",
  "4a": "sumo", "4b": "hyperext", "4c": "lateral-step-up", "4d": "sl-hip-thrust", "4e": "pull-through",
  "5a": "pendlay", "5b": "seal-row", "5c": "neutral-pulldown", "5d": "face-pull", "5e": "ab-wheel", "5f": "pallof", "5g": "copenhagen",
  "6a": "smith-hip-thrust", "6b": "b-stance-rdl", "6c": "cable-abduction", "6d": "kickback",
};

const PHASES = [
  { name: "Period", text: "Train as planned if you feel fine. If energy is low, keep the weights and drop a set." },
  { name: "Follicular", text: "Energy often climbs through this phase. A good stretch to push." },
  { name: "Around ovulation", text: "Some people feel strongest here, but the research is mixed. Let your warm-ups decide." },
  { name: "Luteal", text: "Sleep and recovery can dip, especially late on. If a session feels flat, this is a likely reason." },
];

const RIR = { 3: ["3", "2", "0–1"], 4: ["3", "2", "1", "0–1"], 5: ["3", "2", "2", "1", "0–1"], 6: ["3", "3", "2", "2", "1", "0–1"] };
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/* ------------------------------------------------------------------ */
/* Dates (local time, ISO yyyy-mm-dd strings)                          */
/* ------------------------------------------------------------------ */
const pad = (n) => String(n).padStart(2, "0");
const iso = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const parse = (s) => { const p = s.split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]); };
const todayISO = () => iso(new Date());
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
const mondayOf = (s) => { const d = parse(s); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return iso(d); };
const daysBetween = (a, b) => Math.round((parse(b) - parse(a)) / 86400000);
const fmtDay = (s) => parse(s).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
const fmtShort = (s) => parse(s).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const isISO = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);

/* ------------------------------------------------------------------ */
/* Numbers                                                             */
/* ------------------------------------------------------------------ */
const num = (v) => { const n = parseFloat(v); return isFinite(n) ? n : 0; };
const fmtNum = (n) => { const r = Math.round(n * 4) / 4; return (r % 1 === 0 ? r.toFixed(0) : String(r)); };
const e1 = (w, r) => w * (1 + r / 30); // Epley estimate
const fmtEst = (n) => String(Math.round(n)); // estimates are rough, so whole numbers
const fmtDelta = (d, weighted) => "+" + (weighted ? (d < 1 ? d.toFixed(1) : String(Math.round(d))) : fmtNum(d));
const PROPER = ["Romanian", "Bulgarian", "Smith", "Meadows", "Pallof", "Copenhagen"];
const inSentence = (name) => (PROPER.indexOf(name.split(" ")[0]) !== -1 ? name : name.charAt(0).toLowerCase() + name.slice(1));
const restLabel = (s) => (s % 60 === 0 ? s / 60 + " min" : Math.floor(s / 60) + ":" + pad(s % 60));

/* ------------------------------------------------------------------ */
/* Storage                                                             */
/* ------------------------------------------------------------------ */
const PREFIX = "sp2:";
function load(key, fallback) {
  try { const raw = localStorage.getItem(PREFIX + key); return raw == null ? fallback : JSON.parse(raw); }
  catch (e) { return fallback; }
}
function save(key, val) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(val)); return true; }
  catch (e) { return false; }
}
function useStored(key, fallback, onFail) {
  const [val, setVal] = useState(() => load(key, fallback));
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!save(key, val) && onFail) onFail();
  }, [val]);
  return [val, setVal];
}

const DEFAULT_TARGETS = { calories: 2400, protein: 140, carbs: 300, fat: 70 };
function defaultSettings() {
  return { blockStart: mondayOf(todayISO()), blockOffset: 0, loadWeeks: 4, sound: true, vibrate: true, wakeLock: true,
    cycleStart: "", cycleLength: 28, targets: DEFAULT_TARGETS, migratedAt: null };
}

/* One-off: bring v1 data across. Old keys are left in place untouched. */
function init() {
  if (load("settings", null) == null) save("settings", defaultSettings());
  if (localStorage.getItem(PREFIX + "migrated")) return;
  const old = (k) => { try { const r = localStorage.getItem("sculptor_" + k); return r ? JSON.parse(r) : null; } catch (e) { return null; } };
  const exLogs = old("exLogs"), sessionLogs = old("sessionLogs"), macroLog = old("macroLog");
  const cycleStart = old("cycleStart"), cycleLength = old("cycleLength");
  const found = !!(exLogs || sessionLogs || macroLog || cycleStart);
  if (found) {
    const logs = load("logs", {});
    Object.keys(exLogs || {}).forEach((k) => {
      const date = k.slice(-10), key = LEGACY[k.slice(0, -11)];
      if (!key || !isISO(date)) return;
      const entry = exLogs[k] || {};
      const sets = (entry.rows || []).filter((r) => num(r.reps) > 0)
        .map((r) => ({ w: num(r.weight) ? String(num(r.weight)) : "", r: String(num(r.reps)), done: true }));
      if (!sets.length && !entry.notes) return;
      logs[key] = logs[key] || {};
      const cur = logs[key][date];
      logs[key][date] = cur ? Object.assign({}, cur, { sets: cur.sets.concat(sets) }) : { sets: sets, note: entry.notes || "" };
    });
    save("logs", logs);
    const sessions = load("sessions", []);
    (sessionLogs || []).forEach((s) => {
      if (!s || !s.ts || !s.dayId) return;
      const date = iso(new Date(s.ts));
      if (!sessions.some((x) => x.day === s.dayId && x.date === date)) sessions.push({ day: s.dayId, date: date, ts: s.ts, legacy: true });
    });
    save("sessions", sessions);
    const food = load("food", {});
    Object.keys(macroLog || {}).forEach((d) => {
      const m = macroLog[d] || {};
      food[d] = { calories: num(m.calories), protein: num(m.protein), carbs: num(m.carbs), fat: num(m.fat) };
    });
    save("food", food);
    const st = Object.assign(defaultSettings(), load("settings", {}));
    if (cycleStart) st.cycleStart = cycleStart;
    if (cycleLength) st.cycleLength = num(cycleLength) || 28;
    st.migratedAt = todayISO();
    save("settings", st);
  }
  localStorage.setItem(PREFIX + "migrated", "1");
}

/* ------------------------------------------------------------------ */
/* Training blocks                                                     */
/* ------------------------------------------------------------------ */
function blockInfo(st, today) {
  const L = RIR[st.loadWeeks] ? st.loadWeeks : 4, len = L + 1;
  const start = isISO(st.blockStart) ? mondayOf(st.blockStart) : mondayOf(today);
  const w = Math.max(0, Math.floor(daysBetween(start, mondayOf(today)) / 7));
  const week = w % len;
  return { block: Math.floor(w / len) + 1 + (st.blockOffset || 0), week: week, weeks: len, loadWeeks: L,
    deload: week === L, rir: week === L ? null : RIR[L][week], last: week === L - 1 };
}
function effortLine(b) {
  if (b.deload) return "Deload week";
  if (b.rir === "0–1") return "Go to failure, or one rep short";
  return "Stop " + b.rir + (b.rir === "1" ? " rep" : " reps") + " short of failure";
}
function blockAdvice(b) {
  if (b.deload) return "Half the sets, same weights, stopping four or more reps short. You should leave feeling fresh. A new block starts next week.";
  if (b.week === 0) return "Settle in. Use weights that leave three good reps in the tank.";
  if (b.last) return "Hardest week of the block. Take machines and isolations to failure, but keep one rep in reserve on RDLs, rows and hip thrusts.";
  return "Add a rep or a little weight wherever you can.";
}

/* ------------------------------------------------------------------ */
/* History, PRs and suggestions                                        */
/* ------------------------------------------------------------------ */
function doneSets(entry) {
  return ((entry && entry.sets) || []).filter((s) => s.done && num(s.r) > 0).map((s) => ({ w: num(s.w), r: num(s.r) }));
}
function historyOf(logs, key) { // oldest first
  const by = logs[key] || {};
  return Object.keys(by).sort()
    .map((d) => ({ date: d, sets: doneSets(by[d]), note: by[d].note || "", dl: !!by[d].dl }))
    .filter((s) => s.sets.length);
}
const isWeighted = (hist) => hist.some((s) => s.sets.some((x) => x.w > 0));
const bestOf = (sets, weighted) => sets.reduce((m, s) => Math.max(m, weighted ? e1(s.w, s.r) : s.r), 0);
const topSet = (sets) => sets.reduce((b, s) => (!b || s.w > b.w || (s.w === b.w && s.r > b.r) ? s : b), null);
const volumeOf = (sets) => sets.reduce((t, s) => t + s.w * s.r, 0);
const summarise = (sets) => sets.map((s) => (s.w ? fmtNum(s.w) : "BW") + "×" + s.r).join(", ");

function prEvents(logs) {
  const out = [];
  Object.keys(logs).forEach((key) => {
    if (!M[key]) return;
    const h = historyOf(logs, key);
    const weighted = isWeighted(h);
    let best = 0;
    h.forEach((s) => {
      const b = bestOf(s.sets, weighted);
      if (best > 0 && b > best + 0.01) out.push({ key: key, date: s.date, value: b, prev: best, weighted: weighted });
      best = Math.max(best, b);
    });
  });
  return out.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

function suggest(slot, mv, prev, b) {
  const lo = slot.reps[0], hi = slot.reps[1];
  const n = b.deload ? Math.ceil(slot.sets / 2) : slot.sets;
  const fill = (w, r) => Array.from({ length: n }, () => ({ w: w, r: r }));
  if (!prev) {
    return { n: n, rows: [], text: b.deload
      ? "Deload week. Pick a comfortable weight and keep every set easy."
      : mv.bw ? "First time on this one. Log what you manage and beat it next time."
      : mv.bwOk ? "First time on this one. Start with bodyweight and add a plate once you hit the top of the range."
      : "First time on this one. Pick a weight you could lift for a few more reps than the range asks." };
  }
  const topW = Math.max.apply(null, prev.sets.map((s) => s.w));
  if (b.deload) {
    return { n: n, rows: fill(topW || "", lo),
      text: (topW ? "Deload: " + fmtNum(topW) + "kg for " : "Deload: ") + lo + " smooth reps, well short of failure." };
  }
  const atTop = prev.sets.filter((s) => s.w === topW);
  const toppedOut = atTop.length >= slot.sets && atTop.every((s) => s.r >= hi);
  const rows = Array.from({ length: n }, (_, i) => ({ w: prev.sets[i] ? prev.sets[i].w || "" : topW || "", r: prev.sets[i] ? prev.sets[i].r : lo }));
  if (!topW) {
    if (toppedOut) return { n: n, rows: rows, text: mv.bw
      ? "You hit the top of the range. Slow the lowering to three seconds to keep progressing."
      : "You hit the top of the range. Add some weight this time." };
    return { n: n, rows: rows, text: "Beat last time by a rep somewhere." };
  }
  if (toppedOut && mv.inc) {
    const w = Math.round((topW + mv.inc) * 100) / 100;
    return { n: n, rows: fill(w, lo), text: "You hit " + hi + " on every set. Go up to " + fmtNum(w) + "kg and build back up from " + lo + "." };
  }
  return { n: n, rows: rows, text: "Stay at " + fmtNum(topW) + "kg and add a rep where you can." };
}

function cycleInfo(st, today) {
  if (!isISO(st.cycleStart)) return null;
  const len = Math.max(21, Math.min(40, num(st.cycleLength) || 28));
  const diff = daysBetween(st.cycleStart, today);
  if (diff < 0) return null;
  const day = (diff % len) + 1, ov = len - 14;
  const p = day <= 5 ? 0 : day < ov - 1 ? 1 : day <= ov + 1 ? 2 : 3;
  return { day: day, len: len, phase: PHASES[p], next: len - day + 1 };
}

/* ------------------------------------------------------------------ */
/* Rest timer alerts                                                   */
/* ------------------------------------------------------------------ */
let audioCtx = null;
function primeAudio() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
  } catch (e) { /* no audio available */ }
}
function beep() {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  [0, 0.22, 0.44].forEach((o) => {
    const osc = audioCtx.createOscillator(), g = audioCtx.createGain();
    osc.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, t + o);
    g.gain.exponentialRampToValueAtTime(0.28, t + o + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + o + 0.16);
    osc.connect(g); g.connect(audioCtx.destination);
    osc.start(t + o); osc.stop(t + o + 0.18);
  });
}

function useWakeLock(on) {
  useEffect(() => {
    if (!on || !("wakeLock" in navigator)) return;
    let lock = null, alive = true;
    const request = () => { navigator.wakeLock.request("screen").then((l) => { if (alive) lock = l; else l.release(); }).catch(() => {}); };
    const onVis = () => { if (document.visibilityState === "visible") request(); };
    request();
    document.addEventListener("visibilitychange", onVis);
    return () => { alive = false; document.removeEventListener("visibilitychange", onVis); if (lock) lock.release().catch(() => {}); };
  }, [on]);
}

function useToday() {
  const [t, setT] = useState(todayISO());
  useEffect(() => {
    const id = setInterval(() => { const n = todayISO(); setT((p) => (p === n ? p : n)); }, 30000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */
const Icon = {
  check: html`<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  back: html`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  train: html`<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  progress: html`<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M3 18l6-6 4 4 8-9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 7h6v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  settings: html`<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="7" r="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="10" cy="17" r="2" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
};

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */
function Sheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  if (!open) return null;
  return html`
    <div className="sheet-backdrop" onClick=${onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label=${title} onClick=${(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2 className="sheet-title">${title}</h2>
          <button className="text-btn" onClick=${onClose}>Close</button>
        </div>
        ${children}
      </div>
    </div>`;
}

function Toast({ toast }) {
  if (!toast) return null;
  return html`<div className=${"toast" + (toast.kind === "pr" ? " toast-pr" : "")} role="status">${toast.msg}</div>`;
}

function Toggle({ label, hint, checked, onChange }) {
  return html`
    <label className="toggle-row">
      <span><span className="toggle-label">${label}</span>${hint ? html`<span className="hint">${hint}</span>` : null}</span>
      <input type="checkbox" className="switch" checked=${checked} onChange=${(e) => onChange(e.target.checked)} />
    </label>`;
}

/* The rest timer slab. The rose fill drains as rest runs out; the text is
   drawn twice and clipped so it stays readable on both halves. */
function TimerBar({ timer, setTimer, settings, raised }) {
  const [now, setNow] = useState(Date.now());
  const alerted = useRef(null);
  useEffect(() => {
    if (!timer) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [timer]);
  const left = timer ? Math.max(0, timer.endAt - now) : 0;
  const finished = !!timer && left <= 0;
  useEffect(() => {
    if (!finished || alerted.current === timer.endAt) return;
    alerted.current = timer.endAt;
    if (now - timer.endAt < 5000) { // don't beep for a timer that ran out while the app was closed
      if (settings.sound) beep();
      if (settings.vibrate && navigator.vibrate) navigator.vibrate([220, 120, 220]);
    }
    const id = setTimeout(() => setTimer((t) => (t && t.endAt === timer.endAt ? null : t)), 20000);
    return () => clearTimeout(id);
  }, [finished]);
  if (!timer) return null;
  const secs = Math.ceil(left / 1000);
  const frac = finished ? 1 : Math.min(1, left / (timer.total * 1000));
  const clock = Math.floor(secs / 60) + ":" + pad(secs % 60);
  const adjust = (d) => setTimer((t) => (t ? Object.assign({}, t, { endAt: Math.max(Date.now() + 1000, t.endAt + d * 1000), total: Math.max(1, t.total + d) }) : t));
  const face = (live) => html`
    <div className="timer-face">
      <div className="timer-read">
        <span className="timer-clock">${finished ? "Go" : clock}</span>
        <span className="timer-label">${finished ? "Rest's up. " + timer.label : timer.label}</span>
      </div>
      <div className="timer-actions">
        ${finished ? null : html`
          <button className="timer-btn" tabIndex=${live ? 0 : -1} aria-label="Take 15 seconds off" onClick=${live ? () => adjust(-15) : null}>−15</button>
          <button className="timer-btn" tabIndex=${live ? 0 : -1} aria-label="Add 15 seconds" onClick=${live ? () => adjust(15) : null}>+15</button>`}
        <button className="timer-btn" tabIndex=${live ? 0 : -1} onClick=${live ? () => setTimer(null) : null}>${finished ? "Dismiss" : "Skip"}</button>
      </div>
    </div>`;
  return html`
    <div className=${"timer" + (raised ? " timer-raised" : "") + (finished ? " timer-done" : "")} role="timer" aria-live="off" aria-label=${"Rest timer, " + clock + " left"}>
      ${face(true)}
      <div className="timer-fill" aria-hidden="true" style=${{ clipPath: "inset(0 " + ((1 - frac) * 100).toFixed(2) + "% 0 0)" }}>${face(false)}</div>
    </div>`;
}

function Nav({ tab, go }) {
  const item = (id, label, icon) => html`
    <button className=${"nav-item" + (tab === id ? " is-active" : "")} aria-current=${tab === id ? "page" : null} onClick=${() => go(id)}>
      ${icon}<span>${label}</span>
    </button>`;
  return html`<nav className="nav" aria-label="Main">${item("train", "Train", Icon.train)}${item("progress", "Progress", Icon.progress)}${item("settings", "Settings", Icon.settings)}</nav>`;
}

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */
function WeekStrip({ b }) {
  return html`
    <div className="weekstrip" aria-hidden="true">
      ${Array.from({ length: b.weeks }, (_, i) => html`
        <span key=${i} className=${"seg" + (i === b.loadWeeks ? " seg-deload" : "") + (i < b.week ? " seg-past" : "") + (i === b.week ? " seg-now" : "")}></span>`)}
    </div>`;
}

function Home({ today, b, settings, setSettings, sessions, food, setFood, openDay, swaps }) {
  const weekStart = mondayOf(today), weekEnd = addDays(weekStart, 6);
  const doneOn = (id) => sessions.filter((s) => s.day === id && s.date >= weekStart && s.date <= weekEnd).map((s) => s.date).sort().pop();
  const dow = parse(today).getDay();
  const todays = DAYS.find((d) => d.dow === dow);
  const pending = DAYS.filter((d) => !doneOn(d.id));
  const hero = todays && !doneOn(todays.id) ? todays : pending.find((d) => d.dow > dow) || pending[0] || null;
  const heroLead = !hero ? "Week complete" : hero === todays ? WEEKDAYS[dow] : todays ? "Up next" : "Rest day. Up next";
  const cyc = cycleInfo(settings, today);
  const [foodOpen, setFoodOpen] = useState(false);
  const moveName = (slot) => M[swaps[slot.id]] ? M[swaps[slot.id]].name : M[slot.moves[0]].name;

  const deloadNow = () => setSettings((s) => Object.assign({}, s, { blockStart: addDays(mondayOf(today), -7 * b.loadWeeks), blockOffset: b.block - 1 }));

  return html`
    <main className="screen home">
      <header className="topbar"><span className="wordmark">Sculptor</span></header>

      <section className="hero" aria-labelledby="hero-name">
        <p className="hero-lead">${heroLead}</p>
        ${hero ? html`
          <h1 id="hero-name" className="display hero-name">${hero.name}</h1>
          <p className="hero-focus">${hero.intro}</p>
          <p className="hero-list">${hero.slots.map((sl, i) => (i ? inSentence(moveName(sl)) : moveName(sl))).join(", ")}.</p>
          <button className="primary" onClick=${() => openDay(hero.id)}>Start session</button>` : html`
          <h1 id="hero-name" className="display hero-name">All six done</h1>
          <p className="hero-focus">Rest up. Next week's first session is back day.</p>`}
      </section>

      <section className=${"block" + (b.deload ? " block-deload" : "")} aria-label="Training block">
        <div className="block-row">
          <h2 className="block-title">Block ${b.block}</h2>
          <span className="block-week">${b.deload ? "Deload week" : "Week " + (b.week + 1) + " of " + b.weeks}</span>
        </div>
        <${WeekStrip} b=${b} />
        <p className="block-effort">${effortLine(b)}</p>
        <p className="block-advice">${blockAdvice(b)}</p>
        ${!b.deload ? html`<button className="text-btn" onClick=${deloadNow}>Deload this week instead</button>` : null}
      </section>

      <section aria-labelledby="week-h">
        <h2 id="week-h" className="section-title">This week</h2>
        <ul className="days">
          ${DAYS.map((d) => {
            const done = doneOn(d.id);
            return html`
              <li key=${d.id}>
                <button className=${"day-row" + (done ? " is-done" : "") + (d.dow === dow ? " is-today" : "")} onClick=${() => openDay(d.id)}>
                  <span className="day-dow">${WEEKDAYS[d.dow].slice(0, 3)}</span>
                  <span className="day-text"><span className="day-name">${d.name}</span><span className="day-focus">${d.focus}</span></span>
                  <span className="day-state">${done ? html`<span className="done-mark">${Icon.check}<span className="sr">Done ${fmtDay(done)}</span></span>` : null}</span>
                </button>
              </li>`;
          })}
        </ul>
      </section>

      ${cyc ? html`
        <section className="panel" aria-labelledby="cyc-h">
          <h2 id="cyc-h" className="section-title">Cycle day ${cyc.day}</h2>
          <p className="panel-strong">${cyc.phase.name}</p>
          <p className="panel-text">${cyc.phase.text}</p>
          <p className="hint">Next period due in about ${cyc.next} ${cyc.next === 1 ? "day" : "days"}.</p>
        </section>` : null}

      <${FoodPanel} today=${today} food=${food} setFood=${setFood} targets=${settings.targets} open=${foodOpen} setOpen=${setFoodOpen} />
    </main>`;
}

const FOOD_KEYS = [["calories", "Calories", "kcal"], ["protein", "Protein", "g"], ["carbs", "Carbs", "g"], ["fat", "Fat", "g"]];
function FoodPanel({ today, food, setFood, targets, open, setOpen }) {
  const f = food[today] || {};
  const [draft, setDraft] = useState({});
  useEffect(() => { if (open) setDraft(Object.assign({}, f)); }, [open]);
  const saveFood = () => {
    const clean = {};
    FOOD_KEYS.forEach(([k]) => { clean[k] = num(draft[k]); });
    setFood((prev) => Object.assign({}, prev, { [today]: clean }));
    setOpen(false);
  };
  return html`
    <section className="panel" aria-labelledby="food-h">
      <div className="block-row">
        <h2 id="food-h" className="section-title">Food today</h2>
        <button className="text-btn" onClick=${() => setOpen(true)}>Update</button>
      </div>
      <div className="food-bars">
        ${FOOD_KEYS.map(([k, label, unit]) => {
          const v = num(f[k]), t = num(targets[k]) || 1;
          return html`
            <div key=${k} className="food-bar">
              <div className="food-top"><span>${label}</span><span className="food-num">${fmtNum(v)}<span className="food-of"> / ${fmtNum(t)}${unit}</span></span></div>
              <div className="meter"><span style=${{ width: Math.min(100, (v / t) * 100) + "%" }}></span></div>
            </div>`;
        })}
      </div>
      <${Sheet} open=${open} onClose=${() => setOpen(false)} title="Food today">
        <p className="hint">Enter today's running totals.</p>
        <div className="form-grid">
          ${FOOD_KEYS.map(([k, label, unit]) => html`
            <label key=${k} className="form-field">
              <span>${label} (${unit})</span>
              <input inputMode="decimal" value=${draft[k] == null || draft[k] === 0 ? "" : draft[k]} placeholder="0"
                onChange=${(e) => { const v = e.target.value; setDraft((d) => Object.assign({}, d, { [k]: v })); }} />
            </label>`)}
        </div>
        <button className="primary wide" onClick=${saveFood}>Save totals</button>
      <//>
    </section>`;
}

/* ------------------------------------------------------------------ */
/* Session screen                                                      */
/* ------------------------------------------------------------------ */
function DayView({ day, today, b, logs, setLogs, swaps, setSwaps, sessions, setSessions, cardio, setCardio, startTimer, notify, settings, onBack }) {
  useWakeLock(settings.wakeLock);
  const [swapSlot, setSwapSlot] = useState(null);
  const [summary, setSummary] = useState(null);
  const moveOf = (slot) => (swaps[slot.id] && M[swaps[slot.id]] ? swaps[slot.id] : slot.moves[0]);
  const already = sessions.find((s) => s.day === day.id && s.date === today);
  const cardioKey = today + ":" + day.id;
  const dowName = WEEKDAYS[parse(today).getDay()];

  const finish = () => {
    let sets = 0, vol = 0;
    day.slots.forEach((slot) => {
      const d = doneSets(logs[moveOf(slot)] && logs[moveOf(slot)][today]);
      sets += d.length; vol += volumeOf(d);
    });
    const keys = day.slots.map(moveOf);
    const prs = prEvents(logs).filter((p) => p.date === today && keys.indexOf(p.key) !== -1);
    setSessions((prev) => prev.filter((s) => !(s.day === day.id && s.date === today))
      .concat([{ day: day.id, date: today, ts: Date.now(), block: b.block, week: b.week + 1, deload: b.deload }]));
    setSummary({ sets: sets, vol: vol, prs: prs });
  };

  return html`
    <main className="screen dayview">
      <header className="dayhead">
        <button className="back-btn" onClick=${onBack}>${Icon.back}<span>Back</span></button>
        <h1 className="display day-title">${day.name}</h1>
        <p className="day-intro">${day.intro}</p>
        <p className=${"day-effort" + (b.deload ? " is-deload" : "")}>${b.deload ? "Deload week: half the sets, keep it easy." : "Block " + b.block + ", week " + (b.week + 1) + ". " + effortLine(b) + "."}</p>
      </header>

      ${day.slots.map((slot, i) => {
        const next = day.slots[i + 1];
        return html`<${Exercise} key=${slot.id + moveOf(slot)} slot=${slot} move=${moveOf(slot)} today=${today} b=${b}
          logs=${logs} setLogs=${setLogs} startTimer=${startTimer} notify=${notify}
          nextName=${next ? M[moveOf(next)].name : null} onSwap=${() => setSwapSlot(slot)} />`;
      })}

      <label className="cardio-row">
        <input type="checkbox" className="box" checked=${!!cardio[cardioKey]}
          onChange=${(e) => { const v = e.target.checked; setCardio((c) => { const n = Object.assign({}, c); if (v) n[cardioKey] = true; else delete n[cardioKey]; return n; }); }} />
        <span><span className="cardio-title">20 min cardio finisher</span><span className="hint">${day.cardio}</span></span>
      </label>

      <button className="primary wide finish" onClick=${finish}>${already ? "Update session" : "Finish session"}</button>
      <p className="hint center">${already ? "Logged " + dowName + ". Your sets save as you go." : "Your sets save as you go. Finishing marks the day done."}</p>

      <${Sheet} open=${!!swapSlot} onClose=${() => setSwapSlot(null)} title="Swap exercise">
        ${swapSlot ? html`
          <p className="hint">Each option keeps its own history.</p>
          <ul className="swap-list">
            ${swapSlot.moves.map((k) => html`
              <li key=${k}>
                <button className=${"swap-opt" + (moveOf(swapSlot) === k ? " is-on" : "")} aria-pressed=${moveOf(swapSlot) === k}
                  onClick=${() => { setSwaps((s) => { const n = Object.assign({}, s); if (k === swapSlot.moves[0]) delete n[swapSlot.id]; else n[swapSlot.id] = k; return n; }); setSwapSlot(null); }}>
                  <span>${M[k].name}</span>${k === swapSlot.moves[0] ? html`<span className="hint">Programmed</span>` : null}
                </button>
              </li>`)}
          </ul>` : null}
      <//>

      <${Sheet} open=${!!summary} onClose=${() => { setSummary(null); onBack(); }} title="Session logged">
        ${summary ? html`
          <div className="summary-stats">
            <div><span className="display stat-num">${summary.sets}</span><span className="stat-label">sets</span></div>
            <div><span className="display stat-num">${Math.round(summary.vol).toLocaleString("en-GB")}</span><span className="stat-label">kg lifted</span></div>
            <div><span className="display stat-num">${summary.prs.length}</span><span className="stat-label">${summary.prs.length === 1 ? "PR" : "PRs"}</span></div>
          </div>
          ${summary.prs.length ? html`
            <ul className="pr-list">
              ${summary.prs.map((p) => html`<li key=${p.key}><span>${M[p.key].name}</span><span className="pr-val">${p.weighted ? fmtEst(p.value) + "kg est. max" : fmtNum(p.value) + " reps"}</span></li>`)}
            </ul>` : null}
          <button className="primary wide" onClick=${() => { setSummary(null); onBack(); }}>Done</button>` : null}
      <//>
    </main>`;
}

function Exercise({ slot, move, today, b, logs, setLogs, startTimer, notify, nextName, onSwap }) {
  const mv = M[move];
  const entry = (logs[move] && logs[move][today]) || { sets: [], note: "" };
  const hist = useMemo(() => historyOf(logs, move), [logs, move]);
  const before = hist.filter((s) => s.date < today);
  const lastShown = before[before.length - 1] || null;
  const prev = before.slice().reverse().find((s) => !s.dl) || lastShown;
  const sug = suggest(slot, mv, prev, b);
  const rowsN = Math.max(sug.n, entry.sets.length);
  const [cueOpen, setCueOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(!!entry.note);
  const doneN = entry.sets.filter((s) => s.done).length;
  const unit = slot.uni ? " per " + slot.uni : "";

  const update = (fn) => setLogs((all) => {
    const by = Object.assign({}, all[move] || {});
    const cur = by[today] || { sets: [], note: "" };
    const next = fn(Object.assign({}, cur, { sets: cur.sets.map((s) => Object.assign({}, s)) }));
    if (b.deload) next.dl = true;
    by[today] = next;
    return Object.assign({}, all, { [move]: by });
  });
  const grow = (e, i) => { while (e.sets.length <= i) e.sets.push({ w: "", r: "", done: false }); };
  const setField = (i, f, v) => update((e) => { grow(e, i); e.sets[i][f] = v; return e; });

  const weightHint = (i) => {
    for (let j = i - 1; j >= 0; j--) { const pr = entry.sets[j]; if (pr && pr.w !== "" && pr.w != null) return String(pr.w); }
    const r = sug.rows[i] || sug.rows[sug.rows.length - 1];
    return r && r.w !== "" && r.w != null ? fmtNum(r.w) : (mv.bw ? "BW" : "");
  };
  const repsHint = (i) => { const r = sug.rows[i] || sug.rows[sug.rows.length - 1]; return r && r.r ? String(r.r) : String(slot.reps[0]) + "–" + slot.reps[1]; };

  const toggle = (i) => {
    const cur = entry.sets[i] || { w: "", r: "", done: false };
    if (cur.done) { setField(i, "done", false); return; }
    const wh = weightHint(i), rh = repsHint(i);
    const w = cur.w !== "" && cur.w != null ? cur.w : (/^\d/.test(wh) ? wh : "");
    const r = cur.r !== "" && cur.r != null ? cur.r : (/^\d+$/.test(rh) ? rh : "");
    if (!num(r)) { notify("Add your reps, then tick the set."); return; }
    primeAudio();
    update((e) => { grow(e, i); e.sets[i] = { w: w === "" ? "" : String(w), r: String(r), done: true, t: Date.now() }; return e; });
    // PR check against every earlier day, and today's other sets
    const weighted = isWeighted(hist) || num(w) > 0;
    const val = weighted ? e1(num(w), num(r)) : num(r);
    const prior = before.reduce((m, s) => Math.max(m, bestOf(s.sets, weighted)), 0);
    const others = bestOf(doneSets({ sets: entry.sets.filter((_, j) => j !== i) }), weighted);
    if (prior > 0 && val > prior + 0.01 && val > others + 0.01) {
      notify(weighted ? "New PR on " + inSentence(mv.name) + ". Estimated max " + fmtEst(val) + "kg." : "New PR on " + inSentence(mv.name) + ". " + num(r) + " reps.", "pr");
    }
    const last = doneN + 1 >= rowsN;
    startTimer(slot.rest, last ? (nextName ? "Next: " + nextName : "That was the last exercise") : "Set " + (doneN + 2) + " of " + rowsN);
  };

  const addSet = () => update((e) => { grow(e, rowsN); return e; });
  const canRemove = entry.sets.length > sug.n && !entry.sets[entry.sets.length - 1].done;
  const removeSet = () => update((e) => { e.sets.pop(); return e; });

  return html`
    <section className=${"ex" + (slot.main ? " ex-main" : "") + (doneN >= rowsN ? " ex-complete" : "")} aria-label=${mv.name}>
      <div className="ex-head">
        <div>
          ${slot.main ? html`<p className="ex-tag">Main lift</p>` : null}
          <h2 className="ex-name">${mv.name}</h2>
          <p className="ex-target">${sug.n} ${sug.n === 1 ? "set" : "sets"} of ${slot.reps[0]}–${slot.reps[1]}${unit}<span className="ex-rest">Rest ${restLabel(slot.rest)}</span></p>
        </div>
        ${slot.moves.length > 1 ? html`<button className="chip" onClick=${onSwap}>Swap</button>` : null}
      </div>

      <p className="ex-last">${lastShown ? "Last time, " + fmtDay(lastShown.date) + ": " + summarise(lastShown.sets) : "No history yet."}</p>
      <p className="ex-sug">${sug.text}</p>

      <div className="sets" role="group" aria-label=${"Sets for " + mv.name}>
        ${Array.from({ length: rowsN }, (_, i) => {
          const s = entry.sets[i] || {};
          return html`
            <div key=${i} className=${"set" + (s.done ? " is-done" : "")}>
              <span className="set-n" aria-hidden="true">${i + 1}</span>
              <label className="field">
                <input inputMode="decimal" enterKeyHint="next" value=${s.w == null ? "" : s.w} placeholder=${weightHint(i)}
                  aria-label=${"Set " + (i + 1) + " weight in kilograms"} onChange=${(e) => setField(i, "w", e.target.value.replace(",", "."))} />
                <span className="unit">kg</span>
              </label>
              <label className="field">
                <input inputMode="numeric" enterKeyHint="done" className=${repsHint(i).indexOf("–") !== -1 ? "is-range" : ""} value=${s.r == null ? "" : s.r} placeholder=${repsHint(i)}
                  aria-label=${"Set " + (i + 1) + " reps"} onChange=${(e) => setField(i, "r", e.target.value.replace(/[^\d]/g, ""))} />
                <span className="unit">reps</span>
              </label>
              <button className="tick" aria-pressed=${!!s.done} aria-label=${(s.done ? "Undo set " : "Log set ") + (i + 1)} onClick=${() => toggle(i)}>${Icon.check}</button>
            </div>`;
        })}
      </div>

      <div className="ex-tools">
        <button className="text-btn" onClick=${addSet}>Add set</button>
        ${canRemove ? html`<button className="text-btn" onClick=${removeSet}>Remove set</button>` : null}
        <button className="text-btn" aria-expanded=${cueOpen} onClick=${() => setCueOpen(!cueOpen)}>Form cue</button>
        <button className="text-btn" aria-expanded=${noteOpen} onClick=${() => setNoteOpen(!noteOpen)}>Note</button>
      </div>
      ${cueOpen ? html`<p className="ex-cue">${slot.cue}</p>` : null}
      ${noteOpen ? html`
        <textarea className="note" rows="2" placeholder="How it felt, machine settings, form notes"
          value=${entry.note || ""} onChange=${(e) => { const v = e.target.value; update((x) => { x.note = v; return x; }); }}></textarea>` : null}
      ${lastShown && lastShown.note ? html`<p className="hint">Last note: ${lastShown.note}</p>` : null}
    </section>`;
}

/* ------------------------------------------------------------------ */
/* Charts                                                              */
/* ------------------------------------------------------------------ */
function Sparkline({ values }) {
  if (values.length < 2) return html`<span className="spark spark-empty" aria-hidden="true"></span>`;
  const W = 88, H = 28, lo = Math.min.apply(null, values), hi = Math.max.apply(null, values), span = hi - lo || 1;
  const d = values.map((v, i) => (i ? "L" : "M") + ((i / (values.length - 1)) * (W - 4) + 2).toFixed(1) + "," + (H - 3 - ((v - lo) / span) * (H - 6)).toFixed(1)).join(" ");
  return html`<svg className="spark" viewBox=${"0 0 " + W + " " + H} width=${W} height=${H} aria-hidden="true"><path d=${d} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function Chart({ points, unit, label, fmt }) {
  if (points.length < 2) return html`<p className="empty">Log this twice to see a trend line.</p>`;
  const W = 340, H = 200, P = { l: 6, r: 46, t: 16, b: 28 };
  const xs = points.map((p) => parse(p.date).getTime()), ys = points.map((p) => p.y);
  let lo = Math.min.apply(null, ys), hi = Math.max.apply(null, ys);
  if (hi === lo) { hi += 1; lo -= 1; }
  const padY = (hi - lo) * 0.14; lo -= padY; hi += padY;
  const x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs);
  const sx = (x) => P.l + ((x - x0) / (x1 - x0 || 1)) * (W - P.l - P.r);
  const sy = (y) => P.t + (1 - (y - lo) / (hi - lo)) * (H - P.t - P.b);
  const line = points.map((p, i) => (i ? "L" : "M") + sx(xs[i]).toFixed(1) + "," + sy(p.y).toFixed(1)).join(" ");
  const area = line + " L" + sx(x1).toFixed(1) + "," + (H - P.b) + " L" + sx(x0).toFixed(1) + "," + (H - P.b) + " Z";
  const ticks = [0.2, 0.5, 0.8].map((f) => lo + (hi - lo) * f);
  const last = points[points.length - 1], first = points[0];
  return html`
    <figure className="chart">
      <svg viewBox=${"0 0 " + W + " " + H} role="img" aria-label=${label + ": " + fmt(first.y) + unit + " on " + fmtShort(first.date) + " to " + fmt(last.y) + unit + " on " + fmtShort(last.date)}>
        <defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--flush)" stop-opacity="0.32"/><stop offset="1" stop-color="var(--flush)" stop-opacity="0"/></linearGradient></defs>
        ${ticks.map((t, i) => html`<g key=${i}>
          <line x1=${P.l} x2=${W - P.r} y1=${sy(t)} y2=${sy(t)} className="chart-grid"/>
          <text x=${W - P.r + 8} y=${sy(t) + 4} className="chart-tick">${fmt(t)}</text></g>`)}
        <path d=${area} fill="url(#chart-fill)"/>
        <path d=${line} fill="none" stroke="var(--flush)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
        ${points.map((p, i) => html`<circle key=${i} cx=${sx(xs[i])} cy=${sy(p.y)} r=${p.pr ? 5 : 3} className=${p.pr ? "dot-pr" : "dot"}/>`)}
        <text x=${P.l} y=${H - 8} className="chart-tick">${fmtShort(first.date)}</text>
        <text x=${W - P.r} y=${H - 8} className="chart-tick" text-anchor="end">${fmtShort(last.date)}</text>
      </svg>
    </figure>`;
}

/* ------------------------------------------------------------------ */
/* Progress                                                            */
/* ------------------------------------------------------------------ */
function Progress({ logs, openMove }) {
  const prs = useMemo(() => prEvents(logs), [logs]);
  const lifts = useMemo(() => Object.keys(logs).filter((k) => M[k]).map((k) => {
    const h = historyOf(logs, k), weighted = isWeighted(h);
    if (!h.length) return null;
    const series = h.map((s) => bestOf(s.sets, weighted));
    return { key: k, h: h, weighted: weighted, series: series, best: Math.max.apply(null, series), last: h[h.length - 1].date };
  }).filter(Boolean).sort((a, b) => (a.last < b.last ? 1 : a.last > b.last ? -1 : 0)), [logs]);

  return html`
    <main className="screen progress">
      <header className="pagehead"><h1 className="display page-title">Progress</h1></header>
      ${!lifts.length ? html`<p className="empty">Log your first session and every lift will show up here with its trend.</p>` : null}

      ${prs.length ? html`
        <section aria-labelledby="pr-h">
          <h2 id="pr-h" className="section-title">Recent PRs</h2>
          <ul className="pr-list">
            ${prs.slice(0, 6).map((p, i) => html`
              <li key=${i}>
                <button className="pr-row" onClick=${() => openMove(p.key)}>
                  <span><span className="pr-name">${M[p.key].name}</span><span className="hint">${fmtDay(p.date)}</span></span>
                  <span className="pr-val">${p.weighted ? fmtEst(p.value) + "kg" : fmtNum(p.value) + " reps"}<span className="pr-delta">${fmtDelta(p.value - p.prev, p.weighted)}</span></span>
                </button>
              </li>`)}
          </ul>
        </section>` : null}

      ${lifts.length ? html`
        <section aria-labelledby="lifts-h">
          <h2 id="lifts-h" className="section-title">Lifts</h2>
          <p className="hint">Weighted lifts show estimated one-rep max, so a heavier set of 6 and a lighter set of 12 compare fairly.</p>
          <ul className="lift-list">
            ${lifts.map((l) => html`
              <li key=${l.key}>
                <button className="lift-row" onClick=${() => openMove(l.key)}>
                  <span className="lift-text"><span className="lift-name">${M[l.key].name}</span><span className="hint">${l.h.length} ${l.h.length === 1 ? "session" : "sessions"}, last ${fmtShort(l.last)}</span></span>
                  <${Sparkline} values=${l.series.slice(-12)} />
                  <span className="lift-best">${l.weighted ? fmtEst(l.best) : fmtNum(l.best)}<span className="lift-unit">${l.weighted ? "kg" : " reps"}</span></span>
                </button>
              </li>`)}
          </ul>
        </section>` : null}
    </main>`;
}

function MoveDetail({ logs, move, onBack }) {
  const mv = M[move];
  const h = historyOf(logs, move);
  const weighted = isWeighted(h);
  const metrics = weighted
    ? [["e1", "Est. max"], ["top", "Top set"], ["vol", "Volume"]]
    : [["reps", "Best set"], ["total", "Total reps"]];
  const [metric, setMetric] = useState(metrics[0][0]);
  const val = (s) => metric === "e1" ? bestOf(s.sets, true) : metric === "top" ? topSet(s.sets).w
    : metric === "vol" ? volumeOf(s.sets) : metric === "reps" ? bestOf(s.sets, false) : s.sets.reduce((t, x) => t + x.r, 0);
  let run = 0;
  const points = h.map((s, i) => { const y = val(s); const pr = i > 0 && y > run + 0.01; run = Math.max(run, y); return { date: s.date, y: y, pr: pr }; });
  const unit = metric === "reps" || metric === "total" ? " reps" : "kg";
  const bestE = weighted ? Math.max.apply(null, h.map((s) => bestOf(s.sets, true))) : 0;
  const heaviest = weighted ? h.reduce((b, s) => { const t = topSet(s.sets); return !b || t.w > b.w || (t.w === b.w && t.r > b.r) ? t : b; }, null) : null;
  const label = (metrics.find((m) => m[0] === metric) || metrics[0])[1];

  return html`
    <main className="screen detail">
      <header className="dayhead">
        <button className="back-btn" onClick=${onBack}>${Icon.back}<span>Progress</span></button>
        <h1 className="display day-title">${mv.name}</h1>
      </header>
      ${h.length ? html`
        <div className="stat-row">
          ${weighted ? html`
            <div><span className="display stat-num">${fmtEst(bestE)}<small>kg</small></span><span className="stat-label">best est. max</span></div>
            <div><span className="display stat-num">${fmtNum(heaviest.w)}<small>×${heaviest.r}</small></span><span className="stat-label">heaviest set</span></div>` : html`
            <div><span className="display stat-num">${fmtNum(Math.max.apply(null, h.map((s) => bestOf(s.sets, false))))}</span><span className="stat-label">best set, reps</span></div>`}
          <div><span className="display stat-num">${h.length}</span><span className="stat-label">sessions</span></div>
        </div>
        <div className="seg-control" role="tablist" aria-label="Chart metric">
          ${metrics.map(([k, l]) => html`<button key=${k} role="tab" aria-selected=${metric === k} className=${metric === k ? "is-on" : ""} onClick=${() => setMetric(k)}>${l}</button>`)}
        </div>
        <${Chart} points=${points} unit=${unit} label=${label} fmt=${metric === "top" ? fmtNum : (v) => Math.round(v).toLocaleString("en-GB")} />
        <h2 className="section-title">History</h2>
        <ul className="hist-list">
          ${h.slice().reverse().map((s) => html`
            <li key=${s.date}>
              <span className="hist-date">${fmtDay(s.date)}${s.dl ? html`<span className="tag-deload">Deload</span>` : null}</span>
              <span className="hist-sets">${summarise(s.sets)}</span>
              ${s.note ? html`<span className="hint">${s.note}</span>` : null}
            </li>`)}
        </ul>` : html`<p className="empty">No sets logged for this one yet.</p>`}
    </main>`;
}

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */
function Settings({ settings, setSettings, b, today, swaps, setSwaps, notify, onImported }) {
  const set = (patch) => setSettings((s) => Object.assign({}, s, patch));
  const fileRef = useRef(null);
  const swapCount = Object.keys(swaps).length;

  const exportData = () => {
    const data = { app: "sculptor", version: 2, exportedAt: new Date().toISOString() };
    ["logs", "sessions", "swaps", "settings", "food", "cardio"].forEach((k) => { data[k] = load(k, null); });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "sculptor-backup-" + today + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    notify("Backup exported.");
  };
  const importData = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.app !== "sculptor" || data.version !== 2) throw new Error("wrong file");
        ["logs", "sessions", "swaps", "settings", "food", "cardio"].forEach((k) => { if (data[k] != null) save(k, data[k]); });
        onImported();
      } catch (e) { notify("That file isn't a Sculptor v2 backup. Choose a file exported from this version."); }
    };
    reader.readAsText(file);
  };

  return html`
    <main className="screen settings">
      <header className="pagehead"><h1 className="display page-title">Settings</h1></header>

      <section className="panel" aria-labelledby="blk-h">
        <h2 id="blk-h" className="section-title">Training block</h2>
        <p className="panel-text">You're in block ${b.block}, ${b.deload ? "deload week" : "week " + (b.week + 1) + " of " + b.weeks}. Each block builds effort week by week, then deloads.</p>
        <label className="form-field">
          <span>Block started (week beginning)</span>
          <input type="date" value=${settings.blockStart} onChange=${(e) => { if (isISO(e.target.value)) set({ blockStart: mondayOf(e.target.value), blockOffset: 0 }); }} />
        </label>
        <label className="form-field">
          <span>Building weeks before each deload</span>
          <select value=${settings.loadWeeks} onChange=${(e) => set({ loadWeeks: Number(e.target.value) })}>
            ${[3, 4, 5, 6].map((n) => html`<option key=${n} value=${n}>${n} weeks, then deload</option>`)}
          </select>
        </label>
        <div className="btn-row">
          ${!b.deload ? html`<button className="secondary" onClick=${() => set({ blockStart: addDays(mondayOf(today), -7 * b.loadWeeks), blockOffset: b.block - 1 })}>Deload this week</button>` : null}
          ${b.week > 0 ? html`<button className="secondary" onClick=${() => set({ blockStart: mondayOf(today), blockOffset: b.block })}>Start block ${b.block + 1} this week</button>` : null}
        </div>
      </section>

      <section className="panel" aria-labelledby="timer-h">
        <h2 id="timer-h" className="section-title">Rest timer</h2>
        <${Toggle} label="Sound when rest is up" checked=${settings.sound} onChange=${(v) => set({ sound: v })} />
        <${Toggle} label="Vibrate when rest is up" hint="Android only" checked=${settings.vibrate} onChange=${(v) => set({ vibrate: v })} />
        <${Toggle} label="Keep screen on during a session" hint="So the timer stays visible between sets" checked=${settings.wakeLock} onChange=${(v) => set({ wakeLock: v })} />
      </section>

      <section className="panel" aria-labelledby="swap-h">
        <h2 id="swap-h" className="section-title">Exercise swaps</h2>
        <p className="panel-text">${swapCount ? swapCount + (swapCount === 1 ? " exercise is" : " exercises are") + " swapped from the programme." : "Everything is running as programmed. Use Swap on any exercise during a session."}</p>
        ${swapCount ? html`<button className="secondary" onClick=${() => setSwaps({})}>Reset to the programme</button>` : null}
      </section>

      <section className="panel" aria-labelledby="cyc-set-h">
        <h2 id="cyc-set-h" className="section-title">Cycle</h2>
        <label className="form-field">
          <span>First day of your last period</span>
          <input type="date" value=${settings.cycleStart || ""} onChange=${(e) => set({ cycleStart: e.target.value })} />
        </label>
        <label className="form-field">
          <span>Cycle length in days</span>
          <input inputMode="numeric" value=${settings.cycleLength} onChange=${(e) => set({ cycleLength: e.target.value.replace(/[^\d]/g, "") })} />
        </label>
        <p className="hint">Phase effects on strength are small and vary a lot between people. Use this to explain a flat day, not to plan around.</p>
        ${settings.cycleStart ? html`<button className="text-btn" onClick=${() => set({ cycleStart: "" })}>Hide cycle from home</button>` : null}
      </section>

      <section className="panel" aria-labelledby="food-set-h">
        <h2 id="food-set-h" className="section-title">Food targets</h2>
        <div className="form-grid">
          ${FOOD_KEYS.map(([k, label, unit]) => html`
            <label key=${k} className="form-field">
              <span>${label} (${unit})</span>
              <input inputMode="numeric" value=${settings.targets[k]} onChange=${(e) => { const v = num(e.target.value); set({ targets: Object.assign({}, settings.targets, { [k]: v }) }); }} />
            </label>`)}
        </div>
      </section>

      <section className="panel" aria-labelledby="data-h">
        <h2 id="data-h" className="section-title">Your data</h2>
        <p className="panel-text">Everything is stored on this phone.${settings.migratedAt ? " Your history from the old version was brought across on " + fmtDay(settings.migratedAt) + "." : ""} Export a backup now and then.</p>
        <div className="btn-row">
          <button className="secondary" onClick=${exportData}>Export backup</button>
          <button className="secondary" onClick=${() => fileRef.current && fileRef.current.click()}>Restore from backup</button>
        </div>
        <input ref=${fileRef} type="file" accept="application/json,.json" hidden onChange=${(e) => { if (e.target.files[0]) importData(e.target.files[0]); e.target.value = ""; }} />
      </section>
      <p className="hint center">Sculptor's Playbook, version 2</p>
    </main>`;
}

/* ------------------------------------------------------------------ */
/* App shell                                                           */
/* ------------------------------------------------------------------ */
function App() {
  const today = useToday();
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const notify = useCallback((msg, kind) => {
    setToast({ msg: msg, kind: kind });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), kind === "pr" ? 4500 : 3000);
  }, []);
  const saveFailed = () => notify("Couldn't save to this phone's storage. Export a backup and free up some space.");

  const [logs, setLogs] = useStored("logs", {}, saveFailed);
  const [sessions, setSessions] = useStored("sessions", [], saveFailed);
  const [swaps, setSwaps] = useStored("swaps", {}, saveFailed);
  const [rawSettings, setSettings] = useStored("settings", defaultSettings(), saveFailed);
  const [food, setFood] = useStored("food", {}, saveFailed);
  const [cardio, setCardio] = useStored("cardio", {}, saveFailed);
  const [timer, setTimer] = useStored("timer", null);
  const settings = useMemo(() => Object.assign(defaultSettings(), rawSettings, { targets: Object.assign({}, DEFAULT_TARGETS, rawSettings.targets || {}) }), [rawSettings]);
  const b = blockInfo(settings, today);

  const [route, setRoute] = useState(() => (history.state && history.state.tab ? history.state : { tab: "train", day: null, move: null }));
  useEffect(() => {
    history.replaceState(route, "");
    const onPop = (e) => setRoute(e.state || { tab: "train", day: null, move: null });
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [route.tab, route.day, route.move]);
  const push = (r) => { history.pushState(r, ""); setRoute(r); };
  const back = () => history.back();
  const goTab = (tab) => { const r = { tab: tab, day: null, move: null }; history.replaceState(r, ""); setRoute(r); };

  const startTimer = useCallback((secs, label) => setTimer({ endAt: Date.now() + secs * 1000, total: secs, label: label }), []);

  const day = route.day ? DAYS.find((d) => d.id === route.day) : null;
  let screen;
  if (day) {
    screen = html`<${DayView} day=${day} today=${today} b=${b} logs=${logs} setLogs=${setLogs} swaps=${swaps} setSwaps=${setSwaps}
      sessions=${sessions} setSessions=${setSessions} cardio=${cardio} setCardio=${setCardio}
      startTimer=${startTimer} notify=${notify} settings=${settings} onBack=${back} />`;
  } else if (route.move && M[route.move]) {
    screen = html`<${MoveDetail} logs=${logs} move=${route.move} onBack=${back} />`;
  } else if (route.tab === "progress") {
    screen = html`<${Progress} logs=${logs} openMove=${(k) => push({ tab: "progress", day: null, move: k })} />`;
  } else if (route.tab === "settings") {
    screen = html`<${Settings} settings=${settings} setSettings=${setSettings} b=${b} today=${today} swaps=${swaps} setSwaps=${setSwaps}
      notify=${notify} onImported=${() => location.reload()} />`;
  } else {
    screen = html`<${Home} today=${today} b=${b} settings=${settings} setSettings=${setSettings} sessions=${sessions}
      food=${food} setFood=${setFood} swaps=${swaps} openDay=${(id) => push({ tab: "train", day: id, move: null })} />`;
  }
  const showNav = !day;

  return html`
    <div className=${"app" + (showNav ? " has-nav" : "") + (timer ? " has-timer" : "")}>
      <${Toast} toast=${toast} />
      ${screen}
      <${TimerBar} timer=${timer} setTimer=${setTimer} settings=${settings} raised=${showNav} />
      ${showNav ? html`<${Nav} tab=${route.tab} go=${goTab} />` : null}
    </div>`;
}

init();
ReactDOM.createRoot(document.getElementById("root")).render(html`<${App} />`);
})();
