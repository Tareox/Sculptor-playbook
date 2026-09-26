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
  "hip-thrust":         { name: "Barbell hip thrust", inc: 2.5, bar: true },
  "smith-hip-thrust":   { name: "Smith machine hip thrust", inc: 2.5 },
  "machine-hip-thrust": { name: "Hip thrust machine", inc: 5 },
  "sl-hip-thrust":      { name: "Single-leg hip thrust", inc: 2.5 },
  "bss":                { name: "Bulgarian split squat", inc: 2 },
  "reverse-lunge":      { name: "Deficit reverse lunge", inc: 2 },
  "walking-lunge":      { name: "Walking lunge", inc: 2 },
  "leg-press":          { name: "Leg press", inc: 5 },
  "hack-squat":         { name: "Hack squat", inc: 5 },
  "smith-squat":        { name: "Smith squat", inc: 2.5 },
  "rdl":                { name: "Romanian deadlift", inc: 2.5, bar: true },
  "db-rdl":             { name: "Dumbbell Romanian deadlift", inc: 2 },
  "sumo":               { name: "Sumo deadlift", inc: 2.5, bar: true },
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
  "seal-row":           { name: "Seal row", inc: 2.5, bar: true },
  "machine-row":        { name: "Machine row", inc: 5 },
  "cable-row":          { name: "Seated cable row", inc: 2.5 },
  "barbell-row":        { name: "Barbell row", inc: 2.5, bar: true },
  "pendlay":            { name: "Pendlay row", inc: 2.5, bar: true },
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
  { id: 1, dow: 2, name: "Wingspan", focus: "Back for width",
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
  { id: 2, dow: 1, name: "Foundation", focus: "Heavy glutes",
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
  { id: 3, dow: 3, name: "Caps", focus: "Shoulders and abs",
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
  { id: 4, dow: 4, name: "Stretch", focus: "Glutes and hamstrings",
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
  { id: 5, dow: 5, name: "Armour", focus: "Back thickness and abs",
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
  { id: 6, dow: 6, name: "Shelf", focus: "Upper glutes",
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

/* Saturday as a recovery day. While it's on, a set of abduction moves to
   Tuesday and Thursday so the upper-glute work isn't lost, and the glute-day
   finishers switch away from stairs. Shelf comes back from Settings. */
const RECHARGE = { id: 7, dow: 6, name: "Recharge", focus: "Easy cardio or rest", kind: "cardio", slots: [],
  intro: "Let your glutes recover. Move easy at a pace you could chat at, or rest. Both count.", cardio: "" };
const CARDIO_OPTIONS = ["Bike", "Easy row", "Flat walk", "Swim", "Rest"];
const SPARE_GLUTES = "Bike or easy row for now, to spare your glutes.";
const byDow = (list) => list.slice().sort((a, b) => a.dow - b.dow);
function planDays(st) {
  if (st.saturday !== "cardio") return byDow(DAYS);
  const tweak = (d, slotId, sets) => Object.assign({}, d, { cardio: SPARE_GLUTES,
    slots: d.slots.map((s) => (s.id === slotId ? Object.assign({}, s, { sets: sets }) : s)) });
  return byDow(DAYS.filter((d) => d.id !== 6)
    .map((d) => (d.id === 2 ? tweak(d, "2d", 4) : d.id === 4 ? tweak(d, "4e", 3) : d))
    .concat([RECHARGE]));
}
let PLAN = byDow(DAYS);

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
const ALL_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
const ACCENTS = {
  rose: { name: "Rose", hex: "#FF7096" },
  orchid: { name: "Orchid", hex: "#D59BFF" },
  peach: { name: "Peach", hex: "#FFA985" },
  ice: { name: "Ice", hex: "#8CCBFF" },
};
const REST_OPTIONS = [45, 60, 75, 90, 120, 150, 180, 240];
function defaultSettings() {
  return { blockStart: mondayOf(todayISO()), blockOffset: 0, loadWeeks: 4, sound: true, vibrate: true, wakeLock: true,
    cycleStart: "", cycleLength: 28, targets: DEFAULT_TARGETS, migratedAt: null,
    accent: "rose", haptics: true, autoScroll: true, warmups: true, showFood: true,
    barWeight: 20, plates: ALL_PLATES, dayNames: {}, exNames: {}, rest: {}, inc: {}, saturday: "cardio" };
}

/* Display names. Custom names are set from Settings and the exercise sheet;
   history is keyed by movement ID, so renaming never touches it. */
const CUSTOM = { ex: {}, day: {} };
const exName = (k) => CUSTOM.ex[k] || (M[k] ? M[k].name : k);
const dayName = (d) => CUSTOM.day[d.id] || d.name;
const buzz = (on, pattern) => { if (on && navigator.vibrate) { try { navigator.vibrate(pattern); } catch (e) { /* ignore */ } } };

/* Plates per side for a barbell total, using the plates you have. */
function platesFor(total, bar, avail) {
  const per = Math.round(((total - bar) / 2) * 100) / 100;
  if (per < 0) return null;
  const list = [];
  let left = per;
  avail.slice().sort((a, b) => b - a).forEach((p) => { while (left >= p - 1e-9) { list.push(p); left = Math.round((left - p) * 100) / 100; } });
  return { per: per, list: list, left: left };
}

/* The smallest step up for a lift. Barbells follow your smallest plates;
   machines, cables and dumbbells can be set per exercise. */
function incFor(key, st) {
  const mv = M[key];
  if (st.inc && num(st.inc[key]) > 0) return num(st.inc[key]);
  if (mv.bar) return st.plates.length ? Math.min.apply(null, st.plates) * 2 : 2.5;
  return mv.inc;
}

/* Warm-up ramp towards the first working weight. Not logged. */
function warmupsFor(w, mv, st, inc) {
  if (!w) return [];
  const bar = mv.bar ? st.barWeight : 0;
  const smallest = mv.bar ? 5 : (inc || mv.inc || 1); // round warm-ups to friendly jumps
  const round = (x) => Math.max(bar, Math.round(x / smallest) * smallest);
  const plan = mv.bar ? [[0, 10], [0.5, 6], [0.7, 4], [0.85, 2]] : [[0.5, 8], [0.7, 4], [0.85, 2]];
  const out = [];
  plan.forEach((p) => {
    const x = p[0] === 0 ? bar : round(w * p[0]);
    if (x > 0 && x < w && !out.some((o) => o.w === x)) out.push({ w: x, r: p[1], bar: p[0] === 0 });
  });
  return out;
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

function suggest(slot, mv, prev, b, inc) {
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
  // When the next step is a big jump (over 10%), go past the range first so the new weight is manageable
  const big = !!(inc && topW && inc / topW > 0.1);
  const need = big ? hi + 2 : hi;
  const toppedOut = atTop.length >= slot.sets && atTop.every((s) => s.r >= need);
  const reachedRange = atTop.length >= slot.sets && atTop.every((s) => s.r >= hi);
  const fellShort = atTop.length > 0 && atTop.every((s) => s.r < lo);
  const rows = Array.from({ length: n }, (_, i) => ({ w: prev.sets[i] ? prev.sets[i].w || "" : topW || "", r: prev.sets[i] ? prev.sets[i].r : lo }));
  if (!topW) {
    if (toppedOut) return { n: n, rows: rows, text: mv.bw
      ? "You hit the top of the range. Slow the lowering to three seconds to keep progressing."
      : "You hit the top of the range. Add some weight this time." };
    return { n: n, rows: rows, text: "Beat last time by a rep somewhere." };
  }
  if (toppedOut && inc) {
    const w = Math.round((topW + inc) * 100) / 100;
    return { n: n, rows: fill(w, lo), text: big
      ? "You hit " + need + " on every set. Go up to " + fmtNum(w) + "kg. It's a big jump on this one, so fewer reps is expected. Build back up from there."
      : "You hit " + hi + " on every set. Go up to " + fmtNum(w) + "kg and build back up from " + lo + "." };
  }
  if (big && reachedRange) {
    return { n: n, rows: rows, text: "Stay at " + fmtNum(topW) + "kg. The next step up is a big jump, so push to " + need + " on every set first." };
  }
  if (fellShort && inc && topW - inc > 0) {
    const w = Math.round((topW - inc) * 100) / 100;
    return { n: n, rows: fill(w, hi), text: "Last time landed under " + lo + " at " + fmtNum(topW) + "kg. Drop back to " + fmtNum(w) + "kg and push the reps higher before trying it again." };
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
  down: html`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
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
  return html`<div className="toast" role="status">${toast.msg}</div>`;
}

/* The PR moment: a brass slab drops in with the number. Tap to dismiss. */
function PrBurst({ pr, onClose }) {
  useEffect(() => {
    if (!pr) return;
    const id = setTimeout(onClose, 4500);
    return () => clearTimeout(id);
  }, [pr]);
  if (!pr) return null;
  return html`
    <button key=${pr.id} className="pr-burst" onClick=${onClose} aria-live="polite">
      <span className="pr-burst-label">New personal record</span>
      <span className="display pr-burst-num">${pr.big}</span>
      <span className="pr-burst-name">${pr.line}</span>
    </button>`;
}

function Toggle({ label, hint, checked, onChange }) {
  return html`
    <label className="toggle-row">
      <span><span className="toggle-label">${label}</span>${hint ? html`<span className="hint">${hint}</span>` : null}</span>
      <input type="checkbox" className="switch" checked=${!!checked} onChange=${(e) => onChange(e.target.checked)} />
    </label>`;
}

/* The rest timer slab. The fill drains as rest runs out; the text is drawn
   twice and clipped so it stays readable on both halves. */
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
    if (now - timer.endAt < 5000) { // no alarm for a timer that ran out while the app was closed
      if (settings.sound) beep();
      buzz(settings.vibrate, [220, 120, 220]);
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

const moveOfSlot = (slot, swaps) => (swaps[slot.id] && M[swaps[slot.id]] ? swaps[slot.id] : slot.moves[0]);
function setsToday(day, swaps, logs, today) {
  return day.slots.reduce((n, slot) => { const k = moveOfSlot(slot, swaps); return n + doneSets(logs[k] && logs[k][today]).length; }, 0);
}

function Home({ today, b, settings, setSettings, sessions, logs, food, setFood, openDay, swaps }) {
  const weekStart = mondayOf(today), weekEnd = addDays(weekStart, 6);
  const doneOn = (id) => sessions.filter((s) => s.day === id && s.date >= weekStart && s.date <= weekEnd).map((s) => s.date).sort().pop();
  const dow = parse(today).getDay();
  const todays = PLAN.find((d) => d.dow === dow);
  const pending = PLAN.filter((d) => !doneOn(d.id));
  const hero = todays && !doneOn(todays.id) ? todays : pending.find((d) => d.dow > dow) || pending[0] || null;
  const heroLead = !hero ? "Week complete" : hero === todays ? WEEKDAYS[dow] + ", " + hero.focus.toLowerCase() : (todays ? "Up next, " : "Rest day. Up next, ") + hero.focus.toLowerCase();
  const logged = hero ? setsToday(hero, swaps, logs, today) : 0;
  const cyc = cycleInfo(settings, today);
  const [foodOpen, setFoodOpen] = useState(false);
  const deloadNow = () => setSettings((s) => Object.assign({}, s, { blockStart: addDays(mondayOf(today), -7 * b.loadWeeks), blockOffset: b.block - 1 }));

  return html`
    <main className="screen home">
      <header className="topbar"><span className="wordmark">Sculptor</span></header>

      <section className="hero" aria-labelledby="hero-name">
        <p className="hero-lead">${heroLead}</p>
        ${hero ? html`
          <h1 id="hero-name" className="display hero-name">${dayName(hero)}</h1>
          <p className="hero-focus">${hero.intro}</p>
          <p className="hero-list">${hero.kind === "cardio" ? CARDIO_OPTIONS.map((o, i) => (i ? o.toLowerCase() : o)).join(", ") + "." : hero.slots.map((sl, i) => (i ? inSentence(exName(moveOfSlot(sl, swaps))) : exName(moveOfSlot(sl, swaps)))).join(", ") + "."}</p>
          <div className="hero-cta">
            <button className="primary" onClick=${() => openDay(hero.id)}>${hero.kind === "cardio" ? "Log it" : logged ? "Resume session" : "Start session"}</button>
            ${logged ? html`<span className="hint">${logged} ${logged === 1 ? "set" : "sets"} logged so far</span>` : null}
          </div>` : html`
          <h1 id="hero-name" className="display hero-name">Week done</h1>
          <p className="hero-focus">Rest up. Next week opens with ${dayName(PLAN[0])}.</p>`}
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
          ${PLAN.map((d) => {
            const done = doneOn(d.id);
            return html`
              <li key=${d.id}>
                <button className=${"day-row" + (done ? " is-done" : "") + (d.dow === dow ? " is-today" : "")} onClick=${() => openDay(d.id)}>
                  <span className="day-dow">${WEEKDAYS[d.dow].slice(0, 3)}</span>
                  <span className="day-text"><span className="day-name">${dayName(d)}</span><span className="day-focus">${d.focus}</span></span>
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

      ${settings.showFood ? html`<${FoodPanel} today=${today} food=${food} setFood=${setFood} targets=${settings.targets} open=${foodOpen} setOpen=${setFoodOpen} />` : null}
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
/* Share card: a 1080×1920 story image of the session                  */
/* ------------------------------------------------------------------ */
async function drawShareCard(d) {
  const W = 1080, H = 1920, P = 96;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d");
  const DF = "'Big Shoulders Display', 'Arial Narrow', sans-serif", TF = "'Hanken Grotesk', system-ui, sans-serif";
  try { await Promise.all([document.fonts.load("800 200px 'Big Shoulders Display'"), document.fonts.load("600 40px 'Hanken Grotesk'"), document.fonts.load("700 40px 'Hanken Grotesk'")]); } catch (e) { /* fall back to system fonts */ }
  g.fillStyle = "#26141C"; g.fillRect(0, 0, W, H);
  g.fillStyle = "#CDAAB4"; g.font = "600 42px " + TF; g.fillText(d.dateLabel, P, 190);

  // Day name, as large as fits on up to two lines
  const words = d.title.split(" ");
  let lines = [d.title], size = 330;
  const widest = (ls, s) => { g.font = "800 " + s + "px " + DF; return Math.max.apply(null, ls.map((l) => g.measureText(l).width)); };
  if (widest(lines, size) > W - 2 * P && words.length > 1) {
    let best = null;
    for (let i = 1; i < words.length; i++) {
      const ls = [words.slice(0, i).join(" "), words.slice(i).join(" ")];
      const w = widest(ls, size);
      if (!best || w < best.w) best = { ls: ls, w: w };
    }
    lines = best.ls;
  }
  while (size > 120 && widest(lines, size) > W - 2 * P) size -= 10;
  g.fillStyle = "#F7EAEB"; g.font = "800 " + size + "px " + DF;
  let y = 250 + size * 0.86;
  lines.forEach((l) => { g.fillText(l, P - 6, y); y += size * 0.86; });
  g.fillStyle = "#CDAAB4"; g.font = "500 48px " + TF; g.fillText(d.focus, P, y + 20);

  // Stats and top sets sit on the band at the bottom
  const tops = d.tops.slice(0, 6);
  y = H - 220 - 70 - tops.length * 118 - 120;
  const stats = [[String(d.sets), "sets"], [Math.round(d.vol).toLocaleString("en-GB"), "kg lifted"]];
  if (d.mins) stats.push([String(d.mins), "minutes"]);
  let numSize = 150, widths;
  const measure = () => stats.map((s) => { g.font = "800 " + numSize + "px " + DF; const a = g.measureText(s[0]).width; g.font = "600 40px " + TF; return Math.max(a, g.measureText(s[1]).width); });
  widths = measure();
  while (numSize > 90 && widths.reduce((t, w) => t + w, 0) + 80 * (stats.length - 1) > W - 2 * P) { numSize -= 10; widths = measure(); }
  let x = P;
  stats.forEach((s, i) => {
    g.fillStyle = "#F7EAEB"; g.font = "800 " + numSize + "px " + DF; g.fillText(s[0], x - 4, y);
    g.fillStyle = "#CDAAB4"; g.font = "600 40px " + TF; g.fillText(s[1], x, y + 58);
    x += widths[i] + 80;
  });

  // Top sets, PRs in brass
  y += 120;
  g.strokeStyle = "#573444"; g.lineWidth = 2;
  tops.forEach((t) => {
    g.beginPath(); g.moveTo(P, y); g.lineTo(W - P, y); g.stroke();
    y += 78;
    g.fillStyle = t.pr ? "#F0C27B" : "#F7EAEB"; g.font = "600 44px " + TF;
    let name = t.name; while (g.measureText(name).width > 560 && name.length > 4) name = name.slice(0, -2);
    g.fillText(name === t.name ? name : name + "…", P, y);
    g.font = "800 64px " + DF; g.textAlign = "right";
    g.fillText((t.pr ? "PR  " : "") + t.set, W - P, y + 4);
    g.textAlign = "left";
    y += 40;
  });

  // Accent band
  g.fillStyle = d.accent; g.fillRect(0, H - 220, W, 220);
  g.fillStyle = "#2A0F18"; g.font = "700 42px " + TF; g.fillText(d.blockLine, P, H - 100);
  g.font = "800 64px " + DF; g.textAlign = "right"; g.fillText("Sculptor", W - P, H - 96); g.textAlign = "left";
  return new Promise((res) => c.toBlob(res, "image/png"));
}

async function shareSession(d, notify) {
  const blob = await drawShareCard(d);
  if (!blob) { notify("Couldn't draw the card on this device."); return; }
  const file = new File([blob], "sculptor-" + d.date + ".png", { type: "image/png" });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: d.title }); } catch (e) { /* share sheet closed */ }
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = file.name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  notify("Card saved to your downloads.");
}

/* ------------------------------------------------------------------ */
/* Recharge: an easy cardio or rest day                                */
/* ------------------------------------------------------------------ */
function CardioView({ day, today, sessions, setSessions, notify, onBack }) {
  const done = sessions.find((s) => s.day === day.id && s.date === today);
  const [act, setAct] = useState(done ? done.activity : null);
  const [mins, setMins] = useState(done && done.mins ? String(done.mins) : "");
  const save = () => {
    const a = act || "Rest";
    setSessions((prev) => prev.filter((s) => !(s.day === day.id && s.date === today))
      .concat([{ day: day.id, date: today, ts: Date.now(), kind: "cardio", activity: a, mins: a === "Rest" ? null : num(mins) || null }]));
    notify(a === "Rest" ? "Rest day logged." : a + " logged.");
    onBack();
  };
  return html`
    <main className="screen dayview">
      <header className="dayhead">
        <button className="back-btn" onClick=${onBack}>${Icon.back}<span>Back</span></button>
        <p className="day-focus-line">${day.focus}</p>
        <h1 className="display day-title">${dayName(day)}</h1>
        <p className="day-intro">${day.intro}</p>
      </header>
      <section className="panel" aria-labelledby="act-h">
        <h2 id="act-h" className="section-title">What did you do?</h2>
        <div className="chip-grid" role="radiogroup" aria-label="Activity">
          ${CARDIO_OPTIONS.map((o) => html`<button key=${o} role="radio" aria-checked=${act === o} className=${"chip" + (act === o ? " is-on" : "")} onClick=${() => setAct(o)}>${o}</button>`)}
        </div>
        ${act && act !== "Rest" ? html`
          <label className="form-field">
            <span>Minutes (optional)</span>
            <input inputMode="numeric" value=${mins} onChange=${(e) => setMins(e.target.value.replace(/[^\d]/g, ""))} />
          </label>` : null}
        <p className="hint">Stairs and steep inclines are glute work, so leave them out while your glutes recover.</p>
        <button className="primary wide finish" onClick=${save}>${done ? "Update" : "Log it"}</button>
      </section>
      <p className="hint center">Want Shelf back? Switch Saturday to lifting in Settings.</p>
    </main>`;
}

/* ------------------------------------------------------------------ */
/* Session screen                                                      */
/* ------------------------------------------------------------------ */
function DayView({ day, today, b, logs, setLogs, swaps, setSwaps, sessions, setSessions, cardio, setCardio, startTimer, notify, onPR, settings, setSettings, onBack }) {
  useWakeLock(settings.wakeLock);
  const [optSlot, setOptSlot] = useState(null);
  const [summary, setSummary] = useState(null);
  const moveOf = (slot) => moveOfSlot(slot, swaps);
  const restOf = (slot) => settings.rest[slot.id] || slot.rest;
  const already = sessions.find((s) => s.day === day.id && s.date === today);
  const cardioKey = today + ":" + day.id;

  const planned = day.slots.reduce((n, slot) => {
    const e = logs[moveOf(slot)] && logs[moveOf(slot)][today];
    return n + Math.max(b.deload ? Math.ceil(slot.sets / 2) : slot.sets, e ? e.sets.length : 0);
  }, 0);
  const doneN = setsToday(day, swaps, logs, today);

  const advance = (i) => {
    if (!settings.autoScroll) return;
    const next = document.querySelectorAll(".dayview .ex")[i + 1] || document.querySelector(".dayview .cardio-row");
    if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const finish = () => {
    let sets = 0, vol = 0, times = [];
    const keys = day.slots.map(moveOf);
    const prs = prEvents(logs).filter((p) => p.date === today && keys.indexOf(p.key) !== -1);
    const tops = [];
    keys.forEach((k) => {
      const e = logs[k] && logs[k][today];
      const d = doneSets(e);
      if (!d.length) return;
      sets += d.length; vol += volumeOf(d);
      (e.sets || []).forEach((s) => { if (s.done && s.t) times.push(s.t); });
      const t = topSet(d);
      tops.push({ name: exName(k), set: (t.w ? fmtNum(t.w) + " × " : "") + t.r + (t.w ? "" : " reps"), pr: prs.some((p) => p.key === k) });
    });
    const mins = times.length > 1 ? Math.max(1, Math.round((Math.max.apply(null, times) - Math.min.apply(null, times)) / 60000)) : null;
    setSessions((prev) => prev.filter((s) => !(s.day === day.id && s.date === today))
      .concat([{ day: day.id, date: today, ts: Date.now(), block: b.block, week: b.week + 1, deload: b.deload, mins: mins }]));
    setSummary({ sets: sets, vol: vol, prs: prs, mins: mins, tops: tops });
  };

  const share = () => shareSession({
    date: today, title: dayName(day), focus: day.focus,
    dateLabel: parse(today).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }),
    sets: summary.sets, vol: summary.vol, mins: summary.mins, tops: summary.tops,
    blockLine: b.deload ? "Block " + b.block + ", deload week" : "Block " + b.block + ", week " + (b.week + 1),
    accent: (ACCENTS[settings.accent] || ACCENTS.rose).hex,
  }, notify);

  const optMove = optSlot ? moveOf(optSlot) : null;
  const [nameDraft, setNameDraft] = useState("");
  useEffect(() => { if (optMove) setNameDraft(settings.exNames[optMove] || ""); }, [optMove]);
  const saveName = () => {
    const v = nameDraft.trim();
    setSettings((s) => { const n = Object.assign({}, s.exNames); if (v && v !== M[optMove].name) n[optMove] = v; else delete n[optMove]; return Object.assign({}, s, { exNames: n }); });
    notify(v ? "Renamed." : "Name reset.");
  };
  const [incDraft, setIncDraft] = useState("");
  useEffect(() => { if (optMove) setIncDraft(settings.inc[optMove] ? String(settings.inc[optMove]) : ""); }, [optMove]);
  const setInc = (v) => {
    const n = num(v);
    setSettings((s) => { const m = Object.assign({}, s.inc); if (n > 0 && n !== M[optMove].inc) m[optMove] = n; else delete m[optMove]; return Object.assign({}, s, { inc: m }); });
    setIncDraft(n > 0 && n !== M[optMove].inc ? String(n) : "");
  };
  const setRest = (secs) => setSettings((s) => { const r = Object.assign({}, s.rest); if (secs === optSlot.rest) delete r[optSlot.id]; else r[optSlot.id] = secs; return Object.assign({}, s, { rest: r }); });

  return html`
    <main className="screen dayview">
      <header className="dayhead">
        <button className="back-btn" onClick=${onBack}>${Icon.back}<span>Back</span></button>
        <p className="day-focus-line">${day.focus}</p>
        <h1 className="display day-title">${dayName(day)}</h1>
        <p className="day-intro">${day.intro}</p>
        <p className=${"day-effort" + (b.deload ? " is-deload" : "")}>${b.deload ? "Deload week: half the sets, keep it easy." : "Block " + b.block + ", week " + (b.week + 1) + ". " + effortLine(b) + "."}</p>
        <div className="day-progress" role="progressbar" aria-valuemin="0" aria-valuemax=${planned} aria-valuenow=${doneN} aria-label="Sets done">
          <div className="meter"><span style=${{ width: Math.min(100, planned ? (doneN / planned) * 100 : 0) + "%" }}></span></div>
          <span className="hint">${doneN} of ${planned} sets</span>
        </div>
      </header>

      ${day.slots.map((slot, i) => {
        const next = day.slots[i + 1];
        return html`<${Exercise} key=${slot.id + moveOf(slot)} index=${i} slot=${slot} move=${moveOf(slot)} rest=${restOf(slot)} today=${today} b=${b}
          logs=${logs} setLogs=${setLogs} startTimer=${startTimer} notify=${notify} onPR=${onPR} settings=${settings}
          nextName=${next ? exName(moveOf(next)) : null} onOptions=${() => setOptSlot(slot)} onComplete=${advance} />`;
      })}

      <label className="cardio-row">
        <input type="checkbox" className="box" checked=${!!cardio[cardioKey]}
          onChange=${(e) => { const v = e.target.checked; setCardio((c) => { const n = Object.assign({}, c); if (v) n[cardioKey] = true; else delete n[cardioKey]; return n; }); }} />
        <span><span className="cardio-title">20 min cardio finisher</span><span className="hint">${day.cardio}</span></span>
      </label>

      <button className="primary wide finish" onClick=${finish}>${already ? "Update session" : "Finish session"}</button>
      <p className="hint center">Your sets save as you go. Finishing marks the day done.</p>

      <${Sheet} open=${!!optSlot} onClose=${() => setOptSlot(null)} title=${optMove ? exName(optMove) : ""}>
        ${optSlot ? html`
          ${optSlot.moves.length > 1 ? html`
            <h3 className="sheet-sub">Swap for</h3>
            <ul className="swap-list">
              ${optSlot.moves.map((k) => html`
                <li key=${k}>
                  <button className=${"swap-opt" + (optMove === k ? " is-on" : "")} aria-pressed=${optMove === k}
                    onClick=${() => { setSwaps((s) => { const n = Object.assign({}, s); if (k === optSlot.moves[0]) delete n[optSlot.id]; else n[optSlot.id] = k; return n; }); }}>
                    <span>${exName(k)}</span>${k === optSlot.moves[0] ? html`<span className="hint">Programmed</span>` : null}
                  </button>
                </li>`)}
            </ul>
            <p className="hint">Each option keeps its own history.</p>` : null}

          <h3 className="sheet-sub">Rest between sets</h3>
          <div className="chip-grid">
            ${REST_OPTIONS.map((sec) => html`
              <button key=${sec} className=${"chip" + (restOf(optSlot) === sec ? " is-on" : "")} aria-pressed=${restOf(optSlot) === sec} onClick=${() => setRest(sec)}>
                ${restLabel(sec)}${sec === optSlot.rest ? html`<span className="sr"> (programmed)</span>` : null}
              </button>`)}
          </div>
          <p className="hint">Programmed: ${restLabel(optSlot.rest)}.</p>

          ${M[optMove].bw ? null : M[optMove].bar ? html`
            <h3 className="sheet-sub">Weight jump</h3>
            <p className="hint">${fmtNum(incFor(optMove, settings))}kg, set by the smallest plates you've ticked in Settings.</p>` : html`
            <h3 className="sheet-sub">Weight jump</h3>
            <div className="chip-grid">
              ${[1, 1.25, 2, 2.5, 5].map((v) => html`
                <button key=${v} className=${"chip" + (incFor(optMove, settings) === v ? " is-on" : "")} aria-pressed=${incFor(optMove, settings) === v} onClick=${() => setInc(v)}>${fmtNum(v)}kg</button>`)}
            </div>
            <div className="rename-row inc-row">
              <input className="text-input" inputMode="decimal" value=${incDraft} placeholder="Other, e.g. 4.5" aria-label="Other weight jump in kilograms"
                onChange=${(e) => setIncDraft(e.target.value.replace(",", "."))} />
              <button className="secondary" onClick=${() => setInc(incDraft)}>Set</button>
            </div>
            <p className="hint">The smallest step this machine, stack or dumbbell rack allows. Suggestions to go up use it. Default ${fmtNum(M[optMove].inc)}kg.</p>`}

          <h3 className="sheet-sub">Your name for it</h3>
          <div className="rename-row">
            <input className="text-input" value=${nameDraft} placeholder=${M[optMove].name} maxLength="40"
              aria-label="Exercise name" onChange=${(e) => setNameDraft(e.target.value)} />
            <button className="secondary" onClick=${saveName}>Save</button>
          </div>
          <p className="hint">Handy for your gym's machine names. History stays attached either way.</p>` : null}
      <//>

      <${Sheet} open=${!!summary} onClose=${() => { setSummary(null); onBack(); }} title="Session logged">
        ${summary ? html`
          <div className="summary-stats">
            <div><span className="display stat-num">${summary.sets}</span><span className="stat-label">sets</span></div>
            <div><span className="display stat-num">${Math.round(summary.vol).toLocaleString("en-GB")}</span><span className="stat-label">kg lifted</span></div>
            ${summary.mins ? html`<div><span className="display stat-num">${summary.mins}</span><span className="stat-label">minutes</span></div>` : null}
            <div><span className="display stat-num">${summary.prs.length}</span><span className="stat-label">${summary.prs.length === 1 ? "PR" : "PRs"}</span></div>
          </div>
          ${summary.prs.length ? html`
            <ul className="pr-list">
              ${summary.prs.map((p) => html`<li key=${p.key}><span>${exName(p.key)}</span><span className="pr-val">${p.weighted ? fmtEst(p.value) + "kg" : fmtNum(p.value) + " reps"}</span></li>`)}
            </ul>` : null}
          <div className="btn-row">
            <button className="primary" onClick=${() => { setSummary(null); onBack(); }}>Done</button>
            ${summary.sets ? html`<button className="secondary" onClick=${share}>Share card</button>` : null}
          </div>` : null}
      <//>
    </main>`;
}

/* A row of plates for one side of the bar, drawn to scale-ish. */
const PLATE_H = { 25: 40, 20: 38, 15: 34, 10: 30, 5: 22, 2.5: 18, 1.25: 14 };
const PLATE_W = { 25: 9, 20: 8, 15: 7, 10: 6, 5: 5, 2.5: 4, 1.25: 3 };
function PlateLine({ total, settings }) {
  if (!total) return null;
  const res = platesFor(total, settings.barWeight, settings.plates);
  if (!res) return html`<p className="plates hint">Lighter than your ${fmtNum(settings.barWeight)}kg bar.</p>`;
  if (!res.list.length) return html`<p className="plates hint">${fmtNum(total)}kg is just the bar.</p>`;
  let x = 14;
  const rects = res.list.map((p, i) => { const w = PLATE_W[p] || 4, h = PLATE_H[p] || 16; const r = html`<rect key=${i} x=${x} y=${22 - h / 2} width=${w} height=${h} rx="1.5"/>`; x += w + 2; return r; });
  return html`
    <div className="plates">
      <svg className="plate-svg" viewBox=${"0 0 " + (x + 16) + " 44"} width=${x + 16} height="44" aria-hidden="true">
        <rect x="0" y="20" width=${x + 16} height="4" rx="2" className="plate-sleeve"/>
        <rect x="6" y="12" width="6" height="20" rx="1.5" className="plate-collar"/>
        <g className="plate-stack">${rects}</g>
      </svg>
      <span className="plates-text">${fmtNum(total)}kg is ${res.list.map(fmtNum).join(" + ")} a side${res.left > 0 ? ". Your plates can't make the last " + fmtNum(res.left * 2) + "kg" : ""}.</span>
    </div>`;
}

function Exercise({ index, slot, move, rest, today, b, logs, setLogs, startTimer, notify, onPR, settings, nextName, onOptions, onComplete }) {
  const mv = M[move];
  const name = exName(move);
  const entry = (logs[move] && logs[move][today]) || { sets: [], note: "" };
  const hist = useMemo(() => historyOf(logs, move), [logs, move]);
  const before = hist.filter((s) => s.date < today);
  const lastShown = before[before.length - 1] || null;
  const prev = before.slice().reverse().find((s) => !s.dl) || lastShown;
  const inc = incFor(move, settings);
  const sug = suggest(slot, mv, prev, b, inc);
  const rowsN = Math.max(sug.n, entry.sets.length);
  const doneN = entry.sets.filter((s) => s.done).length;
  const complete = rowsN > 0 && doneN >= rowsN;
  const [open, setOpen] = useState(!complete);
  const [cueOpen, setCueOpen] = useState(false);
  const [warmOpen, setWarmOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(!!entry.note);
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
  const weightAt = (i) => { const s = entry.sets[i]; return num(s && s.w !== "" && s.w != null ? s.w : weightHint(i)); };
  const nextRow = (() => { for (let i = 0; i < rowsN; i++) { if (!(entry.sets[i] && entry.sets[i].done)) return i; } return rowsN - 1; })();

  const toggle = (i) => {
    const cur = entry.sets[i] || { w: "", r: "", done: false };
    if (cur.done) { setField(i, "done", false); return; }
    const wh = weightHint(i), rh = repsHint(i);
    const w = cur.w !== "" && cur.w != null ? cur.w : (/^\d/.test(wh) ? wh : "");
    const r = cur.r !== "" && cur.r != null ? cur.r : (/^\d+$/.test(rh) ? rh : "");
    if (!num(r)) { notify("Add your reps, then tick the set."); return; }
    primeAudio();
    buzz(settings.haptics, 12);
    update((e) => { grow(e, i); e.sets[i] = { w: w === "" ? "" : String(w), r: String(r), done: true, t: Date.now() }; return e; });
    // PR check against every earlier day, and today's other sets
    const weighted = isWeighted(hist) || num(w) > 0;
    const val = weighted ? e1(num(w), num(r)) : num(r);
    const prior = before.reduce((m, s) => Math.max(m, bestOf(s.sets, weighted)), 0);
    const others = bestOf(doneSets({ sets: entry.sets.filter((_, j) => j !== i) }), weighted);
    if (prior > 0 && val > prior + 0.01 && val > others + 0.01) {
      onPR({ id: Date.now(), big: weighted ? fmtEst(val) + "kg" : num(r) + " reps", line: (weighted ? "Estimated max, " : "Best set, ") + inSentence(name) });
    }
    const last = doneN + 1 >= rowsN;
    startTimer(rest, last ? (nextName ? "Next: " + nextName : "That was the last exercise") : "Set " + (doneN + 2) + " of " + rowsN);
    if (last && settings.autoScroll) setTimeout(() => { setOpen(false); setTimeout(() => onComplete(index), 80); }, 450);
  };

  const addSet = () => update((e) => { grow(e, rowsN); return e; });
  const canRemove = entry.sets.length > sug.n && !entry.sets[entry.sets.length - 1].done;
  const removeSet = () => update((e) => { e.sets.pop(); return e; });
  const warm = slot.main && settings.warmups ? warmupsFor(weightAt(0), mv, settings, inc) : [];

  if (!open) {
    return html`
      <section className="ex ex-collapsed" aria-label=${name}>
        <button className="ex-fold" aria-expanded="false" onClick=${() => setOpen(true)}>
          <span className="done-mark">${Icon.check}</span>
          <span className="ex-fold-text"><span className="ex-fold-name">${name}</span><span className="hint">${summarise(doneSets(entry))}</span></span>
          ${Icon.down}
        </button>
      </section>`;
  }

  return html`
    <section className=${"ex" + (slot.main ? " ex-main" : "")} aria-label=${name}>
      <div className="ex-head">
        <div>
          ${slot.main ? html`<p className="ex-tag">Main lift</p>` : null}
          <h2 className="ex-name">${name}</h2>
          <p className="ex-target">${sug.n} ${sug.n === 1 ? "set" : "sets"} of ${slot.reps[0]}–${slot.reps[1]}${unit}<button className="ex-rest" onClick=${onOptions}>Rest ${restLabel(rest)}</button></p>
        </div>
        <button className="chip" onClick=${onOptions}>Edit</button>
      </div>

      <p className="ex-last">${lastShown ? "Last time, " + fmtDay(lastShown.date) + ": " + summarise(lastShown.sets) : "No history yet."}</p>
      <p className="ex-sug">${sug.text}</p>

      ${warmOpen && warm.length ? html`
        <ol className="warmups" aria-label="Warm-up sets">
          ${warm.map((s, i) => html`<li key=${i}><span className="warm-set">${s.bar ? "Bar" : fmtNum(s.w) + "kg"} × ${s.r}</span>${mv.bar && !s.bar ? html`<span className="hint">${(platesFor(s.w, settings.barWeight, settings.plates) || { list: [] }).list.map(fmtNum).join(" + ")} a side</span>` : null}</li>`)}
        </ol>` : null}

      <div className="sets" role="group" aria-label=${"Sets for " + name}>
        ${Array.from({ length: rowsN }, (_, i) => {
          const s = entry.sets[i] || {};
          const rh = repsHint(i);
          return html`
            <div key=${i} className=${"set" + (s.done ? " is-done" : "")}>
              <span className="set-n" aria-hidden="true">${i + 1}</span>
              <label className="field">
                <input inputMode="decimal" enterKeyHint="next" value=${s.w == null ? "" : s.w} placeholder=${weightHint(i)}
                  aria-label=${"Set " + (i + 1) + " weight in kilograms"} onChange=${(e) => setField(i, "w", e.target.value.replace(",", "."))} />
                <span className="unit">kg</span>
              </label>
              <label className="field">
                <input inputMode="numeric" enterKeyHint="done" className=${rh.indexOf("–") !== -1 ? "is-range" : ""} value=${s.r == null ? "" : s.r} placeholder=${rh}
                  aria-label=${"Set " + (i + 1) + " reps"} onChange=${(e) => setField(i, "r", e.target.value.replace(/[^\d]/g, ""))} />
                <span className="unit">reps</span>
              </label>
              <button className="tick" aria-pressed=${!!s.done} aria-label=${(s.done ? "Undo set " : "Log set ") + (i + 1)} onClick=${() => toggle(i)}>${Icon.check}</button>
            </div>`;
        })}
      </div>

      ${mv.bar ? html`<${PlateLine} total=${weightAt(nextRow)} settings=${settings} />` : null}

      <div className="ex-tools">
        <button className="text-btn" onClick=${addSet}>Add set</button>
        ${canRemove ? html`<button className="text-btn" onClick=${removeSet}>Remove set</button>` : null}
        ${warm.length ? html`<button className="text-btn" aria-expanded=${warmOpen} onClick=${() => setWarmOpen(!warmOpen)}>Warm-up</button>` : null}
        <button className="text-btn" aria-expanded=${cueOpen} onClick=${() => setCueOpen(!cueOpen)}>Form cue</button>
        <button className="text-btn" aria-expanded=${noteOpen} onClick=${() => setNoteOpen(!noteOpen)}>Note</button>
        ${complete ? html`<button className="text-btn" onClick=${() => setOpen(false)}>Fold</button>` : null}
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
const CAL_WEEKS = 12;
function TrainingCalendar({ sessions, today }) {
  const start = addDays(mondayOf(today), -7 * (CAL_WEEKS - 1));
  const by = {};
  sessions.forEach((s) => {
    if (s.date < start) return;
    const cur = by[s.date] || { dl: false, lift: false };
    if (s.kind === "cardio") { by[s.date] = cur; cur.cardio = true; return; }
    cur.lift = true; if (s.deload) cur.dl = true; by[s.date] = cur;
  });
  const count = sessions.filter((s) => s.date >= start && s.date <= today && s.kind !== "cardio").length;
  const rows = ["M", "T", "W", "T", "F", "S", "S"];
  return html`
    <section aria-labelledby="cal-h">
      <h2 id="cal-h" className="section-title">Last ${CAL_WEEKS} weeks</h2>
      <div className="cal" role="img" aria-label=${count + " sessions in the last " + CAL_WEEKS + " weeks"}>
        ${rows.map((r, di) => html`
          <div key=${di} className="cal-row">
            <span className="cal-dow" aria-hidden="true">${r}</span>
            ${Array.from({ length: CAL_WEEKS }, (_, wi) => {
              const d = addDays(start, wi * 7 + di);
              const hit = by[d];
              return html`<span key=${wi} className=${"cal-cell" + (hit ? (hit.lift ? (hit.dl ? " is-deload" : " is-on") : " is-cardio") : "") + (d === today ? " is-today" : "") + (d > today ? " is-future" : "")}></span>`;
            })}
          </div>`)}
      </div>
      <p className="hint">${count} lifting ${count === 1 ? "session" : "sessions"} since ${fmtShort(start)}. Deloads show in green, recharge days in grey.</p>
    </section>`;
}

function Progress({ logs, sessions, today, openMove }) {
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
      <${TrainingCalendar} sessions=${sessions} today=${today} />
      ${!lifts.length ? html`<p className="empty">Log your first session and every lift will show up here with its trend.</p>` : null}

      ${prs.length ? html`
        <section aria-labelledby="pr-h">
          <h2 id="pr-h" className="section-title">Recent PRs</h2>
          <ul className="pr-list">
            ${prs.slice(0, 6).map((p, i) => html`
              <li key=${i}>
                <button className="pr-row" onClick=${() => openMove(p.key)}>
                  <span><span className="pr-name">${exName(p.key)}</span><span className="hint">${fmtDay(p.date)}</span></span>
                  <span className="pr-val">${p.weighted ? fmtEst(p.value) + "kg" : fmtNum(p.value) + " reps"}<span className="pr-delta">${fmtDelta(p.value - p.prev, p.weighted)}</span></span>
                </button>
              </li>`)}
          </ul>
        </section>` : null}

      ${lifts.length ? html`
        <section aria-labelledby="lifts-h">
          <h2 id="lifts-h" className="section-title">Lifts</h2>
          <p className="hint">Weighted lifts show estimated one-rep max, so a heavy set of 6 and a lighter set of 12 compare fairly.</p>
          <ul className="lift-list">
            ${lifts.map((l) => html`
              <li key=${l.key}>
                <button className="lift-row" onClick=${() => openMove(l.key)}>
                  <span className="lift-text"><span className="lift-name">${exName(l.key)}</span><span className="hint">${l.h.length} ${l.h.length === 1 ? "session" : "sessions"}, last ${fmtShort(l.last)}</span></span>
                  <${Sparkline} values=${l.series.slice(-12)} />
                  <span className="lift-best">${l.weighted ? fmtEst(l.best) : fmtNum(l.best)}<span className="lift-unit">${l.weighted ? "kg" : " reps"}</span></span>
                </button>
              </li>`)}
          </ul>
        </section>` : null}
    </main>`;
}

function MoveDetail({ logs, move, onBack }) {
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
        <h1 className="display day-title">${exName(move)}</h1>
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
  const nameCount = Object.keys(settings.exNames).length;
  const restCount = Object.keys(settings.rest).length;
  const incCount = Object.keys(settings.inc).length;
  const dayCustom = Object.keys(settings.dayNames).length;
  const setDayName = (id, v) => { const n = Object.assign({}, settings.dayNames); if (v.trim()) n[id] = v; else delete n[id]; set({ dayNames: n }); };
  const togglePlate = (p) => { const has = settings.plates.indexOf(p) !== -1; set({ plates: has ? settings.plates.filter((x) => x !== p) : settings.plates.concat([p]).sort((a, c) => c - a) }); };

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
        <p className="form-label">Saturday</p>
        <div className="seg-control" role="radiogroup" aria-label="Saturday">
          <button role="radio" aria-checked=${settings.saturday === "cardio"} className=${settings.saturday === "cardio" ? "is-on" : ""} onClick=${() => set({ saturday: "cardio" })}>Recharge</button>
          <button role="radio" aria-checked=${settings.saturday !== "cardio"} className=${settings.saturday !== "cardio" ? "is-on" : ""} onClick=${() => set({ saturday: "shelf" })}>Shelf</button>
        </div>
        <p className="hint">${settings.saturday === "cardio"
          ? "Easy cardio or rest on Saturdays. Tuesday and Thursday each get an extra set of abduction, and their finishers switch to bike or rowing."
          : "Saturday is the Shelf glute session. Switch to Recharge if your glutes need more recovery."}</p>
        <div className="btn-row">
          ${!b.deload ? html`<button className="secondary" onClick=${() => set({ blockStart: addDays(mondayOf(today), -7 * b.loadWeeks), blockOffset: b.block - 1 })}>Deload this week</button>` : null}
          ${b.week > 0 ? html`<button className="secondary" onClick=${() => set({ blockStart: mondayOf(today), blockOffset: b.block })}>Start block ${b.block + 1} this week</button>` : null}
        </div>
      </section>

      <section className="panel" aria-labelledby="look-h">
        <h2 id="look-h" className="section-title">Accent colour</h2>
        <div className="swatches" role="radiogroup" aria-label="Accent colour">
          ${Object.keys(ACCENTS).map((k) => html`
            <button key=${k} role="radio" aria-checked=${settings.accent === k} className=${"swatch" + (settings.accent === k ? " is-on" : "")} onClick=${() => set({ accent: k })}>
              <span className="swatch-dot" style=${{ background: ACCENTS[k].hex }}></span><span>${ACCENTS[k].name}</span>
            </button>`)}
        </div>
      </section>

      <section className="panel" aria-labelledby="names-h">
        <h2 id="names-h" className="section-title">Day names</h2>
        <p className="panel-text">Call your days whatever you like. Leave one blank to use the default.</p>
        ${PLAN.map((d) => html`
          <label key=${d.id} className="form-field">
            <span>${WEEKDAYS[d.dow]}, ${d.focus.toLowerCase()}</span>
            <input value=${settings.dayNames[d.id] || ""} placeholder=${d.name} maxLength="24" onChange=${(e) => setDayName(d.id, e.target.value)} />
          </label>`)}
        ${dayCustom ? html`<button className="text-btn" onClick=${() => set({ dayNames: {} })}>Use the default names</button>` : null}
      </section>

      <section className="panel" aria-labelledby="sess-h">
        <h2 id="sess-h" className="section-title">During a session</h2>
        <${Toggle} label="Auto-advance" hint="Folds an exercise when its last set is ticked and scrolls to the next" checked=${settings.autoScroll} onChange=${(v) => set({ autoScroll: v })} />
        <${Toggle} label="Warm-up sets for main lifts" hint="A ramp up to your first working weight" checked=${settings.warmups} onChange=${(v) => set({ warmups: v })} />
        <${Toggle} label="Buzz when you tick a set" hint="Android only" checked=${settings.haptics} onChange=${(v) => set({ haptics: v })} />
        <${Toggle} label="Keep screen on" hint="So the timer stays visible between sets" checked=${settings.wakeLock} onChange=${(v) => set({ wakeLock: v })} />
      </section>

      <section className="panel" aria-labelledby="timer-h">
        <h2 id="timer-h" className="section-title">Rest timer</h2>
        <${Toggle} label="Sound when rest is up" checked=${settings.sound} onChange=${(v) => set({ sound: v })} />
        <${Toggle} label="Vibrate when rest is up" hint="Android only" checked=${settings.vibrate} onChange=${(v) => set({ vibrate: v })} />
        <p className="hint">Change an exercise's rest by tapping its rest time during a session.</p>
      </section>

      <section className="panel" aria-labelledby="gym-h">
        <h2 id="gym-h" className="section-title">Your gym</h2>
        <p className="panel-text">Used to work out plates for barbell lifts.</p>
        <label className="form-field">
          <span>Barbell weight</span>
          <select value=${settings.barWeight} onChange=${(e) => set({ barWeight: Number(e.target.value) })}>
            ${[20, 15, 10].map((n) => html`<option key=${n} value=${n}>${n}kg</option>`)}
          </select>
        </label>
        <p className="form-label">Plates available</p>
        <div className="chip-grid">
          ${ALL_PLATES.map((p) => html`<button key=${p} className=${"chip" + (settings.plates.indexOf(p) !== -1 ? " is-on" : "")} aria-pressed=${settings.plates.indexOf(p) !== -1} onClick=${() => togglePlate(p)}>${fmtNum(p)}kg</button>`)}
        </div>
      </section>

      <section className="panel" aria-labelledby="ex-h">
        <h2 id="ex-h" className="section-title">Exercise changes</h2>
        <p className="panel-text">${swapCount || nameCount || restCount || incCount
          ? [swapCount ? swapCount + " swapped" : "", nameCount ? nameCount + " renamed" : "", restCount ? restCount + " with custom rest" : "", incCount ? incCount + " with a custom weight jump" : ""].filter(Boolean).join(", ") + "."
          : "Everything is as programmed. Tap Edit on any exercise during a session to swap it, rename it, or change its rest or weight jump."}</p>
        <div className="btn-row">
          ${swapCount ? html`<button className="secondary" onClick=${() => setSwaps({})}>Undo swaps</button>` : null}
          ${nameCount ? html`<button className="secondary" onClick=${() => set({ exNames: {} })}>Undo renames</button>` : null}
          ${restCount ? html`<button className="secondary" onClick=${() => set({ rest: {} })}>Undo rest changes</button>` : null}
          ${incCount ? html`<button className="secondary" onClick=${() => set({ inc: {} })}>Undo weight jumps</button>` : null}
        </div>
      </section>

      <section className="panel" aria-labelledby="home-h">
        <h2 id="home-h" className="section-title">Home screen</h2>
        <${Toggle} label="Show food today" checked=${settings.showFood} onChange=${(v) => set({ showFood: v })} />
        ${settings.showFood ? html`
          <div className="form-grid">
            ${FOOD_KEYS.map(([k, label, unit]) => html`
              <label key=${k} className="form-field">
                <span>${label} target (${unit})</span>
                <input inputMode="numeric" value=${settings.targets[k]} onChange=${(e) => { const v = num(e.target.value); set({ targets: Object.assign({}, settings.targets, { [k]: v }) }); }} />
              </label>`)}
          </div>` : null}
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

      <section className="panel" aria-labelledby="data-h">
        <h2 id="data-h" className="section-title">Your data</h2>
        <p className="panel-text">Everything is stored on this phone.${settings.migratedAt ? " Your history from the old version was brought across on " + fmtDay(settings.migratedAt) + "." : ""} Export a backup now and then.</p>
        <div className="btn-row">
          <button className="secondary" onClick=${exportData}>Export backup</button>
          <button className="secondary" onClick=${() => fileRef.current && fileRef.current.click()}>Restore from backup</button>
        </div>
        <input ref=${fileRef} type="file" accept="application/json,.json" hidden onChange=${(e) => { if (e.target.files[0]) importData(e.target.files[0]); e.target.value = ""; }} />
      </section>
      <p className="hint center">Sculptor's Playbook, version 2.4</p>
    </main>`;
}

/* ------------------------------------------------------------------ */
/* App shell                                                           */
/* ------------------------------------------------------------------ */
function App() {
  const today = useToday();
  const [toast, setToast] = useState(null);
  const [pr, setPr] = useState(null);
  const toastTimer = useRef(null);
  const notify = useCallback((msg) => {
    setToast({ msg: msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);
  const saveFailed = () => notify("Couldn't save to this phone's storage. Export a backup and free up some space.");

  const [logs, setLogs] = useStored("logs", {}, saveFailed);
  const [sessions, setSessions] = useStored("sessions", [], saveFailed);
  const [swaps, setSwaps] = useStored("swaps", {}, saveFailed);
  const [rawSettings, setSettings] = useStored("settings", defaultSettings(), saveFailed);
  const [food, setFood] = useStored("food", {}, saveFailed);
  const [cardio, setCardio] = useStored("cardio", {}, saveFailed);
  const [timer, setTimer] = useStored("timer", null);
  const settings = useMemo(() => {
    const d = defaultSettings();
    const s = Object.assign(d, rawSettings);
    s.targets = Object.assign({}, DEFAULT_TARGETS, rawSettings.targets || {});
    ["dayNames", "exNames", "rest", "inc"].forEach((k) => { if (!s[k] || typeof s[k] !== "object") s[k] = {}; });
    if (!Array.isArray(s.plates)) s.plates = ALL_PLATES;
    return s;
  }, [rawSettings]);
  CUSTOM.ex = settings.exNames;
  CUSTOM.day = settings.dayNames;
  PLAN = planDays(settings);
  const b = blockInfo(settings, today);

  useEffect(() => {
    document.documentElement.style.setProperty("--flush", (ACCENTS[settings.accent] || ACCENTS.rose).hex);
  }, [settings.accent]);

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
  const onPR = useCallback((p) => { setPr(p); buzz(settings.haptics, [30, 50, 30, 50, 90]); }, [settings.haptics]);

  const day = route.day ? PLAN.find((d) => d.id === route.day) : null;
  let screen;
  if (day && day.kind === "cardio") {
    screen = html`<${CardioView} day=${day} today=${today} sessions=${sessions} setSessions=${setSessions} notify=${notify} onBack=${back} />`;
  } else if (day) {
    screen = html`<${DayView} day=${day} today=${today} b=${b} logs=${logs} setLogs=${setLogs} swaps=${swaps} setSwaps=${setSwaps}
      sessions=${sessions} setSessions=${setSessions} cardio=${cardio} setCardio=${setCardio}
      startTimer=${startTimer} notify=${notify} onPR=${onPR} settings=${settings} setSettings=${setSettings} onBack=${back} />`;
  } else if (route.move && M[route.move]) {
    screen = html`<${MoveDetail} logs=${logs} move=${route.move} onBack=${back} />`;
  } else if (route.tab === "progress") {
    screen = html`<${Progress} logs=${logs} sessions=${sessions} today=${today} openMove=${(k) => push({ tab: "progress", day: null, move: k })} />`;
  } else if (route.tab === "settings") {
    screen = html`<${Settings} settings=${settings} setSettings=${setSettings} b=${b} today=${today} swaps=${swaps} setSwaps=${setSwaps}
      notify=${notify} onImported=${() => location.reload()} />`;
  } else {
    screen = html`<${Home} today=${today} b=${b} settings=${settings} setSettings=${setSettings} sessions=${sessions} logs=${logs}
      food=${food} setFood=${setFood} swaps=${swaps} openDay=${(id) => push({ tab: "train", day: id, move: null })} />`;
  }
  const showNav = !day;

  return html`
    <div className=${"app" + (showNav ? " has-nav" : "") + (timer ? " has-timer" : "")}>
      <${Toast} toast=${toast} />
      ${pr ? html`<${PrBurst} key=${pr.id} pr=${pr} onClose=${() => setPr(null)} />` : null}
      ${screen}
      <${TimerBar} timer=${timer} setTimer=${setTimer} settings=${settings} raised=${showNav} />
      ${showNav ? html`<${Nav} tab=${route.tab} go=${goTab} />` : null}
    </div>`;
}

init();
ReactDOM.createRoot(document.getElementById("root")).render(html`<${App} />`);
})();
