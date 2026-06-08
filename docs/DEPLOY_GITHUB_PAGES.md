# Hướng dẫn Deploy lên GitHub Pages

> Quy trình đã chạy thật ngày 08/06/2026 cho repo `thietkelongson/pccc-calc-web`. Lưu lại để sau cứ theo trình tự mà làm.

## Điều kiện cần

- **Git** đã cài (kiểm tra: `git --version`)
- **GitHub Credential Manager** đã lưu token (kiểm tra: `printf "protocol=https\nhost=github.com\n\n" | git credential fill` — nếu trả về `username=...` và `password=...` là OK)
- Nếu chưa có credential → mở Git Bash, chạy `git clone https://github.com/<bất kỳ repo private nào>` để trigger đăng nhập, hoặc đăng nhập GitHub Desktop một lần
- Tài khoản GitHub có quyền tạo repo public

## A. Lần đầu deploy (repo mới)

### A.1 — Set git config (chỉ chạy 1 lần cho máy)

```bash
git config --global user.name "thietkelongson"
git config --global user.email "thietkelongson@users.noreply.github.com"
git config --global init.defaultBranch main
```

### A.2 — Chuẩn bị thư mục dự án

Trong thư mục dự án tạo 2 file (nếu chưa có):

**`.gitignore`**
```
.DS_Store
Thumbs.db
desktop.ini
*.log
node_modules/
.vscode/
.idea/
```

**`README.md`** — mô tả ngắn cho người vào repo. Nên có link demo Pages.

### A.3 — Init repo + commit

```bash
cd "G:/Other computers/My Computer (1)/Dự án web tính toán PCCC"
git init
git add .
git commit -m "Initial commit: PCCC Calc web prototype"
```

### A.4 — Tạo repo trên GitHub qua API

> Cách này dùng được kể cả khi `github.com` web đang outage — API thường vẫn lên.

```bash
# Lấy token đã lưu trong credential manager
TOKEN=$(printf "protocol=https\nhost=github.com\n\n" | git credential fill 2>/dev/null | grep "^password=" | cut -d= -f2-)

# Ghi JSON payload (tránh quoting bash)
cat > /tmp/repo.json << 'EOF'
{"name":"pccc-calc-web","description":"PCCC Calc - Web tinh toan PCCC","private":false,"has_issues":true,"has_wiki":false,"auto_init":false}
EOF

# Tạo repo
curl -s -X POST \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/user/repos \
  -d @/tmp/repo.json | head -c 400
```

Đổi `"name"`, `"description"` cho dự án khác. `"private":true` nếu muốn ẩn (Pages vẫn chạy nhưng cần GitHub Pro).

**Cách thay thế (UI):** vào https://github.com/new → điền tên → tạo. Sau đó skip bước này.

### A.5 — Push code

```bash
git branch -M main
git remote add origin https://github.com/thietkelongson/pccc-calc-web.git
git push -u origin main
```

Credential manager tự auth bằng token đã lưu. Push xong code đã lên repo.

### A.6 — Bật GitHub Pages qua API

```bash
TOKEN=$(printf "protocol=https\nhost=github.com\n\n" | git credential fill 2>/dev/null | grep "^password=" | cut -d= -f2-)

cat > /tmp/pages.json << 'EOF'
{"source":{"branch":"main","path":"/"}}
EOF

curl -s -X POST \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/thietkelongson/pccc-calc-web/pages \
  -d @/tmp/pages.json
```

Response sẽ có `"html_url": "https://thietkelongson.github.io/pccc-calc-web/"` — đó là URL public.

**Cách thay thế (UI):** vào `https://github.com/<user>/<repo>/settings/pages` → chọn Source: `Deploy from a branch` → Branch: `main` / `/ (root)` → Save.

### A.7 — Chờ build & kiểm tra

- Build lần đầu mất **1–3 phút**.
- Xem tiến trình build: `https://github.com/<user>/<repo>/actions`
- Khi action hiện ✅ → mở `https://<user>.github.io/<repo>/`

## B. Update sau này (đã có repo)

Mỗi lần sửa code, chạy 3 lệnh trong thư mục dự án:

```bash
git add .
git commit -m "Mô tả thay đổi"
git push
```

GitHub Pages tự deploy lại sau **~30–60 giây**. Không cần làm gì thêm.

## C. Troubleshooting

### C.1 — github.com trả 504/502 (outage)
- API (`api.github.com`) thường vẫn lên → tạo repo + bật Pages qua API như bước A.4, A.6.
- Push code có thể bị timeout — đợi 10–30 phút rồi `git push` lại. Commit đã lưu local, không mất.
- Kiểm tra trạng thái: https://www.githubstatus.com/

### C.2 — Push bị "Authentication failed"
- Token credential đã hết hạn (PAT mặc định hết hạn 30 ngày).
- Mở **Windows Credential Manager** → Generic Credentials → tìm `git:https://github.com` → Remove.
- Chạy `git push` lại — sẽ pop trình duyệt cho login lại.

### C.3 — Pages báo 404 sau khi build xong
- Đảm bảo file `index.html` nằm ở **root** repo (không phải trong subfolder).
- Hoặc đổi Source path sang subfolder (vd `/docs`) trong Settings → Pages.

### C.4 — File có space trong tên không load được
- GitHub Pages serve theo URL nên file có space sẽ bị encode `%20`. Vẫn chạy nhưng link xấu.
- Đổi tên file/folder không có space, không có dấu tiếng Việt khi có thể.

### C.5 — Quên đường dẫn dự án trong Git Bash
- Windows path có space cần quote: `cd "G:/Other computers/My Computer (1)/Dự án web tính toán PCCC"`
- Hoặc dùng dấu `\` để escape space.

## D. Bonus: Domain riêng (tùy chọn)

Nếu sau này muốn dùng domain riêng (vd `pccccalc.com`):

1. Mua domain tại Namecheap / Cloudflare Registrar.
2. Trong DNS provider, thêm record:
   - `CNAME @ thietkelongson.github.io`
   - hoặc `A @ 185.199.108.153` (+ 109, 110, 111)
3. Vào repo Settings → Pages → Custom domain → nhập domain → Save.
4. Đợi DNS propagation (~10–60 phút).
5. Bật "Enforce HTTPS" sau khi cert tự cấp xong.

## E. Bonus: Xóa repo (nếu cần)

```bash
TOKEN=$(printf "protocol=https\nhost=github.com\n\n" | git credential fill 2>/dev/null | grep "^password=" | cut -d= -f2-)
curl -s -X DELETE -H "Authorization: token $TOKEN" \
  https://api.github.com/repos/thietkelongson/pccc-calc-web
```

⚠️ **Xóa repo không thể undo** — kiểm tra kỹ tên trước khi chạy.

## F. Reference

- Repo gốc làm theo hướng dẫn này: https://github.com/thietkelongson/pccc-calc-web
- Demo: https://thietkelongson.github.io/pccc-calc-web/
- GitHub REST API docs: https://docs.github.com/rest/repos/repos
- GitHub Pages docs: https://docs.github.com/pages
