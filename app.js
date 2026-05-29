var useState = React.useState;
var useEffect = React.useEffect;

var DAYS = [
  { id: 1, name: "Glutes Heavy", emoji: "🍑", tag: "Hip Thrust Focus", color: "#ff6eb4",
    exercises: [
      { id: "1a", name: "Barbell Hip Thrust", sets: "5 × 8-10", note: "PRIMARY glute builder. Full ROM, 2-sec squeeze at top, last 1-2 reps should be a real grind. Adding weight here over the weeks is THE driver of glute growth — chase it relentlessly.", progression: "double" },
      { id: "1b", name: "Bulgarian Split Squat", sets: "4 × 10/leg", note: "Chest forward = glute. Add a rep weekly until 12, then add weight.", progression: "double" },
      { id: "1c", name: "Romanian Deadlift", sets: "4 × 8-10", note: "Hip hinge. Push the floor back, feel the deep stretch in the hamstrings — that stretch under load is a major glute/ham growth driver.", progression: "double" },
      { id: "1e", name: "Cable Kickback", sets: "3 × 15-20/leg", note: "Pump finisher. Higher reps, slow squeeze.", progression: "double" },
      { id: "1f", name: "20 min cardio finisher", sets: "20 min", note: "Stairmaster or incline walk. Glute-biased." },
    ],
  },
  { id: 2, name: "Back", emoji: "🏗️", tag: "Width + Thickness", color: "#c084fc",
    exercises: [
      { id: "2a", name: "Barbell Row", sets: "4 × 6-8", note: "PRIMARY. Heaviest back exercise. Underhand for more lat.", progression: "double" },
      { id: "2b", name: "Meadows Row landmine", sets: "4 × 8-10/side", note: "Best mid-back exercise nobody does. Brace hard.", progression: "double" },
      { id: "2c", name: "Chest-Supported DB Row", sets: "4 × 10-12", note: "Pure back, no momentum. Squeeze shoulder blades.", progression: "double" },
      { id: "2d", name: "Lat Pulldown wide or neutral grip", sets: "4 × 8-12", note: "ADDED for width — the plan had no vertical pull at all. This is what builds the V-taper. Drive the elbows down, think lats not biceps.", progression: "double" },
      { id: "2e", name: "Straight-Arm Cable Pulldown", sets: "3 × 15", note: "Lats only. No biceps. Focus on the squeeze.", progression: "single" },
      { id: "2f", name: "Face Pulls", sets: "4 × 20", note: "Rear delts + posture. Always.", progression: "single" },
      { id: "2g", name: "20 min cardio finisher", sets: "20 min", note: "Rowing pairs perfectly with back day." },
    ],
  },
  { id: 3, name: "Shoulders + Abs", emoji: "💎", tag: "All 3 Heads", color: "#f472b6",
    exercises: [
      { id: "3a", name: "Seated DB Overhead Press", sets: "4 × 8-10", note: "PRIMARY pressing. Control the eccentric.", progression: "double" },
      { id: "3b", name: "Cable Lateral Raise", sets: "4 × 12-15", note: "Side delts. Cable beats dumbbell — constant tension.", progression: "double" },
      { id: "3c", name: "Rear Delt Fly pec deck or cable", sets: "4 × 15", note: "Often-neglected. This is the difference between flat and sculpted shoulders.", progression: "single" },
      { id: "3d", name: "DB Lateral Raise", sets: "3 × 12-15", note: "Swapped in for the redundant second press — side delts are what build shoulder width. Slight forward lean, no shrug, no swing.", progression: "double" },
      { id: "3e", name: "Cable Crunch", sets: "4 × 12-15", note: "Weighted abs. Treat as a real lift — progressive overload.", progression: "double" },
      { id: "3f", name: "Hanging Leg Raise", sets: "3 × 10-15", note: "Lower abs. Slow controlled, no swinging.", progression: "single" },
      { id: "3g", name: "20 min cardio finisher", sets: "20 min", note: "Steady state — incline walk." },
    ],
  },
  { id: 4, name: "Glutes Hinge", emoji: "🍑", tag: "Deadlift Focus", color: "#e879f9",
    exercises: [
      { id: "4a", name: "Sumo Deadlift", sets: "4 × 6-8", note: "PRIMARY. Wide stance. Glutes drive the lockout.", progression: "double" },
      { id: "4b", name: "Hyperextension on bench, plate held", sets: "4 × 10-12", note: "Round lower back slightly to bias glutes. Squeeze 1 sec at top. Don't go past parallel.", progression: "double" },
      { id: "4d", name: "Single-Leg Hip Thrust or DB Hip Thrust", sets: "3 × 12/leg", note: "Different stimulus from Day 1's heavy thrusts.", progression: "double" },
      { id: "4e", name: "Cable Pull Through", sets: "3 × 12-15", note: "Glute-ham tie-in. Hinge mechanics with cable resistance.", progression: "double" },
      { id: "4f", name: "20 min cardio finisher", sets: "20 min", note: "Stairmaster — try sideways for upper glutes." },
    ],
  },
  { id: 5, name: "Back + Abs", emoji: "🏗️", tag: "Volume Day", color: "#a78bfa",
    exercises: [
      { id: "5a", name: "Pendlay Row", sets: "4 × 6-8", note: "PRIMARY. Reset between reps. Strict form.", progression: "double" },
      { id: "5b", name: "Seal Row or Chest-Supported", sets: "4 × 10-12", note: "No momentum allowed. Pure back work.", progression: "double" },
      { id: "5c", name: "Neutral-Grip Lat Pulldown", sets: "4 × 10-12", note: "Second vertical pull of the week for lat width. Neutral grip is lat-biased and easy on the shoulders.", progression: "double" },
      { id: "5d", name: "Face Pulls", sets: "4 × 20", note: "Twice a week is correct for this movement.", progression: "single" },
      { id: "5e", name: "Ab Wheel Rollout", sets: "4 × 8-12", note: "Full body anti-extension. Brutal core work.", progression: "double" },
      { id: "5f", name: "Pallof Press", sets: "3 × 12/side", note: "Anti-rotation. Builds the obliques and stability.", progression: "single" },
      { id: "5g", name: "Copenhagen Plank", sets: "3 × 20-30 sec/side", note: "Hip stability + obliques.", progression: "single" },
      { id: "5h", name: "20 min cardio finisher", sets: "20 min", note: "Rowing or cycling." },
    ],
  },
  { id: 6, name: "Glutes Pump", emoji: "🍑", tag: "Glute Med + Volume", color: "#fb7185",
    exercises: [
      { id: "6a", name: "Machine / Smith Hip Thrust", sets: "4 × 12-15", note: "PRIMARY. Lighter + higher rep than Day 1. Constant tension, 2-sec squeeze every rep.", progression: "double" },
      { id: "6b", name: "B-Stance Romanian Deadlift", sets: "4 × 10-12/leg", note: "Stagger stance, ~70% weight on front leg. Unilateral hinge — different stimulus from Day 4 sumo.", progression: "double" },
      { id: "6c", name: "Standing Cable Hip Abduction", sets: "4 × 15-20/leg", note: "Glute med — builds the upper-side shelf. Ankle strap on the low pulley, lean slightly toward the stack, control the return.", progression: "double" },
      { id: "6d", name: "Cable Kickback", sets: "3 × 15-20/leg", note: "Peak contraction. Slow squeeze, no swinging or momentum.", progression: "double" },
      { id: "6e", name: "Cable Lateral Raise", sets: "3 × 12-15", note: "Delt-width insurance — pure side delt, no arms or traps. Keeps your shoulders capped now that this isn't a shoulder day.", progression: "single" },
      { id: "6g", name: "20 min cardio finisher", sets: "20 min", note: "Stairmaster or incline walk. Glute-biased." },
    ],
  },
];

// Maintenance / recomp macros — eat at TDEE, let training drive the recomp
// TDEE ≈ 2,400 kcal (6x training/wk + high daily steps) | maintenance target = 2,400 daily, protein held high
var MACROS_TARGET = { calories: 2400, protein: 140, carbs: 300, fat: 70 };

var MACRO_KEYS = [
  { key: "calories", label: "Cal", unit: "kcal", color: "#ff6eb4" },
  { key: "protein", label: "Protein", unit: "g", color: "#c084fc" },
  { key: "carbs", label: "Carbs", unit: "g", color: "#f472b6" },
  { key: "fat", label: "Fat", unit: "g", color: "#fb7185" },
];

var CYCLE_PHASES = [
  { name: "Menstrual", days: [1, 5], color: "#fb7185", emoji: "🌑",
    energy: "Low", strength: "Lower",
    tip: "Be gentle. Focus on form over weight. Different session, not a bad one.",
    training: "Reduce load 10-15% if needed. Prioritise machines over barbells. Warmup longer.",
    nutrition: "Iron-rich foods help. Honour cravings with protein-first meals.",
  },
  { name: "Follicular", days: [6, 13], color: "#c084fc", emoji: "🌒",
    energy: "Rising", strength: "Building",
    tip: "Estrogen is climbing. Time to chase progressive overload.",
    training: "Push heavier on hip thrusts, RDLs, sumo deadlifts. Recovery is faster.",
    nutrition: "Bulk targets work perfectly here. Hit your calories every day.",
  },
  { name: "Ovulatory", days: [14, 16], color: "#ff6eb4", emoji: "🌕",
    energy: "Peak", strength: "Peak",
    tip: "You are at your strongest. Window for personal records. Use it.",
    training: "Go heavy across the board. Coordination and power peak.",
    nutrition: "Appetite naturally lower. Don't skip meals — bulk requires consistency.",
  },
  { name: "Luteal", days: [17, 28], color: "#e879f9", emoji: "🌘",
    energy: "Declining", strength: "Variable",
    tip: "Progesterone rises and fatigue follows. Maintain, don't chase PRs.",
    training: "Keep volume steady. Hydrate more. Sleep quality may drop.",
    nutrition: "Cravings spike. Front-load protein. Magnesium helps with PMS.",
  },
];

function getCyclePhase(startDate, cycleLength) {
  if (!startDate) return null;
  var start = new Date(startDate);
  var today = new Date();
  var diff = Math.floor((today - start) / 86400000);
  var dayInCycle = (diff % cycleLength) + 1;
  var daysLeft = cycleLength - dayInCycle;
  var phase = CYCLE_PHASES[3];
  for (var i = 0; i < CYCLE_PHASES.length; i++) {
    if (dayInCycle >= CYCLE_PHASES[i].days[0] && dayInCycle <= CYCLE_PHASES[i].days[1]) {
      phase = CYCLE_PHASES[i];
      break;
    }
  }
  return { phase: phase, dayInCycle: dayInCycle, daysLeft: daysLeft };
}

var SCHEDULE = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getWeekKey() {
  var now = new Date();
  var jan1 = new Date(now.getFullYear(), 0, 1);
  var week = Math.ceil(((now - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return "week-" + now.getFullYear() + "-" + week;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function tryGet(key, fallback) {
  return new Promise(function(resolve) {
    try {
      var raw = localStorage.getItem("sculptor_" + key);
      resolve(raw ? JSON.parse(raw) : fallback);
    } catch (e) {
      resolve(fallback);
    }
  });
}

function trySet(key, val) {
  return new Promise(function(resolve) {
    try {
      localStorage.setItem("sculptor_" + key, JSON.stringify(val));
      resolve(true);
    } catch (e) {
      resolve(false);
    }
  });
}

function App() {
  var s = useState("home"); var view = s[0]; var setView = s[1];
  var s2 = useState(null); var activeDay = s2[0]; var setActiveDay = s2[1];
  var s3 = useState({}); var checked = s3[0]; var setChecked = s3[1];
  var s4 = useState({}); var completedDays = s4[0]; var setCompletedDays = s4[1];
  var s5 = useState([]); var sessionLogs = s5[0]; var setSessionLogs = s5[1];
  var s6 = useState({}); var exLogs = s6[0]; var setExLogs = s6[1];
  var s7 = useState({}); var macroLog = s7[0]; var setMacroLog = s7[1];
  var s9 = useState(""); var cycleStart = s9[0]; var setCycleStart = s9[1];
  var s10 = useState(28); var cycleLength = s10[0]; var setCycleLength = s10[1];
  var s11 = useState(true); var loading = s11[0]; var setLoading = s11[1];
  var s12 = useState(null); var toast = s12[0]; var setToast = s12[1];
  var s13 = useState(null); var logModal = s13[0]; var setLogModal = s13[1];
  var s14 = useState(false); var macroModal = s14[0]; var setMacroModal = s14[1];
  var s15 = useState(false); var cycleModal = s15[0]; var setCycleModal = s15[1];

  var weekKey = getWeekKey();
  var today = todayKey();
  var cycleInfo = getCyclePhase(cycleStart, cycleLength);

  function showToast(msg, type) {
    setToast({ msg: msg, type: type || "success" });
    setTimeout(function() { setToast(null); }, 3000);
  }

  useEffect(function() {
    Promise.all([
      tryGet("checked", {}),
      tryGet("completedDays", {}),
      tryGet("sessionLogs", []),
      tryGet("exLogs", {}),
      tryGet("macroLog", {}),
      tryGet("cycleStart", ""),
      tryGet("cycleLength", 28),
    ]).then(function(results) {
      setChecked(results[0]);
      setCompletedDays(results[1]);
      setSessionLogs(results[2]);
      setExLogs(results[3]);
      setMacroLog(results[4]);
      setCycleStart(results[5]);
      setCycleLength(results[6]);
      setLoading(false);
    });
  }, []);

  function persist(key, val, setter) {
    setter(val);
    trySet(key, val).then(function(ok) {
      if (!ok) showToast("Could not save", "error");
    });
  }

  function toggleCheck(exId) {
    var next = Object.assign({}, checked);
    next[exId] = !checked[exId];
    persist("checked", next, setChecked);
  }

  function completeDay(dayId) {
    var dateStr = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    var d = DAYS.filter(function(x) { return x.id === dayId; })[0];
    var nextCd = Object.assign({}, completedDays);
    nextCd[weekKey + "-d" + dayId] = dateStr;
    persist("completedDays", nextCd, setCompletedDays);
    var nextSl = [{ dayId: dayId, name: d.name, emoji: d.emoji, date: dateStr, ts: Date.now() }].concat(sessionLogs).slice(0, 60);
    persist("sessionLogs", nextSl, setSessionLogs);
    showToast(d.emoji + " " + d.name + " logged!");
    setView("home");
  }

  function saveExLog(exId, entry) {
    var next = Object.assign({}, exLogs);
    next[exId + "-" + today] = entry;
    trySet("exLogs", next).then(function(ok) {
      if (ok) { setExLogs(next); showToast("Sets saved"); }
      else showToast("Could not save", "error");
    });
  }

  function saveMacroLog(l) {
    var next = Object.assign({}, macroLog);
    next[today] = l;
    trySet("macroLog", next).then(function(ok) {
      if (ok) { setMacroLog(next); showToast("Nutrition logged"); }
      else showToast("Could not save", "error");
    });
  }

  function saveCycle(start, length) {
    setCycleStart(start);
    setCycleLength(length);
    trySet("cycleStart", start);
    trySet("cycleLength", length);
    showToast("Cycle updated");
  }

  function exportData() {
    var data = { checked: checked, completedDays: completedDays, sessionLogs: sessionLogs, exLogs: exLogs, macroLog: macroLog, cycleStart: cycleStart, cycleLength: cycleLength, exportedAt: new Date().toISOString() };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "sculptor-backup-" + today + ".json"; a.click();
    URL.revokeObjectURL(url);
    showToast("Data exported");
  }

  function isDayDone(dayId) { return !!completedDays[weekKey + "-d" + dayId]; }
  var weeklyCount = DAYS.filter(function(d) { return isDayDone(d.id); }).length;
  var day = activeDay ? DAYS.filter(function(d) { return d.id === activeDay; })[0] : null;
  var dayChecked = day ? day.exercises.filter(function(e) { return checked[e.id]; }).length : 0;
  var dayTotal = day ? day.exercises.length : 0;
  var todayMacros = macroLog[today] || {};

  function exHistory(exId) {
    var out = [];
    Object.keys(exLogs).forEach(function(k) {
      if (k.length > 11 && k.slice(0, k.length - 11) === exId) {
        out.push({ date: k.slice(-10), entry: exLogs[k] });
      }
    });
    out.sort(function(a, b) { return a.date < b.date ? 1 : (a.date > b.date ? -1 : 0); });
    return out;
  }
  function lastPrior(exId) {
    var h = exHistory(exId);
    for (var i = 0; i < h.length; i++) { if (h[i].date !== today) return h[i]; }
    return null;
  }
  function summarizeRows(rs) {
    return (rs || []).filter(function(r) { return r.weight || r.reps; }).map(function(r) {
      return (r.weight ? r.weight + "kg" : "BW") + (r.reps ? " × " + r.reps : "");
    }).join(", ");
  }

  if (loading) return React.createElement("div", { style: S.loading },
    React.createElement("div", { style: { fontSize: 28, color: "#ff6eb4" } }, "✦"),
    React.createElement("div", { style: { fontSize: 11, color: "#ff6eb4", letterSpacing: 4, marginTop: 12 } }, "loading")
  );

  return React.createElement("div", { style: S.root },
    React.createElement("style", null, css),
    React.createElement("div", { style: { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" } },
      [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(function(i) {
        return React.createElement("span", { key: i, className: "bg-sparkle", style: {
          left: ((i * 37 + 11) % 100) + "%", top: ((i * 53 + 7) % 100) + "%",
          animationDelay: ((i * 0.4) % 3) + "s", animationDuration: (2.5 + (i % 3) * 0.8) + "s",
          fontSize: i % 3 === 0 ? 10 : i % 3 === 1 ? 7 : 13,
          color: ["#ff6eb4","#c084fc","#f9a8d4","#e879f9","#fb7185"][i % 5],
        }}, "✦");
      })
    ),
    toast && React.createElement("div", { style: Object.assign({}, S.toast, {
      background: toast.type === "error" ? "#2a0a0a" : "#1a0a1a",
      borderColor: toast.type === "error" ? "#fb718566" : "#ff6eb466",
      color: toast.type === "error" ? "#fb7185" : "#ff6eb4",
    }) }, toast.msg),

    view === "home" && React.createElement("div", { style: S.page },
      React.createElement("div", { style: S.header },
        React.createElement("div", { style: S.headerGlow }),
        React.createElement("div", null,
          React.createElement("div", { style: S.headerEyebrow }, "✦ THE SCULPTOR'S ✦"),
          React.createElement("div", { style: S.headerTitle }, "PLAYBOOK"),
          React.createElement("div", { style: S.headerSub }, "Recomp · 6 Days · Glutes Priority"),
        ),
        React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 } },
          React.createElement("div", { style: S.weekBadge },
            React.createElement("span", { style: S.weekNum }, weeklyCount),
            React.createElement("span", { style: S.weekOf }, "/6 ✦"),
          ),
          React.createElement("button", { style: S.exportBtn, onClick: exportData }, "backup"),
        ),
      ),

      React.createElement("div", { style: S.barWrap },
        React.createElement("div", { style: S.bar },
          React.createElement("div", { style: Object.assign({}, S.barFill, { width: ((weeklyCount / 6) * 100) + "%" }) }),
          weeklyCount > 0 && React.createElement("div", { style: Object.assign({}, S.barGlow, { left: ((weeklyCount / 6) * 100) + "%" }) }),
        ),
      ),

      React.createElement("div", { style: S.schedRow },
        SCHEDULE.map(function(d, i) {
          return React.createElement("div", { key: d, style: Object.assign({}, S.schedDay, isDayDone(i + 1) ? S.schedDayDone : {}) },
            isDayDone(i + 1) && React.createElement("span", { style: S.schedSparkle }, "✦"),
            React.createElement("span", { style: S.schedLabel }, d),
            React.createElement("span", { style: S.schedNum }, "D" + (i + 1)),
          );
        })
      ),

      React.createElement("div", { style: S.cycleCard, onClick: function() { setCycleModal(true); } },
        React.createElement("div", { style: Object.assign({}, S.cycleCardGlow, { background: cycleInfo ? cycleInfo.phase.color : "#ff6eb4" }) }),
        cycleInfo ? React.createElement("div", null,
          React.createElement("div", { style: S.cycleCardTop },
            React.createElement("div", null,
              React.createElement("div", { style: S.cycleLabel }, "✦ CYCLE AWARENESS"),
              React.createElement("div", { style: Object.assign({}, S.cyclePhaseName, { color: cycleInfo.phase.color }) },
                cycleInfo.phase.emoji + " " + cycleInfo.phase.name + " Phase"
              ),
              React.createElement("div", { style: S.cycleSub }, "Day " + cycleInfo.dayInCycle + " · " + cycleInfo.daysLeft + " days until next cycle"),
            ),
            React.createElement("div", { style: S.cycleStats },
              React.createElement("div", { style: Object.assign({}, S.cycleStatBadge, { borderColor: cycleInfo.phase.color + "66", color: cycleInfo.phase.color }) }, "Energy: " + cycleInfo.phase.energy),
              React.createElement("div", { style: Object.assign({}, S.cycleStatBadge, { borderColor: cycleInfo.phase.color + "66", color: cycleInfo.phase.color }) }, "Strength: " + cycleInfo.phase.strength),
            ),
          ),
          React.createElement("div", { style: S.cycleTip }, cycleInfo.phase.tip),
          React.createElement("div", { style: S.cycleDetailRow },
            React.createElement("span", { style: S.cycleDetailIcon }, "🏋️"),
            React.createElement("span", { style: S.cycleDetailText }, cycleInfo.phase.training),
          ),
          React.createElement("div", { style: Object.assign({}, S.cycleDetailRow, { marginTop: 8 }) },
            React.createElement("span", { style: S.cycleDetailIcon }, "🥗"),
            React.createElement("span", { style: S.cycleDetailText }, cycleInfo.phase.nutrition),
          ),
          React.createElement("div", { style: S.cycleEditHint }, "Tap to update"),
        ) : React.createElement("div", null,
          React.createElement("div", { style: S.cycleLabel }, "✦ CYCLE AWARENESS"),
          React.createElement("div", { style: { fontSize: 12, color: "#6a3a6a", lineHeight: 1.7, marginTop: 8, marginBottom: 14 } }, "Log your period start date to get personalised training and nutrition adjustments for each phase of your cycle."),
          React.createElement("div", { style: { fontSize: 12, color: "#ff6eb4", letterSpacing: 1 } }, "Set up →"),
        ),
      ),

      // BULK NUTRITION SECTION
      React.createElement("div", { style: { marginBottom: 32 } },
        React.createElement("div", { style: Object.assign({}, S.secLabel, { marginBottom: 14 }) }, "✦ MAINTENANCE NUTRITION"),

        React.createElement("div", { style: S.macroCard },
          React.createElement("div", { style: S.macroCardGlow }),
          React.createElement("div", { style: S.macroCardTop },
            React.createElement("span", { style: Object.assign({}, S.macroCardTitle, { color: "#ff6eb4" }) }, "Daily Targets"),
            React.createElement("button", { style: S.logBtn2, onClick: function() { setMacroModal(true); } }, "Log intake"),
          ),
          React.createElement("div", { style: S.macroGrid },
            MACRO_KEYS.map(function(m) {
              var actual = Number(todayMacros[m.key]) || 0;
              var target = MACROS_TARGET[m.key];
              var pct = Math.min((actual / target) * 100, 100);
              return React.createElement("div", { key: m.key, style: S.macroItem, onClick: function() { setMacroModal(true); } },
                React.createElement("div", { style: S.macroLabel }, m.label),
                React.createElement("div", { style: S.macroVals },
                  React.createElement("span", { style: Object.assign({}, S.macroActual, { color: m.color }) }, actual || "—"),
                  React.createElement("span", { style: S.macroTarget }, "/" + target + m.unit),
                ),
                React.createElement("div", { style: S.pillBg },
                  React.createElement("div", { style: Object.assign({}, S.pillFill, { width: pct + "%", background: m.color }) }),
                ),
              );
            })
          ),
          React.createElement("div", { style: { borderTop: "1px solid #2a1a2a", paddingTop: 12, fontSize: 11, color: "#7a5a7a", lineHeight: 1.6 } },
            "Eating at maintenance (~2,400 kcal) with protein held high. The scale stays roughly flat — judge progress by the mirror, measurements, and your lifts. If weight drifts more than ~0.25kg/week over 2-3 weeks, adjust by ~150 kcal."
          ),
        ),

        React.createElement("div", { style: S.rulesCard },
          React.createElement("div", { style: S.rulesTitle }, "✦ Recomp Rules"),
          [
            { icon: "🥩", rule: "Protein every meal", detail: "140g daily, spread across 4-5 meals. This is the lever that drives recomp at maintenance — hit it without fail." },
            { icon: "🍚", rule: "Carbs around training", detail: "300g daily — bias most of them to pre/post workout. 50-100g before, 50-100g after." },
            { icon: "🥑", rule: "Fat at 70g", detail: "Hormones and recovery. Avocado, olive oil, eggs, fatty fish." },
            { icon: "⚖️", rule: "Scale stays flat, that's the point", detail: "At maintenance the number won't move much. Recomp shows up in the tape and the mirror, not the scale." },
            { icon: "📸", rule: "Progress photos every 4 weeks", detail: "Far more useful than the scale for a recomp. Same lighting, same poses." },
            { icon: "💧", rule: "Hydrate", detail: "3+ litres daily. Helps recovery, performance, and appetite control." },
            { icon: "👟", rule: "Maintain 10K steps", detail: "Keeps daily expenditure up so spare calories partition toward muscle, not fat." },
            { icon: "🛌", rule: "Sleep is muscle growth", detail: "8+ hours. You build and repair muscle while sleeping, not while lifting." },
          ].map(function(r) {
            return React.createElement("div", { key: r.rule, style: S.ruleItem },
              React.createElement("span", { style: S.ruleIcon }, r.icon),
              React.createElement("div", null,
                React.createElement("div", { style: S.ruleName }, r.rule),
                React.createElement("div", { style: S.ruleDetail }, r.detail),
              ),
            );
          })
        ),
      ),

      // PROGRESSION GUIDE
      React.createElement("div", { style: S.rulesCard },
        React.createElement("div", { style: Object.assign({}, S.rulesTitle, { color: "#c084fc" }) }, "✦ How to Progress Each Lift"),
        React.createElement("div", { style: { fontSize: 12, color: "#a08aa0", lineHeight: 1.7, marginBottom: 14 } },
          "Most exercises use ", React.createElement("strong", { style: { color: "#ff6eb4" } }, "double progression"), ". When you hit the top of the rep range across all sets with good form, add weight next session and drop back to the bottom of the range. Build back up over 1-3 weeks."
        ),
        React.createElement("div", { style: { fontSize: 11, color: "#6a3a6a", lineHeight: 1.6, padding: "10px 12px", background: "#0d040d", borderRadius: 8, borderLeft: "2px solid #ff6eb444" } },
          "Example: Hip Thrust 5×10 @ 70kg → next week 5×8 @ 75kg → 5×9 @ 75kg → 5×10 @ 75kg → 5×8 @ 80kg..."
        ),
      ),

      React.createElement("div", { style: { height: 32 } }),
      React.createElement("div", { style: Object.assign({}, S.secLabel, { marginBottom: 12 }) }, "✦ THIS WEEK'S SESSIONS"),
      React.createElement("div", { style: S.dayList },
        DAYS.map(function(d) {
          return React.createElement("div", { key: d.id, style: S.dayCard, className: "day-card", onClick: function() { setActiveDay(d.id); setView("day"); } },
            React.createElement("div", { style: Object.assign({}, S.dayAccent, { background: d.color, boxShadow: "0 0 10px " + d.color + "55" }) }),
            React.createElement("div", { style: S.dayCardL },
              React.createElement("span", { style: S.dayEmoji }, d.emoji),
              React.createElement("div", null,
                React.createElement("div", { style: S.dayName }, "Day " + d.id + " — " + d.name),
                React.createElement("div", { style: S.dayTag }, d.tag),
              ),
            ),
            isDayDone(d.id)
              ? React.createElement("span", { style: Object.assign({}, S.doneBadge, { background: d.color }) }, "Done")
              : React.createElement("span", { style: S.arrow }, "→"),
          );
        })
      ),

      sessionLogs.length > 0 && React.createElement("div", null,
        React.createElement("div", { style: Object.assign({}, S.secLabel, { marginBottom: 12 }) }, "✦ RECENT SESSIONS"),
        React.createElement("div", { style: S.logList },
          sessionLogs.slice(0, 4).map(function(l, i) {
            return React.createElement("div", { key: i, style: S.logItem },
              React.createElement("span", { style: { fontSize: 20 } }, l.emoji),
              React.createElement("div", { style: { flex: 1 } },
                React.createElement("div", { style: S.logName }, l.name),
                React.createElement("div", { style: S.logDate }, l.date),
              ),
              React.createElement("span", { style: { fontSize: 10, color: "#ff6eb4", opacity: 0.6 } }, "✦"),
            );
          })
        ),
      ),

      React.createElement("div", { style: S.tip }, "Recommended split: Mon Glutes / Tue Back / Wed Shoulders+Abs / Thu Glutes Hinge / Fri Back+Abs / Sat Glutes Pump. Sunday rest."),
    ),

    view === "day" && day && React.createElement("div", { style: S.page },
      React.createElement("button", { style: S.backBtn, onClick: function() { setView("home"); } }, "← Back"),
      React.createElement("div", { style: Object.assign({}, S.dayHeader, { borderColor: day.color + "66" }) },
        React.createElement("span", { style: { fontSize: 36 } }, day.emoji),
        React.createElement("div", { style: { flex: 1 } },
          React.createElement("div", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 2, lineHeight: 1, color: day.color } }, day.name),
          React.createElement("div", { style: { fontSize: 11, color: "#6a3a6a", letterSpacing: 1, marginTop: 4 } }, day.tag),
          cycleInfo && React.createElement("div", { style: { marginTop: 6, fontSize: 10, color: cycleInfo.phase.color, opacity: 0.8 } },
            cycleInfo.phase.emoji + " " + cycleInfo.phase.name + " — " + cycleInfo.phase.energy + " energy"
          ),
        ),
        isDayDone(day.id) && React.createElement("span", { style: Object.assign({}, S.doneBadge, { background: day.color }) }, "Done"),
      ),

      React.createElement("div", { style: S.barWrap },
        React.createElement("div", { style: S.bar },
          React.createElement("div", { style: Object.assign({}, S.barFill, { width: ((dayChecked / dayTotal) * 100) + "%", background: day.color }) }),
          dayChecked > 0 && React.createElement("div", { style: Object.assign({}, S.barGlow, { left: ((dayChecked / dayTotal) * 100) + "%", background: day.color }) }),
        ),
      ),
      React.createElement("div", { style: { fontSize: 11, color: "#5a2a5a", letterSpacing: 1, marginBottom: 20, textAlign: "right" } }, dayChecked + " of " + dayTotal),

      React.createElement("div", { style: S.exList },
        day.exercises.map(function(ex) {
          var isChecked = !!checked[ex.id];
          var logged = exLogs[ex.id + "-" + today];
          var isPrimary = ex.note && ex.note.indexOf("PRIMARY") === 0;
          return React.createElement("div", { key: ex.id, style: Object.assign({}, S.exCard, isChecked ? { opacity: 0.45 } : {}, isPrimary ? { borderLeft: "3px solid " + day.color } : {}) },
            React.createElement("div", { style: Object.assign({}, S.checkbox, isChecked ? { background: day.color, borderColor: day.color, boxShadow: "0 0 12px " + day.color + "66" } : {}), onClick: function() { toggleCheck(ex.id); } },
              isChecked && React.createElement("span", { style: { color: "#fff", fontSize: 11, fontWeight: 700 } }, "✦"),
            ),
            React.createElement("div", { style: { flex: 1, cursor: "pointer" }, onClick: function() { toggleCheck(ex.id); } },
              isPrimary && React.createElement("span", { style: { fontSize: 9, fontWeight: 500, letterSpacing: 1.5, padding: "2px 8px", borderRadius: 5, display: "inline-block", marginBottom: 6, background: day.color + "33", color: day.color, border: "1px solid " + day.color + "66" } }, "PRIMARY LIFT"),
              React.createElement("div", { style: { fontSize: 14, fontWeight: 500, color: "#f0e0f0", marginBottom: 3, lineHeight: 1.3, textDecoration: isChecked ? "line-through" : "none" } }, ex.name),
              React.createElement("div", { style: { fontSize: 12, color: day.color, marginBottom: 4 } }, ex.sets),
              React.createElement("div", { style: { fontSize: 11, color: "#5a3a5a", lineHeight: 1.5 } }, ex.note),
              logged && React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 } },
                logged.rows.slice(0, 5).map(function(r, i) {
                  return (r.weight || r.reps) ? React.createElement("span", { key: i, style: { fontSize: 10, padding: "2px 8px", background: "#1e0e1e", borderRadius: 6, border: "1px solid " + day.color + "44", color: day.color } },
                    (r.weight ? r.weight + "kg" : "") + (r.weight && r.reps ? " x " : "") + (r.reps || "")
                  ) : null;
                })
              ),
              (!logged && lastPrior(ex.id)) && React.createElement("div", { style: { fontSize: 10, color: "#7a5a7a", marginTop: 8, letterSpacing: 0.3 } },
                "↩ Last " + lastPrior(ex.id).date.slice(5) + ":  " + (summarizeRows(lastPrior(ex.id).entry.rows) || "—")
              ),
            ),
            React.createElement("button", { style: Object.assign({}, S.logBtnEx, { borderColor: logged ? day.color + "88" : "#2a1a2a", color: logged ? day.color : "#4a3a4a" }), onClick: function(e) { e.stopPropagation(); setLogModal({ ex: ex, color: day.color, existing: logged, previous: lastPrior(ex.id), history: exHistory(ex.id) }); } },
              logged ? "✦" : "+"
            ),
          );
        })
      ),

      !isDayDone(day.id)
        ? React.createElement("button", { style: Object.assign({}, S.completeBtn, { background: "linear-gradient(135deg, " + day.color + ", #e879f9)", boxShadow: "0 4px 24px " + day.color + "55" }), className: "complete-btn", onClick: function() { completeDay(day.id); } }, "✦ Mark Session Complete ✦")
        : React.createElement("div", { style: { textAlign: "center", padding: 16, fontSize: 13, color: "#c084fc", letterSpacing: 2 } }, "✦ Session logged ✦"),
    ),

    logModal && React.createElement(SetLogModal, { ex: logModal.ex, color: logModal.color, existing: logModal.existing, previous: logModal.previous, history: logModal.history, onSave: function(e) { saveExLog(logModal.ex.id, e); setLogModal(null); }, onClose: function() { setLogModal(null); } }),
    macroModal && React.createElement(MacroLogModal, { todayLog: todayMacros, onSave: function(l) { saveMacroLog(l); setMacroModal(false); }, onClose: function() { setMacroModal(false); } }),
    cycleModal && React.createElement(CycleModal, { currentStart: cycleStart, currentLength: cycleLength, onSave: function(s, l) { saveCycle(s, l); setCycleModal(false); }, onClose: function() { setCycleModal(false); } }),
  );
}

function SetLogModal(props) {
  var ex = props.ex; var color = props.color; var existing = props.existing;
  var previous = props.previous; var history = props.history || [];

  function seedRows() {
    if (existing && existing.rows) return existing.rows;
    if (previous && previous.entry && previous.entry.rows) {
      // Carry last session's weights forward; leave reps blank so you log fresh.
      return previous.entry.rows.map(function(r) { return { weight: r.weight || "", reps: "" }; });
    }
    return [{ weight: "", reps: "" }, { weight: "", reps: "" }, { weight: "", reps: "" }];
  }
  var s1 = useState(seedRows());
  var rows = s1[0]; var setRows = s1[1];
  var s2 = useState(existing && existing.notes ? existing.notes : "");
  var notes = s2[0]; var setNotes = s2[1];
  var s3 = useState(false); var showHist = s3[0]; var setShowHist = s3[1];

  function updateRow(i, field, val) {
    var next = rows.map(function(r, j) {
      if (j === i) { var newR = Object.assign({}, r); newR[field] = val; return newR; }
      return r;
    });
    setRows(next);
  }
  function summary(rs) {
    return (rs || []).filter(function(r) { return r.weight || r.reps; }).map(function(r) {
      return (r.weight ? r.weight + "kg" : "BW") + (r.reps ? "×" + r.reps : "");
    }).join("   ");
  }
  var range = ex.sets.replace(/^\s*[0-9]+\s*×\s*/, "");
  var progHint = ex.progression === "double"
    ? "Double progression — hit " + range + " across all sets, then add weight next time and drop back to the bottom of the range."
    : "Keep the load, chase clean reps and the squeeze. Add weight only when it feels easy.";

  return React.createElement("div", { style: S.overlay, onClick: props.onClose },
    React.createElement("div", { style: S.modal, onClick: function(e) { e.stopPropagation(); } },
      React.createElement("div", { style: Object.assign({}, S.modalBar, { background: "linear-gradient(90deg, " + color + ", #e879f9)" }) }),
      React.createElement("div", { style: S.modalHead },
        React.createElement("div", null,
          React.createElement("div", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, color: color } }, ex.name),
          React.createElement("div", { style: { fontSize: 11, color: "#6a3a6a", marginTop: 2 } }, ex.sets),
        ),
        React.createElement("button", { style: S.closeBtn, onClick: props.onClose }, "X"),
      ),

      previous ? React.createElement("div", { style: { background: "#1e0e1e", border: "1px solid " + color + "33", borderRadius: 10, padding: "10px 12px", marginBottom: 14 } },
        React.createElement("div", { style: { fontSize: 9, letterSpacing: 1.5, color: "#6a3a6a", textTransform: "uppercase", marginBottom: 5 } }, "Last session · " + previous.date.slice(5) + "  —  beat this"),
        React.createElement("div", { style: { fontSize: 14, color: color, fontWeight: 500 } }, summary(previous.entry.rows) || "—"),
        previous.entry.notes ? React.createElement("div", { style: { fontSize: 11, color: "#8a6a8a", marginTop: 4, fontStyle: "italic" } }, "\u201C" + previous.entry.notes + "\u201D") : null,
        history.length > 1 && React.createElement("button", { style: { background: "none", border: "none", color: "#7a5a7a", fontSize: 10, cursor: "pointer", padding: 0, marginTop: 8, letterSpacing: 0.5 }, onClick: function() { setShowHist(!showHist); } }, showHist ? "hide history" : "show full history →"),
        showHist && React.createElement("div", { style: { marginTop: 8, borderTop: "1px solid #2a1a2a", paddingTop: 8, display: "flex", flexDirection: "column", gap: 5 } },
          history.slice(0, 8).map(function(h, i) {
            return React.createElement("div", { key: i, style: { fontSize: 11, color: "#8a6a8a", display: "flex", justifyContent: "space-between", gap: 12 } },
              React.createElement("span", { style: { flexShrink: 0 } }, h.date.slice(5)),
              React.createElement("span", { style: { color: "#a884a8", textAlign: "right" } }, summary(h.entry.rows) || "—"),
            );
          })
        ),
      ) : React.createElement("div", { style: { fontSize: 11, color: "#6a4a6a", marginBottom: 14, lineHeight: 1.5, borderLeft: "2px solid " + color + "44", paddingLeft: 10 } }, "First time logging this one — set your baseline and we build from here."),

      React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 8 } },
        React.createElement("span", { style: { width: 24 } }),
        React.createElement("span", { style: { flex: 1, fontSize: 9, color: "#5a2a5a", letterSpacing: 1, textAlign: "center" } }, "WEIGHT"),
        React.createElement("span", { style: { flex: 1, fontSize: 9, color: "#5a2a5a", letterSpacing: 1, textAlign: "center" } }, "REPS"),
        React.createElement("span", { style: { width: 28 } }),
      ),
      rows.map(function(row, i) {
        var prevRow = previous && previous.entry.rows ? previous.entry.rows[i] : null;
        return React.createElement("div", { key: i, style: { display: "flex", gap: 8, marginBottom: 8, alignItems: "center" } },
          React.createElement("span", { style: { width: 24, fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, textAlign: "center", color: color } }, i + 1),
          React.createElement("input", { style: Object.assign({}, S.setInput, { borderColor: color + "44" }), placeholder: prevRow && prevRow.weight ? String(prevRow.weight) : "kg", value: row.weight, onChange: function(e) { updateRow(i, "weight", e.target.value); }, type: "number", inputMode: "decimal" }),
          React.createElement("input", { style: Object.assign({}, S.setInput, { borderColor: color + "44" }), placeholder: prevRow && prevRow.reps ? String(prevRow.reps) : "reps", value: row.reps, onChange: function(e) { updateRow(i, "reps", e.target.value); }, type: "number", inputMode: "numeric" }),
          React.createElement("button", { style: { width: 28, height: 28, background: "none", border: "none", color: "#3a1a3a", fontSize: 11, cursor: "pointer" }, onClick: function() { setRows(rows.filter(function(_, j) { return j !== i; })); } }, "X"),
        );
      }),
      React.createElement("button", { style: S.addSetBtn, onClick: function() { setRows(rows.concat([{ weight: "", reps: "" }])); } }, "+ Add set"),
      React.createElement("div", { style: { fontSize: 10, color: "#7a5a7a", lineHeight: 1.6, marginBottom: 14, padding: "9px 11px", background: "#0d040d", borderRadius: 8, borderLeft: "2px solid " + color + "44" } }, "🎯 " + progHint),
      React.createElement("textarea", { style: S.notesInput, placeholder: "Notes — RPE, how it felt, form cues...", value: notes, onChange: function(e) { setNotes(e.target.value); } }),
      React.createElement("button", { style: Object.assign({}, S.saveBtn, { background: "linear-gradient(135deg, " + color + ", #e879f9)" }), onClick: function() { props.onSave({ rows: rows, notes: notes }); } }, "✦ Save"),
    ),
  );
}

function MacroLogModal(props) {
  var todayLog = props.todayLog;
  var init = { calories: "", protein: "", carbs: "", fat: "" };
  Object.keys(todayLog).forEach(function(k) { init[k] = todayLog[k]; });
  var s1 = useState(init); var l = s1[0]; var setL = s1[1];

  return React.createElement("div", { style: S.overlay, onClick: props.onClose },
    React.createElement("div", { style: S.modal, onClick: function(e) { e.stopPropagation(); } },
      React.createElement("div", { style: Object.assign({}, S.modalBar, { background: "linear-gradient(90deg, #ff6eb4, #e879f9)" }) }),
      React.createElement("div", { style: S.modalHead },
        React.createElement("div", null,
          React.createElement("div", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, color: "#ff6eb4" } }, "Log Intake ✦"),
          React.createElement("div", { style: { fontSize: 11, color: "#6a3a6a", marginTop: 2 } }, "Lean bulk · " + MACROS_TARGET.calories + " kcal target"),
        ),
        React.createElement("button", { style: S.closeBtn, onClick: props.onClose }, "X"),
      ),
      React.createElement("div", { style: { fontSize: 12, color: "#6a3a6a", lineHeight: 1.7, marginBottom: 20, borderLeft: "2px solid #ff6eb433", paddingLeft: 12 } }, "Hit protein and calories every day. The rest is flexibility."),
      MACRO_KEYS.map(function(m) {
        var actual = Number(l[m.key]) || 0;
        var target = MACROS_TARGET[m.key];
        var pct = Math.min((actual / target) * 100, 100);
        var over = actual > target * 1.1;
        return React.createElement("div", { key: m.key, style: { marginBottom: 18 } },
          React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
            React.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: m.color, flexShrink: 0 } }),
            React.createElement("label", { style: { flex: 1, fontSize: 13, color: "#e0c0e0" } }, m.label),
            React.createElement("span", { style: { fontSize: 10, color: over ? "#fb7185" : m.color, letterSpacing: 0.3 } }, actual + " / " + target + m.unit),
            React.createElement("input", { style: Object.assign({}, S.setInput, { width: 80, borderColor: m.color + "55" }), type: "number", value: l[m.key] || "", onChange: function(e) { var next = Object.assign({}, l); next[m.key] = e.target.value; setL(next); }, placeholder: "0" }),
          ),
          React.createElement("div", { style: { height: 3, background: "#2a0a2a", borderRadius: 2, overflow: "hidden", marginTop: 8, marginLeft: 18 } },
            React.createElement("div", { style: { height: "100%", width: pct + "%", background: over ? "#fb7185" : m.color, borderRadius: 2, transition: "width 0.2s ease" } }),
          ),
        );
      }),
      React.createElement("button", { style: Object.assign({}, S.saveBtn, { background: "linear-gradient(135deg, #ff6eb4, #e879f9)", marginTop: 8 }), onClick: function() { props.onSave(l); } }, "✦ Save Today's Log"),
    ),
  );
}

function CycleModal(props) {
  var s1 = useState(props.currentStart || ""); var start = s1[0]; var setStart = s1[1];
  var s2 = useState(props.currentLength || 28); var length = s2[0]; var setLength = s2[1];
  var preview = getCyclePhase(start, length);

  return React.createElement("div", { style: S.overlay, onClick: props.onClose },
    React.createElement("div", { style: S.modal, onClick: function(e) { e.stopPropagation(); } },
      React.createElement("div", { style: Object.assign({}, S.modalBar, { background: "linear-gradient(90deg, #f472b6, #e879f9)" }) }),
      React.createElement("div", { style: S.modalHead },
        React.createElement("div", null,
          React.createElement("div", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, color: "#f472b6" } }, "Cycle Tracker ✦"),
          React.createElement("div", { style: { fontSize: 11, color: "#6a3a6a", marginTop: 2 } }, "Training adapts to your cycle"),
        ),
        React.createElement("button", { style: S.closeBtn, onClick: props.onClose }, "X"),
      ),
      React.createElement("div", { style: { marginBottom: 16 } },
        React.createElement("label", { style: { fontSize: 11, color: "#7a3a7a", letterSpacing: 1, display: "block", marginBottom: 8 } }, "FIRST DAY OF LAST PERIOD"),
        React.createElement("input", { type: "date", value: start, onChange: function(e) { setStart(e.target.value); }, style: Object.assign({}, S.setInput, { width: "100%", textAlign: "left", padding: "12px 14px", fontSize: 14, colorScheme: "dark" }) }),
      ),
      React.createElement("div", { style: { marginBottom: 20 } },
        React.createElement("label", { style: { fontSize: 11, color: "#7a3a7a", letterSpacing: 1, display: "block", marginBottom: 8 } }, "AVERAGE CYCLE LENGTH (DAYS)"),
        React.createElement("div", { style: { display: "flex", gap: 8 } },
          [24, 26, 28, 30, 32].map(function(n) {
            return React.createElement("button", { key: n, onClick: function() { setLength(n); }, style: { flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid " + (length === n ? "#f472b666" : "#2a1a2a"), background: length === n ? "#f472b622" : "#1a0a1a", color: length === n ? "#f472b6" : "#5a3a5a", fontSize: 13, cursor: "pointer" } }, n);
          })
        ),
      ),
      preview && React.createElement("div", { style: { padding: 14, background: preview.phase.color + "11", borderRadius: 12, border: "1px solid " + preview.phase.color + "33", marginBottom: 20 } },
        React.createElement("div", { style: { fontSize: 11, color: preview.phase.color, letterSpacing: 1, marginBottom: 6 } }, "CURRENT PHASE"),
        React.createElement("div", { style: { fontSize: 16, color: preview.phase.color, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2 } }, preview.phase.emoji + " " + preview.phase.name + " — Day " + preview.dayInCycle),
      ),
      React.createElement("button", { style: Object.assign({}, S.saveBtn, { background: "linear-gradient(135deg, #f472b6, #e879f9)" }), onClick: function() { props.onSave(start, length); } }, "✦ Save"),
    ),
  );
}

var css = "\n  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');\n  * { box-sizing: border-box; margin: 0; padding: 0; }\n  input, textarea, button { font-family: 'DM Sans', sans-serif; }\n  ::-webkit-scrollbar { width: 4px; }\n  ::-webkit-scrollbar-thumb { background: #3a1a3a; border-radius: 2px; }\n  .day-card { cursor: pointer; transition: transform 0.2s ease; }\n  .day-card:hover { transform: translateX(5px); }\n  .complete-btn:hover { filter: brightness(1.15); }\n  .bg-sparkle { position: fixed; pointer-events: none; animation: floatSparkle ease-in-out infinite; opacity: 0; }\n  @keyframes floatSparkle { 0%{opacity:0;transform:translateY(0) rotate(0deg)} 30%{opacity:0.5} 70%{opacity:0.3} 100%{opacity:0;transform:translateY(-40px) rotate(180deg)} }\n  @keyframes slideUp { from{transform:translateY(50px);opacity:0} to{transform:translateY(0);opacity:1} }\n  @keyframes slideDown { from{transform:translateY(-20px);opacity:0} to{transform:translateY(0);opacity:1} }\n  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }\n  input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.5) sepia(1) saturate(5) hue-rotate(280deg); }\n";

var S = {
  root: { background: "linear-gradient(160deg, #0d0010 0%, #120018 40%, #0a000f 100%)", minHeight: "100vh", color: "#f0e0f0", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" },
  loading: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0d0010", gap: 12 },
  page: { maxWidth: 480, margin: "0 auto", padding: "32px 20px 80px", position: "relative", zIndex: 1 },
  toast: { position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", padding: "10px 20px", borderRadius: 20, border: "1px solid", fontSize: 12, letterSpacing: 0.5, zIndex: 200, animation: "slideDown 0.2s ease", whiteSpace: "nowrap" },
  header: { marginBottom: 24, position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  headerGlow: { position: "absolute", top: -20, left: -40, width: 200, height: 120, background: "radial-gradient(ellipse, #ff6eb433 0%, transparent 70%)", pointerEvents: "none" },
  headerEyebrow: { fontSize: 10, letterSpacing: 4, color: "#ff6eb4", marginBottom: 2, opacity: 0.8 },
  headerTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, letterSpacing: 4, lineHeight: 1, background: "linear-gradient(135deg, #ff6eb4, #f0abfc, #fb7185)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" },
  headerSub: { fontSize: 11, color: "#c084fc", letterSpacing: 2, marginTop: 4, opacity: 0.8 },
  weekBadge: { display: "flex", flexDirection: "column", alignItems: "flex-end" },
  weekNum: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 54, lineHeight: 1, background: "linear-gradient(135deg, #ff6eb4, #e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" },
  weekOf: { fontSize: 10, color: "#c084fc", letterSpacing: 1 },
  exportBtn: { background: "none", border: "1px solid #2a1a2a", borderRadius: 8, padding: "4px 10px", color: "#5a2a5a", fontSize: 10, cursor: "pointer", letterSpacing: 0.5 },
  barWrap: { marginBottom: 20 },
  bar: { height: 3, background: "#1a0a1a", borderRadius: 2, overflow: "visible", position: "relative" },
  barFill: { height: "100%", background: "linear-gradient(90deg, #ff6eb4, #e879f9)", borderRadius: 2, transition: "width 0.5s ease", boxShadow: "0 0 10px #ff6eb477" },
  barGlow: { position: "absolute", top: "50%", transform: "translate(-50%, -50%)", width: 8, height: 8, borderRadius: "50%", boxShadow: "0 0 10px 4px #ff6eb4aa" },
  schedRow: { display: "flex", gap: 6, marginBottom: 28 },
  schedDay: { flex: 1, background: "#1a0a1a", borderRadius: 10, padding: "10px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, border: "1px solid #2a0a2a", position: "relative", overflow: "hidden" },
  schedDayDone: { background: "linear-gradient(160deg, #2a0a2a, #1a0a1a)", border: "1px solid #ff6eb466", boxShadow: "0 0 12px #ff6eb422" },
  schedSparkle: { position: "absolute", top: 4, right: 5, fontSize: 8, color: "#ff6eb4" },
  schedLabel: { fontSize: 9, color: "#5a3a5a", letterSpacing: 1 },
  schedNum: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: "#f0e0f0", letterSpacing: 1 },
  secLabel: { fontSize: 9, letterSpacing: 3, color: "#5a2a5a", textTransform: "uppercase" },
  cycleCard: { background: "linear-gradient(135deg, #1a0a1a, #150515)", borderRadius: 16, padding: 16, marginBottom: 28, border: "1px solid #3a1a3a", cursor: "pointer", position: "relative", overflow: "hidden" },
  cycleCardGlow: { position: "absolute", top: -40, right: -40, width: 150, height: 150, borderRadius: "50%", opacity: 0.08, filter: "blur(30px)", pointerEvents: "none" },
  cycleCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  cycleLabel: { fontSize: 9, color: "#5a2a5a", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 },
  cyclePhaseName: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 2, lineHeight: 1 },
  cycleSub: { fontSize: 10, color: "#6a3a6a", marginTop: 4 },
  cycleStats: { display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" },
  cycleStatBadge: { fontSize: 10, padding: "3px 8px", borderRadius: 10, border: "1px solid", letterSpacing: 0.5 },
  cycleTip: { fontSize: 12, color: "#c0a0c0", lineHeight: 1.6, marginBottom: 12, fontStyle: "italic" },
  cycleDetailRow: { display: "flex", gap: 8, alignItems: "flex-start" },
  cycleDetailIcon: { fontSize: 14, flexShrink: 0, marginTop: 1 },
  cycleDetailText: { fontSize: 11, color: "#6a3a6a", lineHeight: 1.6 },
  cycleEditHint: { fontSize: 9, color: "#4a2a4a", letterSpacing: 2, textAlign: "right", marginTop: 12 },
  macroCard: { background: "linear-gradient(135deg, #1a0a1a, #150515)", borderRadius: 16, padding: 16, marginBottom: 14, border: "1px solid #3a1a3a", position: "relative", overflow: "hidden" },
  macroCardGlow: { position: "absolute", top: -30, right: -30, width: 120, height: 120, background: "radial-gradient(ellipse, #ff6eb422 0%, transparent 70%)", pointerEvents: "none" },
  macroCardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  macroCardTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 2 },
  logBtn2: { background: "none", border: "1px solid #3a1a3a", borderRadius: 8, padding: "5px 10px", color: "#6a3a6a", fontSize: 11, cursor: "pointer", letterSpacing: 0.5 },
  macroGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 },
  macroItem: { cursor: "pointer" },
  macroLabel: { fontSize: 9, color: "#6a3a6a", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 },
  macroVals: { display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 },
  macroActual: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, lineHeight: 1 },
  macroTarget: { fontSize: 10, color: "#4a2a4a" },
  pillBg: { height: 3, background: "#2a0a2a", borderRadius: 2, overflow: "hidden" },
  pillFill: { height: "100%", borderRadius: 2, transition: "width 0.4s ease" },
  rulesCard: { background: "linear-gradient(135deg, #150a15, #110811)", borderRadius: 14, padding: 16, border: "1px solid #2a1a2a", marginBottom: 16 },
  rulesTitle: { fontSize: 10, color: "#ff6eb4", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16, opacity: 0.8 },
  ruleItem: { display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" },
  ruleIcon: { fontSize: 20, flexShrink: 0, marginTop: 1 },
  ruleName: { fontSize: 13, fontWeight: 500, color: "#e0c0e0", marginBottom: 3 },
  ruleDetail: { fontSize: 11, color: "#6a3a6a", lineHeight: 1.6 },
  dayList: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 },
  dayCard: { background: "linear-gradient(135deg, #160a16, #120812)", borderRadius: 14, padding: "14px 16px 14px 0", display: "flex", alignItems: "center", border: "1px solid #2a1a2a", overflow: "hidden" },
  dayAccent: { width: 4, alignSelf: "stretch", borderRadius: "0 2px 2px 0", marginRight: 14, flexShrink: 0 },
  dayCardL: { display: "flex", alignItems: "center", gap: 12, flex: 1 },
  dayEmoji: { fontSize: 24 },
  dayName: { fontSize: 14, fontWeight: 500, color: "#f0e0f0" },
  dayTag: { fontSize: 11, color: "#6a3a6a", marginTop: 2 },
  doneBadge: { fontSize: 10, fontWeight: 500, letterSpacing: 1, padding: "4px 12px", borderRadius: 20, color: "#fff", flexShrink: 0 },
  arrow: { fontSize: 16, color: "#3a1a3a", marginLeft: "auto" },
  logList: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 },
  logItem: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#120812", borderRadius: 10, border: "1px solid #2a1a2a" },
  logName: { fontSize: 13, color: "#e0c0e0", fontWeight: 500 },
  logDate: { fontSize: 11, color: "#4a2a4a", marginTop: 2 },
  tip: { fontSize: 12, color: "#5a2a5a", lineHeight: 1.7, padding: "14px 16px", background: "#110811", borderRadius: 10, borderLeft: "2px solid #ff6eb433" },
  backBtn: { background: "none", border: "none", color: "#6a3a6a", fontSize: 13, cursor: "pointer", letterSpacing: 0.5, marginBottom: 24, padding: 0 },
  dayHeader: { display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid", position: "relative" },
  exList: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 },
  exCard: { display: "flex", gap: 12, background: "linear-gradient(135deg, #160a16, #120812)", borderRadius: 14, padding: 14, border: "1px solid #2a1a2a", alignItems: "flex-start" },
  checkbox: { width: 22, height: 22, borderRadius: 6, border: "1.5px solid #3a1a3a", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2, cursor: "pointer" },
  logBtnEx: { width: 28, height: 28, borderRadius: 8, border: "1px solid", background: "none", fontSize: 13, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" },
  completeBtn: { width: "100%", padding: 16, borderRadius: 14, border: "none", color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3, cursor: "pointer" },
  overlay: { position: "fixed", inset: 0, background: "rgba(5,0,10,0.92)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 },
  modal: { background: "linear-gradient(160deg, #1a0a1a, #130813)", borderRadius: "22px 22px 0 0", padding: "0 20px 44px", width: "100%", maxWidth: 480, maxHeight: "88vh", overflowY: "auto", animation: "slideUp 0.25s ease", border: "1px solid #3a1a3a", borderBottom: "none" },
  modalBar: { height: 4, borderRadius: "22px 22px 0 0", marginBottom: 20 },
  modalHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  closeBtn: { background: "none", border: "none", color: "#4a2a4a", fontSize: 16, cursor: "pointer" },
  addSetBtn: { width: "100%", background: "none", border: "1px dashed #2a1a2a", borderRadius: 8, padding: 10, color: "#5a2a5a", fontSize: 12, cursor: "pointer", marginTop: 4, marginBottom: 14 },
  notesInput: { width: "100%", background: "#1a0a1a", border: "1px solid #2a1a2a", borderRadius: 10, padding: 12, color: "#f0e0f0", fontSize: 12, outline: "none", resize: "none", height: 70, marginBottom: 16, lineHeight: 1.6 },
  setInput: { flex: 1, background: "#1e0e1e", border: "1px solid", borderRadius: 8, padding: "10px 8px", color: "#f0e0f0", fontSize: 15, textAlign: "center", outline: "none" },
  saveBtn: { width: "100%", padding: 14, borderRadius: 12, border: "none", color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 2, cursor: "pointer" },
};

ReactDOM.render(React.createElement(App), document.getElementById("root"));
