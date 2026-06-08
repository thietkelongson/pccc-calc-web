// =========================================================================
// BDC (Bảng Đối Chiếu) — Metadata + mapping công trình → hệ thống áp dụng
// =========================================================================
window.BDC_INDEX = {
  // A — Bảng đối chiếu theo loại công trình
  congTrinh: [
    { id: 'a2_chung_cu',     ma: 'A2',  ten: 'Nhà chung cư, nhà tập thể',     icon: '🏢', file: 'a2_chung_cu.docx' },
    { id: 'a3_hon_hop',      ma: 'A3',  ten: 'Nhà hỗn hợp',                    icon: '🏬', file: 'a3_hon_hop.docx' },
    { id: 'a4_van_phong',    ma: 'A4',  ten: 'Nhà văn phòng',                  icon: '🏢', file: 'a4_van_phong.docx' },
    { id: 'a14_nha_san_xuat',ma: 'A14', ten: 'Nhà sản xuất',                   icon: '🏭', file: 'a14_nha_san_xuat.docx' },
    { id: 'a15_nha_kho',     ma: 'A15', ten: 'Nhà kho',                        icon: '📦', file: 'a15_nha_kho.docx' }
  ],
  // B — Bảng đối chiếu theo hệ thống PCCC
  heThong: [
    { id: 'b1_bao_chay_thuong',  ma: 'B1',  ten: 'Hệ thống báo cháy loại thường', icon: '🔔', file: 'b1_bao_chay_thuong.docx' },
    { id: 'b2_bao_chay_dia_chi', ma: 'B2',  ten: 'Hệ thống báo cháy loại địa chỉ',icon: '📡', file: 'b2_bao_chay_dia_chi.docx' },
    { id: 'b5_hong_nuoc',        ma: 'B5',  ten: 'Họng nước chữa cháy trong nhà', icon: '🚰', file: 'b5_hong_nuoc.docx' },
    { id: 'b6_cc_nuoc_bot',      ma: 'B6',  ten: 'Chữa cháy tự động bằng nước, bọt', icon: '💧', file: 'b6_cc_nuoc_bot.docx' },
    { id: 'b12_pt_ban_dau',      ma: 'B12', ten: 'Phương tiện chữa cháy ban đầu',  icon: '🧯', file: 'b12_pt_ban_dau.docx' }
  ],

  // Mapping công trình → hệ thống cần kèm BDC khi thẩm định
  // (rút gọn theo QCVN 10:2025/BCA — bản đầy đủ sẽ link sang module Tra cứu QC10)
  mapping: {
    a2_chung_cu:      ['b1_bao_chay_thuong', 'b2_bao_chay_dia_chi', 'b5_hong_nuoc', 'b6_cc_nuoc_bot', 'b12_pt_ban_dau'],
    a3_hon_hop:       ['b2_bao_chay_dia_chi', 'b5_hong_nuoc', 'b6_cc_nuoc_bot', 'b12_pt_ban_dau'],
    a4_van_phong:     ['b1_bao_chay_thuong', 'b2_bao_chay_dia_chi', 'b5_hong_nuoc', 'b6_cc_nuoc_bot', 'b12_pt_ban_dau'],
    a14_nha_san_xuat: ['b2_bao_chay_dia_chi', 'b5_hong_nuoc', 'b6_cc_nuoc_bot', 'b12_pt_ban_dau'],
    a15_nha_kho:      ['b2_bao_chay_dia_chi', 'b5_hong_nuoc', 'b6_cc_nuoc_bot', 'b12_pt_ban_dau']
  }
};
