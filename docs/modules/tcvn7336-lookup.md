# Module: Tra cứu TCVN 7336

> Tra cứu thông số thiết kế hệ thống chữa cháy tự động bằng **nước, bọt** (Sprinkler / Drencher) theo **TCVN 7336:2021** — thay thế TCVN 7336:2003.

## 1. Phạm vi & mục tiêu

- Cho phép kỹ sư thiết kế tra nhanh **cường độ phun**, **lưu lượng tối thiểu**, **diện tích tính toán**, **thời gian phun** và **khoảng cách tối đa giữa đầu phun** theo nhóm nguy cơ phát sinh cháy.
- Bao trùm **3 bảng tra + 1 phụ lục** của TCVN 7336:2021:
  - **Bảng 1** — Thông số cho gian phòng cao ≤ 10 m (Nhóm 1, 2, 3, 4.1, 4.2 + Nhóm 5/6/7 trỏ Bảng 2)
  - **Bảng 2** — Thông số chi tiết cho **kho** Nhóm 5, 6, 7 theo 5 dải chiều cao xếp hàng hóa
  - **Bảng 3** — Thông số cho gian phòng cao **10–20 m** (Nhóm 1, 2, 3, 4.1, 4.2) theo 5 dải chiều cao
  - **Phụ lục A** — Phân loại cơ sở theo nhóm nguy cơ phát sinh cháy (Nhóm 1–7)

Phần chưa làm: **Phụ lục B** (phương pháp tính thủy lực) và **Phụ lục C** (chữa cháy bằng bọt bội số nở cao) — sẽ tích hợp vào module **Thủy lực Sprinkler** khi tính mạng đường ống.

## 2. Kiến trúc

```
tcvn7336-lookup.html              ← UI: tabs, form, render
modules/tcvn7336/
├── engine.js                     ← Logic tra cứu + áp chú thích (port từ DuLieuChuaChay.cs)
├── data/
│   ├── bang1.js + .json          ← Bảng 1 — phòng ≤ 10 m
│   ├── bang2.js + .json          ← Bảng 2 — kho Nhóm 5/6/7
│   ├── bang3.js + .json          ← Bảng 3 — phòng 10–20 m
│   └── phu_luc_a.js + .json      ← Phụ lục A — 8 nhóm nguy cơ + danh sách công năng
└── raw/tcvn7336_raw.txt          ← Text trích PDF TCVN 7336:2021
```

`.js` là wrapper `window.TCVN7336_BANGx = <data>;` để load qua thẻ `<script>` (chạy được trên `file://`, không cần fetch + CORS). `.json` để dùng cho backend / API sau này.

### Tách 2 lớp
- **Lớp logic** (`engine.js`): nhận `{nhom, chieuCaoPhong, chieuCaoKho}` → trả về object thông số. Không phụ thuộc CSS/DOM. Có thể port sang Node/Python.
- **Lớp UI** (`tcvn7336-lookup.html`): tabs (Tra cứu nhanh / Bảng 1 / Bảng 2 / Bảng 3 / Phụ lục A), form input, render kết quả. Áp K = Stt/S ở lớp UI để Stt thay đổi không cần bấm "Tra cứu" lại.

## 3. API engine

```js
TCVN7336_ENGINE.traCuu({
  nhom,             // '1' | '2' | '3' | '4.1' | '4.2' | '5' | '6' | '7'
  chieuCaoPhong,    // m  — bắt buộc, ≤ 20
  chieuCaoKho,      // m  — bắt buộc cho Nhóm 5/6/7, ≤ 5.5
  dienTichThucTe    // m² — tùy chọn, dùng cho CT5 K=Stt/S
})
```

### Shape trả về

```js
{
  nhom, chieuCaoPhong, chieuCaoKho, dienTichThucTe,
  bang,              // 'B1' | 'B2' | 'B3' | 'B2+CT3'
  braket,            // 'Phòng ≤ 10 m' | 'Từ 10 đến 12 m' | 'Đến 1 m' | ...
  cuongDoNuoc,       // l/s·m² — null nếu nhóm không áp dụng nước
  cuongDoBot,        // l/s·m² — null nếu nhóm không áp dụng bọt
  luuLuongNuoc,      // l/s
  luuLuongBot,       // l/s
  dienTichTinhToan,  // m² (S)
  thoiGianPhun,      // phút
  khoangCach,        // m
  heSoK,             // Stt/S (1 nếu Stt ≥ S)
  heSoTang,          // CT3 Bảng 2: 1.0–1.5 cho phòng > 10 m
  luuLuongNuocThucTe,
  luuLuongBotThucTe,
  canhBao: [],       // input không hợp lệ
  ghiChu: []         // diễn giải các bước (tra Bảng nào, áp CT gì)
}
```

## 4. Cây quyết định tra bảng

```
                    ┌─ Nhóm 1, 2, 3, 4.1, 4.2 ──┐
chieuCaoPhong ≤ 10 ─┤                            ├─→ Bảng 1
                    └─ Nhóm 5, 6, 7 ────────────┘
                       (kèm chieuCaoKho)         └─→ Bảng 2

                    ┌─ Nhóm 1, 2, 3, 4.1, 4.2 ──┐
10 < chieuCaoPhong  │  (chia 5 dải h: 10-12,    │─→ Bảng 3
≤ 20                │   12-14, 14-16, 16-18,    │
                    │   18-20)                   │
                    │                            │
                    └─ Nhóm 5, 6, 7 ────────────┘
                       (kèm chieuCaoKho)         └─→ Bảng 2 + CT3
                                                    (×1.1 / 1.2 / 1.3 / 1.4 / 1.5)
```

## 5. Schema dữ liệu

### 5.1 Bảng 1 / Bảng 3 (Nhóm 1–4.2)

```js
// Bảng 1
'1':   { i_nuoc: 0.08, i_bot: null, q_nuoc: 10, q_bot: null, S: 60, T: 30, L: 4 }
// 'i_nuoc'/'q_nuoc' = null khi nhóm không áp dụng nước (Nhóm 4.2)
// 'i_bot'/'q_bot' = null khi nhóm không áp dụng bọt (Nhóm 1)
```

Bảng 3 là mảng 5 phần tử theo `hMax` (12, 14, 16, 18, 20). Nhóm 1 chỉ có `{i, q, S}` (chỉ nước); Nhóm 4.2 chỉ có `{i_b, q_b, S}` (chỉ bọt); các nhóm còn lại có cả `i_n/i_b/q_n/q_b/S`.

### 5.2 Bảng 2 (Nhóm 5, 6, 7 kho)

```js
{ hMax: 1.0, n5: { i_n: 0.08, i_b: 0.04, q_n: 15, q_b: 7.5 },
             n6: { i_n: 0.16, i_b: 0.08, q_n: 30, q_b: 15  },
             n7: { i_n: null, i_b: 0.1, q_n: null, q_b: 18 } }
```

5 phần tử theo `hMax` (1, 2, 3, 4, 5.5). Nhóm 7 luôn `i_n/q_n = null` (chỉ áp bọt).

### 5.3 Phụ lục A (phân loại nhóm)

```js
{
  ma, ten, tai_trong, mau,
  co_so: [...]   // danh sách công năng / cơ sở thuộc nhóm
}
```

## 6. Các chú thích đã tự động áp

| CT | Bảng | Tác dụng |
|----|------|----------|
| CT3 Bảng 2 | B2 | Phòng > 10 m → tăng i và q của Nhóm 5/6/7 lên 10% cho mỗi 2 m chiều cao tăng thêm (max ×1.5) |
| CT5 Bảng 1 / CT4 Bảng 3 | B1 / B3 | Stt < S → lưu lượng giảm theo K = Stt/S (áp ở lớp UI để Stt live update) |
| CT1 ghi chú Bảng 1 (²) | B1 | Nhóm 7: thời gian phun 25 phút (mặc định); 15 phút cho hạng A/B/C1; 10 phút cho hạng C2/C3 (chưa làm UI chọn hạng) |

**Chưa làm:**
- CT3 Bảng 1 (phụ gia thẩm thấu → giảm 1.5 lần i, q) — sẽ là toggle "Có phụ gia thẩm thấu" trong tab Tra cứu nhanh.
- CT2 Bảng 2 (Nhóm 6 chữa cao su → dùng nước có phụ gia hoặc bọt bội số nở thấp) — cảnh báo gợi ý.
- CT3, CT4 Phụ lục A (kho thuộc Nhóm 1 → lấy theo Nhóm 2; Nhóm 2 tăng 1.5–2.5 lần theo tải trọng cháy).

## 7. Quy tắc allow chất chữa cháy

| Nhóm | Nước | Bọt | Lý do |
|------|------|-----|-------|
| 1 | ✅ | ❌ | Bảng 1 cột bọt = "—" |
| 2 | ✅ | ✅ | — |
| 3 | ✅ | ✅ | — |
| 4.1 | ✅ | ✅ | — |
| 4.2 | ❌ | ✅ | Bảng 1 cột nước = "—" |
| 5 | ✅ | ✅ | — |
| 6 | ✅ | ✅ | — |
| 7 | ❌ | ✅ | Bảng 2 cột nước = "—" |

UI tự disable nút chất chữa cháy không áp dụng và chuyển active sang nút kia.

## 8. Quy ước hiển thị

- **Cường độ phun**: 3 chữ số thập phân (`0,080` l/s·m²)
- **Lưu lượng**: 1 chữ số thập phân (`30,0` l/s)
- **Diện tích, Thời gian, Khoảng cách**: số nguyên + đơn vị (`120 m²`, `60 phút`, `4 m`)
- Khi Stt < S: thẻ Cường độ / Lưu lượng / Diện tích đều có chip 🟠 **"đã điều chỉnh"** và dòng phụ ghi giá trị gốc + hệ số K.

## 9. Tiến trình đã làm

| Mốc | Nội dung |
|-----|----------|
| 1 | Khung UI 4 tab (Bảng 1/2/3/Phụ lục A) — render table thuần |
| 2 | Phụ lục A có search + highlight (NFD normalize cho tiếng Việt) |
| 3 | Engine.js port từ DuLieuChuaChay.cs — quyết định bảng theo chiều cao, áp CT3 Bảng 2, áp K Stt/S |
| 4 | Tab "Tra cứu nhanh" — form input + 5 thẻ kết quả + diễn giải bước |
| 5 | Toggle "Nước / Dung dịch tạo bọt" — auto disable theo Nhóm |
| 6 | Stt chuyển sang góc panel kết quả, live update không cần bấm Tra cứu lại |
| 7 | Cường độ và Diện tích cũng điều chỉnh theo Stt (cùng chip "đã điều chỉnh") |
| 8 | Re-verify từng số liệu vs PDF — fix Bảng 1 Nhóm 1: i_bot/q_bot = "—" (không có cột bọt) |

## 10. Còn lại / TODO

- [ ] **Toggle "Phụ gia thẩm thấu"** (CT3 Bảng 1) — giảm i, q 1.5 lần.
- [ ] **Chọn hạng nguy hiểm cháy nổ** (A/B/C1/C2/C3) cho Nhóm 7 — đổi thời gian phun (10/15/25 phút).
- [ ] **Tăng cường Nhóm 2 theo tải trọng cháy** (CT4 Phụ lục A: ×1.5 nếu > 1400 MJ/m², ×2.5 nếu > 2200 MJ/m²).
- [ ] **Cảnh báo Nhóm 6 + cao su/nhựa** (CT2 Bảng 2): gợi ý dùng nước có phụ gia hoặc bọt bội số nở thấp.
- [ ] **Tra ngược từ Phụ lục A**: chọn công năng → tự xác định nhóm → trỏ sang tab Tra cứu nhanh.
- [ ] **Export PDF kết quả tra cứu** với tem công ty (Phase 2 — backend).
- [ ] Khi chuyển backend: re-implement `engine.js` thành REST API trả cùng shape; UI thay `TCVN7336_ENGINE.traCuu(...)` bằng `fetch(...)`.

## 11. Đối chiếu chéo

Module được port từ **VPT_PCCC** ([DuLieuChuaChay.cs](file:///C:/Users/Admin/source/repos/VPT_PCCC/VPT_PCCC/DuLieuChuaChay.cs)) — phần mềm desktop của chính chủ. Logic quyết định bảng + áp CT3 Bảng 2 + áp K Stt/S được port nguyên trạng. Đã bổ sung:
- Tách riêng cường độ/lưu lượng theo **nước vs bọt** (VPT_PCCC chỉ có 1 cột `CuongDoPhun`).
- Lookup chi tiết Bảng 2 / Bảng 3 cho cả 2 cột nước & bọt.
- Phụ lục A đầy đủ 8 nhóm + danh sách công năng có search.

## 12. Liên kết

- Tiêu chuẩn nguồn: [modules/tcvn7336/raw/tcvn7336_raw.txt](../../modules/tcvn7336/raw/tcvn7336_raw.txt) (text trích PDF TCVN 7336:2021)
- Entry point: [tcvn7336-lookup.html](../../tcvn7336-lookup.html)
- Engine: [modules/tcvn7336/engine.js](../../modules/tcvn7336/engine.js)
- Dữ liệu Bảng 1: [bang1.js](../../modules/tcvn7336/data/bang1.js) · [bang1.json](../../modules/tcvn7336/data/bang1.json)
- Dữ liệu Bảng 2: [bang2.js](../../modules/tcvn7336/data/bang2.js) · [bang2.json](../../modules/tcvn7336/data/bang2.json)
- Dữ liệu Bảng 3: [bang3.js](../../modules/tcvn7336/data/bang3.js) · [bang3.json](../../modules/tcvn7336/data/bang3.json)
- Dữ liệu Phụ lục A: [phu_luc_a.js](../../modules/tcvn7336/data/phu_luc_a.js) · [phu_luc_a.json](../../modules/tcvn7336/data/phu_luc_a.json)
- Phần mềm gốc tham chiếu: [VPT_PCCC/DuLieuChuaChay.cs](file:///C:/Users/Admin/source/repos/VPT_PCCC/VPT_PCCC/DuLieuChuaChay.cs)
