// =========================================================================
// BDC Engine — toàn bộ logic tra cứu Bảng Đối Chiếu (BDC) thẩm duyệt PCCC.
// Không phụ thuộc DOM. Trả về object thuần JSON-serializable.
// Mục tiêu: có thể move sang backend (Node/Python) sau này mà không đổi UI.
//
// API công khai:
//   BDCEngine.getCatalog()                              → { congTrinh: [...], heThong: [...] }
//   BDCEngine.getCongTrinh()                            → danh sách công trình (A1..A26)
//   BDCEngine.getHeThong()                              → danh sách hệ thống (B1..B16)
//   BDCEngine.findItem(bdcId)                           → metadata + data của 1 BDC
//   BDCEngine.getChecklist(bdcId)                       → checklist data của 1 BDC
//   BDCEngine.isLoaded(bdcId)                           → boolean
//   BDCEngine.allLoaded()                               → mảng id đã có data
//   BDCEngine.countLeafs(section)                       → số mục con của 1 section
//   BDCEngine.countAllLeafs(bdcId)                      → tổng số mục của cả BDC
//   BDCEngine.itemKey(bdcId, si, subi, ii)              → khóa định danh 1 mục
//
//   BDCEngine.loadHosoList()                            → mảng hồ sơ từ localStorage
//   BDCEngine.saveHosoList(arr)
//   BDCEngine.getHoso(id)
//   BDCEngine.upsertHoso(h)
//   BDCEngine.deleteHoso(id)
//   BDCEngine.genHosoId()
//
//   BDCEngine.loadVerdict(hosoId)                       → { 'bdc|si|subi|ii': 'pass'|'kn'|'na' }
//   BDCEngine.saveVerdict(hosoId, v)
//   BDCEngine.loadThietKe(hosoId)
//   BDCEngine.saveThietKe(hosoId, t)
//
//   BDCEngine.hosoProgress(hoso)                        → { total, done }
//   BDCEngine.getTotals(hoso)                           → { total, pass, kn, na, done }
//   BDCEngine.buildHosoGroups(hoso)                     → groups[] cho checklist renderer
//   BDCEngine.buildExportPayload(hoso)                  → payload cho export.py
// =========================================================================
(function () {
  'use strict';

  const INDEX = window.BDC_INDEX || { congTrinh: [], heThong: [] };

  // Map bdcId → { data, ma, ten, icon, file }
  const LOADED = {};
  INDEX.congTrinh.concat(INDEX.heThong).forEach(it => {
    const v = window['BDC_CHECKLIST_' + it.id.toUpperCase()];
    if (v) LOADED[it.id] = { data: v, ma: it.ma, ten: it.ten, icon: it.icon, file: it.file };
  });

  const HOSO_LIST_KEY = 'bdc-hoso-list';

  // ---------- Catalog ----------
  function getCatalog() { return INDEX; }
  function getCongTrinh() { return INDEX.congTrinh; }
  function getHeThong() { return INDEX.heThong; }
  function findItem(bdcId) {
    return INDEX.congTrinh.find(c => c.id === bdcId)
        || INDEX.heThong.find(b => b.id === bdcId)
        || null;
  }
  function getChecklist(bdcId) { return LOADED[bdcId] ? LOADED[bdcId].data : null; }
  function isLoaded(bdcId) { return !!LOADED[bdcId]; }
  function allLoaded() { return Object.keys(LOADED); }

  // ---------- Counting ----------
  function countLeafs(sec) {
    return sec.subs.reduce((n, s) => n + s.items.length, 0);
  }
  function countAllLeafs(bdcId) {
    const data = getChecklist(bdcId);
    if (!data) return 0;
    return data.reduce((n, s) => n + countLeafs(s), 0);
  }
  function itemKey(bdcId, si, subi, ii) { return bdcId + '|' + si + '|' + subi + '|' + ii; }

  // ---------- Hồ sơ storage ----------
  function loadHosoList() { return JSON.parse(localStorage.getItem(HOSO_LIST_KEY) || '[]'); }
  function saveHosoList(arr) { localStorage.setItem(HOSO_LIST_KEY, JSON.stringify(arr)); }
  function getHoso(id) { return loadHosoList().find(h => h.id === id) || null; }
  function upsertHoso(h) {
    const arr = loadHosoList();
    const i = arr.findIndex(x => x.id === h.id);
    if (i >= 0) arr[i] = h; else arr.unshift(h);
    saveHosoList(arr);
  }
  function deleteHoso(id) {
    saveHosoList(loadHosoList().filter(h => h.id !== id));
    localStorage.removeItem('hoso-' + id + '-verdict');
    localStorage.removeItem('hoso-' + id + '-thietke');
  }
  function genHosoId() {
    return 'h' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
  }

  // ---------- Verdict / Thiết kế storage ----------
  function loadVerdict(hosoId) { return JSON.parse(localStorage.getItem('hoso-' + hosoId + '-verdict') || '{}'); }
  function saveVerdict(hosoId, v) { localStorage.setItem('hoso-' + hosoId + '-verdict', JSON.stringify(v)); }
  function loadThietKe(hosoId) { return JSON.parse(localStorage.getItem('hoso-' + hosoId + '-thietke') || '{}'); }
  function saveThietKe(hosoId, t) { localStorage.setItem('hoso-' + hosoId + '-thietke', JSON.stringify(t)); }

  // ---------- Progress / Stats ----------
  function bdcIdsOf(hoso) {
    const ids = [];
    if (hoso.maCongTrinhFull) ids.push(hoso.maCongTrinhFull);
    return ids.concat(hoso.heThongIds || []);
  }

  function hosoProgress(hoso) {
    const verdict = loadVerdict(hoso.id);
    let total = 0, done = 0;
    bdcIdsOf(hoso).forEach(bid => {
      const data = getChecklist(bid);
      if (!data) return;
      data.forEach((sec, si) => sec.subs.forEach((sub, subi) => sub.items.forEach((_, ii) => {
        total++;
        if (verdict[itemKey(bid, si, subi, ii)]) done++;
      })));
    });
    return { total, done };
  }

  function getTotals(hoso) {
    const verdict = loadVerdict(hoso.id);
    let total = 0, pass = 0, kn = 0, na = 0, done = 0;
    bdcIdsOf(hoso).forEach(bid => {
      const data = getChecklist(bid);
      if (!data) return;
      data.forEach((sec, si) => sec.subs.forEach((sub, subi) => sub.items.forEach((_, ii) => {
        total++;
        const v = verdict[itemKey(bid, si, subi, ii)];
        if (v) done++;
        if (v === 'pass') pass++;
        else if (v === 'kn') kn++;
        else if (v === 'na') na++;
      })));
    });
    return { total, pass, kn, na, done };
  }

  // ---------- Group builder (cho UI checklist renderer) ----------
  function buildHosoGroups(hoso) {
    const groups = [];
    const ct = INDEX.congTrinh.find(c => c.id === hoso.maCongTrinhFull);
    if (ct && LOADED[hoso.maCongTrinhFull]) {
      groups.push({
        label: `📋 PHẦN A — Tổng quan công trình (${ct.ma})`,
        bdcId: hoso.maCongTrinhFull,
        ma: ct.ma,
        sections: LOADED[hoso.maCongTrinhFull].data
      });
    }
    (hoso.heThongIds || []).forEach(htId => {
      const b = INDEX.heThong.find(x => x.id === htId);
      if (b && LOADED[htId]) {
        groups.push({
          label: `⚙️ PHẦN B — ${b.ma} ${b.ten}`,
          bdcId: htId,
          ma: b.ma,
          sections: LOADED[htId].data
        });
      }
    });
    return groups;
  }

  // ---------- Export payload ----------
  function buildExportPayload(hoso) {
    return {
      id: hoso.id,
      ten: hoso.ten,
      maCongTrinhFull: hoso.maCongTrinhFull,
      heThongIds: hoso.heThongIds || [],
      thongTinDuAn: hoso.thongTinDuAn || {},
      verdict: loadVerdict(hoso.id),
      thietKe: loadThietKe(hoso.id),
    };
  }

  // ---------- Export ----------
  window.BDCEngine = {
    getCatalog, getCongTrinh, getHeThong, findItem, getChecklist, isLoaded, allLoaded,
    countLeafs, countAllLeafs, itemKey,
    loadHosoList, saveHosoList, getHoso, upsertHoso, deleteHoso, genHosoId,
    loadVerdict, saveVerdict, loadThietKe, saveThietKe,
    hosoProgress, getTotals, buildHosoGroups, buildExportPayload,
  };
})();
