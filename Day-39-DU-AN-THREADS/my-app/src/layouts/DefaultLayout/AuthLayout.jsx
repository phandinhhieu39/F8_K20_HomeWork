import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-white text-neutral-900 flex flex-col justify-between items-center px-4 py-8 relative">
      <div className="hidden sm:block h-4"></div>

      {/* Nội dung form được truyền vào qua children */}
      <div className="w-full max-w-[370px] mx-auto flex flex-col items-center">
        {children}
      </div>

      {/* Khối QR Code góc dưới bên phải (Desktop) */}
      <div className="hidden lg:flex fixed right-8 bottom-12 flex-col items-center">
        <span className="text-[11px] text-neutral-400 mb-2">
          Quét để tải ứng dụng
        </span>
        <div className="p-3 bg-white border border-neutral-200 rounded-2xl shadow-sm">
          <svg className="w-24 h-24" viewBox="0 0 100 100" fill="currentColor">
            <path d="M10 10h30v30h-30zM15 15v20h20v-20zM22 22h6v6h-6zM60 10h30v30h-30zM65 15v20h20v-20zM72 22h6v6h-6zM10 60h30v30h-30zM15 65v20h20v-20zM22 72h6v6h-6zM48 10h5v15h-5zM48 30h5v10h-5zM10 48h15v5h-15zM30 48h10v5h-10zM48 48h10v10h-10zM60 48h12v5h-12zM78 48h12v5h-12zM48 65h5v25h-5zM60 60h8v8h-8zM75 60h15v8h-15zM60 75h10v15h-10zM75 75h8v8h-8zM85 85h5v5h-5z" />
          </svg>
        </div>
      </div>

      {/* Chân trang Footer */}
      <footer className="w-full mt-10 pt-4 text-center text-[11px] text-neutral-400 flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
        <span>© 2025</span>
        <a href="#" className="hover:underline">
          Điều khoản của Threads
        </a>
        <a href="#" className="hover:underline">
          Chính sách quyền riêng tư
        </a>
        <a href="#" className="hover:underline">
          Chính sách cookie
        </a>
        <a href="#" className="hover:underline">
          Báo cáo sự cố
        </a>
      </footer>
    </div>
  );
}
