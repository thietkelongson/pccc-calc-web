// =========================================================================
// TCVN 7336:2021 — Engine tra cứu thông số tối thiểu
// Port từ DuLieuChuaChay.cs (VPT_PCCC) + bổ sung tra Bảng 2 / Bảng 3 chi tiết
// =========================================================================
(function () {
  'use strict';

  // Bảng 1 (phòng ≤ 10 m) — Nhóm 1, 2, 3, 4.1, 4.2
  const BANG1_KHO = {
    '1':   { i_nuoc: 0.08, i_bot: null, q_nuoc: 10,  q_bot: null,S: 60,  T: 30, L: 4 },
    '2':   { i_nuoc: 0.12, i_bot: 0.08, q_nuoc: 30,  q_bot: 20,  S: 120, T: 60, L: 4 },
    '3':   { i_nuoc: 0.24, i_bot: 0.12, q_nuoc: 60,  q_bot: 30,  S: 120, T: 60, L: 4 },
    '4.1': { i_nuoc: 0.30, i_bot: 0.15, q_nuoc: 110, q_bot: 55,  S: 180, T: 60, L: 4 },
    '4.2': { i_nuoc: null, i_bot: 0.17, q_nuoc: null,q_bot: 65,  S: 180, T: 60, L: 3 }
  };

  // Bảng 2 — Kho Nhóm 5, 6, 7 theo chiều cao xếp hàng
  // Trả về theo dải [h_min, h_max]
  const BANG2 = [
    { hMax: 1.0, n5: { i_n: 0.08, i_b: 0.04, q_n: 15,   q_b: 7.5  }, n6: { i_n: 0.16, i_b: 0.08, q_n: 30, q_b: 15 }, n7: { i_n: null, i_b: 0.1, q_n: null, q_b: 18 } },
    { hMax: 2.0, n5: { i_n: 0.16, i_b: 0.08, q_n: 30,   q_b: 15   }, n6: { i_n: 0.32, i_b: 0.20, q_n: 60, q_b: 36 }, n7: { i_n: null, i_b: 0.2, q_n: null, q_b: 36 } },
    { hMax: 3.0, n5: { i_n: 0.24, i_b: 0.12, q_n: 45,   q_b: 22.5 }, n6: { i_n: 0.40, i_b: 0.24, q_n: 75, q_b: 45 }, n7: { i_n: null, i_b: 0.3, q_n: null, q_b: 54 } },
    { hMax: 4.0, n5: { i_n: 0.32, i_b: 0.16, q_n: 60,   q_b: 30   }, n6: { i_n: 0.40, i_b: 0.32, q_n: 75, q_b: 60 }, n7: { i_n: null, i_b: 0.4, q_n: null, q_b: 75 } },
    { hMax: 5.5, n5: { i_n: 0.40, i_b: 0.32, q_n: 75,   q_b: 37.5 }, n6: { i_n: 0.50, i_b: 0.40, q_n: 90, q_b: 75 }, n7: { i_n: null, i_b: 0.4, q_n: null, q_b: 75 } }
  ];

  // Bảng 3 — Phòng cao 10–20 m, Nhóm 1, 2, 3, 4.1, 4.2
  const BANG3 = [
    { hMax: 12, n1:{i:0.09,q:12,S:66}, n2:{i_n:0.13,i_b:0.09,q_n:35,q_b:25,S:132}, n3:{i_n:0.26,i_b:0.13,q_n:70,q_b:35,S:132}, n41:{i_n:0.33,i_b:0.17,q_n:130,q_b:65,S:198}, n42:{i_b:0.20,q_b:95,S:238}  },
    { hMax: 14, n1:{i:0.10,q:14,S:72}, n2:{i_n:0.14,i_b:0.10,q_n:40,q_b:30,S:144}, n3:{i_n:0.29,i_b:0.14,q_n:85,q_b:45,S:144}, n41:{i_n:0.36,i_b:0.18,q_n:155,q_b:80,S:216}, n42:{i_b:0.22,q_b:115,S:259} },
    { hMax: 16, n1:{i:0.11,q:17,S:78}, n2:{i_n:0.16,i_b:0.11,q_n:50,q_b:35,S:156}, n3:{i_n:0.31,i_b:0.16,q_n:95,q_b:50,S:156}, n41:{i_n:0.39,i_b:0.20,q_n:180,q_b:90,S:230}, n42:{i_b:0.25,q_b:140,S:276} },
    { hMax: 18, n1:{i:0.12,q:20,S:84}, n2:{i_n:0.17,i_b:0.12,q_n:57,q_b:40,S:168}, n3:{i_n:0.34,i_b:0.17,q_n:115,q_b:60,S:168}, n41:{i_n:0.42,i_b:0.21,q_n:215,q_b:105,S:252},n42:{i_b:0.27,q_b:165,S:303} },
    { hMax: 20, n1:{i:0.13,q:24,S:90}, n2:{i_n:0.18,i_b:0.13,q_n:65,q_b:50,S:180}, n3:{i_n:0.36,i_b:0.18,q_n:130,q_b:65,S:180}, n41:{i_n:0.45,i_b:0.23,q_n:240,q_b:120,S:270},n42:{i_b:0.30,q_b:195,S:325} }
  ];

  function pickBracket(table, h) {
    for (const row of table) if (h <= row.hMax) return row;
    return null;
  }

  function describeBracket(table, h, getStart) {
    for (let i = 0; i < table.length; i++) {
      const r = table[i];
      if (h <= r.hMax) {
        const prev = i === 0 ? (getStart || 0) : table[i - 1].hMax;
        const label = i === 0 ? `Đến ${r.hMax} m` : `Trên ${prev} đến ${r.hMax} m`;
        return { label, prev, max: r.hMax };
      }
    }
    return null;
  }

  /**
   * Tra cứu thông số tối thiểu theo TCVN 7336:2021
   * @param {Object} input
   *   nhom: '1' | '2' | '3' | '4.1' | '4.2' | '5' | '6' | '7'
   *   chieuCaoPhong: number (m) — chiều cao phòng tính toán
   *   chieuCaoKho: number (m, optional) — chiều cao xếp hàng cho Nhóm 5/6/7
   *   dienTichThucTe: number (m², optional) — diện tích bảo vệ thực tế (để giảm Q theo K)
   * @returns {Object} kết quả + meta diễn giải
   */
  function traCuu(input) {
    const { nhom, chieuCaoPhong, chieuCaoKho, dienTichThucTe } = input;
    const out = {
      nhom,
      chieuCaoPhong,
      chieuCaoKho,
      dienTichThucTe,
      bang: null,            // 'B1' | 'B2' | 'B3' | 'B2+CT3'
      braket: null,
      cuongDoNuoc: null,
      cuongDoBot: null,
      luuLuongNuoc: null,
      luuLuongBot: null,
      dienTichTinhToan: null,
      thoiGianPhun: null,
      khoangCach: null,
      heSoK: 1,
      heSoTang: 1,
      luuLuongNuocThucTe: null,
      luuLuongBotThucTe: null,
      canhBao: [],
      ghiChu: []
    };

    if (!nhom) { out.canhBao.push('Chưa chọn nhóm nguy cơ.'); return out; }
    if (!(chieuCaoPhong > 0)) { out.canhBao.push('Chiều cao phòng phải > 0.'); return out; }
    if (chieuCaoPhong > 20) { out.canhBao.push('Chiều cao phòng > 20 m không thuộc phạm vi áp dụng TCVN 7336 — cần thiết kế đặc biệt.'); return out; }

    const needKho = (nhom === '5' || nhom === '6' || nhom === '7');
    if (needKho && !(chieuCaoKho > 0)) { out.canhBao.push('Nhóm 5/6/7 cần nhập chiều cao xếp hàng hóa.'); return out; }
    if (needKho && chieuCaoKho > 5.5) { out.canhBao.push('Chiều cao xếp hàng > 5,5 m — yêu cầu thử nghiệm thiết kế đặc biệt (Bảng 2, CT5).'); return out; }

    // ----- Nhóm 1, 2, 3, 4.1, 4.2 -----
    if (!needKho) {
      if (chieuCaoPhong <= 10.0) {
        const r = BANG1_KHO[nhom];
        out.bang = 'B1';
        out.braket = 'Phòng ≤ 10 m';
        out.cuongDoNuoc = r.i_nuoc;
        out.cuongDoBot  = r.i_bot;
        out.luuLuongNuoc = r.q_nuoc;
        out.luuLuongBot  = r.q_bot;
        out.dienTichTinhToan = r.S;
        out.thoiGianPhun = r.T;
        out.khoangCach = r.L;
        out.ghiChu.push('Tra Bảng 1 — phòng cao ≤ 10 m.');
      } else {
        // 10 < h ≤ 20 → Bảng 3
        const br = describeBracket(BANG3, chieuCaoPhong, 10);
        const row = pickBracket(BANG3, chieuCaoPhong);
        out.bang = 'B3';
        out.braket = br ? br.label : '';

        const map = { '1': 'n1', '2': 'n2', '3': 'n3', '4.1': 'n41', '4.2': 'n42' };
        const key = map[nhom];
        const cell = row[key];
        if (key === 'n1') {
          out.cuongDoNuoc = cell.i;
          out.luuLuongNuoc = cell.q;
        } else if (key === 'n42') {
          out.cuongDoBot = cell.i_b;
          out.luuLuongBot = cell.q_b;
        } else {
          out.cuongDoNuoc = cell.i_n;
          out.cuongDoBot  = cell.i_b;
          out.luuLuongNuoc = cell.q_n;
          out.luuLuongBot  = cell.q_b;
        }
        out.dienTichTinhToan = cell.S;
        out.thoiGianPhun = (nhom === '1') ? 30 : 60;
        out.khoangCach = (nhom === '4.2') ? 3 : 4;
        out.ghiChu.push(`Tra Bảng 3 — phòng cao ${br.label.toLowerCase()}.`);
      }
    }
    // ----- Nhóm 5, 6, 7 (kho) -----
    else {
      const br = describeBracket(BANG2, chieuCaoKho, 0);
      const row = pickBracket(BANG2, chieuCaoKho);
      const map = { '5': 'n5', '6': 'n6', '7': 'n7' };
      const cell = row[map[nhom]];

      out.bang = 'B2';
      out.braket = br ? br.label : '';
      out.cuongDoNuoc = cell.i_n;
      out.cuongDoBot  = cell.i_b;
      out.luuLuongNuoc = cell.q_n;
      out.luuLuongBot  = cell.q_b;
      out.dienTichTinhToan = 90;
      out.thoiGianPhun = (nhom === '7') ? 25 : 60;
      out.khoangCach = 3;
      out.ghiChu.push(`Tra Bảng 2 — kho Nhóm ${nhom}, chiều cao xếp hàng ${br.label.toLowerCase()}.`);

      // CHÚ THÍCH 3 Bảng 2: phòng > 10 m → tăng 10% cho mỗi 2 m chiều cao tăng thêm
      if (chieuCaoPhong > 10.0) {
        let tang = 1.0;
        if (chieuCaoPhong <= 12.0) tang = 1.1;
        else if (chieuCaoPhong <= 14.0) tang = 1.2;
        else if (chieuCaoPhong <= 16.0) tang = 1.3;
        else if (chieuCaoPhong <= 18.0) tang = 1.4;
        else tang = 1.5;
        out.heSoTang = tang;
        out.bang = 'B2+CT3';
        if (out.cuongDoNuoc != null) out.cuongDoNuoc = round3(out.cuongDoNuoc * tang);
        if (out.cuongDoBot  != null) out.cuongDoBot  = round3(out.cuongDoBot  * tang);
        if (out.luuLuongNuoc != null) out.luuLuongNuoc = round1(out.luuLuongNuoc * tang);
        if (out.luuLuongBot  != null) out.luuLuongBot  = round1(out.luuLuongBot  * tang);
        out.ghiChu.push(`Áp CT3 Bảng 2: phòng cao ${chieuCaoPhong} m > 10 m → tăng ${Math.round((tang - 1) * 100)}% (cộng 10% cho mỗi 2 m chiều cao phòng tăng thêm).`);
      }

      if (nhom === '7') {
        out.ghiChu.push('Nhóm 7 (kho chất lỏng cháy) — thường dùng hệ thống bọt; thời gian phun 25 phút (CT1 Bảng 1).');
      }
    }

    // ----- Hệ số K theo Stt -----
    if (dienTichThucTe > 0 && out.dienTichTinhToan > 0) {
      if (dienTichThucTe < out.dienTichTinhToan) {
        const K = dienTichThucTe / out.dienTichTinhToan;
        out.heSoK = round3(K);
        if (out.luuLuongNuoc != null) out.luuLuongNuocThucTe = round1(out.luuLuongNuoc * K);
        if (out.luuLuongBot  != null) out.luuLuongBotThucTe  = round1(out.luuLuongBot  * K);
        out.ghiChu.push(`Stt = ${dienTichThucTe} m² < S = ${out.dienTichTinhToan} m² → áp K = Stt/S = ${out.heSoK} (giảm lưu lượng thực tế).`);
      } else {
        out.luuLuongNuocThucTe = out.luuLuongNuoc;
        out.luuLuongBotThucTe  = out.luuLuongBot;
        out.ghiChu.push(`Stt = ${dienTichThucTe} m² ≥ S = ${out.dienTichTinhToan} m² → giữ nguyên lưu lượng tối thiểu.`);
      }
    }

    return out;
  }

  function round1(x) { return Math.round(x * 10) / 10; }
  function round3(x) { return Math.round(x * 1000) / 1000; }

  window.TCVN7336_ENGINE = { traCuu, BANG1_KHO, BANG2, BANG3 };
})();
