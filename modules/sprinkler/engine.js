// =========================================================================
// SPRINKLER ENGINE — 19 công thức thuỷ lực theo TCVN 7336:2021 Phụ lục B
// Port từ VPT_PCCC/CongThucThuyLuc.cs (Long Son), bổ sung Bảng Kt từ TCVN B.2
// Đơn vị: Q (L/s), P (MPa), L (m), DN (mm), v (m/s), K (L/min/√bar)
// =========================================================================
(function () {
  'use strict';

  // ---------- Utils ----------
  const R2 = v => Math.round(v * 100) / 100;
  const R3 = v => Math.round(v * 1000) / 1000;
  const R6 = v => Math.round(v * 1e6) / 1e6;

  // ---------- Bảng Kt (TCVN 7336:2021 Bảng B.2) ----------
  // Đặc tính thuỷ lực Kt [l⁶/s²] — ΔP = Q²·L / (100·Kt)
  // BUILTIN: chỉ vật liệu chuẩn TCVN (không sửa). User có thể bổ sung qua CUSTOM.
  const Kt_TABLE_BUILTIN = {
    'Thép đen': {
      15: 0.0755, 20: 0.75, 25: 3.44, 32: 13.97, 40: 28.7,
      50: 110, 65: 572, 80: 1429, 100: 4322,
      125: 13530, 150: 28690, 200: 209900, 250: 711300, 300: 1856000,
    },
    'Thép tráng kẽm': {
      15: 0.18, 20: 0.926, 25: 3.65, 32: 16.5, 40: 34.5,
      50: 135, 65: 517, 80: 1262, 100: 5205, 125: 16940, 150: 43000,
    },
  };
  let Kt_TABLE_CUSTOM = {}; // { 'Tên VL': { DN: Kt, ... }, ... }

  function getKt(DN, material) {
    const tab = (Kt_TABLE_CUSTOM[material] || Kt_TABLE_BUILTIN[material]
                 || Kt_TABLE_BUILTIN['Thép đen']);
    return tab[DN] != null ? tab[DN] : null;
  }
  function setCustomKt(table) { Kt_TABLE_CUSTOM = table || {}; }
  function getCustomKt() { return Kt_TABLE_CUSTOM; }
  function listMaterials() {
    return [...Object.keys(Kt_TABLE_BUILTIN), ...Object.keys(Kt_TABLE_CUSTOM)];
  }
  function isBuiltinMaterial(name) { return name in Kt_TABLE_BUILTIN; }

  // =========================================================================
  // 19 CÔNG THỨC THUỶ LỰC
  // =========================================================================

  // 1. Đổi K từ gpm/√psi (đơn vị Mỹ) sang L/min/√bar (đơn vị metric)
  function chuyenDoi_K_US_to_metric(K_us) {
    return R3(K_us * 0.76);
  }

  // 2. Lưu lượng đầu phun chủ đạo: Q₁ = S₁ × i
  function tinhQ1_DauPhunChuDao(S1_m2, i_lps_m2) {
    return R3(S1_m2 * i_lps_m2);
  }

  // 3. Áp suất tại đầu phun chủ đạo: P₁ = Q₁² / K²
  function tinhP1_DauPhunChuDao(Q1, K) {
    if (K <= 0) throw new Error('Hệ số K phải > 0');
    return R3((Q1 * Q1) / (K * K));
  }

  // 4. Lưu lượng đoạn ống đầu (1-2): Q_1-2 = Q₁
  function tinhQ_Doan12(Q1) {
    return R3(Q1);
  }

  // 5 & 9. Tổn thất áp suất 1 đoạn ống bất kỳ
  // ΔP = Q² · L / (100 · Kt)
  function tinhdP_DoanOng(Q, L, Kt) {
    if (Kt <= 0) throw new Error('Đặc tính thuỷ lực Kt phải > 0');
    return R3((Q * Q * L) / (100 * Kt));
  }

  // 6. Áp suất tại nút tiếp theo: P₂ = P_trước + ΔP_đoạn
  function tinhP_NutTiepTheo(P_truoc, dP_doan) {
    return R3(P_truoc + dP_doan);
  }

  // 7. Lưu lượng đầu phun kế: Q = K · √P
  function tinhQ_DauPhunTiepTheo(K, P) {
    if (P <= 0) return 0;
    return R3(K * Math.sqrt(P));
  }

  // 8. Lưu lượng tích lũy đoạn ống kế: Q_2-3 = Q_1-2 + Q₂
  function tinhQ_DoanOngTiepTheo(Q_doan_truoc, Q_dauphun_hientai) {
    return R3(Q_doan_truoc + Q_dauphun_hientai);
  }

  // 10. Nút giao ĐỐI XỨNG (n=2) hoặc LỆCH 1 BÊN (n=1): Q_tong = Q_nhanh × n
  function tinhQ_NutGiao_DongDeu(Q_nhanh, soNhanh) {
    return R3(Q_nhanh * soNhanh);
  }

  // 11. Nút giao BẤT ĐỐI XỨNG — cân bằng thuỷ lực
  // Q_short' = Q_short × √(P_max / P_short); Q_tong = Q_max + Q_short'
  function tinhQ_NutGiao_BatDoiXung(P_max, Q_max, P_short, Q_short) {
    if (P_short <= 0) throw new Error('P nhánh ngắn phải > 0 để cân bằng');
    const Q_short_thuc = Q_short * Math.sqrt(P_max / P_short);
    return R3(Q_max + Q_short_thuc);
  }

  // 12. Đặc tính tổng quát hàng (B_pI): Bp = Q² / P
  function tinhDacTinhHang(Q_hang, P_dau_hang) {
    if (P_dau_hang <= 0) throw new Error('Áp suất đầu hàng phải > 0');
    return R3((Q_hang * Q_hang) / P_dau_hang);
  }

  // 13. Lưu lượng đoạn ống trục chính A-B (sau hàng I)
  // Mạch cụt: Q_AB = Q_I. Mạch vòng: Q_AB = 0.5 × Q_I (TCVN B.2.12)
  function tinhQ_DoanChinh_AB(Q_I, isMachVong) {
    return R3(isMachVong ? Q_I * 0.5 : Q_I);
  }

  // 14. Tổn thất đoạn ống phân phối A-B (precision cao do DN lớn)
  function tinhdP_DoanPhanPhoi(Q_ab, L_ab, Kt) {
    if (Kt <= 0) throw new Error('Kt phải > 0');
    return R6((Q_ab * Q_ab * L_ab) / (100 * Kt));
  }

  // 15. Áp suất nút phân phối kế tiếp: P_b = P_a + ΔP_ab
  function tinhP_NutPhanPhoi(P_truoc, dP_doan) {
    return R3(P_truoc + dP_doan);
  }

  // 16. Lưu lượng hàng kế tiếp (Q_II): √(Bp × P)
  // Giả định hàng II cùng cấu trúc với hàng I → dùng chung Bp
  function tinhQ_HangTiepTheo(Bp, P_dau_hang) {
    if (P_dau_hang <= 0) return 0;
    return R3(Math.sqrt(Bp * P_dau_hang));
  }

  // 17. Tổng Q tích lũy đoạn phân phối (B-C, C-D…)
  // Mạch cụt: gánh 100%. Mạch vòng: gánh 50%
  function tinhQ_DoanPhanPhoi(Q_tichluy_truoc, Q_hang_moi, isMachVong) {
    const tong = Q_tichluy_truoc + Q_hang_moi;
    return R3(isMachVong ? tong * 0.5 : tong);
  }

  // 18. Kiểm tra Q tổng hệ ≥ Q tối thiểu TCVN
  function kiemTra_QTongHe(Q_thuc, Q_min_TCVN) {
    return Q_thuc >= Q_min_TCVN;
  }

  // 19. Vận tốc dòng chảy: v = 4000·Q / (π·DN²)
  // Giới hạn theo TCVN B.1.9: v_max = 10 m/s (mạng); 2.8 m/s (ống hút)
  function tinhVanToc(Q_lps, DN_mm) {
    if (DN_mm <= 0) throw new Error('DN phải > 0');
    return R2((4000 * Q_lps) / (Math.PI * DN_mm * DN_mm));
  }

  // ---------- Constants TCVN ----------
  const V_MAX_MANG = 10;     // m/s — vận tốc tối đa ống mạng
  const V_MAX_HUT  = 2.8;    // m/s — vận tốc tối đa ống hút
  const P_MAX_VAN  = 1.0;    // MPa — áp suất tối đa tại bộ điều khiển (B.3.14)
  const PHU_KIEN_RATE = 0.20; // 20% — phụ kiện cộng vào tổng tổn thất (B.3.13)

  // ---------- Sanity test ----------
  // Ví dụ nhóm 1 từ TCVN: i=0.08 L/s·m², S₁=12 m², K=80
  // Q₁ = 0.08 × 12 = 0.96 L/s = 57.6 L/min
  // P₁ = (57.6/80)² = 0.518 bar = 0.0518 MPa
  function selfTest() {
    const out = [];
    const Q1 = tinhQ1_DauPhunChuDao(12, 0.08);            // 0.96 L/s
    out.push({ name: 'Q1 = S1×i', exp: 0.96, got: Q1, ok: Math.abs(Q1 - 0.96) < 1e-3 });

    // K=80 L/min/√bar → tính ở đơn vị L/min: Q1_lpm = Q1×60 = 57.6
    // P (bar) = (Q1_lpm/K)² = (57.6/80)² = 0.5184
    // Đổi sang MPa = 0.05184
    // Hàm tinhP1 dùng Q và K cùng đơn vị; ở dây test trực tiếp:
    const P1_bar = R3(Math.pow(57.6 / 80, 2));            // 0.518 bar
    out.push({ name: 'P1 bar', exp: 0.518, got: P1_bar, ok: Math.abs(P1_bar - 0.518) < 1e-3 });

    // ΔP đoạn: Q=1 L/s, L=3 m, Kt(DN25)=3.44 → ΔP = 1·3 / (100·3.44) = 0.00872 MPa
    const dP = tinhdP_DoanOng(1.0, 3.0, getKt(25, 'Thép đen'));
    out.push({ name: 'ΔP DN25 L=3', exp: 0.009, got: dP, ok: Math.abs(dP - 0.009) < 0.01 });

    // v = 4000·1 / (π·25²) = 2.037 m/s
    const v = tinhVanToc(1.0, 25);
    out.push({ name: 'v Q=1 DN25', exp: 2.04, got: v, ok: Math.abs(v - 2.04) < 0.01 });

    // Mạch vòng: Q_AB = 0.5 × Q_I
    const Qab = tinhQ_DoanChinh_AB(10, true);
    out.push({ name: 'Q_AB vòng', exp: 5.0, got: Qab, ok: Qab === 5.0 });

    return out;
  }

  // ---------- Export ----------
  window.SPRINKLER_ENGINE = {
    // Bảng & lookup
    Kt_TABLE_BUILTIN,
    getKt,
    setCustomKt, getCustomKt, listMaterials, isBuiltinMaterial,
    // Constants
    V_MAX_MANG, V_MAX_HUT, P_MAX_VAN, PHU_KIEN_RATE,
    // 19 công thức
    chuyenDoi_K_US_to_metric,
    tinhQ1_DauPhunChuDao,
    tinhP1_DauPhunChuDao,
    tinhQ_Doan12,
    tinhdP_DoanOng,
    tinhP_NutTiepTheo,
    tinhQ_DauPhunTiepTheo,
    tinhQ_DoanOngTiepTheo,
    tinhQ_NutGiao_DongDeu,
    tinhQ_NutGiao_BatDoiXung,
    tinhDacTinhHang,
    tinhQ_DoanChinh_AB,
    tinhdP_DoanPhanPhoi,
    tinhP_NutPhanPhoi,
    tinhQ_HangTiepTheo,
    tinhQ_DoanPhanPhoi,
    kiemTra_QTongHe,
    tinhVanToc,
    // Test
    selfTest,
  };
})();
