// =========================================================================
// Demo Checklist — BDC A4 Nhà văn phòng
// (Mẫu rút gọn 12 mục đầu để demo phương án "Checklist tương tác")
// Bản đầy đủ ~80–100 mục — sẽ parse hết khi user chọn phương án này
// =========================================================================
window.BDC_CHECKLIST_A4 = {
  ma: 'A4',
  ten: 'Bảng đối chiếu — Nhà văn phòng',
  congTrinh: 'Tòa nhà sử dụng làm trụ sở, nhà làm việc',
  muc: [
    {
      so: '1',
      ten: 'Xác định chiều cao an toàn PCCC, số tầng, nhóm nhà, hạng nguy hiểm cháy nổ',
      la_tieu_de: true
    },
    {
      so: '1.1', noi_dung_doi_chieu: 'Đối tượng thuộc diện thẩm định, phân cấp thẩm định',
      quy_dinh: 'Tòa nhà sử dụng làm trụ sở, nhà làm việc cao từ 7 tầng trở lên hoặc có tổng diện tích sàn từ 3.000 m². Thẩm quyền theo Điều 9 Thông tư 36/2025/TT-BCA.',
      vien_dan: 'Phụ lục III, Nghị định 105/2025/NĐ-CP; Điều 9 Thông tư 36/2025/TT-BCA'
    },
    {
      so: '1.2', noi_dung_doi_chieu: 'Số tầng và tầng hầm',
      quy_dinh: 'Số tầng nhà bao gồm toàn bộ các tầng trên mặt đất (kể cả tầng kỹ thuật, tum) và tầng bán/nửa hầm, không bao gồm tầng áp mái. Tum không tính khi chỉ bao che lồng cầu thang/giếng thang máy và che thiết bị kỹ thuật, có diện tích mái tum ≤ 30% diện tích sàn mái.',
      vien_dan: 'Điều 1.4.24 QCVN 10:2025/BCA'
    },
    {
      so: '1.3', noi_dung_doi_chieu: 'Chiều cao phục vụ PCCC',
      quy_dinh: 'Chiều cao PCCC = khoảng cách lớn nhất từ mặt đường cho xe chữa cháy tiếp cận đến mép dưới của lỗ cửa mở trên tường ngoài của tầng trên cùng. Khi không có lỗ cửa: bằng một nửa tổng khoảng cách từ mặt đường tới mặt sàn và đến trần của tầng trên cùng.',
      vien_dan: 'Điều 1.4.9 QCVN 06:2022/BXD và Sửa đổi 1:2023'
    },
    {
      so: '1.4', noi_dung_doi_chieu: 'Phân loại nhóm nhà, hạng nguy hiểm cháy nổ',
      quy_dinh: 'F4.3 — Trụ sở các cơ quan, văn phòng làm việc. Gian phòng kho ≥ 50 m² và bếp có thiết bị đun nấu > 10 kW được xếp F5. Phân chia khoang cháy theo chiều cao, mỗi khoang ≤ 50 m. Tường/sàn ngăn cháy có REI ≥ 90.',
      vien_dan: 'Bảng 6 QCVN 06:2022/BXD; Điều 2.6.5.2 QCVN 06:2022/BXD; Điều A.2.2 QCVN 06:2022/BXD'
    },
    {
      so: '2',
      ten: 'Hệ thống báo cháy',
      la_tieu_de: true
    },
    {
      so: '2.1', noi_dung_doi_chieu: 'Đối tượng trang bị báo cháy — đối với nhà',
      quy_dinh: 'Nhà văn phòng cao ≥ 5 tầng hoặc tổng diện tích sàn ≥ 500 m². Cho phép trang bị thiết bị báo cháy độc lập khi cao < 5 tầng và tổng diện tích sàn < 1.500 m².',
      vien_dan: 'Bảng A.1 QCVN 10:2025/BCA'
    },
    {
      so: '2.2', noi_dung_doi_chieu: 'Đối tượng trang bị báo cháy — đối với hạng mục/khu vực',
      quy_dinh: 'Danh mục hạng mục/khu vực phải trang bị hệ thống báo cháy tự động theo Bảng A.2. Lưu ý: không gian phía trên trần giả/dưới sàn nâng — không áp dụng TCVN 7568-14:2025.',
      vien_dan: 'Bảng A.2 QCVN 10:2025/BCA'
    },
    {
      so: '2.3', noi_dung_doi_chieu: 'Đối tượng trang bị báo cháy — đối với gian phòng',
      quy_dinh: 'Phòng thương mại trong tòa nhà công năng khác: tầng hầm/bán hầm — không phụ thuộc diện tích; tầng trên mặt đất ≥ 500 m². Phòng máy chủ chuyên dụng ≥ 24 m². Phòng lưu giữ ô tô — không phụ thuộc diện tích.',
      vien_dan: 'Bảng A.3 QCVN 10:2025/BCA'
    },
    {
      so: '3',
      ten: 'Hệ thống chữa cháy tự động (nước/bọt)',
      la_tieu_de: true
    },
    {
      so: '3.1', noi_dung_doi_chieu: 'Đối tượng trang bị Sprinkler',
      quy_dinh: 'Nhà văn phòng cao từ 25 m trở lên — bắt buộc trang bị hệ thống chữa cháy tự động bằng nước (Sprinkler).',
      vien_dan: 'Bảng A.1 QCVN 10:2025/BCA'
    },
    {
      so: '3.2', noi_dung_doi_chieu: 'Cường độ phun, lưu lượng, diện tích tính toán',
      quy_dinh: 'Theo Nhóm 1 (nhà văn phòng) Bảng 1 TCVN 7336:2021: cường độ phun ≥ 0,08 l/s·m² (nước); lưu lượng tối thiểu 10 l/s; diện tích tính toán tối thiểu 60 m²; thời gian phun 30 phút; khoảng cách giữa đầu phun ≤ 4 m.',
      vien_dan: 'Bảng 1 TCVN 7336:2021'
    }
  ]
};
