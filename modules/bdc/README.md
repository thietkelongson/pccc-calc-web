# Module BDC — Bảng đối chiếu thẩm duyệt PCCC

## Phạm vi
42 BDC parse từ `.docx`/`.doc` Bộ Công an (26 công trình A1–A26 + 16 hệ thống B1–B16).

## Cấu trúc thư mục
```
modules/bdc/
├── source/                  # Template .docx gốc (đã rename ASCII)
├── data/
│   ├── index.js             # Metadata 42 BDC
│   ├── checklist_*.js       # 42 file checklist parsed
│   └── img/<bdc_id>/        # Ảnh trích từ template
├── mapping.json             # Map tên gốc tiếng Việt → slug ASCII + icon
├── parse_docx.py            # Parser .docx → JSON
├── batch_import.ps1         # PowerShell: copy + convert .doc qua Word COM
├── batch_parse.py           # Python: parse all 42 + regenerate index.js
└── export.py                # Xuất hồ sơ → .docx hoàn chỉnh
```

## Workflow

### Cập nhật khi BCA ra phiên bản template mới
```powershell
# 1. Copy file gốc vào thư mục nguồn (đổi đường dẫn trong batch_import.ps1 nếu cần)
& .\modules\bdc\batch_import.ps1

# 2. Parse lại toàn bộ
python .\modules\bdc\batch_parse.py
```

### Xuất hồ sơ thẩm duyệt
Trong UI: mở hồ sơ → bấm **📥 Xuất Word** → trình duyệt tải file `hoso_<id>.json`.

Sau đó chạy:
```powershell
cd modules\bdc
python export.py <đường dẫn tới hoso_xxx.json>
```

Kết quả: `hoso_<id>.docx` — file Word giữ nguyên format template Bộ Công an, fill:
- **Preamble** (6 mục đầu): Tên CT / Địa điểm / Chủ đầu tư / Đại diện / Đơn vị TVTK / Cán bộ TĐ
- **Cột "Nội dung thiết kế"** (cột 3): nội dung user nhập cho từng mục
- **Cột "Kết luận"** (cột 6): `+` / `KN` / `N/A` theo verdict

Hồ sơ nhiều BDC sẽ được ghép thành 1 file Word duy nhất (A trước, B sau theo thứ tự user tick).

## Schema hồ sơ JSON
```json
{
  "id": "h_xxx",
  "ten": "Tên hồ sơ",
  "maCongTrinhFull": "a4_van_phong",
  "heThongIds": ["b2_bao_chay_dia_chi", "b5_hong_nuoc"],
  "thongTinDuAn": {
    "tenCongTrinh": "...", "diaDiem": "...", "chuDauTu": "...",
    "diaChiDaiDien": "...", "donViTuVan": "...", "canBoThamDinh": "..."
  },
  "verdict": { "bdcId|si|subi|ii": "pass|kn|na" },
  "thietKe":  { "bdcId|si|subi|ii": "Mô tả thiết kế..." }
}
```

## Roadmap (Phase 2 — Backend)
- Thay flow CLI bằng API: frontend POST `/api/bdc/export` → server stream `.docx`
- Convert `.docx` → `.pdf` qua Word COM hoặc LibreOffice headless
- Lưu file output vào S3/R2, trả link tải có thời hạn
