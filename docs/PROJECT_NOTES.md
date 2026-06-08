# PCCC Calc — Ghi chú dự án

## Mục đích

Web app cung cấp **9 công cụ cốt lõi** cho thiết kế PCCC:

**Tra cứu (2):**
1. Tra cứu QC10
2. Tra cứu bảng đối chiếu

**Tính toán thủy lực (2):**
3. Thủy lực Sprinkler theo TCVN 7336
4. Thủy lực với giá hàng cao trên 5.5m

**Tính toán hệ chữa cháy (3):**
5. Hệ chữa cháy khí FM-200
6. Hệ chữa cháy bọt FOAM
7. Chữa cháy có thêm chất phụ gia thẩm thấu

**Tính toán khác (2):**
8. Tải trọng cháy
9. Hút khói & bù khí

> Đây là **toàn bộ phạm vi** của hệ thống — đã chốt ngày 07/06/2026.

## Mô hình kinh doanh

- **Chia sẻ rộng rãi** — bất kỳ ai cũng có thể tiếp cận trang web
- **Yêu cầu tài khoản** — phải đăng nhập để sử dụng bảng tính
- **Trả phí theo lượt** — mỗi lần chạy bảng tính sẽ phát sinh phí
- **Mô hình giá chưa chốt** → UI thiết kế linh hoạt, dễ chuyển đổi giữa:
  - Credit / số dư (nạp trước, trừ theo lượt)
  - Thanh toán từng lần (cổng thanh toán trực tiếp)
  - Gói thuê bao + credit bổ sung

→ **Lưu ý kiến trúc:** tách rõ lớp "billing/credit" khỏi lớp "tính toán" để dễ đổi mô hình mà không phải sửa logic core.

## Đối tượng người dùng

Đa dạng — UI phải phục vụ được cả 4 nhóm:

| Nhóm | Đặc điểm sử dụng |
|---|---|
| Kỹ sư thiết kế PCCC (cá nhân/freelance) | Cần tốc độ, lưu nhiều dự án, xuất hồ sơ chuyên nghiệp |
| Công ty thiết kế MEP | Team nhiều người, cần share dự án nội bộ, phân quyền |
| Nhà thầu thi công PCCC | Tính nhanh để báo giá, không cần báo cáo quá chi tiết |
| Sinh viên / nghiên cứu | Học tập, làm đồ án — nhạy cảm với giá, có thể cần tier rẻ |

## Tier miễn phí (Free Demo)

- Cho phép **dùng thử bảng tính + xem kết quả tóm tắt** miễn phí
- Các thao tác cần trả phí:
  - **Lưu** dự án vào tài khoản
  - **Xuất** file (PDF/Excel/DXF/PNG)
  - Xem **báo cáo chi tiết đầy đủ** theo tiêu chuẩn

→ UI cần phân biệt rõ: phần nào là preview free, phần nào ẩn/khóa cho đến khi trả phí (kèm CTA upgrade).

## Đầu ra (Deliverable) sau khi trả phí

User có thể download cả 3 dạng file:

1. **📄 Báo cáo PDF có tem** — in được, có logo/tem công ty (cho phép tùy biến header), kèm công thức + viện dẫn tiêu chuẩn
2. **📊 File Excel bảng tính** — XLSX, user có thể chỉnh sửa tiếp ngoài hệ thống
3. **📐 Bản vẽ sơ đồ** — DXF (CAD), SVG (web/in), PNG (preview nhanh) — đặc biệt cho module Sprinkler isometric

→ Nên có thiết kế **template báo cáo có thể tùy chỉnh** (logo, tên công ty, người thiết kế, ngày tháng) lưu theo tài khoản.

## Tính năng lưu trữ

- Đăng nhập / quản lý tài khoản cá nhân
- Lưu lại bảng tính và sơ đồ của các dự án đã tạo
- Truy cập lại dự án cũ → xem, chỉnh sửa, xuất lại (xuất lại đã trả phí không cần trả lại?)
- Cần xem xét: chia sẻ dự án trong team (cho nhóm MEP)

## Hệ quả thiết kế (cần phản ánh trong UI)

| Khía cạnh | Yêu cầu UI |
|---|---|
| Auth | Trang đăng nhập / đăng ký / quên mật khẩu / xác thực email |
| Demo gating | Phân biệt rõ feature free vs paid, có CTA upgrade rõ ràng |
| Billing | Hiển thị số dư / gói cước; xác nhận phí trước khi tính / xuất |
| Pricing page | Bảng giá module + so sánh gói, có tính cho đối tượng sinh viên |
| Output | Nút "Export" có submenu PDF / Excel / DXF / SVG / PNG |
| Template báo cáo | Trang setup logo + thông tin công ty, áp dụng vào mọi export |
| Lịch sử dự án | List, search, tag, filter theo loại module |
| Team workspace | (Phase 2) Mời thành viên, phân quyền xem/sửa |
| Đa đối tượng | Có thể có tier giá riêng cho sinh viên (cần xác minh) |

## Định hướng phát triển

### Phase 1 — MVP
1. Dashboard cá nhân (đang làm)
2. Trang Auth (login / signup / forgot)
3. Module Thủy lực Sprinkler hoàn chỉnh (sơ đồ isometric + tính + export)
4. Module Tải trọng cháy
5. Module FM-200
6. Trang Profile + Template báo cáo
7. Lưu/mở dự án theo tài khoản
8. Demo gating + nút upgrade

### Phase 2 — Thương mại hóa
9. Tích hợp cổng thanh toán (Momo/VNPay/Stripe)
10. Hệ thống credit/billing
11. Pricing page
12. Các module PCCC còn lại

### Phase 3 — Team & Scale
13. Team workspace, phân quyền
14. Tier sinh viên (giá ưu đãi, có xác minh)
15. API / tích hợp với phần mềm CAD/Revit
16. Multi-language (EN)

## Các điểm còn cần làm rõ về sau

- Sinh viên có cần xác minh không (qua email .edu.vn)? Hay tự khai báo?
- Xuất lại file đã trả phí trước đó — miễn phí hay tính lại?
- Tem báo cáo: có cần chữ ký số / pháp lý không, hay chỉ là branding?
- Lưu trữ: giới hạn số dự án theo gói? Hay không giới hạn?
- Tiêu chuẩn quốc tế (NFPA, FM Global) có cần làm song song với TCVN không?
