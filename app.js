var useState = React.useState;
var useEffect = React.useEffect;
var useCallback = React.useCallback;

var DAYS = [
  { id: 1, name: "Glute Lab", emoji: "🍑", tag: "Glutes · Hamstrings", color: "#ff6eb4", isTraining: true,
    exercises: [
      { id: "1a", name: "Barbell Hip Thrust", sets: "4 × 8-10", note: "2-sec hold at top. Drive through heels." },
      { id: "1b", name: "Bulgarian Split Squat", sets: "4 × 10/leg", note: "Chest toward front knee — glute exercise." },
      { id: "1c", name: "Romanian Deadlift", sets: "3 × 10", note: "Push the floor back, don't lift the bar." },
      { id: "1d", name: "Cable Kickback", sets: "3 × 15/leg", note: "Straight leg, toe down, squeeze at extension." },
      { id: "1e", name: "DB Step-Up high box", sets: "4 × 10/leg", note: "No push-off. 3-sec descent. Heel drive only." },
    ],
  },
  { id: 2, name: "The Back Session", emoji: "🏗️", tag: "Back · Rear Delts", color: "#c084fc", isTraining: true,
    exercises: [
      { id: "2a", name: "Meadows Row (landmine)", sets: "4 × 8/side", note: "SUPERSET A", superset: "A" },
      { id: "2b", name: "Chest-Supported DB Row", sets: "4 × 12", note: "SUPERSET A — no momentum.", superset: "A" },
      { id: "2c", name: "Barbell Row underhand", sets: "3 × 8", note: "SUPERSET B", superset: "B" },
      { id: "2d", name: "Straight-Arm Cable Pulldown", sets: "3 × 15", note: "SUPERSET B — lats only.", superset: "B" },
      { id: "2e", name: "Single-Arm DB Row", sets: "3 × 12/side", note: "Go heavy. Use a strap." },
      { id: "2f", name: "Face Pulls", sets: "4 × 20", note: "Non-negotiable. Every week." },
    ],
  },
  { id: 3, name: "Shoulder Sculpture", emoji: "💎", tag: "Shoulders · Triceps", color: "#f472b6", isTraining: true,
    exercises: [
      { id: "3a", name: "Cable Lateral Raise", sets: "4 × 15", note: "GIANT SET", superset: "Giant" },
      { id: "3b", name: "Rear Delt Fly", sets: "4 × 15", note: "GIANT SET — 2 min rest after round.", superset: "Giant" },
      { id: "3c", name: "Plate Front Raise", sets: "4 × 12", note: "GIANT SET — slow, no swinging.", superset: "Giant" },
      { id: "3d", name: "Seated DB Overhead Press", sets: "4 × 8-10", note: "Giant set pre-exhausts — these feel heavier." },
      { id: "3e", name: "Arnold Press", sets: "3 × 10", note: "Rotation hits front AND side delt." },
      { id: "3f", name: "Cable Upright Row wide grip", sets: "3 × 12", note: "Flared elbows = side delt bias." },
      { id: "3g", name: "Overhead Cable Tricep Extension", sets: "3 × 12", note: "Long head = arm shape." },
    ],
  },
  { id: 4, name: "Active Sculptor", emoji: "🌸", tag: "Cardio · Core", color: "#fb7185", isTraining: false,
    exercises: [
      { id: "4a", name: "Incline Treadmill Walk", sets: "20 min", note: "10-12% incline, fast pace." },
      { id: "4b", name: "Stairmaster", sets: "15 min", note: "5 min steady, 2 min sideways each side, 6 min steady." },
      { id: "4c", name: "Rowing Machine", sets: "10 min steady", note: "Upper back, posterior chain, posture." },
      { id: "4d", name: "Ab Wheel Rollout", sets: "3 × 10", note: "CORE — pick 3 of 4.", superset: "Core" },
      { id: "4e", name: "Pallof Press", sets: "3 × 12/side", note: "CORE", superset: "Core" },
      { id: "4f", name: "Dead Bug", sets: "3 × 10/side", note: "CORE", superset: "Core" },
      { id: "4g", name: "Copenhagen Plank", sets: "3 × 20 sec/side", note: "CORE — great for hip stability.", superset: "Core" },
    ],
  },
  { id: 5, name: "The Full Picture", emoji: "🎀", tag: "Glutes · Back · Shoulders", color: "#e879f9", isTraining: true,
    exercises: [
      { id: "5a", name: "Sumo Deadlift", sets: "4 × 6", note: "SUPERSET A — heavy.", superset: "A" },
      { id: "5b", name: "Chest-Supported Row", sets: "4 × 12", note: "SUPERSET A — no momentum.", superset: "A" },
      { id: "5c", name: "Hip Thrust high reps", sets: "3 × 15", note: "SUPERSET B", superset: "B" },
      { id: "5d", name: "Cable Lateral Raise", sets: "3 × 15", note: "SUPERSET B", superset: "B" },
      { id: "5e", name: "Nordic Curl", sets: "3 × 6-8", note: "SUPERSET C — feet under barbell. Lower slowly.", superset: "C" },
      { id: "5f", name: "Rear Delt Cable Fly", sets: "3 × 15", note: "SUPERSET C", superset: "C" },
      { id: "5g", name: "Lateral Step-Up", sets: "3 × 10/leg", note: "FINISHER — step sideways for glute med.", superset: "Finish" },
      { id: "5h", name: "Hip Thrust ISO Hold", sets: "3 × 20 sec", note: "FINISHER — no rest between.", superset: "Finish" },
      { id: "5i", name: "Cable Lateral Raise", sets: "3 × 15", note: "FINISHER", superset: "Finish" },
    ],
  },
];

var MACROS = {
  training: { calories: 2400, protein: 130, carbs: 325, fat: 65 },
  rest: { calories: 2000, protein: 130, carbs: 235, fat: 55 },
};

var MACRO_KEYS = [
  { key: "calories", label: "Cal", unit: "kcal", color: "#ff6eb4" },
  { key: "protein", label: "Protein", unit: "g", color: "#c084fc" },
  { key: "carbs", label: "Carbs", unit: "g", color: "#f472b6" },
  { key: "fat", label: "Fat", unit: "g", color: "#fb7185" },
];

var CYCLE_PHASES = [
  { name: "Menstrual", days: [1, 5], color: "#fb7185", emoji: "🌑",
    energy: "Low", strength: "Lower",
    tip: "Be gentle with yourself. Focus on form over weight. This isn't a bad session — it's a different one.",
    training: "Reduce load by 10-15% if needed. Prioritise hip thrusts and cable work. Warmup longer.",
    nutrition: "Iron-rich foods help. Cravings are real — honour them with protein-first meals before reaching for carbs.",
  },
  { name: "Follicular", days: [6, 13], color: "#c084fc", emoji: "🌒",
    energy: "Rising", strength: "Building",
    tip: "Estrogen is climbing and so are you. This is the time to chase progressive overload and attempt PRs.",
    training: "Push heavier on hip thrusts, RDLs and sumo deadlifts. Recovery is faster — you can handle more volume.",
    nutrition: "Your targets work perfectly here. Appetite may be lower — stick to your protein goal regardless.",
  },
  { name: "Ovulatory", days: [14, 16], color: "#ff6eb4", emoji: "🌕",
    energy: "Peak", strength: "Peak",
    tip: "You are at your strongest right now. This is your window for personal records. Use it.",
    training: "Go heavy across the board. Coordination and power are at their best.",
    nutrition: "Appetite is naturally lower. Don't undereat — your performance depends on carbs being topped up.",
  },
  { name: "Luteal", days: [17, 28], color: "#e879f9", emoji: "🌘",
    energy: "Declining", strength: "Variable",
    tip: "Progesterone rises and fatigue follows. A session that feels hard isn't weakness — your physiology has shifted.",
    training: "Keep volume steady but don't panic if weights feel heavier. Hydrate more. Sleep quality may drop.",
    nutrition: "Cravings spike hard here. Front-load protein at every meal. Magnesium helps with PMS symptoms.",
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

var SCHEDULE = ["Mon", "Tue", "Wed", "Thu", "Fri"];

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
  return window.storage.get(key).then(function(r) {
    try {
      return r && r.value ? JSON.parse(r.value) : fallback;
    } catch (e) {
      return fallback;
    }
  }).catch(function(e) {
    return fallback;
  });
}

function trySet(key, val) {
  return window.storage.set(key, JSON.stringify(val)).then(function(r) {
    return r ? true : false;
  }).catch(function(e) {
    return false;
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
  var s8 = useState("training"); var dayType = s8[0]; var setDayType = s8[1];
  var s9 = useState(""); var cycleStart = s9[0]; var setCycleStart = s9[1];
  var s10 = useState(28); var cycleLength = s10[0]; var setCycleLength = s10[1];
  var s11 = useState(true); var loading = s11[0]; var setLoading = s11[1];
  var s12 = useState(null); var toast = s12[0]; var setToast = s12[1];
  var s13 = useState(null); var logModal = s13[0]; var setLogModal = s13[1];
  var s14 = useState(false); var macroModal = s14[0]; var setMacroModal = s14[1];
  var s15 = useState(false); var cycleModal = s15[0]; var setCycleModal = s15[1];

  var weekKey = getWeekKey();
  var today = todayKey();
  var targets = MACROS[dayType];
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
      tryGet("dayType", "training"),
      tryGet("cycleStart", ""),
      tryGet("cycleLength", 28),
    ]).then(function(results) {
      setChecked(results[0]);
      setCompletedDays(results[1]);
      setSessionLogs(results[2]);
      setExLogs(results[3]);
      setMacroLog(results[4]);
      setDayType(results[5]);
      setCycleStart(results[6]);
      setCycleLength(results[7]);
      setLoading(false);
    });
  }, []);

  function persist(key, val, setter) {
    setter(val);
    trySet(key, val).then(function(ok) {
      if (!ok) showToast("Could not save — storage may be full", "error");
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
    next[today] = Object.assign({}, l, { dayType: dayType });
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

  if (loading) return React.createElement("div", { style: S.loading },
    React.createElement("div", { style: { fontSize: 28, color: "#ff6eb4" } }, "✦"),
    React.createElement("div", { style: { fontSize: 11, color: "#ff6eb4", letterSpacing: 4, marginTop: 12 } }, "loading")
  );

  return React.createElement("div", { style: S.root },
    React.createElement("style", null, css),

    // Background sparkles
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

    // Toast
    toast && React.createElement("div", { style: Object.assign({}, S.toast, {
      background: toast.type === "error" ? "#2a0a0a" : "#1a0a1a",
      borderColor: toast.type === "error" ? "#fb718566" : "#ff6eb466",
      color: toast.type === "error" ? "#fb7185" : "#ff6eb4",
    }) }, toast.msg),

    // HOME
    view === "home" && React.createElement("div", { style: S.page },
      // Header
      React.createElement("div", { style: S.header },
        React.createElement("div", { style: S.headerGlow }),
        React.createElement("div", null,
          React.createElement("div", { style: S.headerEyebrow }, "✦ THE SCULPTOR'S ✦"),
          React.createElement("div", { style: S.headerTitle }, "PLAYBOOK"),
          React.createElement("div", { style: S.headerSub }, "Glutes · Back · Shoulders"),
        ),
        React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 } },
          React.createElement("div", { style: S.weekBadge },
            React.createElement("span", { style: S.weekNum }, weeklyCount),
            React.createElement("span", { style: S.weekOf }, "/5 ✦"),
          ),
          React.createElement("button", { style: S.exportBtn, onClick: exportData }, "backup"),
        ),
      ),

      // Progress bar
      React.createElement("div", { style: S.barWrap },
        React.createElement("div", { style: S.bar },
          React.createElement("div", { style: Object.assign({}, S.barFill, { width: ((weeklyCount / 5) * 100) + "%" }) }),
          weeklyCount > 0 && React.createElement("div", { style: Object.assign({}, S.barGlow, { left: ((weeklyCount / 5) * 100) + "%" }) }),
        ),
      ),

      // Schedule row
      React.createElement("div", { style: S.schedRow },
        SCHEDULE.map(function(d, i) {
          return React.createElement("div", { key: d, style: Object.assign({}, S.schedDay, isDayDone(i + 1) ? S.schedDayDone : {}) },
            isDayDone(i + 1) && React.createElement("span", { style: S.schedSparkle }, "✦"),
            React.createElement("span", { style: S.schedLabel }, d),
            React.createElement("span", { style: S.schedNum }, "D" + (i + 1)),
          );
        })
      ),

      // Cycle card
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

      // Nutrition section
      React.createElement("div", { style: { marginBottom: 32 } },
        React.createElement("div", { style: Object.assign({}, S.secLabel, { marginBottom: 14 }) }, "✦ NUTRITION"),

        // Day type toggle
        React.createElement("div", { style: S.dayTypeCard },
          React.createElement("div", { style: S.dayTypeLabel }, "What kind of day is today?"),
          React.createElement("div", { style: S.dayTypeRow },
            React.createElement("button", { style: Object.assign({}, S.dayTypeBtn, dayType === "training" ? S.dayTypeBtnActive : {}), onClick: function() { persist("dayType", "training", setDayType); } }, "Training Day"),
            React.createElement("button", { style: Object.assign({}, S.dayTypeBtn, dayType === "rest" ? S.dayTypeBtnActiveRest : {}), onClick: function() { persist("dayType", "rest", setDayType); } }, "Rest / Cardio"),
          ),
          React.createElement("div", { style: S.dayTypeReasoning },
            dayType === "training"
              ? "Slight surplus fuels muscle building. Higher carbs before and after lifting."
              : "Slight deficit drives fat loss. Protein stays the same to protect muscle.",
          ),
        ),

        // Macro card
        React.createElement("div", { style: S.macroCard },
          React.createElement("div", { style: S.macroCardGlow }),
          React.createElement("div", { style: S.macroCardTop },
            React.createElement("span", { style: Object.assign({}, S.macroCardTitle, { color: dayType === "training" ? "#ff6eb4" : "#c084fc" }) },
              (dayType === "training" ? "Training Day" : "Rest Day") + " Targets"
            ),
            React.createElement("button", { style: S.logBtn2, onClick: function() { setMacroModal(true); } }, "Log intake"),
          ),
          React.createElement("div", { style: S.macroGrid },
            MACRO_KEYS.map(function(m) {
              var actual = Number(todayMacros[m.key]) || 0;
              var target = targets[m.key];
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
          React.createElement("div", { style: S.compareRow },
            React.createElement("div", { style: S.compareItem },
              React.createElement("span", { style: S.compareLabel }, "Training day"),
              React.createElement("span", { style: S.compareVal }, MACROS.training.calories + "kcal · " + MACROS.training.protein + "p · " + MACROS.training.carbs + "c · " + MACROS.training.fat + "f"),
            ),
            React.createElement("div", { style: S.compareDivider }),
            React.createElement("div", { style: S.compareItem },
              React.createElement("span", { style: S.compareLabel }, "Rest day"),
              React.createElement("span", { style: S.compareVal }, MACROS.rest.calories + "kcal · " + MACROS.rest.protein + "p · " + MACROS.rest.carbs + "c · " + MACROS.rest.fat + "f"),
            ),
          ),
        ),

        // Rules
        React.createElement("div", { style: S.rulesCard },
          React.createElement("div", { style: S.rulesTitle }, "✦ Your Recomp Rules"),
          [
            { icon: "🥩", rule: "Protein non-negotiable", detail: "130g every day — training or not. This protects your muscle on rest days." },
            { icon: "🍚", rule: "Carbs follow training", detail: "325g on lifting days. 235g on rest days to nudge fat loss." },
            { icon: "🥑", rule: "Fat stays above 55g", detail: "As a female, lower than this disrupts hormones and recovery." },
            { icon: "👟", rule: "10K steps in your TDEE", detail: "Your targets already account for daily steps." },
            { icon: "⏰", rule: "Post-workout nutrition", detail: "30-50g protein and 60-80g carbs within 2 hours of training." },
            { icon: "📊", rule: "Judge over weeks", detail: "Progress photos every 4 weeks are more useful than the daily scale." },
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

      // Sessions
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
                React.createElement("div", { style: { fontSize: 9, marginTop: 3, color: d.isTraining ? "#ff6eb4" : "#c084fc" } }, d.isTraining ? "Training" : "Rest / Cardio"),
              ),
            ),
            isDayDone(d.id)
              ? React.createElement("span", { style: Object.assign({}, S.doneBadge, { background: d.color }) }, "Done")
              : React.createElement("span", { style: S.arrow }, "→"),
          );
        })
      ),

      // Recent
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

      React.createElement("div", { style: S.tip }, "Never run Day 1 and Day 5 back to back — glutes need 48hrs to recover."),
    ),

    // DAY VIEW
    view === "day" && day && React.createElement("div", { style: S.page },
      React.createElement("button", { style: S.backBtn, onClick: function() { setView("home"); } }, "← Back"),
      React.createElement("div", { style: Object.assign({}, S.dayHeader, { borderColor: day.color + "66" }) },
        React.createElement("span", { style: { fontSize: 36 } }, day.emoji),
        React.createElement("div", { style: { flex: 1 } },
          React.createElement("div", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 2, lineHeight: 1, color: day.color } }, day.name),
          React.createElement("div", { style: { fontSize: 11, color: "#6a3a6a", letterSpacing: 1, marginTop: 4 } }, day.tag),
          React.createElement("div", { style: { marginTop: 8, padding: "8px 10px", background: "#1a0a1a", borderRadius: 8, border: "1px solid " + (day.isTraining ? "#ff6eb444" : "#c084fc44"), display: "inline-block" } },
            React.createElement("span", { style: { fontSize: 11, color: day.isTraining ? "#ff6eb4" : "#c084fc" } }, day.isTraining ? "Training day" : "Rest/cardio day"),
            React.createElement("span", { style: { display: "block", fontSize: 10, color: "#5a2a5a", marginTop: 2 } },
              day.isTraining
                ? MACROS.training.calories + "kcal · " + MACROS.training.protein + "g protein · " + MACROS.training.carbs + "g carbs"
                : MACROS.rest.calories + "kcal · " + MACROS.rest.protein + "g protein · " + MACROS.rest.carbs + "g carbs"
            ),
          ),
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
          return React.createElement("div", { key: ex.id, style: Object.assign({}, S.exCard, isChecked ? { opacity: 0.45 } : {}, ex.superset ? { borderLeft: "2px solid " + day.color + "44" } : {}) },
            React.createElement("div", { style: Object.assign({}, S.checkbox, isChecked ? { background: day.color, borderColor: day.color, boxShadow: "0 0 12px " + day.color + "66" } : {}), onClick: function() { toggleCheck(ex.id); } },
              isChecked && React.createElement("span", { style: { color: "#fff", fontSize: 11, fontWeight: 700 } }, "✦"),
            ),
            React.createElement("div", { style: { flex: 1, cursor: "pointer" }, onClick: function() { toggleCheck(ex.id); } },
              ex.superset && React.createElement("span", { style: Object.assign({}, S.superTag, { background: day.color + "22", color: day.color, border: "1px solid " + day.color + "44" }) },
                ex.superset === "Giant" ? "GIANT SET" : ex.superset === "Finish" ? "FINISHER" : ex.superset === "Core" ? "CORE" : "SUPERSET " + ex.superset
              ),
              React.createElement("div", { style: { fontSize: 14, fontWeight: 500, color: "#f0e0f0", marginBottom: 3, lineHeight: 1.3, textDecoration: isChecked ? "line-through" : "none" } }, ex.name),
              React.createElement("div", { style: { fontSize: 12, color: day.color, marginBottom: 4 } }, ex.sets),
              React.createElement("div", { style: { fontSize: 11, color: "#5a3a5a", lineHeight: 1.5 } }, ex.note),
              logged && React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 } },
                logged.rows.slice(0, 3).map(function(r, i) {
                  return (r.weight || r.reps) ? React.createElement("span", { key: i, style: { fontSize: 10, padding: "2px 8px", background: "#1e0e1e", borderRadius: 6, border: "1px solid " + day.color + "44", color: day.color } },
                    (r.weight ? r.weight + "kg" : "") + (r.weight && r.reps ? " x " : "") + (r.reps || "")
                  ) : null;
                })
              ),
            ),
            React.createElement("button", { style: Object.assign({}, S.logBtnEx, { borderColor: logged ? day.color + "88" : "#2a1a2a", color: logged ? day.color : "#4a3a4a" }), onClick: function(e) { e.stopPropagation(); setLogModal({ ex: ex, color: day.color, existing: logged }); } },
              logged ? "✦" : "+"
            ),
          );
        })
      ),

      !isDayDone(day.id)
        ? React.createElement("button", { style: Object.assign({}, S.completeBtn, { background: "linear-gradient(135deg, " + day.color + ", #e879f9)", boxShadow: "0 4px 24px " + day.color + "55" }), className: "complete-btn", onClick: function() { completeDay(day.id); } }, "✦ Mark Session Complete ✦")
        : React.createElement("div", { style: { textAlign: "center", padding: 16, fontSize: 13, color: "#c084fc", letterSpacing: 2 } }, "✦ Session logged ✦"),
    ),

    // Modals
    logModal && React.createElement(SetLogModal, { ex: logModal.ex, color: logModal.color, existing: logModal.existing, onSave: function(e) { saveExLog(logModal.ex.id, e); setLogModal(null); }, onClose: function() { setLogModal(null); } }),
    macroModal && React.createElement(MacroLogModal, { targets: targets, dayType: dayType, todayLog: todayMacros, onSave: function(l) { saveMacroLog(l); setMacroModal(false); }, onClose: function() { setMacroModal(false); } }),
    cycleModal && React.createElement(CycleModal, { currentStart: cycleStart, currentLength: cycleLength, onSave: function(s, l) { saveCycle(s, l); setCycleModal(false); }, onClose: function() { setCycleModal(false); } }),
  );
}

function SetLogModal(props) {
  var ex = props.ex; var color = props.color; var existing = props.existing;
  var s1 = useState(existing && existing.rows ? existing.rows : [{ weight: "", reps: "" }, { weight: "", reps: "" }, { weight: "", reps: "" }]);
  var rows = s1[0]; var setRows = s1[1];
  var s2 = useState(existing && existing.notes ? existing.notes : "");
  var notes = s2[0]; var setNotes = s2[1];

  function updateRow(i, field, val) {
    var next = rows.map(function(r, j) { return j === i ? Object.assign({}, r, { [field]: val }) : r; });
    setRows(next);
  }

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
      React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 8 } },
        React.createElement("span", { style: { width: 24 } }),
        React.createElement("span", { style: { flex: 1, fontSize: 9, color: "#5a2a5a", letterSpacing: 1, textAlign: "center" } }, "WEIGHT"),
        React.createElement("span", { style: { flex: 1, fontSize: 9, color: "#5a2a5a", letterSpacing: 1, textAlign: "center" } }, "REPS"),
        React.createElement("span", { style: { width: 28 } }),
      ),
      rows.map(function(row, i) {
        return React.createElement("div", { key: i, style: { display: "flex", gap: 8, marginBottom: 8, alignItems: "center" } },
          React.createElement("span", { style: { width: 24, fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, textAlign: "center", color: color } }, i + 1),
          React.createElement("input", { style: Object.assign({}, S.setInput, { borderColor: color + "44" }), placeholder: "kg/lb", value: row.weight, onChange: function(e) { updateRow(i, "weight", e.target.value); }, type: "number" }),
          React.createElement("input", { style: Object.assign({}, S.setInput, { borderColor: color + "44" }), placeholder: "reps", value: row.reps, onChange: function(e) { updateRow(i, "reps", e.target.value); }, type: "number" }),
          React.createElement("button", { style: { width: 28, height: 28, background: "none", border: "none", color: "#3a1a3a", fontSize: 11, cursor: "pointer" }, onClick: function() { setRows(rows.filter(function(_, j) { return j !== i; })); } }, "X"),
        );
      }),
      React.createElement("button", { style: S.addSetBtn, onClick: function() { setRows(rows.concat([{ weight: "", reps: "" }])); } }, "+ Add set"),
      React.createElement("textarea", { style: S.notesInput, placeholder: "Notes — RPE, how it felt, form cues...", value: notes, onChange: function(e) { setNotes(e.target.value); } }),
      React.createElement("button", { style: Object.assign({}, S.saveBtn, { background: "linear-gradient(135deg, " + color + ", #e879f9)" }), onClick: function() { props.onSave({ rows: rows, notes: notes }); } }, "✦ Save"),
    ),
  );
}

function MacroLogModal(props) {
  var targets = props.targets; var dayType = props.dayType; var todayLog = props.todayLog;
  var init = { calories: "", protein: "", carbs: "", fat: "" };
  Object.keys(todayLog).forEach(function(k) { init[k] = todayLog[k]; });
  var s1 = useState(init); var l = s1[0]; var setL = s1[1];

  return React.createElement("div", { style: S.overlay, onClick: props.onClose },
    React.createElement("div", { style: S.modal, onClick: function(e) { e.stopPropagation(); } },
      React.createElement("div", { style: Object.assign({}, S.modalBar, { background: "linear-gradient(90deg, #ff6eb4, #e879f9)" }) }),
      React.createElement("div", { style: S.modalHead },
        React.createElement("div", null,
          React.createElement("div", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, color: "#ff6eb4" } }, "Log Intake ✦"),
          React.createElement("div", { style: { fontSize: 11, color: "#6a3a6a", marginTop: 2 } }, (dayType === "training" ? "Training day" : "Rest day") + " — " + targets.calories + " kcal target"),
        ),
        React.createElement("button", { style: S.closeBtn, onClick: props.onClose }, "X"),
      ),
      React.createElement("div", { style: { fontSize: 12, color: "#6a3a6a", lineHeight: 1.7, marginBottom: 20, borderLeft: "2px solid #ff6eb433", paddingLeft: 12 } }, "Rough totals are fine. Protein and calories matter most."),
      MACRO_KEYS.map(function(m) {
        var actual = Number(l[m.key]) || 0;
        var target = targets[m.key];
        var pct = Math.min((actual / target) * 100, 100);
        var over = actual > target;
        return React.createElement("div", { key: m.key, style: { marginBottom: 18 } },
          React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
            React.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: m.color, flexShrink: 0 } }),
            React.createElement("label", { style: { flex: 1, fontSize: 13, color: "#e0c0e0" } }, m.label),
            React.createElement("span", { style: { fontSize: 10, color: over ? "#fb7185" : m.color, letterSpacing: 0.3 } }, actual + " / " + target + m.unit + (over ? " !" : "")),
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
          React.createElement("div", { style: { fontSize: 11, color: "#6a3a6a", marginTop: 2 } }, "Your training adapts to your cycle"),
        ),
        React.createElement("button", { style: S.closeBtn, onClick: props.onClose }, "X"),
      ),
      React.createElement("div", { style: { fontSize: 12, color: "#6a3a6a", lineHeight: 1.7, marginBottom: 20, borderLeft: "2px solid #f472b633", paddingLeft: 12 } }, "Enter the first day of your last period. This stays private on your device."),
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
        React.createElement("div", { style: { fontSize: 11, color: "#6a3a6a", marginTop: 4 } }, preview.daysLeft + " days until next cycle"),
      ),
      React.createElement("div", { style: { marginBottom: 16 } },
        React.createElement("div", { style: { fontSize: 10, color: "#5a2a5a", letterSpacing: 2, marginBottom: 10 } }, "ALL 4 PHASES"),
        CYCLE_PHASES.map(function(p) {
          return React.createElement("div", { key: p.name, style: { display: "flex", gap: 10, alignItems: "center", marginBottom: 10, padding: "8px 10px", background: "#1a0a1a", borderRadius: 8, border: "1px solid " + p.color + "33" } },
            React.createElement("span", { style: { fontSize: 16 } }, p.emoji),
            React.createElement("div", { style: { flex: 1 } },
              React.createElement("div", { style: { fontSize: 12, fontWeight: 500, color: p.color } }, p.name + " days " + p.days[0] + "-" + p.days[1]),
              React.createElement("div", { style: { fontSize: 10, color: "#5a2a5a", marginTop: 2 } }, "Energy: " + p.energy + " · Strength: " + p.strength),
            ),
          );
        })
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
  schedRow: { display: "flex", gap: 8, marginBottom: 28 },
  schedDay: { flex: 1, background: "#1a0a1a", borderRadius: 10, padding: "10px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, border: "1px solid #2a0a2a", position: "relative", overflow: "hidden" },
  schedDayDone: { background: "linear-gradient(160deg, #2a0a2a, #1a0a1a)", border: "1px solid #ff6eb466", boxShadow: "0 0 12px #ff6eb422" },
  schedSparkle: { position: "absolute", top: 4, right: 5, fontSize: 8, color: "#ff6eb4" },
  schedLabel: { fontSize: 9, color: "#5a3a5a", letterSpacing: 1 },
  schedNum: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: "#f0e0f0", letterSpacing: 1 },
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
  dayTypeCard: { background: "linear-gradient(135deg, #1a0a1a, #150515)", borderRadius: 14, padding: 16, marginBottom: 14, border: "1px solid #2a1a2a" },
  dayTypeLabel: { fontSize: 11, color: "#6a3a6a", letterSpacing: 0.5, marginBottom: 12 },
  dayTypeRow: { display: "flex", gap: 8, marginBottom: 12 },
  dayTypeBtn: { flex: 1, padding: "10px 8px", borderRadius: 10, border: "1px solid #2a1a2a", background: "#110811", color: "#6a3a6a", fontSize: 12, cursor: "pointer", letterSpacing: 0.3 },
  dayTypeBtnActive: { background: "#ff6eb422", border: "1px solid #ff6eb466", color: "#ff6eb4" },
  dayTypeBtnActiveRest: { background: "#c084fc22", border: "1px solid #c084fc66", color: "#c084fc" },
  dayTypeReasoning: { fontSize: 11, color: "#6a3a6a", lineHeight: 1.6 },
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
  compareRow: { borderTop: "1px solid #2a1a2a", paddingTop: 12, display: "flex", gap: 12 },
  compareItem: { flex: 1, display: "flex", flexDirection: "column", gap: 3 },
  compareLabel: { fontSize: 9, color: "#5a2a5a", letterSpacing: 1, textTransform: "uppercase" },
  compareVal: { fontSize: 10, color: "#6a4a6a", lineHeight: 1.5 },
  compareDivider: { width: 1, background: "#2a1a2a", alignSelf: "stretch" },
  rulesCard: { background: "linear-gradient(135deg, #150a15, #110811)", borderRadius: 14, padding: 16, border: "1px solid #2a1a2a" },
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
  superTag: { fontSize: 9, fontWeight: 500, letterSpacing: 1.5, padding: "2px 8px", borderRadius: 5, display: "inline-block", marginBottom: 6 },
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
