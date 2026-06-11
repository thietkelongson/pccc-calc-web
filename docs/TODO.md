# PCCC Calc — Việc còn dở

> Cập nhật cuối: 2026-06-09 — sau session làm xong module BDC đầy đủ 42 bảng.

## Đang ở đâu

- ✅ Phase 0 (Prototype) xong
- 🟡 **Phase 1 (Frontend)** — module BDC hoàn chỉnh, 8 module còn lại + UX polish
- ⚪ Phase 2 (Backend & Thương mại hóa)
- ⚪ Phase 3 (Mở rộng & Tối ưu)

## Module BDC — phần còn dở

| Việc | Mức độ | Ghi chú |
|---|---|---|
| **Xuất PDF** | Cần làm | Hiện chỉ có export `.docx`. Cách: gọi Word COM `SaveAs2` format 17, hoặc LibreOffice headless. Cần backend. |
| **Backend API thay CLI** | Phase 2 | Frontend hiện download JSON + user chạy `python export.py` thủ công. Khi có server, đổi thành POST `/api/bdc/export` → trả stream `.docx`/`.pdf`. |
| **Parser multi-scenario** | Nice-to-have | B3 (trạm bơm) có 4 bảng riêng cho QCVN02/TCVN4513 — hiện chỉ chọn bảng lớn nhất, mất 3 scenario nhỏ. Cần parser gộp hoặc cho user chọn scenario. |
| **Preamble — danh mục TCVN** | Nice-to-have | Hiện bỏ qua phần liệt kê TCVN/QCVN ở đầu mỗi file A. Có thể parse thêm thành panel "Tiêu chuẩn áp dụng" trong view hồ sơ. |
| **Auto-suggest hệ thống** | Sau khi có engine | Hiện wizard B3 cho user tick thủ công 5 hệ thống. Tương lai: dùng engine QC10 + thông số (chiều cao, DT sàn) → tự đề xuất. |
| **Mapping công trình → hệ thống** | Sau | Field `mapping` trong `index.js` hiện trống. Khi có data Bảng A.1 QC10 đủ, fill mapping → trang chủ gợi ý sẵn. |

## 8 module tính toán còn lại (Phase 1.5)

Thứ tự ưu tiên theo WORKFLOW.md:

1. **FM-200** (đơn giản nhất, NFPA 2001 / TCVN 7161-9)
2. **Tải trọng cháy** (q MJ/m², phân hạng QCVN 06)
3. **Foam** (bể xăng dầu, hóa chất)
4. **Wetting agent** (phụ gia thẩm thấu)
5. **Hút khói & bù khí** (QCVN 06)
6. **Thủy lực giá hàng cao >5.5m** (ESFR)
7. **Hoàn thiện Sprinkler Isometric** — xem [docs/modules/sprinkler-network.md](modules/sprinkler-network.md) (Core 5 ngày + Phase 1.5 vay PipeNet + Phase 2 export)
8. **Bảng đối chiếu sprinkler thiết bị** (K-factor theo NSX) — KHÁC BDC thẩm duyệt

## Frontend chung — Phase 1 còn dở

### 1.1 Auth & Onboarding
- [ ] Trang xác thực email (sau click link)
- [ ] Trang xác minh thẻ sinh viên (.edu.vn + ảnh thẻ)
- [ ] Onboarding wizard sau đăng ký lần đầu

### 1.2 Quản lý tài khoản
- [ ] Trang Profile (avatar, đổi password, xóa account)
- [ ] **Trang Hồ sơ công ty** — logo + tên + mã số thuế (áp dụng vào tem báo cáo). Hiện thông tin dự án nhập theo từng hồ sơ BDC, nhưng logo công ty của user nên lưu chung
- [ ] Trang Project list (toàn bộ dự án qua mọi module, không chỉ BDC)
- [ ] Trang Project detail
- [ ] Modal "Tạo dự án mới"
- [ ] Thùng rác (30 ngày)

### 1.3 Billing & Demo gating
- [ ] Trang Bảng giá (4 gói: Starter / Pro / Business / Sinh viên + FAQ)
- [ ] Trang Nạp credit (UI mock Momo/VNPay/Stripe)
- [ ] Trang Lịch sử giao dịch
- [ ] Modal Paywall ("Cần X credit để thực hiện")
- [ ] Modal Confirm trừ credit ("Sẽ trừ 5 credit, tiếp tục?")
- [ ] **Tích hợp gating vào BDC export**: hiện cho free, sau cần trừ credit khi xuất Word

### 1.6 Trang phụ
- [ ] Cài đặt (theme/language/đơn vị SI vs Imperial)
- [ ] Help / Tài liệu hướng dẫn từng module
- [ ] FAQ
- [ ] Liên hệ
- [ ] Trang Tiêu chuẩn (danh mục TCVN/NFPA/QCVN)
- [ ] Thư viện thiết bị (sprinkler/van/ống)

### 1.7 Polish
- [ ] Mobile responsive (kiểm tra toàn bộ)
- [ ] Loading skeletons
- [ ] **Toast notifications** thay alert() (hiện BDC export dùng alert)
- [ ] Keyboard shortcuts (Ctrl+K search, Ctrl+S save, Esc close)
- [ ] 404 page đẹp
- [ ] Mobile sidebar BDC (hiện responsive hoạt động nhưng chưa được polish)

## Phase 2 — Backend & thương mại hóa

Đại khái cần:
- Chọn stack (Node + Express, FastAPI, hay Laravel?)
- Database: `users`, `companies`, `projects`, `calculations`, `hosos`, `transactions`, `credits`
- JWT + refresh token + OAuth Google
- Email service (SendGrid/Resend)
- API tính toán + lưu trữ
- **API export** (BDC + future modules)
- Tích hợp Momo / VNPay / Stripe
- Lưu file output → S3/R2 + signed URL

## Lưu ý kỹ thuật cần nhớ

- BDC parser **`_row`** trong item là index trong template gốc — đừng đổi schema không thì export hỏng
- Cache busting `?v=N` trong `bdc-lookup.html` — bump khi data thay đổi, không browser sẽ cache JS cũ
- Chạy preview local: `python -m http.server 8765` ở root project (đã có `.claude/launch.json`)
- Re-import 42 BDC khi BCA cập nhật: `& .\modules\bdc\batch_import.ps1; python .\modules\bdc\batch_parse.py`
- `docxcompose` cần cài qua `pip install docxcompose`

## Mở session sau

Bắt đầu bằng:
```
đọc dự án để biết tiến độ
```

Hoặc cụ thể hơn:
```
tiếp tục theo docs/TODO.md, làm mục [X]
```
