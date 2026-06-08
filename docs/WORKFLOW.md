# PCCC Calc — Workflow phát triển

> Cập nhật: 07/06/2026
> Đọc kèm: [PROJECT_NOTES.md](PROJECT_NOTES.md)

## 📊 Trạng thái tổng quan

| Phase | Tên | Tiến độ |
|---|---|---|
| **0** | Khởi tạo & Prototype UI | ✅ Xong |
| **1** | Hoàn thiện Frontend (UI/UX) | 🟡 Đang làm — ~30% |
| **2** | Backend & Thương mại hóa | ⚪ Chưa bắt đầu |
| **3** | Mở rộng & Tối ưu | ⚪ Chưa bắt đầu |

---

## ✅ PHASE 0 — Đã hoàn thành

- [x] **Landing page** (`index.html`) — hero, features, how-it-works, why-us, target users, CTA, footer
- [x] **Dashboard cá nhân** (`dashboard.html`) — topbar credit, sidebar, stats, modules grid, recent projects
- [x] **Module Sprinkler Isometric** (`sprinkler-network.html`) — vẽ 3D, grid pick, ống theo DN, tính Hazen-Williams
- [x] **Preview gộp 3 trang** (`preview.html`)
- [x] **Theme sáng/tối** (toàn bộ trang)
- [x] **Project notes & business model** (`PROJECT_NOTES.md`)
- [x] **Workflow này** (`WORKFLOW.md`)

---

## 🟡 PHASE 1 — Hoàn thiện Frontend

### 1.1 Auth & Onboarding
- [x] Trang **Đăng ký** (`signup.html`) — email + password + role selector + strength bar + 5 credit gift
- [x] Trang **Đăng nhập** (`login.html`) — email + mật khẩu + "Nhớ tôi" + social login mock
- [x] Trang **Quên mật khẩu** (`forgot-password.html`) — 2 state: form và "Đã gửi email"
- [ ] Trang **Xác thực email** — màn hình confirm sau click link
- [ ] Trang **Xác minh thẻ sinh viên** — upload thẻ + email .edu.vn (cho tier giảm 50%)
- [ ] **Onboarding wizard** — sau đăng ký lần đầu: chọn role → nhập hồ sơ công ty → tặng 5 credit demo

### 1.2 Quản lý tài khoản & dự án
- [ ] **Trang Profile cá nhân** — avatar, tên, email, đổi mật khẩu, xóa tài khoản
- [ ] **Trang Hồ sơ công ty** — logo, tên công ty, người thiết kế, mã số thuế → áp dụng vào tem báo cáo
- [ ] **Trang Project list** — danh sách dự án + search + filter theo module + tag + sort
- [ ] **Trang Project detail** — xem chi tiết 1 dự án, các bản tính bên trong, lịch sử chỉnh sửa
- [ ] **Modal "Tạo dự án mới"** — nhập tên, chọn module, chọn tag, gán team (nếu có)
- [ ] **Thùng rác** — dự án đã xóa (giữ 30 ngày)

### 1.3 Billing & Demo gating
- [ ] **Trang Bảng giá chi tiết** — 4 gói (Starter / Pro / Business / Sinh viên) + FAQ
- [ ] **Trang Nạp credit** — chọn gói + cổng thanh toán (UI mock Momo/VNPay/Stripe)
- [ ] **Trang Lịch sử giao dịch** — bảng nạp / trừ credit + filter theo loại / thời gian
- [ ] **Modal Paywall** — hiện khi user free cố lưu/xuất → "Cần X credit để thực hiện thao tác này"
- [ ] **Modal Confirm trừ credit** — trước khi chạy tính: "Sẽ trừ 5 credit, tiếp tục?"

### 1.4 Hoàn thiện Module Sprinkler hiện tại
- [ ] Lưu sơ đồ ra **JSON** (localStorage trước, API sau)
- [ ] Tải lại sơ đồ từ JSON
- [ ] **Preview báo cáo PDF** ngay trong app trước khi export
- [ ] **Preview bản vẽ DXF** (render SVG)
- [ ] **Bảng kết quả chi tiết** — Q/v/i/ΔH theo từng đoạn ống (export ra Excel)
- [ ] **Lưới đẳng áp** (isobaric overlay)
- [ ] **Vòng kín loop** + giải Hardy-Cross
- [ ] **Thư viện phụ kiện** — cút, tê, van với hệ số cản ξ

### 1.5 Các tính năng cốt lõi cần xây dựng (9 mục)

**Tra cứu (2):**
- [x] **Tra cứu QC10** — `qc10-lookup.html` — Port từ phần mềm desktop QCVN10Lookup, 31 loại nhà, đánh giá 4 hệ thống (báo cháy / chữa cháy / họng nước / loa thông báo) theo Bảng A.1/B.1/G.1
- [x] **Tra cứu TCVN 7336** — `tcvn7336-lookup.html` — Bảng 1 (phòng ≤10 m), Bảng 2 (kho Nhóm 5–7), Bảng 3 (phòng 10–20 m) và Phụ lục A (phân loại nhóm nguy cơ + search). Dữ liệu lấy từ TCVN 7336:2021 và đối chiếu phần mềm VPT_PCCC.
- [x] **Bảng đối chiếu thẩm duyệt PCCC** — `bdc-lookup.html` — Hồ sơ thẩm duyệt theo công trình: wizard 4 bước (loại công trình → thông tin dự án → hệ thống áp dụng → xác nhận) → checklist tổng hợp 2 cấp (Phần A tổng quan + Phần B chi tiết từng hệ thống). **Đầy đủ 42 BDC** parse từ `.docx`/`.doc` Bộ Công an (26 công trình A1–A26 + 16 hệ thống B1–B16), tổng **1.850 mục đối chiếu + 65 hình minh hoạ**. Mỗi mục có Quy định + Viện dẫn + Hướng dẫn BCA + textarea điền thiết kế + verdict Đạt/KN/N/A. State lưu localStorage theo hồ sơ. Truy cập BDC đơn lẻ qua hash `#/bdc/<id>`. Script `batch_import.ps1` + `batch_parse.py` để re-import khi BCA cập nhật template. **Export Word** qua `modules/bdc/export.py`: giữ nguyên template gốc + fill preamble (6 mục đầu) + cột "Nội dung thiết kế" + cột "Kết luận" → hồ sơ tổng hợp nhiều BDC ghép vào 1 file Word duy nhất qua `docxcompose`.
- [ ] **Tra cứu bảng đối chiếu sprinkler thiết bị** — K-factor, áp lực, diện tích bảo vệ theo nhà sản xuất (Tyco/Viking/RD…) — khác BDC thẩm duyệt ở trên

**Tính toán thủy lực (2):**
- [x] **Thủy lực TCVN 7336** — đã có module Isometric (cần hoàn thiện thêm)
- [ ] **Thủy lực giá hàng cao > 5.5m** — ESFR / in-rack sprinkler cho nhà kho cao

**Tính toán hệ chữa cháy đặc biệt (3):**
- [ ] **Hệ chữa cháy khí FM-200** — khối lượng, số bình, đường kính ống (NFPA 2001 / TCVN 7161-9)
- [ ] **Hệ chữa cháy bọt FOAM** — dung dịch bọt, foam concentrate cho bể xăng dầu, hóa chất
- [ ] **Chữa cháy có phụ gia thẩm thấu** — wetting agent cho cháy class A vật liệu thấm

**Tính toán khác (2):**
- [ ] **Tải trọng cháy** — mật độ q (MJ/m²), phân hạng nguy hiểm cháy theo QCVN 06:2022
- [ ] **Hút khói & bù khí** — lưu lượng quạt hút khói + quạt cấp khí tươi theo QCVN 06

> Lưu ý: Đây là **toàn bộ phạm vi tính năng** đã chốt (9 mục). Không mở rộng thêm các module khác (Trụ nước, Lối thoát nạn, Đầu báo cháy) — đã loại khỏi scope.

### 1.6 Trang phụ
- [ ] **Trang Cài đặt** — theme, ngôn ngữ, thông báo, đơn vị (SI/Imperial)
- [ ] **Trang Tài liệu / Help** — hướng dẫn dùng từng module
- [ ] **Trang FAQ** — câu hỏi thường gặp về billing, technical
- [ ] **Trang Liên hệ** — form gửi tin nhắn / hotline
- [ ] **Trang Tiêu chuẩn** — danh mục TCVN/NFPA/QCVN có thể tra cứu
- [ ] **Trang Thư viện thiết bị** — sprinkler, van, ống có sẵn thông số

### 1.7 Polish
- [ ] **Mobile responsive** kiểm tra toàn bộ trang
- [ ] **Empty states** đẹp cho list trống
- [ ] **Loading skeletons** cho các page load
- [ ] **Toast notifications** thay alert()
- [ ] **Keyboard shortcuts** (Ctrl+K search, Ctrl+S save, Esc close modal...)
- [ ] **404 page** đẹp

---

## ⚪ PHASE 2 — Backend & Thương mại hóa

### 2.1 Hạ tầng & Auth
- [ ] Chọn stack backend (Node.js + Express / FastAPI / Laravel?)
- [ ] Database schema: `users`, `projects`, `calculations`, `transactions`, `credits`, `companies`
- [ ] JWT auth + refresh token
- [ ] Email service (SendGrid / Resend / SMTP)
- [ ] Xác thực email + reset password
- [ ] OAuth Google / Facebook
- [ ] Rate limiting + security headers

### 2.2 API tính toán & lưu trữ
- [ ] API `POST /projects` — tạo dự án
- [ ] API `GET /projects?filter=...` — list + search
- [ ] API `PUT /projects/:id` — cập nhật
- [ ] API `DELETE /projects/:id` — xóa
- [ ] API `POST /calculations/sprinkler/run` — chạy tính + trừ credit
- [ ] API tương tự cho FM-200, tải trọng cháy, ...

### 2.3 Credit & Payment
- [ ] API `GET /credits/balance`
- [ ] API `POST /credits/topup` — gắn cổng thanh toán
- [ ] Tích hợp **Momo**, **VNPay**, **Stripe** (chọn 1–2 đầu tiên)
- [ ] Webhook xử lý kết quả thanh toán
- [ ] API `GET /transactions` — lịch sử
- [ ] Logic trừ credit atomic (tránh double-spend)

### 2.4 Export server-side
- [ ] **PDF generator** với tem công ty (Puppeteer / wkhtmltopdf / PDFKit)
- [ ] **Excel generator** (ExcelJS)
- [ ] **DXF generator** (cho module Sprinkler)
- [ ] Lưu file vào S3 / Cloudflare R2
- [ ] Link tải có thời hạn (signed URL)

### 2.5 Verify sinh viên
- [ ] Upload ảnh thẻ SV
- [ ] Manual review hoặc OCR auto-verify (.edu.vn)
- [ ] Apply giảm giá vào account

---

## ⚪ PHASE 3 — Mở rộng & Tối ưu

### 3.1 Team & Collaboration
- [ ] Team workspace — mời thành viên qua email
- [ ] Phân quyền: Owner / Editor / Viewer
- [ ] Comment trên bản tính
- [ ] History / Version control của 1 bản tính
- [ ] Notifications khi có thay đổi

### 3.2 Tối ưu & Marketing
- [ ] SEO landing page (meta, schema.org, sitemap)
- [ ] Google Analytics / Plausible
- [ ] Blog kỹ thuật (TCVN updates, case study)
- [ ] Referral program
- [ ] Email marketing (newsletter)

### 3.3 Mở rộng nền tảng
- [ ] **Multi-language EN** — cho thị trường quốc tế
- [ ] **API public** cho lập trình viên
- [ ] **Plugin AutoCAD** — import sơ đồ trực tiếp
- [ ] **Plugin Revit** — đồng bộ MEP
- [ ] **App di động** (PWA hoặc native)
- [ ] **Tiêu chuẩn quốc tế** mở rộng (FM Global, EN 12845)

---

## 🎯 Đề xuất thứ tự ưu tiên ngay tiếp theo

Theo thứ tự nên làm để có MVP frontend hoàn chỉnh nhất:

1. **Auth pages** (Đăng ký + Đăng nhập + Quên mật khẩu) — vì mọi flow đều bắt đầu từ đây
2. **Trang Project list** + **Project detail** — vì dashboard đã link tới
3. **Modal Paywall + Confirm trừ credit** — vì đụng đến mọi module
4. **Trang Bảng giá chi tiết** + **Trang Nạp credit** — hoàn thiện luồng tiền
5. **Hồ sơ công ty + template báo cáo** — vì xuất file cần thông tin này
6. **Module FM-200** — module đơn giản nhất, dễ làm tiếp
7. **Module Tải trọng cháy** — cũng đơn giản, có form rõ
8. **Polish: empty states, loading, toast, 404** — đánh bóng UX
9. Các module phức tạp khác (Foam, Hút khói, Thoát nạn, Đầu báo)
10. Chuyển sang **Phase 2 (Backend)**

---

## 📝 Quy ước file & cấu trúc

```
/
├── index.html              ← Landing (public)
├── dashboard.html          ← Dashboard (logged in)
├── auth/
│   ├── login.html
│   ├── signup.html
│   └── forgot.html
├── account/
│   ├── profile.html
│   ├── company.html
│   ├── billing.html
│   └── transactions.html
├── projects/
│   ├── list.html
│   └── detail.html
├── pricing.html
├── modules/
│   ├── sprinkler-network.html  (đã có)
│   ├── fm200.html
│   ├── fire-load.html
│   ├── hydrant.html
│   ├── foam.html
│   ├── smoke.html
│   ├── evacuation.html
│   └── detector.html
├── help.html
├── faq.html
├── contact.html
├── preview.html            ← Tab gộp (development tool)
├── PROJECT_NOTES.md
└── WORKFLOW.md
```

> **Lưu ý:** Hiện đang prototype HTML thuần. Khi đến Phase 2 nên migrate sang framework (Next.js / Nuxt / SvelteKit) để chia sẻ component & quản lý state tốt hơn.
