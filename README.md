# Project3 Frontend

Ứng dụng web học tập trực tuyến, xây dựng bằng React + Vite. Hỗ trợ nhiều vai trò người dùng: admin, giáo viên (teacher), học viên (student), nhân viên (staff).

## Công nghệ sử dụng

- **React 19** + **Vite** – nền tảng frontend, HMR nhanh
- **React Router** – điều hướng trang
- **TanStack Query** – quản lý dữ liệu bất đồng bộ
- **React Hook Form** + **Zod** – xử lý và validate form
- **Tailwind CSS** – styling
- **Axios** – gọi API
- **shadcn/ui**, **lucide-react** – bộ component UI

## Cấu trúc thư mục

```
src/
├── assets/       # Hình ảnh, tài nguyên tĩnh
├── components/   # Component dùng chung
├── hooks/        # Custom hooks
├── lib/          # Cấu hình thư viện (axios, query client...)
├── pages/        # Các trang theo vai trò (admin, teacher, student, staff, academic, public)
└── utils/        # Hàm tiện ích
```

## Bắt đầu

Cài đặt các gói phụ thuộc:

```bash
npm install
```

Chạy môi trường phát triển:

```bash
npm run dev
```

Build cho production:

```bash
npm run build
```

Xem thử bản build:

```bash
npm run preview
```

Kiểm tra lỗi lint:

```bash
npm run lint
```
