/* wRVU Counter PWA. Data: CMS CY2026 PFS (RVU26D, Oct 2026 release). Storage: IndexedDB with localStorage fallback. */
(function () {
  "use strict";

  // ---------- Data ----------
  var MOD_LABEL = { X: "X-ray", C: "CT", M: "MRI", U: "Ultrasound", B: "Breast", N: "Nuc med", P: "PET", F: "Fluoro", I: "Angio/IR imaging", R: "Procedure", D: "DXA", Z: "Custom", K: "Combo" };
  var MOD_SYN = { X: "xr xray radiograph plain film", C: "ct cat", M: "mri mr", U: "us ultrasound sono", B: "breast mammo", N: "nm nuc nuclear", P: "pet", F: "fluoro fluoroscopy", I: "ir angio angiography", R: "proc procedure ir", D: "dxa dexa bone density", Z: "custom", K: "combo" };
  var COMBOS = [
    { key: "combo:cap-w", name: "CT chest/abd/pelvis w/", codes: ["71260", "74177"], tags: "cap chest abd pelvis w" },
    { key: "combo:cap-wo", name: "CT chest/abd/pelvis w/o", codes: ["71250", "74176"], tags: "cap chest abd pelvis wo" },
    { key: "combo:pe-ap", name: "CTA chest (PE) + CT abd/pelvis w/", codes: ["71275", "74177"], tags: "cta pe chest abd pelvis w" },
    { key: "combo:trauma", name: "CT head + c-spine w/o", codes: ["70450", "72125"], tags: "trauma head cspine wo" },
    { key: "combo:mammo-dbt", name: "Screening mammo + DBT", codes: ["77067", "77063"], tags: "mammo screening tomo dbt 3d" }
  ];
  var DEFAULT_FAVS = ["71045", "71046", "74018", "70450", "combo:trauma", "71250", "71260", "71275", "74176", "74177", "combo:cap-w", "70551", "70553", "72141", "72148", "73721", "76700", "76705", "76770", "93970", "combo:mammo-dbt", "77066", "78815"];
  var COMMON = new Set(["71045", "71046", "74018", "70450", "70460", "70470", "70486", "70490", "70491", "70496", "70498", "71250", "71260", "71275", "72125", "72131", "74150", "74176", "74177", "74178", "70551", "70553", "72141", "72148", "72158", "73221", "73721", "74183", "76700", "76705", "76770", "76536", "76856", "76830", "76801", "76805", "76817", "93880", "93970", "93971", "93925", "77065", "77066", "77067", "77063", "78815", "78306", "78582", "78226", "78452", "77080"]);
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  var BASE = (self.WRVU_RAW || "").split("\n").filter(Boolean).map(function (line) {
    var p = line.split("|");
    return { code: p[0], rvu: Number(p[1]), mod: p[2], name: p[3], tags: p[4] || "" };
  });

  // ---------- Helpers ----------
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function f2(n) { return (Math.round(n * 100) / 100).toFixed(2); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function ymd(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function toDate(s) { var p = s.split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]); }
  function shiftDay(s, n) { var d = toDate(s); d.setDate(d.getDate() + n); return ymd(d); }
  function today() { return ymd(new Date()); }
  function pretty(s) { return toDate(s).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" }); }
  function monthLabel(ym) { return MONTHS[Number(ym.slice(5, 7)) - 1] + " " + ym.slice(0, 4); }
  function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function csvCell(v) { var s = String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
  function toCsv(rows) { return rows.map(function (r) { return r.map(csvCell).join(","); }).join("\n"); }
  function buzz() { if (S.settings.haptics && navigator.vibrate) { try { navigator.vibrate(12); } catch (e) { /* ignore */ } } }

  function tokenize(s) {
    var out = [];
    s.toLowerCase().split(/\s+/).forEach(function (p) {
      if (!p || p.indexOf("w/") === 0 || p === "&") return;
      var joined = p.replace(/[^a-z0-9+]/g, "");
      p.split(/[^a-z0-9+]+/).forEach(function (t) { if (t) out.push(t); });
      if (joined && joined !== p) out.push(joined);
    });
    return out;
  }
  function parseQuery(q) {
    var s = " " + q.toLowerCase().trim() + " ";
    var qty = null;
    var tail = s.match(/\s[x*](\d{1,3})\s$/);
    if (tail) { qty = Number(tail[1]); s = s.slice(0, tail.index) + " "; }
    var lead = s.match(/^\s(\d{1,2})\s?[x*]\s/);
    if (qty === null && lead) { qty = Number(lead[1]); s = " " + s.slice(lead[0].length); }
    s = s.replace(/w\/o\s*(&|and|\+)?\s*w\/?/g, " wwo ")
      .replace(/\s(w\/wo|w\+wo|w&wo|w-wo|with and without|w and wo)\s/g, " wwo ")
      .replace(/w\/o|\swithout\s|\snon ?contrast\s|\snoncon\s/g, " wo ")
      .replace(/w\/|\swith\s/g, " w ");
    return { tokens: tokenize(s), qty: qty };
  }
  function scoreItem(it, qt) {
    var total = 0, code = it.label.toLowerCase();
    for (var i = 0; i < qt.length; i++) {
      var q = qt[i], best = 0;
      if (code === q) best = 10; else if (code.indexOf(q) === 0) best = 4;
      for (var j = 0; j < it.tokens.length; j++) {
        var t = it.tokens[j];
        if (t === q) { if (best < 3) best = 3; }
        else if (t.indexOf(q) === 0) { var v = q.length >= 2 ? 1.5 : 1; if (best < v) best = v; }
      }
      if (best === 0) return 0;
      total += best;
    }
    return total;
  }

  // ---------- Storage (IndexedDB + localStorage fallback) ----------
  var LS_KEY = "wrvu-counter-pwa-v1";
  var DB_NAME = "wrvu-counter", STORE = "kv", REC = "state";
  var dbPromise = null, storageMode = "memory";
  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      if (!("indexedDB" in self)) { reject(new Error("no idb")); return; }
      var req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = function () { req.result.createObjectStore(STORE); };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
      req.onblocked = function () { reject(new Error("blocked")); };
    });
    return dbPromise;
  }
  function idbGet() {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, "readonly");
        var r = tx.objectStore(STORE).get(REC);
        r.onsuccess = function () { resolve(r.result || null); };
        r.onerror = function () { reject(r.error); };
      });
    });
  }
  function idbPut(val) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(val, REC);
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { reject(tx.error); };
        tx.onabort = function () { reject(tx.error); };
      });
    });
  }
  function lsGet() { try { var s = localStorage.getItem(LS_KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  function lsPut(val) { try { localStorage.setItem(LS_KEY, JSON.stringify(val)); return true; } catch (e) { return false; } }

  function loadState() {
    return idbGet().then(function (v) {
      storageMode = "IndexedDB";
      if (!v) { var l = lsGet(); if (l) return l; }
      return v;
    }).catch(function () {
      var l = lsGet();
      storageMode = (function () { try { localStorage.setItem("__t", "1"); localStorage.removeItem("__t"); return "localStorage"; } catch (e) { return "memory"; } })();
      return l;
    });
  }
  var saveTimer = null;
  function snapshot() { return { v: 1, entries: S.entries, favs: S.favs, customs: S.customs, settings: S.settings, lastBackup: S.lastBackup, savedAt: new Date().toISOString() }; }
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flush, 150);
  }
  function flush() {
    clearTimeout(saveTimer);
    var snap = snapshot();
    if (storageMode === "IndexedDB") {
      return idbPut(snap).catch(function () { storageMode = "localStorage"; lsPut(snap); });
    }
    lsPut(snap);
    return Promise.resolve();
  }
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flush(); });
  window.addEventListener("pagehide", flush);

  // ---------- State ----------
  var S = { entries: [], favs: DEFAULT_FAVS.slice(), customs: [], settings: { theme: "system", remindDays: 7, haptics: true }, lastBackup: null };
  var U = { tab: "today", date: today(), hi: 0, results: [], editPins: false, view: "day", yearF: String(new Date().getFullYear()), monthF: "all", sortKey: "date", sortDir: -1, codesMod: "all", codesQuery: "", persisted: null, swState: "not registered" };
  var undoStack = [];
  var items = [], itemMap = new Map(), usage = new Map();

  function rebuildItems() {
    var byCode = new Map();
    BASE.forEach(function (r) {
      byCode.set(r.code, { key: r.code, label: r.code, name: r.name, rvu: r.rvu, mod: r.mod, tokens: [r.code.toLowerCase()].concat(tokenize(r.name + " " + r.tags + " " + (MOD_SYN[r.mod] || ""))), parts: [{ code: r.code, name: r.name, rvu: r.rvu }] });
    });
    S.customs.forEach(function (c) {
      byCode.set(c.code, { key: c.code, label: c.code, name: c.name, rvu: c.rvu, mod: "Z", tokens: [c.code.toLowerCase()].concat(tokenize(c.name + " " + MOD_SYN.Z)), parts: [{ code: c.code, name: c.name, rvu: c.rvu }] });
    });
    var list = Array.from(byCode.values());
    COMBOS.forEach(function (cb) {
      var parts = cb.codes.map(function (c) { var it = byCode.get(c); return it ? it.parts[0] : null; }).filter(Boolean);
      if (parts.length !== cb.codes.length) return;
      list.push({ key: cb.key, label: cb.codes.join("+"), name: cb.name, rvu: parts.reduce(function (s, p) { return s + p.rvu; }, 0), mod: "K", tokens: tokenize(cb.name + " " + cb.tags + " " + cb.codes.join(" ") + " combo"), parts: parts });
    });
    items = list;
    itemMap = new Map(list.map(function (i) { return [i.key, i]; }));
  }
  function rebuildUsage() {
    usage = new Map();
    S.entries.forEach(function (e) { usage.set(e.code, (usage.get(e.code) || 0) + e.qty); });
  }
  function search(q, mod, limit) {
    var pq = parseQuery(q);
    var pool = mod === "all" ? items : items.filter(function (i) { return i.mod === mod; });
    if (!pq.tokens.length) return { list: mod === "all" ? [] : pool.slice().sort(function (a, b) { return a.label.localeCompare(b.label); }), qty: pq.qty };
    var scored = [];
    pool.forEach(function (it) {
      var s = scoreItem(it, pq.tokens);
      if (s > 0) scored.push({ it: it, s: s + Math.min(2, Math.log10(1 + (usage.get(it.parts[0].code) || 0))) + (S.favs.indexOf(it.key) >= 0 ? 0.3 : 0) + (COMMON.has(it.key) ? 0.4 : 0) - (it.mod === "R" ? 0.2 : 0) });
    });
    scored.sort(function (a, b) { return b.s - a.s || a.it.label.localeCompare(b.it.label); });
    return { list: scored.slice(0, limit || 12).map(function (x) { return x.it; }), qty: pq.qty };
  }

  // ---------- Mutations ----------
  function commit(next) {
    undoStack.push(S.entries);
    if (undoStack.length > 40) undoStack.shift();
    S.entries = next;
    rebuildUsage();
    save();
  }
  function qtyValue(override) {
    var n = override != null ? override : Number($("qty").value);
    n = Math.round(Number.isFinite(n) ? n : 1);
    return Math.max(1, Math.min(999, n || 1));
  }
  function addItem(it, n) {
    var next = S.entries.slice();
    it.parts.forEach(function (p) {
      var i = next.findIndex(function (e) { return e.date === U.date && e.code === p.code; });
      if (i >= 0) next[i] = Object.assign({}, next[i], { qty: next[i].qty + n });
      else next.push({ id: newId(), date: U.date, code: p.code, name: p.name, rvu: p.rvu, qty: n, at: new Date().toISOString() });
    });
    commit(next);
    buzz();
    $("qty").value = "1";
    toast("Added " + it.name + " ×" + n + " (" + f2(it.rvu * n) + ")", "Undo", doUndo);
    renderAll();
  }
  function setEntryQty(id, q) {
    if (q <= 0) commit(S.entries.filter(function (e) { return e.id !== id; }));
    else commit(S.entries.map(function (e) { return e.id === id ? Object.assign({}, e, { qty: q }) : e; }));
    renderAll();
  }
  function doUndo() {
    if (!undoStack.length) return;
    S.entries = undoStack.pop();
    rebuildUsage();
    save();
    toast("Undone", null, null);
    renderAll();
  }
  function togglePin(key) {
    var i = S.favs.indexOf(key);
    if (i >= 0) S.favs.splice(i, 1); else S.favs.push(key);
    save();
  }
  function movePin(key, dir) {
    var i = S.favs.indexOf(key), j = i + dir;
    if (i < 0 || j < 0 || j >= S.favs.length) return;
    S.favs[i] = S.favs[j]; S.favs[j] = key;
    save();
  }

  // ---------- Toast ----------
  var toastTimer = null, toastAction = null;
  function toast(msg, btn, action) {
    $("toastMsg").textContent = msg;
    var b = $("toastBtn");
    if (btn) { b.textContent = btn; b.classList.remove("hidden"); toastAction = action; } else { b.classList.add("hidden"); toastAction = null; }
    $("toast").classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { $("toast").classList.add("hidden"); }, 4000);
  }
  $("toastBtn").addEventListener("click", function () { $("toast").classList.add("hidden"); if (toastAction) toastAction(); });

  // ---------- Aggregates ----------
  function sumWhere(pred) {
    var r = 0, n = 0;
    S.entries.forEach(function (e) { if (pred(e)) { r += e.rvu * e.qty; n += e.qty; } });
    return { rvu: r, n: n };
  }
  function dayAggs() {
    var m = new Map();
    S.entries.forEach(function (e) {
      var a = m.get(e.date) || { exams: 0, rvu: 0 };
      a.exams += e.qty; a.rvu += e.rvu * e.qty; m.set(e.date, a);
    });
    var mtd = 0, ytd = 0, cm = "", cy = "";
    return Array.from(m.keys()).sort().map(function (d) {
      var a = m.get(d);
      if (d.slice(0, 7) !== cm) { cm = d.slice(0, 7); mtd = 0; }
      if (d.slice(0, 4) !== cy) { cy = d.slice(0, 4); ytd = 0; }
      mtd += a.rvu; ytd += a.rvu;
      return { date: d, exams: a.exams, rvu: a.rvu, mtd: mtd, ytd: ytd };
    });
  }
  function groupDays(days, keyLen) {
    var m = new Map();
    days.forEach(function (d) {
      var k = d.date.slice(0, keyLen);
      var a = m.get(k) || { days: 0, exams: 0, rvu: 0 };
      a.days++; a.exams += d.exams; a.rvu += d.rvu; m.set(k, a);
    });
    var cum = 0, cy = "";
    return Array.from(m.keys()).sort().map(function (k) {
      var a = m.get(k);
      if (keyLen === 7 && k.slice(0, 4) !== cy) { cy = k.slice(0, 4); cum = 0; }
      cum += a.rvu;
      return { key: k, days: a.days, exams: a.exams, rvu: a.rvu, cum: cum };
    });
  }

  // ---------- Header ----------
  function renderHeader() {
    $("dateLabel").textContent = (U.date === today() ? "Today · " : "") + pretty(U.date);
    $("dateInput").value = U.date;
    $("todayBtn").classList.toggle("hidden", U.date === today());
    var d = sumWhere(function (e) { return e.date === U.date; });
    var m = sumWhere(function (e) { return e.date.slice(0, 7) === U.date.slice(0, 7); });
    var y = sumWhere(function (e) { return e.date.slice(0, 4) === U.date.slice(0, 4); });
    $("dayTotal").innerHTML = f2(d.rvu) + "<small>wRVU</small>";
    $("subTotals").textContent = d.n + " exam" + (d.n === 1 ? "" : "s") + " · " + MONTHS[Number(U.date.slice(5, 7)) - 1] + " " + f2(m.rvu) + " · " + U.date.slice(0, 4) + " " + f2(y.rvu);
    document.documentElement.style.setProperty("--toph", $("top").offsetHeight + "px");
  }

  // ---------- Search ----------
  function renderResults() {
    var q = $("search").value;
    var box = $("results");
    if (!q.trim()) { box.classList.add("hidden"); U.results = []; return; }
    var r = search(q, "all", 12);
    U.results = r.list;
    if (U.hi >= r.list.length) U.hi = 0;
    if (!r.list.length) { box.innerHTML = '<div class="empty">No match. Add it under Codes as a custom code.</div>'; box.classList.remove("hidden"); return; }
    box.innerHTML = r.list.map(function (it, i) {
      var on = S.favs.indexOf(it.key) >= 0;
      return '<div class="res' + (i === U.hi ? " hi" : "") + '" data-add="' + esc(it.key) + '" role="option">' +
        '<div class="main"><div class="nm">' + esc(it.name) + '</div><div class="meta">' + esc(it.label) + " · " + esc(MOD_LABEL[it.mod] || "") + '</div></div>' +
        '<div class="rv">' + f2(it.rvu) + '</div>' +
        '<button class="pin' + (on ? " on" : "") + '" data-pin="' + esc(it.key) + '">' + (on ? "Pinned" : "Pin") + '</button></div>';
    }).join("");
    box.classList.remove("hidden");
  }
  function addFromSearch() {
    var it = U.results[U.hi] || U.results[0];
    if (!it) return;
    var pq = parseQuery($("search").value);
    var n = qtyValue(pq.qty);
    $("search").value = "";
    U.hi = 0;
    renderResults();
    addItem(it, n);
    $("search").focus();
  }
  $("search").addEventListener("input", function () { U.hi = 0; renderResults(); });
  $("search").addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); U.hi = Math.min(U.hi + 1, Math.max(0, U.results.length - 1)); renderResults(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); U.hi = Math.max(0, U.hi - 1); renderResults(); }
    else if (e.key === "Enter") { e.preventDefault(); addFromSearch(); }
    else if (e.key === "Escape") { $("search").value = ""; renderResults(); }
  });
  $("qty").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); addFromSearch(); } });
  $("results").addEventListener("click", function (e) {
    var pin = e.target.closest("[data-pin]");
    if (pin) { e.stopPropagation(); togglePin(pin.getAttribute("data-pin")); renderResults(); if (U.tab === "today") renderView(); return; }
    var row = e.target.closest("[data-add]");
    if (row) { var it = itemMap.get(row.getAttribute("data-add")); if (it) { U.results = [it]; U.hi = 0; addFromSearch(); } }
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest("#searchwrap")) $("results").classList.add("hidden");
  });
  $("search").addEventListener("focus", function () { if ($("search").value.trim()) renderResults(); });
  $("qtyMinus").addEventListener("click", function () { $("qty").value = String(Math.max(1, qtyValue() - 1)); });
  $("qtyPlus").addEventListener("click", function () { $("qty").value = String(qtyValue() + 1); });
  document.addEventListener("keydown", function (e) {
    var tag = e.target && e.target.tagName;
    if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") { e.preventDefault(); setTab("today"); $("search").focus(); }
  });

  // ---------- Date controls ----------
  function setDate(d) { if (d) { U.date = d; renderAll(); } }
  $("prevDay").addEventListener("click", function () { setDate(shiftDay(U.date, -1)); });
  $("nextDay").addEventListener("click", function () { setDate(shiftDay(U.date, 1)); });
  $("todayBtn").addEventListener("click", function () { setDate(today()); });
  $("dateInput").addEventListener("change", function (e) { setDate(e.target.value); });

  // ---------- Views ----------
  function backupDue() {
    if (!S.entries.length) return false;
    var days = Number(S.settings.remindDays) || 0;
    if (days <= 0) return false;
    if (!S.lastBackup) return true;
    return (Date.now() - new Date(S.lastBackup).getTime()) > days * 86400000;
  }
  function lastBackupText() {
    if (!S.lastBackup) return "Never backed up";
    var d = new Date(S.lastBackup);
    var days = Math.floor((Date.now() - d.getTime()) / 86400000);
    return "Last backup " + d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) + " " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) + (days > 0 ? " (" + days + " day" + (days === 1 ? "" : "s") + " ago)" : "");
  }

  function viewToday() {
    var h = "";
    if (backupDue()) h += '<div class="banner"><div><strong>Back up your log.</strong><div style="font-size:13px">' + esc(lastBackupText()) + '.</div></div><button data-act="quickBackup">Back up</button></div>';
    var favItems = S.favs.map(function (k) { return itemMap.get(k); }).filter(Boolean);
    var dayCounts = new Map();
    S.entries.forEach(function (e) { if (e.date === U.date) dayCounts.set(e.code, (dayCounts.get(e.code) || 0) + e.qty); });
    h += '<h2>Quick add <button class="chipbtn' + (U.editPins ? " on" : "") + '" data-act="editPins">' + (U.editPins ? "Done" : "Edit") + '</button></h2>';
    if (favItems.length) {
      h += '<div class="grid">' + favItems.map(function (it) {
        var c = it.mod === "K" ? 0 : (dayCounts.get(it.key) || 0);
        return '<div class="tile' + (it.mod === "K" ? " combo" : "") + '" data-tile="' + esc(it.key) + '" role="button" tabindex="0">' +
          (c ? '<span class="cnt">×' + c + '</span>' : "") +
          '<div class="nm">' + esc(it.name) + '</div><div class="meta">' + esc(it.label) + " · " + f2(it.rvu) + '</div>' +
          (U.editPins ? '<div class="pinedit"><button data-move="-1" data-key="' + esc(it.key) + '" aria-label="Move left">←</button><button data-move="1" data-key="' + esc(it.key) + '" aria-label="Move right">→</button><button data-unpin="' + esc(it.key) + '">Unpin</button></div>' : "") +
          '</div>';
      }).join("") + '</div>';
    } else {
      h += '<div class="card note">No pinned exams. Pin exams from search results or the Codes tab.</div>';
    }
    var day = S.entries.filter(function (e) { return e.date === U.date; });
    h += '<h2>Log · ' + esc(pretty(U.date)) + '</h2>';
    if (day.length) {
      var tot = 0, n = 0;
      h += '<div class="list">' + day.map(function (e) {
        tot += e.rvu * e.qty; n += e.qty;
        return '<div class="li"><div class="main"><div class="nm">' + esc(e.name) + '</div><div class="meta">' + esc(e.code) + " · " + f2(e.rvu) + " each · " + f2(e.rvu * e.qty) + '</div></div>' +
          '<div class="step"><button data-dec="' + e.id + '" aria-label="Decrease">−</button><span>' + e.qty + '</span><button data-inc="' + e.id + '" aria-label="Increase">+</button></div>' +
          '<button class="del" data-del="' + e.id + '">Delete</button></div>';
      }).join("") + '<div class="totalrow"><span>Total · ' + n + ' exam' + (n === 1 ? "" : "s") + '</span><span>' + f2(tot) + ' wRVU</span></div></div>';
    } else {
      h += '<div class="card note">Nothing logged for this date yet. Tap a pinned exam or search above.</div>';
    }
    return h;
  }

  function historyData() {
    var days = dayAggs();
    var inY = function (k) { return U.yearF === "all" || k.slice(0, 4) === U.yearF; };
    var inM = function (k) { return U.monthF === "all" || k.slice(5, 7) === U.monthF; };
    var cols, rows, csvHead, csvRows, tot = 0, ex = 0, dn = 0;
    if (U.view === "day") {
      var fd = days.filter(function (d) { return inY(d.date) && inM(d.date); });
      fd.forEach(function (d) { tot += d.rvu; ex += d.exams; dn++; });
      cols = [["date", "Date"], ["exams", "Exams"], ["rvu", "wRVU"], ["mtd", "MTD"], ["ytd", "YTD"]];
      rows = fd.map(function (d) { return { date: d.date, exams: d.exams, rvu: d.rvu, mtd: d.mtd, ytd: d.ytd, _cells: ['<a href="#" data-goto="' + d.date + '">' + esc(toDate(d.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "2-digit" })) + '</a>', d.exams, f2(d.rvu), f2(d.mtd), f2(d.ytd)], _csv: [d.date, d.exams, f2(d.rvu), f2(d.mtd), f2(d.ytd)] }; });
      csvHead = ["Date", "Exams", "wRVU", "Month to date", "Year to date"];
    } else if (U.view === "month") {
      var ms = groupDays(days, 7).filter(function (m) { return inY(m.key); });
      ms.forEach(function (m) { tot += m.rvu; ex += m.exams; dn += m.days; });
      cols = [["date", "Month"], ["days", "Days"], ["exams", "Exams"], ["rvu", "wRVU"], ["avg", "Avg/day"], ["cum", "YTD"]];
      rows = ms.map(function (m) { return { date: m.key, days: m.days, exams: m.exams, rvu: m.rvu, avg: m.rvu / m.days, cum: m.cum, _cells: [esc(monthLabel(m.key)), m.days, m.exams, f2(m.rvu), f2(m.rvu / m.days), f2(m.cum)], _csv: [m.key, m.days, m.exams, f2(m.rvu), f2(m.rvu / m.days), f2(m.cum)] }; });
      csvHead = ["Month", "Days", "Exams", "wRVU", "Avg per day", "Year to date"];
    } else if (U.view === "year") {
      var ys = groupDays(days, 4);
      ys.forEach(function (y) { tot += y.rvu; ex += y.exams; dn += y.days; });
      cols = [["date", "Year"], ["days", "Days"], ["exams", "Exams"], ["rvu", "wRVU"], ["avg", "Avg/day"], ["cum", "All-time"]];
      rows = ys.map(function (y) { return { date: y.key, days: y.days, exams: y.exams, rvu: y.rvu, avg: y.rvu / y.days, cum: y.cum, _cells: [y.key, y.days, y.exams, f2(y.rvu), f2(y.rvu / y.days), f2(y.cum)], _csv: [y.key, y.days, y.exams, f2(y.rvu), f2(y.rvu / y.days), f2(y.cum)] }; });
      csvHead = ["Year", "Days", "Exams", "wRVU", "Avg per day", "All-time total"];
    } else {
      var m = new Map(), dset = new Set();
      S.entries.forEach(function (e) {
        if (!inY(e.date) || !inM(e.date)) return;
        dset.add(e.date);
        var a = m.get(e.code) || { code: e.code, name: e.name, count: 0, rvu: 0 };
        a.count += e.qty; a.rvu += e.rvu * e.qty; m.set(e.code, a);
      });
      var arr = Array.from(m.values());
      arr.forEach(function (x) { tot += x.rvu; ex += x.count; });
      dn = dset.size;
      cols = [["date", "CPT"], ["name", "Exam"], ["exams", "Count"], ["rvu", "wRVU"], ["share", "Share"]];
      rows = arr.map(function (x) { var sh = tot > 0 ? Math.round(x.rvu / tot * 100) : 0; return { date: x.code, name: x.name, exams: x.count, rvu: x.rvu, share: sh, _cells: [esc(x.code), '<span style="display:block;text-align:left">' + esc(x.name) + '</span>', x.count, f2(x.rvu), sh + "%"], _csv: [x.code, x.name, x.count, f2(x.rvu), sh + "%"] }; });
      csvHead = ["CPT", "Exam", "Count", "wRVU", "Share"];
    }
    var k = U.sortKey, dir = U.sortDir;
    if (!rows.length || !(k in rows[0])) k = "date";
    rows.sort(function (a, b) { var x = a[k], y = b[k]; return (typeof x === "string" ? x.localeCompare(y) : x - y) * dir; });
    csvRows = rows.map(function (r) { return r._csv; });
    return { cols: cols, rows: rows, csv: [csvHead].concat(csvRows), tot: tot, ex: ex, dn: dn, days: days, sortKey: k };
  }

  function viewHistory() {
    if (!S.entries.length) return '<div class="card note" style="margin-top:12px">History appears after you log your first exam.</div>';
    var years = Array.from(new Set(S.entries.map(function (e) { return e.date.slice(0, 4); }).concat([String(new Date().getFullYear())]))).sort().reverse();
    var hd = historyData();
    var h = '<div class="seg" style="margin-top:4px">' + [["day", "Daily"], ["month", "Monthly"], ["year", "Yearly"], ["exam", "By exam"]].map(function (v) { return '<button data-view="' + v[0] + '" class="' + (U.view === v[0] ? "on" : "") + '">' + v[1] + '</button>'; }).join("") + '</div>';
    h += '<div class="filters">';
    if (U.view !== "year") h += '<select data-filter="year" aria-label="Year"><option value="all">All years</option>' + years.map(function (y) { return '<option value="' + y + '"' + (U.yearF === y ? " selected" : "") + '>' + y + '</option>'; }).join("") + '</select>';
    if (U.view === "day" || U.view === "exam") h += '<select data-filter="month" aria-label="Month"><option value="all">All months</option>' + MONTHS.map(function (m, i) { var v = pad(i + 1); return '<option value="' + v + '"' + (U.monthF === v ? " selected" : "") + '>' + m + '</option>'; }).join("") + '</select>';
    h += '</div>';
    h += '<div class="card" style="margin-bottom:10px"><div class="big" style="font-size:26px">' + f2(hd.tot) + '<small>wRVU</small></div><div class="sub">' + hd.ex + ' exams · ' + hd.dn + ' day' + (hd.dn === 1 ? "" : "s") + (hd.dn ? ' · ' + f2(hd.tot / hd.dn) + ' per day' : "") + '</div></div>';
    if (U.view === "month") {
      var yr = U.yearF === "all" ? years[0] : U.yearF;
      var vals = MONTHS.map(function (_, i) { var k = yr + "-" + pad(i + 1); return S.entries.reduce(function (s, e) { return e.date.slice(0, 7) === k ? s + e.rvu * e.qty : s; }, 0); });
      var mx = Math.max.apply(null, vals.concat([1]));
      h += '<div class="card" style="margin-bottom:10px"><div class="sub">' + yr + ' by month</div><div class="chart">' + vals.map(function (v, i) { return '<div class="col"><div class="v">' + (v ? Math.round(v) : "") + '</div><div class="b' + (v ? "" : " zero") + '" style="height:' + Math.max(2, v / mx * 100) + '%"></div><div class="l">' + MONTHS[i].charAt(0) + '</div></div>'; }).join("") + '</div></div>';
    }
    if (hd.rows.length) {
      h += '<div class="tablewrap"><table><thead><tr>' + hd.cols.map(function (c) { var on = hd.sortKey === c[0]; return '<th data-sort="' + c[0] + '" class="' + (on ? "sorted" : "") + '">' + c[1] + (on ? (U.sortDir > 0 ? " ▲" : " ▼") : "") + '</th>'; }).join("") + '</tr></thead><tbody>' +
        hd.rows.map(function (r) { return '<tr>' + r._cells.map(function (c) { return '<td>' + c + '</td>'; }).join("") + '</tr>'; }).join("") + '</tbody></table></div>';
    } else h += '<div class="card note">No entries in this period.</div>';
    h += '<p class="note">Tap a column header to sort. Tap a date to open that day.</p>';
    h += '<div class="btnrow"><button class="btn" data-act="csvView">Export this view (CSV)</button></div>';
    return h;
  }

  function viewCodes() {
    var mods = ["all", "X", "C", "M", "U", "B", "N", "P", "F", "I", "R", "D", "K", "Z"].filter(function (m) { return m === "all" || items.some(function (i) { return i.mod === m; }); });
    var h = '<h2>Browse codes</h2><div class="stack"><input class="field" id="codesQuery" type="search" placeholder="Filter by CPT or name" value="' + esc(U.codesQuery) + '" autocomplete="off">' +
      '<select id="codesMod" aria-label="Modality">' + mods.map(function (m) { return '<option value="' + m + '"' + (U.codesMod === m ? " selected" : "") + '>' + (m === "all" ? "All modalities" : MOD_LABEL[m]) + '</option>'; }).join("") + '</select></div>';
    h += '<div id="codesList" style="margin-top:8px">' + codesListHtml() + '</div>';
    h += '<h2>Custom code</h2><div class="card"><div class="formgrid"><input class="field" id="cCode" placeholder="Code" autocapitalize="characters"><input class="field" id="cRvu" inputmode="decimal" placeholder="wRVU"><input class="field full" id="cName" placeholder="Exam name"><button class="btn primary full" data-act="addCustom">Add custom code</button></div><p class="note" id="cErr">Custom codes are pinned to Quick add. Use the same CPT to override a listed value.</p></div>';
    if (S.customs.length) {
      h += '<div class="list" style="margin-top:8px">' + S.customs.map(function (c) { return '<div class="li"><div class="main"><div class="nm">' + esc(c.name) + '</div><div class="meta">' + esc(c.code) + ' · ' + f2(c.rvu) + ' wRVU</div></div><button class="del" data-delcustom="' + esc(c.code) + '">Remove</button></div>'; }).join("") + '</div>';
    }
    return h;
  }
  function codesListHtml() {
    var list;
    if (U.codesQuery.trim()) list = search(U.codesQuery, U.codesMod, 200).list;
    else list = (U.codesMod === "all" ? items : items.filter(function (i) { return i.mod === U.codesMod; })).slice().sort(function (a, b) { return a.label.localeCompare(b.label); });
    var total = list.length;
    list = list.slice(0, 200);
    if (!list.length) return '<div class="card note">No matching codes.</div>';
    return '<p class="note">' + total + ' code' + (total === 1 ? "" : "s") + (total > 200 ? ", showing the first 200" : "") + '. Tap Add to log on ' + esc(pretty(U.date)) + '.</p><div class="list">' + list.map(function (it) {
      var on = S.favs.indexOf(it.key) >= 0;
      return '<div class="li"><div class="main"><div class="nm">' + esc(it.name) + '</div><div class="meta">' + esc(it.label) + ' · ' + esc(MOD_LABEL[it.mod]) + ' · ' + f2(it.rvu) + '</div></div><button class="pin' + (on ? " on" : "") + '" data-pin2="' + esc(it.key) + '">' + (on ? "Pinned" : "Pin") + '</button><button class="pin" data-add2="' + esc(it.key) + '">Add</button></div>';
    }).join("") + '</div>';
  }

  function viewSettings() {
    var h = '<h2>Backup</h2><div class="card stack">';
    h += '<div><strong>' + esc(lastBackupText()) + '</strong><div class="note">' + S.entries.length + ' log lines saved on this device (' + esc(storageMode) + (U.persisted === true ? ", persistent" : U.persisted === false ? ", not marked persistent" : "") + ').</div></div>';
    h += '<div class="btnrow"><button class="btn primary" data-act="backupFile">Download backup</button>' + (navigator.canShare ? '<button class="btn" data-act="backupShare">Share backup</button>' : "") + '<button class="btn" data-act="backupCopy">Copy backup text</button></div>';
    h += '<label class="row"><span>Remind me to back up every</span><select data-setting="remindDays">' + [[0, "Never"], [3, "3 days"], [7, "7 days"], [14, "14 days"], [30, "30 days"]].map(function (o) { return '<option value="' + o[0] + '"' + (Number(S.settings.remindDays) === o[0] ? " selected" : "") + '>' + o[1] + '</option>'; }).join("") + '</select></label>';
    h += '</div><h2>Restore</h2><div class="card stack"><textarea id="restoreText" placeholder="Paste backup text here"></textarea>' +
      '<div class="btnrow"><button class="btn" data-act="restoreMerge">Merge pasted</button><button class="btn danger" data-act="restoreReplace">Replace with pasted</button></div>' +
      '<label class="btn" style="display:flex;align-items:center;justify-content:center">Restore from file (merge)<input type="file" id="restoreFile" accept=".json,application/json,text/plain" class="hidden"></label>' +
      '<p class="note" id="restoreMsg">Merge adds lines not already on this device. Replace overwrites the log, pins and custom codes.</p></div>';
    h += '<h2>Export</h2><div class="card stack"><div class="btnrow"><button class="btn" data-act="csvAll">All log lines (CSV)</button><button class="btn" data-act="csvMonths">Monthly totals (CSV)</button></div></div>';
    h += '<h2>Preferences</h2><div class="card">' +
      '<label class="row"><span>Appearance</span><select data-setting="theme">' + [["system", "Match phone"], ["light", "Light"], ["dark", "Dark"]].map(function (o) { return '<option value="' + o[0] + '"' + (S.settings.theme === o[0] ? " selected" : "") + '>' + o[1] + '</option>'; }).join("") + '</select></label>' +
      '<label class="row"><span>Vibrate on add (Android)</span><input type="checkbox" data-setting="haptics"' + (S.settings.haptics ? " checked" : "") + ' style="width:24px;height:24px"></label>' +
      '<div class="btnrow" style="margin-top:8px"><button class="btn" data-act="resetPins">Reset pins to defaults</button><button class="btn danger" data-act="clearAll">Erase all data</button></div></div>';
    h += '<h2>About</h2><div class="card note">wRVU values are CY 2026 national work RVUs from the CMS Medicare Physician Fee Schedule Relative Value File, October release (RVU26D, PPRRVU2026_Oct_nonQPP, released 08/26/2026). For diagnostic imaging the modifier 26 work RVU equals the global work RVU; procedures without a 26 split use their global work RVU. ' + BASE.length + ' codes plus ' + COMBOS.length + ' combos; radiation oncology and carrier-priced codes are excluded. Each log line keeps the wRVU it was entered with. CPT codes and descriptions copyright 2026 American Medical Association. Source: https://www.cms.gov/medicare/payment/fee-schedules/physician/pfs-relative-value-files/rvu26d<br><br>Offline: ' + esc(U.swState) + '. App version 1.0.0.</div>';
    return h;
  }

  function renderView() {
    var v = $("view");
    if (U.tab === "today") v.innerHTML = viewToday();
    else if (U.tab === "history") v.innerHTML = viewHistory();
    else if (U.tab === "codes") v.innerHTML = viewCodes();
    else v.innerHTML = viewSettings();
    if (U.tab === "codes") {
      $("codesQuery").addEventListener("input", function (e) { U.codesQuery = e.target.value; $("codesList").innerHTML = codesListHtml(); });
      $("codesMod").addEventListener("change", function (e) { U.codesMod = e.target.value; $("codesList").innerHTML = codesListHtml(); });
    }
    if (U.tab === "settings") {
      $("restoreFile").addEventListener("change", function (e) {
        var f = e.target.files && e.target.files[0];
        if (!f) return;
        f.text().then(function (t) { restore(t, "merge"); });
      });
    }
  }
  function renderAll() { renderHeader(); renderView(); }
  function setTab(t) {
    U.tab = t;
    Array.prototype.forEach.call(document.querySelectorAll("#tabs button"), function (b) { b.classList.toggle("on", b.getAttribute("data-tab") === t); });
    $("searchwrap").classList.toggle("hidden", t !== "today");
    renderAll();
    window.scrollTo(0, 0);
  }
  $("tabs").addEventListener("click", function (e) { var b = e.target.closest("[data-tab]"); if (b) setTab(b.getAttribute("data-tab")); });

  // ---------- Backup / export ----------
  function backupJson() { return JSON.stringify({ app: "wrvu-counter", v: 1, exportedAt: new Date().toISOString(), entries: S.entries, favs: S.favs, customs: S.customs, settings: S.settings }); }
  function stamp() { var d = new Date(); return ymd(d) + "-" + pad(d.getHours()) + pad(d.getMinutes()); }
  function downloadText(name, text, type) {
    try {
      var blob = new Blob([text], { type: type });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = name; a.rel = "noopener";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      return true;
    } catch (e) { return false; }
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallbackCopy(text); });
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    var ok = false; try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    ta.remove(); return ok;
  }
  function markBackup() { S.lastBackup = new Date().toISOString(); save(); }
  function allCsv() {
    return toCsv([["Date", "CPT", "Exam", "Qty", "wRVU each", "wRVU total"]].concat(S.entries.slice().sort(function (a, b) { return a.date.localeCompare(b.date) || a.code.localeCompare(b.code); }).map(function (e) { return [e.date, e.code, e.name, e.qty, f2(e.rvu), f2(e.rvu * e.qty)]; })));
  }
  function monthsCsv() {
    return toCsv([["Month", "Days", "Exams", "wRVU", "Avg per day", "Year to date"]].concat(groupDays(dayAggs(), 7).map(function (m) { return [m.key, m.days, m.exams, f2(m.rvu), f2(m.rvu / m.days), f2(m.cum)]; })));
  }
  function restore(text, mode) {
    var msg = $("restoreMsg");
    try {
      var p = JSON.parse(text);
      if (!p || !Array.isArray(p.entries)) throw new Error("bad");
      var clean = p.entries.filter(function (e) { return e && typeof e.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.date) && typeof e.code === "string" && typeof e.rvu === "number" && typeof e.qty === "number"; })
        .map(function (e) { return { id: e.id || newId(), date: e.date, code: e.code, name: String(e.name || e.code), rvu: e.rvu, qty: e.qty, at: e.at }; });
      if (mode === "replace") {
        if (!confirm("Replace everything on this device with the pasted backup (" + clean.length + " log lines)?")) return;
        commit(clean);
        if (Array.isArray(p.favs)) S.favs = p.favs.filter(function (k) { return typeof k === "string"; });
        if (Array.isArray(p.customs)) S.customs = p.customs.filter(function (c) { return c && typeof c.code === "string" && typeof c.rvu === "number"; });
      } else {
        var ids = new Set(S.entries.map(function (e) { return e.id; }));
        var add = clean.filter(function (e) { return !ids.has(e.id); });
        commit(S.entries.concat(add));
        if (Array.isArray(p.customs)) { var have = new Set(S.customs.map(function (c) { return c.code; })); S.customs = S.customs.concat(p.customs.filter(function (c) { return c && typeof c.code === "string" && typeof c.rvu === "number" && !have.has(c.code); })); }
        clean = add;
      }
      rebuildItems(); save(); renderAll();
      toast("Restored " + clean.length + " log lines", null, null);
    } catch (e) {
      if (msg) msg.textContent = "That is not a valid wRVU Counter backup.";
      toast("Not a valid backup", null, null);
    }
  }

  // ---------- Delegated actions ----------
  $("view").addEventListener("click", function (e) {
    var t = e.target, el;
    if ((el = t.closest("[data-move]"))) { e.stopPropagation(); movePin(el.getAttribute("data-key"), Number(el.getAttribute("data-move"))); renderView(); return; }
    if ((el = t.closest("[data-unpin]"))) { e.stopPropagation(); togglePin(el.getAttribute("data-unpin")); renderView(); return; }
    if ((el = t.closest("[data-tile]"))) { if (U.editPins) return; var it = itemMap.get(el.getAttribute("data-tile")); if (it) addItem(it, qtyValue()); return; }
    if ((el = t.closest("[data-inc]"))) { var id = el.getAttribute("data-inc"); var en = S.entries.find(function (x) { return x.id === id; }); if (en) setEntryQty(id, en.qty + 1); return; }
    if ((el = t.closest("[data-dec]"))) { var id2 = el.getAttribute("data-dec"); var en2 = S.entries.find(function (x) { return x.id === id2; }); if (en2) setEntryQty(id2, en2.qty - 1); return; }
    if ((el = t.closest("[data-del]"))) { setEntryQty(el.getAttribute("data-del"), 0); toast("Deleted", "Undo", doUndo); return; }
    if ((el = t.closest("[data-view]"))) { U.view = el.getAttribute("data-view"); U.sortKey = "date"; U.sortDir = -1; renderView(); return; }
    if ((el = t.closest("[data-sort]"))) { var k = el.getAttribute("data-sort"); if (U.sortKey === k) U.sortDir = -U.sortDir; else { U.sortKey = k; U.sortDir = k === "date" ? -1 : -1; } renderView(); return; }
    if ((el = t.closest("[data-goto]"))) { e.preventDefault(); U.date = el.getAttribute("data-goto"); setTab("today"); return; }
    if ((el = t.closest("[data-pin2]"))) { togglePin(el.getAttribute("data-pin2")); $("codesList").innerHTML = codesListHtml(); return; }
    if ((el = t.closest("[data-add2]"))) { var it2 = itemMap.get(el.getAttribute("data-add2")); if (it2) { addItem(it2, 1); } return; }
    if ((el = t.closest("[data-delcustom]"))) { var c = el.getAttribute("data-delcustom"); S.customs = S.customs.filter(function (x) { return x.code !== c; }); S.favs = S.favs.filter(function (k2) { return k2 !== c; }); rebuildItems(); save(); renderView(); return; }
    if ((el = t.closest("[data-act]"))) action(el.getAttribute("data-act"));
  });
  $("view").addEventListener("change", function (e) {
    var t = e.target;
    var f = t.getAttribute && t.getAttribute("data-filter");
    if (f === "year") { U.yearF = t.value; renderView(); return; }
    if (f === "month") { U.monthF = t.value; renderView(); return; }
    var s = t.getAttribute && t.getAttribute("data-setting");
    if (s) {
      S.settings[s] = t.type === "checkbox" ? t.checked : (s === "remindDays" ? Number(t.value) : t.value);
      if (s === "theme") applyTheme();
      save();
    }
  });
  function action(a) {
    if (a === "editPins") { U.editPins = !U.editPins; renderView(); }
    else if (a === "quickBackup") { setTab("settings"); }
    else if (a === "backupFile") { if (downloadText("wrvu-backup-" + stamp() + ".json", backupJson(), "application/json")) { markBackup(); toast("Backup downloaded", null, null); renderView(); } }
    else if (a === "backupShare") {
      try {
        var file = new File([backupJson()], "wrvu-backup-" + stamp() + ".json", { type: "application/json" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], title: "wRVU backup" }).then(function () { markBackup(); renderView(); }, function () { /* cancelled */ });
        } else { toast("Sharing files is not supported here", null, null); }
      } catch (e) { toast("Sharing failed", null, null); }
    }
    else if (a === "backupCopy") { copyText(backupJson()).then(function (ok) { if (ok) { markBackup(); toast("Backup text copied. Paste it somewhere safe.", null, null); renderView(); } else toast("Copy failed", null, null); }); }
    else if (a === "restoreMerge") { restore($("restoreText").value, "merge"); }
    else if (a === "restoreReplace") { restore($("restoreText").value, "replace"); }
    else if (a === "csvAll") { downloadText("wrvu-log-" + stamp() + ".csv", allCsv(), "text/csv"); }
    else if (a === "csvMonths") { downloadText("wrvu-monthly-" + stamp() + ".csv", monthsCsv(), "text/csv"); }
    else if (a === "csvView") { downloadText("wrvu-" + U.view + "-" + stamp() + ".csv", toCsv(historyData().csv), "text/csv"); }
    else if (a === "resetPins") { if (confirm("Reset Quick add pins to the defaults?")) { S.favs = DEFAULT_FAVS.slice(); save(); toast("Pins reset", null, null); } }
    else if (a === "clearAll") {
      if (confirm("Erase all log lines, pins and custom codes on this device? Download a backup first if you need it.")) {
        undoStack = []; S.entries = []; S.favs = DEFAULT_FAVS.slice(); S.customs = []; S.lastBackup = null;
        rebuildItems(); rebuildUsage(); save(); renderAll(); toast("All data erased", null, null);
      }
    }
    else if (a === "addCustom") {
      var code = $("cCode").value.trim().toUpperCase(), name = $("cName").value.trim(), rs = $("cRvu").value.trim(), r = Number(rs);
      if (!code || !name || rs === "" || !Number.isFinite(r) || r < 0) { $("cErr").textContent = "Enter a code, a name, and a wRVU of 0 or more."; return; }
      S.customs = S.customs.filter(function (c) { return c.code !== code; }).concat([{ code: code, name: name, rvu: r }]);
      if (S.favs.indexOf(code) < 0) S.favs.push(code);
      rebuildItems(); save(); renderView(); toast("Custom code " + code + " added and pinned", null, null);
    }
  }
  // Keyboard activation for tiles
  $("view").addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches("[data-tile]")) { e.preventDefault(); e.target.click(); }
  });

  // ---------- Theme ----------
  function applyTheme() {
    var t = S.settings.theme;
    if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");
  }

  // ---------- Day rollover ----------
  var lastToday = today();
  setInterval(function () {
    var t = today();
    if (t !== lastToday) { if (U.date === lastToday) U.date = t; lastToday = t; renderAll(); }
  }, 60000);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") { var t = today(); if (t !== lastToday) { if (U.date === lastToday) U.date = t; lastToday = t; renderAll(); } }
  });
  window.addEventListener("resize", function () { document.documentElement.style.setProperty("--toph", $("top").offsetHeight + "px"); });

  // ---------- Boot ----------
  loadState().then(function (st) {
    if (st && Array.isArray(st.entries)) {
      S.entries = st.entries;
      if (Array.isArray(st.favs)) S.favs = st.favs;
      if (Array.isArray(st.customs)) S.customs = st.customs;
      if (st.settings) S.settings = Object.assign(S.settings, st.settings);
      S.lastBackup = st.lastBackup || null;
    }
    applyTheme();
    rebuildItems(); rebuildUsage();
    renderAll();
    window.__wrvuReady = true;
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persisted().then(function (p) {
        if (p) { U.persisted = true; return; }
        return navigator.storage.persist().then(function (g) { U.persisted = g; });
      }).catch(function () { U.persisted = null; }).then(function () { if (U.tab === "settings") renderView(); });
    }
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      var hadController = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.register("./sw.js").then(function (reg) {
        U.swState = "ready for offline use";
        reg.addEventListener("updatefound", function () {
          var nw = reg.installing;
          if (nw) nw.addEventListener("statechange", function () { if (nw.state === "activated" && hadController) toast("App updated", "Reload", function () { location.reload(); }); });
        });
      }).catch(function (err) { U.swState = "offline cache unavailable (" + err.message + ")"; });
    });
  } else { U.swState = "offline cache not supported in this browser"; }
})();
