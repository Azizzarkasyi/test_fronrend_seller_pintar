# Test Frontend Web Developer - Article Management System

Sebuah aplikasi manajemen artikel dengan role-based authentication yang dibangun dengan Next.js 15, TypeScript, dan Tailwind CSS.

## 🚀 Live Demo

- **Vercel Deployment**: [Coming Soon]
- **GitHub Repository**: [Coming Soon]

## ✨ Features

### 👤 User Features

- **Authentication**

  - Login dengan validasi form (React Hook Form + Zod)
  - Register dengan validasi form
  - Auto redirect ke articles setelah login/register
  - Logout dengan redirect ke login page

- **List Artikel**

  - Filter artikel berdasarkan kategori
  - Searching artikel dengan debounce (400ms)
  - Pagination (9 items per page)
  - Responsive design

- **Detail Artikel**
  - Tampilan artikel lengkap dengan konten
  - Related articles (maksimal 3 dari kategori yang sama)
  - Responsive layout

### 👨‍💼 Admin Features

- **Authentication**

  - Login/Register dengan validasi form
  - Auto redirect ke admin dashboard
  - Protected admin routes dengan middleware

- **Category Management**

  - List categories dengan search dan pagination (10 items per page)
  - Create category dengan form validation
  - Edit category dengan form validation
  - Delete category functionality

- **Article Management**
  - List articles dengan filter kategori dan search (debounce 400ms)
  - Pagination (10 items per page)
  - Create article dengan form validation dan preview
  - Edit article dengan form validation dan preview
  - Delete article functionality

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API Client**: Axios
- **Icons**: Lucide React
- **Form Validation**: React Hook Form + Zod
- **Authentication**: JWT dengan middleware protection

## 📁 Project Structure

```
test_frontend/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── articles/
│   │   │   │   ├── create/page.tsx
│   │   │   │   ├── [id]/edit/page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── categories/
│   │   │       ├── create/page.tsx
│   │   │       ├── [id]/edit/page.tsx
│   │   │       └── page.tsx
│   │   ├── articles/
│   │   │   ├── [id]/page.tsx
│   │   │   └── page.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   └── components/ (if any)
├── lib/
│   └── validation/
│       └── loginSchema.tsx
├── utils/
│   ├── axiosInstance.tsx
│   └── articlesAPI.tsx
├── middleware.ts
└── package.json
```

## 🔧 Installation & Setup

1. Clone repository:

```bash
git clone [repository-url]
cd test_frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run development server:

```bash
npm run dev
```

4. Open [http://localhost:3001](http://localhost:3001)

## 🌐 API Integration

Base URL: `https://test-fe.mysellerpintar.com/api`

### Authentication Endpoints

- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Articles Endpoints

- `GET /articles` - Get all articles
- `GET /articles/:id` - Get article by ID

## 🔐 Authentication & Authorization

### Role-Based Access Control

- **User Role**: Akses ke halaman articles dan detail artikel
- **Admin Role**: Akses ke admin dashboard, management artikel dan kategori

### Middleware Protection

File `middleware.ts` melindungi route berdasarkan role:

- `/articles` - User & Admin
- `/admin/*` - Admin only
- Public routes: `/`, `/login`, `/register`, `/unauthorized`

### Admin Test Account

```
Username: myadmin
Password: password123
```

## 📱 Responsive Design

Aplikasi fully responsive dengan breakpoint:

- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## 🎨 UI/UX Features

- **Loading States**: Skeleton loading dan spinner
- **Error Handling**: Toast messages dan error boundaries
- **Success Messages**: Feedback untuk aksi berhasil
- **Form Validation**: Real-time validation dengan error messages
- **Debounced Search**: Optimized search performance (400ms)
- **Pagination**: Efficient data loading

## 🧪 Testing Account

### Admin Account

```
Username: myadmin
Password: password123
Role: Admin
```

### Regular User Account

```
Username: testuser
Password: password123
Role: User
```

## 📝 Development Notes

### Backup Data

Aplikasi menggunakan mock data sebagai backup jika API tidak available:

- Mock articles data di `utils/articlesAPI.tsx`
- Mock categories data di admin pages

### Form Validation Rules

- **Article Title**: Minimal 5 karakter
- **Article Content**: Minimal 50 karakter
- **Article Excerpt**: Minimal 20 karakter
- **Category Name**: Minimal 2 karakter
- **Username**: Minimal 3 karakter
- **Password**: Minimal 6 karakter

### Debounce Configuration

- Search articles: 400ms
- Search categories: 400ms
- Sesuai requirement (300-500ms)

## 🚀 Deployment

### Build Commands

```bash
# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

# or

pnpm dev

# or

bun dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
```
