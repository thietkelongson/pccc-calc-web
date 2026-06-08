# Module: Tra cứu QC10

> Tra cứu yêu cầu trang bị PCCC theo **QCVN 10:2025/BCA** (hiệu lực 30/12/2025).

## 1. Phạm vi & mục tiêu

- Cho phép người dùng chọn loại công trình / hạng mục / gian phòng / thiết bị / cơ sở chuyên ngành → nhận về danh sách hệ thống PCCC bắt buộc trang bị kèm giải thích.
- Bao trùm **7 bảng** của Phụ lục A → G:
  - **A.1** Nhà (32 STT)
  - **A.2** Hạng mục/khu vực (cáp, băng tải, hầm cáp…)
  - **A.3** Gian phòng (kho hạng A/B/C, sản xuất, phòng máy chủ…)
  - **A.4** Thiết bị (máy biến áp, buồng sơn…)
  - **B.1** Họng nước chữa cháy trong nhà
  - **C.1** Cấp nước chữa cháy ngoài nhà
  - **D.1** Phương tiện chữa cháy cơ giới (xe CC / tàu CC / bơm khiêng tay)
  - **E.1** Dụng cụ phá dỡ thô sơ
  - **F.1** Mặt nạ lọc độc / phòng độc cách ly
  - **G.1** Hệ thống loa thông báo

Chưa làm: **H.1–H.7** (lưu lượng nước CC, số tia phun…) — sẽ tích hợp vào module Sprinkler Network khi tính toán mạng đường ống.

## 2. Kiến trúc

```
qc10-lookup.html              ← UI: tabs, search, form, render
modules/qc10/
├── engine.js                 ← Logic thuần, không chạm DOM
├── data/
│   ├── bang_a1.js + .json    ← Nguồn dữ liệu mỗi bảng
│   ├── bang_a2.js + .json
│   ├── bang_a2_chuyennganh.js  ← Catalog cơ sở chuyên ngành (merge standalone của C.1/D.1/E.1/F.1)
│   ├── bang_a3.js + .json
│   ├── bang_a4.js + .json
│   ├── bang_b1.js + .json
│   ├── bang_c1.js + .json
│   ├── bang_d1.js + .json
│   ├── bang_e1.js + .json
│   ├── bang_f1.js + .json
│   └── bang_g1.js + .json
└── raw/qcvn10_raw.txt        ← Text gốc từ PDF, phục vụ tra cứu khi bổ sung
```

`.js` chỉ là wrapper `window.BANG_X_DATA = <JSON>;` để load qua thẻ `<script>` (không cần fetch + parse). Khi chuyển sang backend, dùng `.json` trực tiếp.

### Tách 2 lớp
- **Lớp logic** (`engine.js`): nhận `{mode, stt, subStt, inputs}` → trả về object JSON. Không phụ thuộc CSS/DOM. Có thể move sang Node/Python sau này.
- **Lớp UI** (`qc10-lookup.html`): chỉ gọi engine, render cards + form. Không biết về cấu trúc dữ liệu nội bộ.

## 3. API engine

```js
QC10Engine.getModes()                              // metadata 4 tabs
QC10Engine.getList(mode)                           // danh sách item của mode
QC10Engine.findItem(mode, stt)                     // item theo STT
QC10Engine.getFieldDef(key)                        // metadata field input
QC10Engine.getRequiredFields({mode, stt, subStt})  // các field cần nhập
QC10Engine.lookup({mode, stt, subStt, inputs})     // tra cứu
```

### Shape của `lookup()` trả về
```js
{
  mode, sttRef, sourceTable, itemName, itemShortName,
  cards: [
    {
      name,                  // tên hệ thống (vd "Báo cháy tự động")
      sourceTable,           // bảng nguồn (vd "Bảng B.1")
      status,                // 'batbuoc' | 'choPhep' | 'khongBatBuoc' | 'khongApDung'
      threshold,             // mô tả ngưỡng quy định
      explanation,           // diễn giải vì sao đạt/không đạt
      note,                  // ghi chú từ subType (nếu có)
      quantities?: { xeCC, tauCC, bomKhieng },  // chỉ có ở D.1
      quantityDescription?,  // mô tả thiết bị (E.1/F.1)
      entryFootnotes?: []    // các chú thích entry-level
    }
  ],
  footnotes: [{ key, text }]
}
```

## 4. Schema dữ liệu

### 4.1 Item (A.1 / A.3 / A.4)
```js
{
  stt, loaiNha | tenGian | tenThietBi, shortName,
  baoChayCriteria, chuaChayCriteria,
  subTypes?: [{ subStt, description, baoChayCriteria, chuaChayCriteria, footnotes }],
  footnotes?: []
}
```

### 4.2 Criteria
- **Đơn**: `{ type, value, unit?, description }`
- **Đa điều kiện**: `{ type: 'multi', operator: 'AND'|'OR', conditions: [criteria...] }`

Các `type` đã hỗ trợ:
`khongPhuThuocDienTich`, `khong`, `tangTroLen`, `tangHonTriet`, `dtsTroLen`, `chieuCaoPCCC`, `chieuDaiTroLen`, `soChauTroLen`, `khanDaiTroLen`, `choTroLen`, `oToTroLen`, `soNguoiTangTroLen`, `soTangHamTroLen`, `congSuatTroLen`, `dienApTroLen`, `soSoiTroLen`, `multi`.

### 4.3 Entry phụ lục (B.1 / C.1 / D.1 / E.1 / F.1 / G.1)
```js
{
  stt, loaiNha,
  apA1Stt: [...],         // các A.1 STT được áp dụng entry này
  apA1SubStt?: [...],     // chi tiết subtype của A.1
  standalone?: true,      // không thuộc A.1 → cơ sở chuyên ngành
  criteria: {...},        // dùng chung schema A.1
  quantities?: { xeCC, tauCC, bomKhieng },   // D.1
  quantityDescription?,   // E.1/F.1
  footnotes?: []
}
```

### 4.4 Cơ sở chuyên ngành (gộp standalone của C.1/D.1/E.1/F.1)
File [bang_a2_chuyennganh.js](../../modules/qc10/data/bang_a2_chuyennganh.js) — merge vào tab A.2 dưới `groupName: 'Cơ sở chuyên ngành'`.

```js
{
  stt: "CN-X",
  tenHangMuc, shortName,
  isChuyenNganh: true,
  scaleFields: ["dienTichHa"],   // các field input cần để chọn tier
  chuyenNganhRefs: {
    c1: [{stt, field?, gte?/lte?/gt?/lt?/eq?/in?}, ...],
    d1: [...], e1: [...], f1: [...]
  }
}
```

`refMatches()` lọc ref theo input:
- `gt/gte/lt/lte`: so sánh số
- `eq/in`: so sánh chuỗi (vd capCongTrinh = 'db' | '1' | '2' | '3')
- Field rỗng (`= 0` hoặc `''`): hiển thị tất cả tier

## 5. Tiến trình đã làm

| Mốc | Nội dung |
|-----|----------|
| 1 | Khung UI + tab A.1 (báo cháy + chữa cháy) — `bang_a1.js` |
| 2 | Thêm tab A.2 (hạng mục cáp), A.3 (gian phòng), A.4 (thiết bị) |
| 3 | Thêm B.1 (họng nước) + G.1 (loa thông báo) cho tab A.1 |
| 4 | Bổ sung C.1 (cấp nước ngoài nhà) + D.1 (phương tiện cơ giới) — hỗ trợ `quantities` |
| 5 | Bổ sung E.1 (dụng cụ phá dỡ) + F.1 (mặt nạ phòng độc) — hỗ trợ `quantityDescription` |
| 6 | Tạo catalog 18 mục **Cơ sở chuyên ngành** — gộp standalone của C.1/D.1/E.1/F.1 vào tab A.2 |
| 7 | Thêm cơ chế **tier matching** (`refMatches`) — input scale (ha, MW, m³, cấp…) lọc đúng tier |
| 8 | **Tách 2 lớp logic/UI** — extract toàn bộ logic ra `engine.js`, UI gọi qua API thuần |
| 9 | Sắp xếp lại thư mục theo module |

## 6. Còn lại / TODO

- [ ] **Bảng H.1 – H.7** (lưu lượng nước CC, số tia phun) — tích hợp vào module Sprinkler Network.
- [ ] Lọc bớt noise tab A.1: hiện tại với 1 công trình có thể hiển thị 8 card, nhiều card chỉ là "Không nằm trong Bảng X". Có thể ẩn / gom các card "khongBatBuoc" có threshold = "Không nằm trong …".
- [ ] Hoàn thiện ánh xạ `apA1Stt` cho E.1 STT 1 ("Nhà sản xuất") — hiện đặt `standalone` vì A.1 không có loại tương ứng trực tiếp.
- [ ] Bổ sung thêm field cho A.4 / A.3 nếu có criteria mới (vd nhiệt độ, áp suất).
- [ ] Khi chuyển sang backend: re-implement `engine.js` thành REST API trả cùng shape; frontend chỉ thay `QC10Engine.lookup(...)` bằng `fetch(...)`.
- [ ] Khi muốn các bảng `.json` dùng được cho cả backend, bỏ wrapper `.js` và load qua `fetch()` trong engine.

## 7. Quy ước khi bổ sung bảng mới

1. Tạo `bang_xN_qcvn10_2025.json` trong [modules/qc10/data/](../../modules/qc10/data/).
2. Tạo wrapper `bang_xN.js`: `window.BANG_XN_DATA = <JSON>;`.
3. Trong [engine.js](../../modules/qc10/engine.js):
   - Thêm `const DATA_XN = window.BANG_XN_DATA;`.
   - Thêm `cards.push(evaluateFromTable(input, DATA_XN, '...', 'Bảng X.N'))` trong nhánh `mode === 'a1'`.
   - Bổ sung `DATA_XN` vào `auxTables` trong `getRelevantInputs` để thu gom field input.
4. Trong [qc10-lookup.html](../../qc10-lookup.html):
   - Thêm `<script src="modules/qc10/data/bang_xN.js"></script>`.
   - Thêm icon mới vào `SYSTEM_ICONS` cho tên hệ thống tương ứng.
5. Bổ sung row trong bảng "Tiến trình đã làm" của file này.

## 8. Liên kết

- Quy chuẩn nguồn: [modules/qc10/raw/qcvn10_raw.txt](../../modules/qc10/raw/qcvn10_raw.txt) (text trích PDF QCVN 10:2025/BCA).
- Entry point: [qc10-lookup.html](../../qc10-lookup.html).
- Engine: [modules/qc10/engine.js](../../modules/qc10/engine.js).
- Catalog chuyên ngành: [modules/qc10/data/bang_a2_chuyennganh.js](../../modules/qc10/data/bang_a2_chuyennganh.js).
