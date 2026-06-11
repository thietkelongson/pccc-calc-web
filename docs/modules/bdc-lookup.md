# Module: Bảng đối chiếu thẩm duyệt (BDC)

> Tra cứu + lập hồ sơ thẩm duyệt PCCC theo bộ **42 Bảng Đối Chiếu** do Bộ Công an ban hành (26 BDC công trình A1–A26 + 16 BDC hệ thống B1–B16).

## 1. Phạm vi & mục tiêu

- Tra cứu nhanh nội dung 42 BDC: yêu cầu thiết kế + hướng dẫn của Bộ Công an + viện dẫn tiêu chuẩn cho từng mục.
- Cho user tạo **hồ sơ thẩm duyệt** = 1 công trình (A) + nhiều hệ thống (B) áp dụng, đối chiếu thiết kế thực tế ↔ quy định, kết luận từng mục (Đạt / Kiến nghị / N/A).
- Xuất **Word** giữ nguyên template Bộ Công an (qua `export.py`) + xuất **PDF** (qua Word COM).

## 2. Kiến trúc

```
bdc-lookup.html               ← UI: 4 view (list, wizard, hồ sơ, BDC đơn lẻ)
modules/bdc/
├── engine.js                 ← Logic thuần, không chạm DOM
├── export.py                 ← Xuất .docx (giữ template) + tùy chọn .pdf
├── parse_docx.py             ← Parser template .docx → checklist_*.js
├── batch_import.ps1          ← Import 42 file gốc từ thư mục Word
├── batch_parse.py            ← Chạy parser cho cả 42 file
├── mapping.json              ← Catalog mã BDC → file Word gốc
├── source/                   ← 42 file Word gốc của Bộ Công an
└── data/
    ├── index.js              ← window.BDC_INDEX = { congTrinh: [...], heThong: [...] }
    ├── checklist_a1_ha_tang.js  ← Mỗi BDC một file: window.BDC_CHECKLIST_<ID> = [...]
    ├── ... (× 42)
    └── img/<bdc_id>/...      ← Hình minh họa trích từ docx gốc
```

`.js` chỉ là wrapper gán biến global để load qua thẻ `<script>`. Khi chuyển sang backend, đổi sang `fetch()` các `.json` tương ứng.

### Tách 2 lớp
- **Lớp logic** ([engine.js](../../modules/bdc/engine.js)): catalog + storage hồ sơ + tính tiến độ + build payload export. Không phụ thuộc CSS/DOM. Có thể move sang Node/Python.
- **Lớp UI** ([bdc-lookup.html](../../bdc-lookup.html)): chỉ gọi engine + render. Không biết về cấu trúc dữ liệu nội bộ.

## 3. API engine

### Catalog
```js
BDCEngine.getCatalog()            // { congTrinh: [...], heThong: [...] }
BDCEngine.getCongTrinh()          // [{id, ma, ten, icon, file}, ...]
BDCEngine.getHeThong()
BDCEngine.findItem(bdcId)         // metadata 1 BDC
BDCEngine.getChecklist(bdcId)     // mảng sections của 1 BDC
BDCEngine.isLoaded(bdcId)
BDCEngine.allLoaded()             // mảng id đã có data
BDCEngine.countLeafs(section)
BDCEngine.countAllLeafs(bdcId)
BDCEngine.itemKey(bdcId, si, subi, ii)
```

### Hồ sơ (localStorage)
```js
BDCEngine.loadHosoList()          // mảng hồ sơ
BDCEngine.saveHosoList(arr)
BDCEngine.getHoso(id)
BDCEngine.upsertHoso(h)
BDCEngine.deleteHoso(id)          // xóa hồ sơ + verdict + thiết kế
BDCEngine.genHosoId()
```

### Verdict / Thiết kế
```js
BDCEngine.loadVerdict(hosoId)     // { 'bdc|si|subi|ii': 'pass'|'kn'|'na' }
BDCEngine.saveVerdict(hosoId, v)
BDCEngine.loadThietKe(hosoId)     // { 'bdc|si|subi|ii': 'text...' }
BDCEngine.saveThietKe(hosoId, t)
```

### Tổng hợp
```js
BDCEngine.hosoProgress(h)         // { total, done }
BDCEngine.getTotals(h)            // { total, pass, kn, na, done }
BDCEngine.buildHosoGroups(h)      // groups[] cho checklist renderer
BDCEngine.buildExportPayload(h)   // payload JSON cho export.py
```

## 4. Schema dữ liệu

### 4.1 Checklist của 1 BDC
```js
// window.BDC_CHECKLIST_<ID> = sections
[
  {
    tt: "1",                // số thứ tự section
    ten: "Tên section",
    subs: [
      {
        tt: "1.1",
        ten: "Tên sub",
        implicit?: true,    // sub không có tiêu đề, gộp vào parent
        huong_dan?: "...",  // hướng dẫn Bộ Công an cho sub
        quy_dinh?: "...",   // quy định tiêu chuẩn cho sub
        vien_dan?: "...",   // viện dẫn TCVN/QCVN
        items: [
          {
            bullet: "a)",   // ký hiệu mục
            ten: "...",
            huong_dan?: "...",
            quy_dinh?: "...",
            vien_dan?: "...",
            _row: 12        // index dòng trong template Word gốc (dùng cho export.py)
          }
        ]
      }
    ]
  }
]
```

### 4.2 Hồ sơ
```js
{
  id: "h...",                     // genHosoId()
  ten: "Tên hồ sơ",
  maCongTrinhFull: "a4_van_phong", // 1 BDC công trình
  heThongIds: ["b1_bao_chay_thuong", ...], // n BDC hệ thống
  thongTinDuAn: {
    tenCongTrinh, diaDiem, chuDauTu,
    diaChiDaiDien, donViTuVan, canBoThamDinh
  },
  created: 1234567890
}
```

Verdict và thiết kế lưu **riêng** dưới key `hoso-<id>-verdict` / `hoso-<id>-thietke` để không bloat list khi enumerate.

## 5. Quy ước key

- `itemKey(bdcId, si, subi, ii)` → `"a4_van_phong|0|1|2"` — định danh duy nhất 1 mục trong toàn hệ thống.
- `_row` trong item là **index dòng trong template Word gốc**. **KHÔNG đổi schema này** không file Word xuất ra sẽ điền sai dòng.

## 6. Pipeline import 42 BDC

```
source/*.docx (Bộ Công an)
   ↓ batch_parse.py
data/checklist_*.js + data/img/<id>/*.png
   ↓ <script src=...>
window.BDC_CHECKLIST_<ID>
   ↓ engine.js
BDCEngine.getChecklist(id)
```

Re-import khi BCA update:
```powershell
& .\modules\bdc\batch_import.ps1
python .\modules\bdc\batch_parse.py
```

Sau khi re-parse, bump cache buster `?v=N` trong [bdc-lookup.html](../../bdc-lookup.html) (lý do: browser cache file `.js` rất khỏe; không bump là user thấy data cũ).

## 7. Export hồ sơ

UI download `hoso_<id>.json`, user chạy:
```
python modules/bdc/export.py <hoso.json>          # → .docx
python modules/bdc/export.py <hoso.json> --pdf    # → .docx + .pdf
```

`export.py`:
- Load template Word gốc tương ứng `maCongTrinhFull` + từng `heThongIds`.
- `fill_preamble`: điền 6 trường `thongTinDuAn` vào header file công trình (A).
- `fill_main_table`: tìm bảng có header `TT`, điền cột thiết kế (col 2) + cột kết luận (col 5) theo `_row`.
  - Cột thiết kế → chữ đỏ.
  - Kết luận `pass` → nền xanh + "Đạt"; `kn` → nền vàng + "Không đạt"; `na` → "N/A".
- `docxcompose` merge nhiều BDC thành 1 file.
- `--pdf`: dùng Word COM `SaveAs2 FileFormat=17` để convert (cần MS Word + `pip install pywin32`).

## 8. Tiến trình đã làm

| Mốc | Nội dung |
|-----|----------|
| 1 | Parser `parse_docx.py` cho 1 template demo |
| 2 | Batch import + parse 42 template Bộ Công an |
| 3 | UI 4 view (list/wizard/hồ sơ/BDC đơn lẻ) với checklist renderer thống nhất |
| 4 | Workflow hồ sơ thẩm duyệt (tạo, sửa, xóa, đối chiếu, lưu verdict + thiết kế) |
| 5 | `export.py` — merge nhiều BDC, fill preamble + main table |
| 6 | Format kết luận: chữ đỏ cột thiết kế, nền xanh/vàng + chữ Đạt/Không đạt cột kết luận |
| 7 | `--pdf`: convert qua Word COM |
| 8 | **Tách 2 lớp logic/UI** — extract sang `engine.js`, UI gọi qua API thuần |

## 9. Còn lại / TODO

- [ ] **Backend API** thay CLI thủ công (Phase 2): `POST /api/bdc/export` → stream `.docx`/`.pdf`.
- [ ] **Parser multi-scenario B3** (trạm bơm) — hiện chỉ lấy bảng lớn nhất, mất 3 scenario nhỏ QCVN02/TCVN4513.
- [ ] **Preamble — danh mục TCVN**: hiện skip phần liệt kê tiêu chuẩn áp dụng ở đầu file A.
- [ ] **Auto-suggest hệ thống**: wizard B3 hiện cho user tick thủ công 5 hệ thống. Khi engine QC10 đủ → tự đề xuất theo loại công trình + chiều cao + DT sàn.
- [ ] **Mapping công trình → hệ thống**: field `mapping` trong `index.js` đang trống. Fill xong → trang chủ gợi ý sẵn.
- [ ] **Toast notifications** thay `alert()` khi export.
- [ ] **Mobile sidebar** polish (responsive hoạt động nhưng UX chưa mượt).

## 10. Quy ước khi bổ sung BDC mới

1. Bỏ file `.docx` mới vào `modules/bdc/source/`.
2. Update `modules/bdc/mapping.json`: thêm entry `{id, ma, ten, icon, file}` vào nhóm `congTrinh` hoặc `heThong`.
3. Chạy `python modules/bdc/batch_parse.py` → sinh `data/checklist_<id>.js` + `data/img/<id>/...`.
4. Update [bdc-lookup.html](../../bdc-lookup.html):
   - Thêm `<script src="modules/bdc/data/checklist_<id>.js?v=N"></script>`.
   - Bump tất cả `?v=N` lên một số mới.
5. Bổ sung row trong bảng "Tiến trình đã làm" nếu cần.

## 11. Liên kết

- Entry UI: [bdc-lookup.html](../../bdc-lookup.html)
- Engine: [modules/bdc/engine.js](../../modules/bdc/engine.js)
- Export CLI: [modules/bdc/export.py](../../modules/bdc/export.py)
- Catalog: [modules/bdc/data/index.js](../../modules/bdc/data/index.js)
- README chi tiết pipeline: [modules/bdc/README.md](../../modules/bdc/README.md)
