# Wedding Website

Website thiệp cưới tương tác cho Đàm Minh Tiến và Nguyễn Minh Thuỳ, xây dựng bằng React, Vite và Tailwind CDN.

## Chạy Local

```bash
npm install
npm run dev
```

Vite sẽ khởi động tại địa chỉ local, mặc định theo cấu hình:

```text
http://127.0.0.1:5173
```

## Build

```bash
npm run build
```

Lệnh build sẽ tạo thư mục `dist/` và copy các asset cần thiết:

- `assets/images-optimized`
- `assets/seo`

Có thể kiểm tra bản build bằng:

```bash
npm run preview
```

## Cấu Trúc Chính

- `index.html`: metadata SEO, favicon, Open Graph, Twitter card và khai báo font.
- `index.jsx`: toàn bộ giao diện React, dữ liệu sự kiện, timeline, gallery, modal và mobile action bar.
- `assets/images-optimized/thumbs`: ảnh WebP dùng cho gallery thumbnail.
- `assets/images-optimized/large`: ảnh WebP lớn dùng cho hero và lightbox.
- `assets/seo`: favicon, manifest và thumbnail chia sẻ mạng xã hội.

## Cập Nhật Nội Dung

Nội dung lễ cưới nằm trong các hằng số đầu file `index.jsx`:

- `EVENT`: tên cô dâu chú rể, ngày giờ, địa điểm nhà trai, thông tin hai gia đình.
- `WEDDING_EVENTS`: thông tin sự kiện nhà gái và nhà trai, gồm link Google Maps.
- `STORY`: mốc hẹn hò.
- `GALLERY`: danh sách ảnh hiển thị trên album.

Khi thêm ảnh mới, đặt ảnh đã tối ưu vào cả hai thư mục `thumbs` và `large`, sau đó thêm tên file vào `GALLERY` trong `index.jsx`.

## Lưu Ý Triển Khai

Website đang dùng đường dẫn asset bắt đầu bằng `/assets/...`, phù hợp khi deploy ở root domain. Nếu deploy trong subpath, cần cấu hình lại base path của Vite hoặc điều chỉnh đường dẫn asset.
