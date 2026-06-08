// =========================================================================
// QC10 Engine — toàn bộ logic tra cứu QCVN 10:2025/BCA.
// Không phụ thuộc DOM. Trả về object thuần JSON-serializable.
// Mục tiêu: có thể move sang backend (Node/Python) sau này mà không đổi UI.
//
// API công khai:
//   QC10Engine.getModes()                              → mode list
//   QC10Engine.getList(mode)                           → danh sách item của mode
//   QC10Engine.findItem(mode, stt)                     → item theo STT
//   QC10Engine.getFieldDef(key)                        → định nghĩa field
//   QC10Engine.getRequiredFields({mode, stt, subStt})  → mảng key field cần nhập
//   QC10Engine.lookup({mode, stt, subStt, inputs})     → kết quả tra cứu
// =========================================================================
(function () {
  'use strict';

  // ---------- Nguồn dữ liệu ----------
  const DATA_A1 = window.BANG_A1_DATA;
  const DATA_A2 = window.BANG_A2_DATA;
  const DATA_A2_CN = window.BANG_A2_CN_DATA;
  const DATA_A3 = window.BANG_A3_DATA;
  const DATA_A4 = window.BANG_A4_DATA;
  const DATA_B1 = window.BANG_B1_DATA;
  const DATA_C1 = window.BANG_C1_DATA;
  const DATA_D1 = window.BANG_D1_DATA;
  const DATA_E1 = window.BANG_E1_DATA;
  const DATA_F1 = window.BANG_F1_DATA;
  const DATA_G1 = window.BANG_G1_DATA;

  const BUILDINGS = DATA_A1?.buildings || [];
  const FOOTNOTES_A1 = DATA_A1?.footnotes || {};

  // Flatten A.3 rooms
  const ROOMS_A3 = (DATA_A3?.groups || []).flatMap(g =>
    g.rooms.map(r => ({
      stt: r.stt, loaiNha: r.tenGian, shortName: r.shortName || r.tenGian,
      groupName: g.groupName, subTypes: r.subTypes,
      baoChayCriteria: r.baoChayCriteria, chuaChayCriteria: r.chuaChayCriteria,
      footnotes: r.footnotes,
    }))
  );

  // A.2: hạng mục thường + cơ sở chuyên ngành (merged)
  const ITEMS_A2 = [
    ...((DATA_A2?.items || []).map(i => ({
      stt: i.stt, loaiNha: i.tenHangMuc, shortName: i.shortName,
      subTypes: i.subTypes, baoChayCriteria: i.baoChayCriteria, chuaChayCriteria: i.chuaChayCriteria,
      footnotes: i.footnotes,
    }))),
    ...((DATA_A2_CN?.items || []).map(i => ({
      stt: i.stt, loaiNha: i.tenHangMuc, shortName: i.shortName,
      isChuyenNganh: true, chuyenNganhRefs: i.chuyenNganhRefs,
      scaleFields: i.scaleFields || [],
      groupName: 'Cơ sở chuyên ngành',
    }))),
  ];

  const ITEMS_A4 = (DATA_A4?.items || []).map(i => ({
    stt: i.stt, loaiNha: i.tenThietBi, shortName: i.shortName,
    subTypes: i.subTypes, baoChayCriteria: i.baoChayCriteria, chuaChayCriteria: i.chuaChayCriteria,
    footnotes: i.footnotes,
  }));

  const MODES = [
    { key: 'a1', label: 'A.1 — Nhà',        searchLabel: 'Loại công trình',     placeholder: 'Gõ để tìm... (vd: chung cư, văn phòng)', tableName: 'Bảng A.1', list: BUILDINGS, footnotes: FOOTNOTES_A1 },
    { key: 'a2', label: 'A.2 — Hạng mục',   searchLabel: 'Hạng mục / khu vực',  placeholder: 'Gõ để tìm... (vd: cáp, băng tải, KCN)', tableName: 'Bảng A.2', list: ITEMS_A2, footnotes: DATA_A2?.footnotes || {} },
    { key: 'a3', label: 'A.3 — Gian phòng', searchLabel: 'Loại gian phòng',     placeholder: 'Gõ để tìm... (vd: kho hạng A, sản xuất)', tableName: 'Bảng A.3', list: ROOMS_A3, footnotes: DATA_A3?.footnotes || {} },
    { key: 'a4', label: 'A.4 — Thiết bị',   searchLabel: 'Thiết bị',            placeholder: 'Gõ để tìm... (vd: máy biến áp, buồng sơn)', tableName: 'Bảng A.4', list: ITEMS_A4, footnotes: DATA_A4?.footnotes || {} },
  ];
  const MODE_BY_KEY = Object.fromEntries(MODES.map(m => [m.key, m]));

  // ---------- Field definitions (metadata cho UI render input) ----------
  const FIELDS = {
    soTang:         { label: 'Số tầng', unit: 'tầng', hint: 'Bao gồm tầng kỹ thuật, tầng tum, tầng bán/nửa hầm. Không bao gồm tầng áp mái.' },
    tongDTS:        { label: 'Tổng diện tích sàn', unit: 'm²', hint: 'Tổng DTS toàn bộ công trình.' },
    chieuCaoPCCC:   { label: 'Chiều cao PCCC', unit: 'm', hint: 'Xác định theo QCVN 06:/BXD.' },
    soChau:         { label: 'Số cháu', unit: 'cháu', hint: 'Áp dụng cho nhà trẻ/mẫu giáo/mầm non.' },
    soCho:          { label: 'Số chỗ ngồi', unit: 'chỗ', hint: 'Áp dụng cho khán đài, hội trường, rạp.' },
    soOto:          { label: 'Số ô tô / tầng', unit: 'xe', hint: 'Áp dụng cho gara cơ khí.' },
    chieuDai:       { label: 'Chiều dài (hầm)', unit: 'm', hint: 'Hầm đường bộ.' },
    soNguoiTang:    { label: 'Số người / tầng', unit: 'người', hint: 'Sức chứa tối đa trên 1 tầng.' },
    soTangHam:      { label: 'Số tầng hầm', unit: 'tầng', hint: 'Số tầng dưới mặt đất.' },
    congSuat:       { label: 'Công suất MBA', unit: 'MVA', hint: 'Áp dụng cho máy biến áp.' },
    dienAp:         { label: 'Điện áp', unit: 'kV', hint: 'Cấp điện áp máy biến áp.' },
    soSoi:          { label: 'Số sợi cáp', unit: 'sợi', hint: 'Áp dụng cho hầm/mương cáp.' },
    dienTichHa:     { label: 'Tổng diện tích', unit: 'ha', hint: 'Tổng diện tích khu / cụm công nghiệp.' },
    dungTichM3:     { label: 'Tổng dung tích', unit: 'm³', hint: 'Dung tích chứa (kho dầu, LNG…).' },
    congSuatMW:     { label: 'Tổng công suất', unit: 'MW', hint: 'Công suất nhà máy nhiệt điện / thủy điện.' },
    congSuatM3Khi:  { label: 'Công suất khí', unit: 'triệu m³/ngđ', hint: 'Triệu m³ khí/ngày đêm (cơ sở chế biến khí).' },
    congSuatM2Year: { label: 'Công suất dệt', unit: 'triệu m²/năm', hint: 'Triệu m²/năm (nhà máy dệt).' },
    capCongTrinh:   { label: 'Cấp công trình', unit: '', hint: 'Bến cảng biển — Cấp đặc biệt / I / II / III.', type: 'select', options: [
      { value: '',   label: '— chưa chọn —' },
      { value: 'db', label: 'Cấp đặc biệt' },
      { value: '1',  label: 'Cấp I' },
      { value: '2',  label: 'Cấp II' },
      { value: '3',  label: 'Cấp III' },
    ]},
  };

  // Map criteria.type → input field key
  const CRITERIA_INPUT = {
    tangTroLen: 'soTang',
    tangHonTriet: 'soTang',
    dtsTroLen: 'tongDTS',
    chieuCaoPCCC: 'chieuCaoPCCC',
    soChauTroLen: 'soChau',
    khanDaiTroLen: 'soCho',
    choTroLen: 'soCho',
    oToTroLen: 'soOto',
    chieuDaiTroLen: 'chieuDai',
    soNguoiTangTroLen: 'soNguoiTang',
    soTangHamTroLen: 'soTangHam',
    congSuatTroLen: 'congSuat',
    dienApTroLen: 'dienAp',
    soSoiTroLen: 'soSoi',
  };

  // ---------- Condition checks ----------
  function fmt(v) { return Number(v || 0).toLocaleString('vi-VN'); }

  function checkCondition(c, input) {
    if (!c) return false;
    switch (c.type) {
      case 'khongPhuThuocDienTich': return true;
      case 'khong': return false;
      case 'tangTroLen':     return input.soTang >= (c.value || 0);
      case 'tangHonTriet':   return input.soTang >  (c.value || 0);
      case 'dtsTroLen':      return input.tongDTS >= (c.value || 0);
      case 'chieuCaoPCCC':   return input.chieuCaoPCCC >= (c.value || 0);
      case 'chieuDaiTroLen': return input.chieuDai >= (c.value || 0);
      case 'soChauTroLen':   return input.soChau >= (c.value || 0);
      case 'khanDaiTroLen':  return input.soCho >= (c.value || 0);
      case 'choTroLen':      return input.soCho >= (c.value || 0);
      case 'oToTroLen':      return input.soOto >= (c.value || 0);
      case 'soNguoiTangTroLen': return input.soNguoiTang >= (c.value || 0);
      case 'soTangHamTroLen':   return input.soTangHam   >= (c.value || 0);
      case 'congSuatTroLen':    return input.congSuat    >= (c.value || 0);
      case 'dienApTroLen':      return input.dienAp      >= (c.value || 0);
      case 'soSoiTroLen':       return input.soSoi       >= (c.value || 0);
      case 'multi': {
        if (!c.conditions || !c.conditions.length) return false;
        const res = c.conditions.map(x => checkCondition(x, input));
        return (c.operator || 'OR').toUpperCase() === 'AND' ? res.every(Boolean) : res.some(Boolean);
      }
      default: return false;
    }
  }

  function condLabel(type) {
    return ({
      tangTroLen: 'Số tầng', tangHonTriet: 'Số tầng', dtsTroLen: 'Tổng DTS', chieuCaoPCCC: 'Chiều cao PCCC',
      soChauTroLen: 'Số cháu', khanDaiTroLen: 'Sức chứa khán đài', choTroLen: 'Số chỗ ngồi',
      oToTroLen: 'Số ô tô/tầng', chieuDaiTroLen: 'Chiều dài',
      soNguoiTangTroLen: 'Số người/tầng', soTangHamTroLen: 'Số tầng hầm',
      congSuatTroLen: 'Công suất', dienApTroLen: 'Điện áp', soSoiTroLen: 'Số sợi cáp',
    })[type] || type;
  }

  function buildDescription(c) {
    if (!c) return '';
    if (c.description) return c.description;
    if (c.type === 'multi' && c.conditions) {
      const parts = c.conditions.map(x => x.description || buildDescription(x));
      const op = (c.operator || 'OR').toUpperCase() === 'AND' ? ' VÀ ' : ' HOẶC ';
      return parts.join(op);
    }
    return ({
      khongPhuThuocDienTich: 'Không phụ thuộc vào diện tích',
      khong: 'Không áp dụng',
      tangTroLen: `Từ ${c.value} tầng trở lên`,
      dtsTroLen: `Tổng DTS từ ${fmt(c.value)} m² trở lên`,
      chieuCaoPCCC: `Chiều cao PCCC từ ${c.value} m trở lên`,
      soChauTroLen: `Từ ${c.value} cháu trở lên`,
      khanDaiTroLen: `Có khán đài từ ${c.value} chỗ trở lên`,
      choTroLen: `Từ ${c.value} chỗ trở lên`,
      oToTroLen: `Từ ${c.value} ô tô/tầng trở lên`,
      chieuDaiTroLen: `Chiều dài từ ${fmt(c.value)} m trở lên`,
      tangHonTriet: `Cao trên ${c.value} tầng`,
      soNguoiTangTroLen: `Từ ${c.value} người/tầng trở lên`,
      soTangHamTroLen: `Có từ ${c.value} tầng hầm trở lên`,
      congSuatTroLen: `Công suất từ ${c.value} MVA trở lên`,
      dienApTroLen: `Điện áp từ ${c.value} kV trở lên`,
      soSoiTroLen: `Từ ${c.value} sợi cáp trở lên`,
    })[c.type] || '';
  }

  function buildExplanation(c, input, batBuoc) {
    if (!c) return batBuoc ? 'Đủ điều kiện bắt buộc theo quy chuẩn.' : 'Chưa đủ điều kiện bắt buộc.';
    switch (c.type) {
      case 'khongPhuThuocDienTich':
        return 'Loại nhà này bắt buộc trang bị, không phụ thuộc vào quy mô.';
      case 'khong':
        return 'Quy chuẩn không yêu cầu trang bị (dấu "-" trong bảng).';
      case 'tangTroLen':
        return batBuoc
          ? `Công trình có ${input.soTang} tầng ≥ ngưỡng ${c.value} tầng → đủ điều kiện bắt buộc.`
          : `Công trình có ${input.soTang} tầng < ngưỡng ${c.value} tầng → chưa đủ điều kiện.`;
      case 'tangHonTriet':
        return batBuoc
          ? `Công trình có ${input.soTang} tầng > ngưỡng ${c.value} tầng → đủ điều kiện bắt buộc.`
          : `Công trình có ${input.soTang} tầng ≤ ngưỡng ${c.value} tầng → chưa đủ điều kiện.`;
      case 'soNguoiTangTroLen':
        return batBuoc
          ? `Sức chứa ${input.soNguoiTang} người/tầng ≥ ngưỡng ${c.value} → đủ điều kiện.`
          : `Sức chứa ${input.soNguoiTang} người/tầng < ngưỡng ${c.value} → chưa đủ điều kiện.`;
      case 'soTangHamTroLen':
        return batBuoc
          ? `Có ${input.soTangHam} tầng hầm ≥ ngưỡng ${c.value} → đủ điều kiện.`
          : `Có ${input.soTangHam} tầng hầm < ngưỡng ${c.value} → chưa đủ điều kiện.`;
      case 'congSuatTroLen':
        return batBuoc
          ? `Công suất ${input.congSuat} MVA ≥ ngưỡng ${c.value} MVA → đủ điều kiện.`
          : `Công suất ${input.congSuat} MVA < ngưỡng ${c.value} MVA → chưa đủ điều kiện.`;
      case 'dienApTroLen':
        return batBuoc
          ? `Điện áp ${input.dienAp} kV ≥ ngưỡng ${c.value} kV → đủ điều kiện.`
          : `Điện áp ${input.dienAp} kV < ngưỡng ${c.value} kV → chưa đủ điều kiện.`;
      case 'soSoiTroLen':
        return batBuoc
          ? `Có ${input.soSoi} sợi cáp ≥ ngưỡng ${c.value} → đủ điều kiện.`
          : `Có ${input.soSoi} sợi cáp < ngưỡng ${c.value} → chưa đủ điều kiện.`;
      case 'dtsTroLen':
        return batBuoc
          ? `Tổng DTS ${fmt(input.tongDTS)} m² ≥ ngưỡng ${fmt(c.value)} m² → đủ điều kiện bắt buộc.`
          : `Tổng DTS ${fmt(input.tongDTS)} m² < ngưỡng ${fmt(c.value)} m² → chưa đủ điều kiện.`;
      case 'chieuCaoPCCC':
        return batBuoc
          ? `Chiều cao PCCC ${input.chieuCaoPCCC} m ≥ ngưỡng ${c.value} m → đủ điều kiện bắt buộc.`
          : `Chiều cao PCCC ${input.chieuCaoPCCC} m < ngưỡng ${c.value} m → chưa đủ điều kiện.`;
      case 'soChauTroLen':
        return batBuoc
          ? `Số cháu ${input.soChau} ≥ ngưỡng ${c.value} → đủ điều kiện bắt buộc.`
          : `Số cháu ${input.soChau} < ngưỡng ${c.value} → chưa đủ điều kiện.`;
      case 'khanDaiTroLen':
      case 'choTroLen':
        return batBuoc
          ? `Sức chứa ${input.soCho} chỗ ≥ ngưỡng ${c.value} chỗ → đủ điều kiện bắt buộc.`
          : `Sức chứa ${input.soCho} chỗ < ngưỡng ${c.value} chỗ → chưa đủ điều kiện.`;
      case 'oToTroLen':
        return batBuoc
          ? `${input.soOto} ô tô/tầng ≥ ngưỡng ${c.value} → đủ điều kiện bắt buộc.`
          : `${input.soOto} ô tô/tầng < ngưỡng ${c.value} → chưa đủ điều kiện.`;
      case 'chieuDaiTroLen':
        return batBuoc
          ? `Chiều dài ${fmt(input.chieuDai)} m ≥ ngưỡng ${fmt(c.value)} m → đủ điều kiện bắt buộc.`
          : `Chiều dài ${fmt(input.chieuDai)} m < ngưỡng ${fmt(c.value)} m → chưa đủ điều kiện.`;
      case 'multi':
        return buildMultiExplanation(c, input, batBuoc);
      default:
        return batBuoc ? 'Đủ điều kiện bắt buộc theo quy chuẩn.' : 'Chưa đủ điều kiện bắt buộc.';
    }
  }

  function buildMultiExplanation(c, input, batBuoc) {
    if (!c.conditions || !c.conditions.length) return '';
    const isOR = (c.operator || 'OR').toUpperCase() !== 'AND';
    const ACTUAL = {
      tangTroLen: i => `${i.soTang} tầng`, tangHonTriet: i => `${i.soTang} tầng`,
      dtsTroLen: i => `${fmt(i.tongDTS)} m²`, chieuCaoPCCC: i => `${i.chieuCaoPCCC} m`,
      soChauTroLen: i => `${i.soChau} cháu`, khanDaiTroLen: i => `${i.soCho} chỗ`,
      choTroLen: i => `${i.soCho} chỗ`, oToTroLen: i => `${i.soOto} ô tô/tầng`,
      chieuDaiTroLen: i => `${fmt(i.chieuDai)} m`,
      soNguoiTangTroLen: i => `${i.soNguoiTang} người/tầng`,
      soTangHamTroLen: i => `${i.soTangHam} tầng hầm`,
      congSuatTroLen: i => `${i.congSuat} MVA`,
      dienApTroLen: i => `${i.dienAp} kV`, soSoiTroLen: i => `${i.soSoi} sợi`,
    };
    const THRESHOLD = {
      tangTroLen: v => `${v} tầng`, tangHonTriet: v => `${v} tầng`,
      dtsTroLen: v => `${fmt(v)} m²`, chieuCaoPCCC: v => `${v} m`,
      soChauTroLen: v => `${v} cháu`, khanDaiTroLen: v => `${v} chỗ`,
      choTroLen: v => `${v} chỗ`, oToTroLen: v => `${v} ô tô/tầng`,
      chieuDaiTroLen: v => `${fmt(v)} m`, soNguoiTangTroLen: v => `${v} người/tầng`,
      soTangHamTroLen: v => `${v} tầng hầm`, congSuatTroLen: v => `${v} MVA`,
      dienApTroLen: v => `${v} kV`, soSoiTroLen: v => `${v} sợi`,
    };
    const lines = c.conditions.map(cond => {
      if (cond.type === 'khongPhuThuocDienTich') return '• Bắt buộc không phụ thuộc → ✓ thỏa';
      const met = checkCondition(cond, input);
      const a = (ACTUAL[cond.type] || (() => '—'))(input);
      const t = (THRESHOLD[cond.type] || (() => '—'))(cond.value);
      const sym = cond.type === 'tangHonTriet' ? (met ? '>' : '≤') : (met ? '≥' : '<');
      return `• ${condLabel(cond.type)}: ${a} ${sym} ngưỡng ${t} → ${met ? '✓ thỏa' : '✗ chưa thỏa'}`;
    });
    const op = isOR ? 'HOẶC' : 'VÀ';
    let kl;
    if (batBuoc) kl = isOR ? 'Ít nhất 1 điều kiện thỏa (phép OR) → bắt buộc trang bị.' : 'Tất cả điều kiện đều thỏa (phép AND) → bắt buộc trang bị.';
    else         kl = isOR ? 'Không thỏa điều kiện nào (phép OR) → chưa đủ điều kiện.' : 'Chưa thỏa đầy đủ tất cả (phép AND) → chưa đủ điều kiện.';
    return `Kiểm tra ${c.conditions.length} điều kiện (toán tử ${op}):\n${lines.join('\n')}\n${kl}`;
  }

  // ---------- Matching for B.1/C.1/D.1/E.1/F.1/G.1 (apA1Stt lookup) ----------
  function findEntryForBuilding(data, b, sub) {
    if (!data || !data.entries) return null;
    for (const e of data.entries) {
      const stts = e.apA1Stt || [];
      if (!stts.includes(b.stt)) continue;
      if (e.subTypes && sub) {
        const matched = e.subTypes.find(st => (st.apA1SubStt || []).includes(sub.subStt));
        if (matched) return { entry: e, sub: matched, criteria: matched.criteria, description: matched.description };
      }
      if (!e.subTypes) return { entry: e, sub: null, criteria: e.criteria };
    }
    return null;
  }

  // ---------- Tier matching for chuyên ngành refs ----------
  function refMatches(ref, input) {
    if (!ref.field) return true;
    const v = input[ref.field];
    if (v == null || v === '' || v === 0) return true; // chưa nhập → hiện hết các tier
    if (ref.gt  != null && !(v >  ref.gt))  return false;
    if (ref.gte != null && !(v >= ref.gte)) return false;
    if (ref.lt  != null && !(v <  ref.lt))  return false;
    if (ref.lte != null && !(v <= ref.lte)) return false;
    if (ref.eq  != null && v !== ref.eq)    return false;
    if (ref.in  != null && !ref.in.includes(v)) return false;
    return true;
  }

  // ---------- Required input fields ----------
  function getRelevantInputs(b, sub) {
    const set = new Set();
    if (!b) return set;

    if (b.isChuyenNganh) {
      (b.scaleFields || []).forEach(f => set.add(f));
      return set;
    }

    function collect(c) {
      if (!c) return;
      if (c.type === 'multi') { (c.conditions || []).forEach(collect); return; }
      const f = CRITERIA_INPUT[c.type];
      if (f) set.add(f);
    }

    if (sub) {
      collect(sub.baoChayCriteria);
      collect(sub.chuaChayCriteria);
    } else if (b.subTypes && b.subTypes.length) {
      b.subTypes.forEach(st => { collect(st.baoChayCriteria); collect(st.chuaChayCriteria); });
    } else {
      collect(b.baoChayCriteria);
      collect(b.chuaChayCriteria);
    }

    // For A.1 mode, also gather inputs needed by B.1/C.1/D.1/E.1/F.1/G.1
    const auxTables = [DATA_B1, DATA_C1, DATA_D1, DATA_E1, DATA_F1, DATA_G1];
    for (const data of auxTables) {
      if (!data) continue;
      const m = findEntryForBuilding(data, b, sub);
      if (m) { collect(m.criteria); continue; }
      data.entries.forEach(e => {
        if (!(e.apA1Stt || []).includes(b.stt)) return;
        if (e.subTypes) e.subTypes.forEach(st => collect(st.criteria));
        else collect(e.criteria);
      });
    }

    return set;
  }

  // ---------- Evaluators ----------
  function evaluateCriteria(c, input, tenHT) {
    if (!c) return { name: tenHT, status: 'khongApDung', threshold: 'Không có dữ liệu', explanation: 'Không có quy định cho loại nhà này.', note: '' };
    const batBuoc = checkCondition(c, input);
    if (batBuoc) {
      return {
        name: tenHT, status: 'batbuoc',
        threshold: c.description || buildDescription(c),
        explanation: buildExplanation(c, input, true),
        note: ''
      };
    }
    if (c.allowIndependent && tenHT.includes('Báo cháy')) {
      return {
        name: tenHT, status: 'choPhep',
        threshold: c.independentNote || 'Cho phép trang bị thiết bị báo cháy độc lập',
        explanation: buildExplanation(c, input, false) + '\n→ Tuy nhiên, được phép thay thế bằng thiết bị báo cháy độc lập.',
        note: c.independentCondition || ''
      };
    }
    return {
      name: tenHT,
      status: c.type === 'khong' ? 'khongApDung' : 'khongBatBuoc',
      threshold: c.type === 'khong' ? 'Không áp dụng' : buildDescription(c),
      explanation: buildExplanation(c, input, false),
      note: ''
    };
  }

  function evaluateFromTable(input, data, tenHT, refTable) {
    const item = { name: tenHT, sourceTable: refTable, status: 'khongApDung', threshold: '', explanation: '', note: '' };
    const b = input.building;
    if (!b || !data) return item;

    const match = findEntryForBuilding(data, b, input.subType);
    if (!match) {
      item.status = 'khongBatBuoc';
      item.threshold = `Không nằm trong ${refTable}`;
      item.explanation = `Loại nhà này không có quy định trang bị trong ${refTable} QCVN 10:2025/BCA.`;
      return item;
    }

    const c = match.criteria;
    const required = checkCondition(c, input);
    item.threshold = (match.sub ? `[${match.entry.stt} → ${match.sub.subStt}] ` : `[${match.entry.stt}] `) + (c.description || buildDescription(c));
    item.explanation = buildExplanation(c, input, required);
    if (match.sub && match.sub.description) item.note = match.sub.description;
    item.status = required ? 'batbuoc' : 'khongBatBuoc';
    if (required && match.entry.quantities) item.quantities = match.entry.quantities;
    if (required) item.quantityDescription = match.entry.quantityDescription || data.quantityDescription || '';
    if (match.entry.footnotes) item.entryFootnotes = match.entry.footnotes;
    return item;
  }

  function evaluateChuyenNganh(b, input) {
    const cards = [];
    const refMap = [
      { key: 'c1', data: DATA_C1, name: 'Cấp nước chữa cháy ngoài nhà',       table: 'C.1' },
      { key: 'd1', data: DATA_D1, name: 'Phương tiện chữa cháy cơ giới',      table: 'D.1' },
      { key: 'e1', data: DATA_E1, name: 'Dụng cụ phá dỡ thô sơ',              table: 'E.1' },
      { key: 'f1', data: DATA_F1, name: 'Mặt nạ lọc độc / phòng độc cách ly', table: 'F.1' },
    ];
    const refs = b.chuyenNganhRefs || {};
    for (const r of refMap) {
      const list = refs[r.key] || [];
      if (!list.length || !r.data) continue;
      list.forEach(ref => {
        if (!refMatches(ref, input)) return;
        const entry = r.data.entries.find(e => e.stt === ref.stt);
        if (!entry) return;
        cards.push({
          name: r.name, sourceTable: r.table, status: 'batbuoc',
          threshold: `[Bảng ${r.table} • STT ${entry.stt}] ${entry.criteria?.description || buildDescription(entry.criteria || {})}`,
          explanation: entry.loaiNha,
          quantities: entry.quantities,
          quantityDescription: entry.quantityDescription || r.data.quantityDescription || '',
          entryFootnotes: entry.footnotes,
        });
      });
    }
    return cards;
  }

  // ---------- Public API ----------
  window.QC10Engine = {
    getModes() { return MODES.map(m => ({ key: m.key, label: m.label, searchLabel: m.searchLabel, placeholder: m.placeholder })); },

    getList(mode) { return MODE_BY_KEY[mode]?.list || []; },

    findItem(mode, stt) { return (MODE_BY_KEY[mode]?.list || []).find(b => b.stt === stt) || null; },

    getFieldDef(key) { return FIELDS[key] || null; },

    getRequiredFields({ mode, stt, subStt }) {
      const item = this.findItem(mode, stt);
      if (!item) return [];
      const sub = subStt && item.subTypes ? item.subTypes.find(s => s.subStt === subStt) : null;
      return Array.from(getRelevantInputs(item, sub));
    },

    lookup({ mode, stt, subStt, inputs }) {
      const item = this.findItem(mode, stt);
      if (!item) return null;
      const sub = subStt && item.subTypes ? item.subTypes.find(s => s.subStt === subStt) : null;
      const cfg = MODE_BY_KEY[mode];
      inputs = inputs || {};

      // Branch: cơ sở chuyên ngành (không dùng báo/chữa cháy A.x)
      if (item.isChuyenNganh) {
        const cards = evaluateChuyenNganh(item, inputs);
        const fnSet = new Set();
        cards.forEach(c => (c.entryFootnotes || []).forEach(k => fnSet.add(k)));
        const fnAll = {
          ...(DATA_C1?.footnotes || {}), ...(DATA_D1?.footnotes || {}),
          ...(DATA_E1?.footnotes || {}), ...(DATA_F1?.footnotes || {}),
        };
        return {
          mode, sttRef: item.stt,
          sourceTable: 'Cơ sở chuyên ngành (C.1/D.1/E.1/F.1)',
          itemName: item.loaiNha, itemShortName: item.shortName,
          cards,
          footnotes: Array.from(fnSet).map(k => ({ key: k, text: fnAll[k] || '' })).filter(x => x.text),
        };
      }

      // Branch: bảng A.x
      const input = { ...inputs, building: item, subType: sub };
      const baoChayCriteria  = sub?.baoChayCriteria  || item.baoChayCriteria;
      const chuaChayCriteria = sub?.chuaChayCriteria || item.chuaChayCriteria;
      const footnoteKeys = sub?.footnotes || item.footnotes || [];
      const sttRef = sub?.subStt || item.stt;

      const cards = [
        evaluateCriteria(baoChayCriteria,  input, 'Báo cháy tự động'),
        evaluateCriteria(chuaChayCriteria, input, 'Chữa cháy tự động'),
      ];
      if (mode === 'a1') {
        cards.push(evaluateFromTable(input, DATA_B1, 'Họng nước chữa cháy trong nhà',       'Bảng B.1'));
        cards.push(evaluateFromTable(input, DATA_C1, 'Cấp nước chữa cháy ngoài nhà',        'Bảng C.1'));
        cards.push(evaluateFromTable(input, DATA_D1, 'Phương tiện chữa cháy cơ giới',       'Bảng D.1'));
        cards.push(evaluateFromTable(input, DATA_E1, 'Dụng cụ phá dỡ thô sơ',               'Bảng E.1'));
        cards.push(evaluateFromTable(input, DATA_F1, 'Mặt nạ lọc độc / phòng độc cách ly',  'Bảng F.1'));
        cards.push(evaluateFromTable(input, DATA_G1, 'Hệ thống loa thông báo',              'Bảng G.1'));
      }

      return {
        mode, sttRef,
        sourceTable: cfg.tableName,
        itemName: item.loaiNha, itemShortName: item.shortName,
        cards,
        footnotes: footnoteKeys.map(k => ({ key: k, text: cfg.footnotes[k] || '' })).filter(x => x.text),
      };
    },
  };
})();
