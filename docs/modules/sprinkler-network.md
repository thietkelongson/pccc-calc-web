# Module Sprinkler Network — TODO

> File chính: `sprinkler-network.html` (~2850 dòng, H3 MVP-B đã xong giao diện + thao tác vẽ)
> Cập nhật: 2026-06-09

## Tổng quan định hướng

Tiêu chuẩn: **TCVN 7336:2021** — phụ kiện cộng +20% vào tổng tổn thất cuối, **không** dùng thư viện Le/D.

Vay mượn:
- **VPTtool** — engine 19 công thức (`CongThucThuyLuc.cs`) + UX domino + form thông số đầu vào
- **PIPENET Vision** — Status Check, Design/Calculate 2-phase, Colour Schemes, Tabular sync, HGL, Add-multiple-pipes, Tagging, minimap, DXF, Word template merge
- **Module sẵn có** — `modules/tcvn7336/engine.js` để tra cường độ/Q/A/T (không port lại)

---

## Phase Core (~5 ngày) — biến nút "⚡ Tính toán" hết stub

### [ ] 1. Engine thuỷ lực — `modules/sprinkler/engine.js`
- [ ] Port 19 hàm từ `VPT_PCCC/CongThucThuyLuc.cs` sang JS pure functions
  - Đổi K (gpm/√psi → L/s/√MPa)
  - Q₁ = i × Stt
  - P₁ = Q₁² / K²
  - ΔP đoạn = Q²·L / (100·Kt)
  - P₂ = P₁ + ΔP
  - Q_sprinkler kế = K·√P
  - Q tích lũy đoạn ống
  - Cân bằng nút giao đối xứng / lệch / **bất đối xứng** (Q'·√(Pmax/Pmin))
  - Đặc tính tổng quát hàng Bp = Q²/Pa
  - Mạch cụt vs mạch vòng (×0.5)
  - Vận tốc v = 4000Q/(π·D²)
  - Check Q_total ≥ Q_TCVN
- [ ] Bảng `DN → Kt` theo TCVN (thép đen, inox, nhựa)
- [ ] Unit test với 1 ví dụ thủ công đã biết kết quả

### [ ] 2. Tab "📋 Thông số TCVN" — thêm vào `sprinkler-network.html`
- [ ] Layout: tab thứ 2 trong cột phải, cạnh "Thuộc tính"
- [ ] Form input:
  - Nhóm nguy cơ (1, 2, 3, 4.1, 4.2, 5, 6, 7) — dropdown
  - Chiều cao phòng (m)
  - Chiều cao xếp hàng (m) — chỉ hiện khi nhóm 5/6/7
  - Diện tích bảo vệ 1 đầu phun Stt (m²)
  - K đầu phun (combobox)
  - Cốt độ bơm hút / đẩy (m)
  - Q vách tường (L/s) — checkbox + ô số
  - Q ngoài nhà (L/s) — checkbox + ô số
- [ ] Gọi `window.TCVN7336_ENGINE.traCuu(...)` mỗi khi input đổi
- [ ] Hiển thị kết quả tra (readonly, nền vàng nhạt):
  - Cường độ phun i (L/ph·m²)
  - Lưu lượng tối thiểu q_min (L/s)
  - Diện tích tính toán S (m²)
  - Thời gian phun T (phút)
  - Khoảng cách max L (m)
  - Bảng tra + ghi chú + cảnh báo (từ engine)
- [ ] Nút "📌 Áp dụng → toàn bộ sprinkler" — bulk set K, pMin, qDesign
- [ ] Lưu vào `state.spec`, persist trong save/load JSON

### [ ] 3. Tree-walk solver — gắn vào nút "⚡ Tính toán"
- [ ] Xác định **sprinkler chủ đạo**: node có `calc.kind='sprinkler'` value '1' (hoặc cờ primary thủ công)
- [ ] BFS từ sprinkler chủ đạo → ngược về source/bơm
- [ ] Mỗi cạnh: gọi hàm engine phù hợp theo `calc.kind` (sprinkler / branch / main)
- [ ] Phân biệt mạch cụt / mạch vòng cho từng đoạn (từ tab Thông số TCVN)
- [ ] Tính ΣQ_sprinkler, so sánh q_min
- [ ] **Áp +20% phụ kiện** vào tổng ΔP cuối
- [ ] + Δz_bơm → Cột áp bơm H_p
- [ ] Lưu kết quả vào `pipe.result = {Q, v, dP}` và `node.result = {P, Q}`
- [ ] Trigger re-render canvas + bảng kết quả

### [ ] 4. Bảng kết quả + khối Trạm bơm
- [ ] Modal/sheet hiện sau khi calc: bảng phẳng từng đoạn (Điểm đầu / Điểm cuối / DN / L / Q nút / P nút / Q ống / v / ΔP)
- [ ] Khối Trạm bơm:
  - Q sprinkler (L/s)
  - Q bơm chính = Q_spr + Q_vách + Q_ngoài_nhà
  - Cột áp bơm chính H_p (m H₂O)
  - Q bơm bù = 1% × Q chính
  - H bơm bù = 110% × H chính
  - V bể = (Q_spr × T_TCVN + Q_ngoài × 180) × 60 / 1000 (m³)
- [ ] Nút "📋 Copy bảng" để paste sang Excel

### [ ] 5. Status Check 🟢🟡🔴 *(vay PipeNet)*
- [ ] Component nhỏ ở topbar, cập nhật realtime
- [ ] Kiểm:
  - Có sprinkler nào được đánh dấu chủ đạo chưa
  - Mọi ống có DN chưa
  - Có liên thông từ sprinkler chủ đạo về node nguồn/bơm chưa
  - Tab Thông số TCVN có đủ input chưa
  - Cốt độ bơm đã nhập chưa
- [ ] Disable nút "⚡ Tính toán" khi 🔴, tooltip nói thiếu gì

### [ ] 6. Cảnh báo đỏ + Auto-adjust *(vay VPT)*

**6a. Danh mục cảnh báo** (kiểm sau mỗi lần calc, lưu vào `pipe.warnings[]` / `node.warnings[]`):

| Mã | Điều kiện | Căn cứ TCVN | Mức | Đối tượng tô |
|---|---|---|---|---|
| `V_MANG` | v > 10 m/s trên ống mạng | B.1.9 | 🔴 lỗi | stroke ống đỏ |
| `V_HUT` | v > 2.8 m/s trên ống hút (đoạn trước bơm) | B.1.9 | 🔴 lỗi | stroke ống đỏ |
| `V_CAO` | 5 < v ≤ 10 m/s | khuyến nghị | 🟡 nhắc | stroke ống vàng |
| `P_VAN` | P tại node > 1.0 MPa | B.3.14 | 🔴 lỗi | node đỏ |
| `Q_THIEU` | ΣQ_sprinkler < q_min tra từ tab TCVN | Bảng 1/2 | 🔴 lỗi | badge tổng |
| `P_MIN_SPR` | P đầu phun < pMin của đầu phun — **ngoài TCVN**, theo catalog NSX (thường 0.05 MPa); để trống pMin thì bỏ qua kiểm này | catalog NSX, không phải 7336 | 🟡 nhắc | node vàng |
| `KT_TRONG` | ống có DN không tồn tại trong bảng Kt của vật liệu đã chọn | — | 🔴 chặn calc | báo trước khi chạy (gộp vào Status Check #5) |

**6b. Hiển thị:**
- [ ] Badge ở thanh status: `🔴 n lỗi · 🟡 m nhắc` — click mở panel danh sách cảnh báo
- [ ] Mỗi dòng trong panel: mã + mô tả + giá trị thực/ngưỡng (VD `v = 11.2 > 10 m/s — ống ③→④ DN50`) — click zoom-to ống/node tương ứng
- [ ] Tooltip khi hover phần tử bị tô màu trên canvas
- [ ] Cảnh báo bị xoá khi state thay đổi (dirty) → buộc calc lại

**6c. Auto-adjust (đã làm — chạy tự động trong `tinhToanThuyLuc()`, không cần nút riêng):**
- [x] Tự kích hoạt khi ΣQ < q_min sau lần solve baseline
- [x] Vòng lặp bump cường độ `i_override` (scale tuyến tính theo target/Q, chặn ×1.005–×2.5/vòng, tối đa 18 vòng) → re-solve toàn mạng — thay cho phương án `Q₁ += 0.01` cũ vì hội tụ nhanh hơn (~3 vòng)
- [x] Dừng khi 1 trong 3: **(a)** q_min ≤ ΣQ ≤ q_min×1.012 → báo `🔄 i: cũ→mới` trong hint; **(b)** xuất hiện ống v > 10 m/s (kể cả ngay từ baseline) → dừng, hint `🛑` + gợi ý DN kế tiếp trong bảng Kt (`quetViPhamVanToc()` / `goiYDNKeTiep()`), gợi ý cũng được đẩy vào `warnings` để hiện trong modal kết quả; **(c)** hết 18 vòng chưa hội tụ → hint `⚠ chưa hội tụ`
- Loop đồng bộ ≤18 vòng nên không cần progress/Cancel như spec cũ

**6d. Nút "🎯 Tự điều chỉnh" + "↩ Mặc định" (đã làm — khác với auto-bump trong ⚡):**
- [x] Nút riêng ở topbar, dò cấu hình: K catalog (80/115/161/202/242) × DN từng ống × mạch trục chính (Q / ½Q)
- [x] Mỗi tổ hợp: `_doSizing()` — pha 1 nâng DN tới khi hết vi phạm (v > 10 nâng ống đó; P_pump > 1 nâng ống có dP lớn nhất), pha 2 hạ DN từng ống (to trước), giữ nếu vẫn sạch
- [x] Ràng buộc: Q ≥ Q_TCVN, v ≤ 10 m/s, P ≤ 1 MPa · mục tiêu: min Σ DN·L, tie-break min H bơm
- [x] Mạch ½Q chỉ áp sau khi `confirm()` (vì là tuyên bố trục chính khép vòng thật); Cancel → lấy phương án tốt nhất không đổi mạch
- [x] Sàn DN khi điều chỉnh: trục chính ≥ DN100, nhánh ≥ DN25 (`dnSanCua`); trục chính = ống có cả 2 đầu không phải sprinkler (`isTrunkPipe`)
- [x] Đổi DN trục chính phải qua `confirm()` liệt kê từng ống; Cancel → dò lại với trục khoá nguyên trạng (`_doSizing(lockTrunk=true)`), chỉ chỉnh nhánh + K
- [x] Trục chính từ đầu phun về bơm chỉ to dần (`trucToDanOK`/`epTrucToDan`, theo `calcResult.trunkPipeIds` thứ tự solve)
- [x] Ống đứng (trục Z iso, dx≈0 trên màn hình — `laOngDung`) luôn tính Q, kịch bản ½Q bỏ qua các ống này
- [x] Mục tiêu chọn phương án (`_chonToiUu`): min Σ DN·L; các phương án vật tư chênh ≤1% coi như ngang nhau → lấy H bơm nhỏ nhất
- [x] `↩ Mặc định` khôi phục DN/K/mạch về snapshot trước lần điều chỉnh đầu
- [x] Cờ `window._silentCalc` bỏ render + bảng chi tiết khi dò (~600ms cho demo 25 ống)
- [ ] Cân nhắc thêm: trần H bơm hoặc trọng số chi phí bơm — hiện min ống thuần túy có thể đẩy H bơm lên sát trần P 1 MPa

### [ ] 7. Properties: tô nền vàng cho kết quả *(vay PipeNet)*
- [ ] CSS: input người dùng nhập → trắng; ô do engine tính → nền vàng nhạt
- [ ] Khi user override ô vàng → đổi về trắng (state dirty)

---

## Phase 1.5 (~6 ngày) — UX nâng cao kiểu PipeNet

### [ ] 8. Design / Calculate 2-phase (D/C button)
- [ ] Toggle 2 chế độ ở topbar
- [ ] **D-phase (Auto-size)**: với ống có DN trống, engine tự chọn DN nhỏ nhất sao cho v ≤ 10 m/s
- [ ] **C-phase**: cố định DN, tính P/Q/v như thường
- [ ] Ô DN do D-phase chọn hiển thị nền vàng (kết hợp với #7)

### [ ] 9. Colour Schemes trên canvas
- [ ] Dropdown ở topbar: None / Velocity / Pressure / DN
- [ ] **Velocity**: xanh <5, vàng 5-10, đỏ >10 m/s — tô màu stroke ống
- [ ] **Pressure**: gradient theo P trên node
- [ ] **DN**: tô màu theo legend hiện có (thay vì chỉ legend tĩnh)
- [ ] Legend động trong góc canvas

### [ ] 10. Tabular view đồng bộ 2 chiều
- [ ] Tab "📊 Bảng" cạnh canvas (hoặc panel dưới)
- [ ] Spreadsheet liệt kê từng đoạn ống + node
- [ ] Filter theo `calc.kind` để mô phỏng 5-tab của VPT
- [ ] Sửa DN ở bảng → canvas re-render
- [ ] Click hàng trong bảng → highlight ống tương ứng trên canvas

### [ ] 11. Add Multiple Pipes dialog
- [ ] Modal: "Từ node X, hướng iso (X+ / Y+ / Z+...), n đoạn × L m, DN = …"
- [ ] Tuỳ chọn: tự sinh sprinkler tại mỗi đầu node mới
- [ ] Tự gán calc-label tăng dần (①②③...)

### [ ] 12. Tagging + Find
- [ ] Topbar: ô "Tag prefix" — node tạo mới tự thêm prefix (VD `F2/SP-3`)
- [ ] Find toolbar: Ctrl+F → tìm node theo label, zoom-to-fit

### [ ] 13. Schematic Overview minimap
- [ ] Cửa sổ nhỏ ở góc dưới phải canvas
- [ ] Hiển thị toàn bộ network thu nhỏ + khung viewport
- [ ] Click/drag để pan

---

## Phase 2 — cần backend hoặc lib nặng

### [ ] 14. Hydraulic Grade Line (HGL) + Elevation Profile
- [ ] Cho user chọn path (chuỗi node) qua nút "🛤 Make Path" hoặc auto chọn từ sprinkler chủ đạo → bơm
- [ ] Đồ thị 2 trục (SVG hoặc Chart.js):
  - X: khoảng cách dọc ống (m)
  - Y: cốt độ (nét đứt) + đường piezometric P+z (đậm)
- [ ] Cảnh báo nếu piezometric chìm dưới cốt độ (áp âm)

### [ ] 15. Export DXF
- [ ] Lib `dxf-writer` hoặc tự sinh text DXF
- [ ] Mapping: ống → LINE, node → BLOCK với attribute label
- [ ] Layer riêng cho từng loại ống (DN50, DN80, ...) — kỹ sư bật/tắt trong CAD

### [ ] 16. Word template merge (cần backend)
- [ ] Template `.docx` có placeholder `{{Q_BomChinh}}`, `{{H_p}}`, `{{table:DoanOng}}`...
- [ ] API `POST /api/sprinkler/export` → trả `.docx`
- [ ] Pattern copy từ `VPT_PCCC/BaoCaoWord.cs`

### [ ] 17. Export PDF
- [ ] Server-side: Word COM `SaveAs2` format 17, hoặc LibreOffice headless

### [ ] 18. Schematic Underlay
- [ ] Upload PNG/PDF mặt bằng kiến trúc
- [ ] Set tỉ lệ (2 điểm chuẩn → biết PX_PER_M)
- [ ] Opacity slider (mặc định 30%)
- [ ] Đặt làm layer dưới grid

### [ ] 19. Lưu dự án vào tài khoản (sau khi có auth)
- [ ] API `POST /api/sprinkler/save` lưu JSON theo user
- [ ] List dự án sprinkler trong Dashboard
- [ ] Gating credit khi export

---

## Quyết định kiến trúc cần chốt trước khi code

1. **Cấu trúc file engine**: 1 file `modules/sprinkler/engine.js` hay tách `formulas.js` + `solver.js`?
2. **State management**: giữ pattern object literal hiện tại của `sprinkler-network.html` hay chuyển sang module pattern (`window.SPRINKLER_STATE = ...`)?
3. **Cách lưu spec TCVN**: trong cùng `state` hay tách `state.spec` riêng để dễ persist?
4. **calc-label làm "primary" như nào**: node có `calc.kind='sprinkler'` và `calc.value='1'` là chủ đạo, hay thêm field `primary: true` riêng?
5. **Định nghĩa "mạch cụt vs vòng" ở đâu**: 1 setting toàn cục trong tab TCVN, hay flag trên từng đoạn ống?

---

## Bắt đầu từ đâu

Đề xuất: **Phase Core mục 2 → 1 → 3**
- #2 trước: thấy UI ngay, user test được flow nhập TCVN
- #1 sau: pure functions, dễ test riêng
- #3 ghép 2 thứ lại: nút Tính toán chạy thật

Sau khi Core 1-7 xong → release thử → lấy phản hồi → chọn 2-3 món Phase 1.5 user kêu thiếu nhất.
