import React, { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/services/api";
import AuthLayout from "@/layouts/DefaultLayout/AuthLayout";

const forgotSchema = z.object({
  email: z
    .string()
    .min(1, "Email là bắt buộc.")
    .email("Email không đúng định dạng."),
});

export default function ForgotPassword() {
  const [apiError, setApiError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    setApiError("");
    try {
      await api.post("/auth/forgot-password", { email: data.email.trim() });
      setIsSuccess(true);
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          "Không thể gửi yêu cầu đặt lại mật khẩu lúc này. Vui lòng thử lại sau.",
      );
    }
  };

  return (
    <AuthLayout>
      <div className="w-24 h-24 rounded-full border-2 border-neutral-900 flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 text-neutral-900"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
          <path d="M8 11V7a4 4 0 018 0v4" />
          <circle cx="12" cy="15.5" r="1" fill="currentColor" />
          <path d="M12 16.5v1.5" />
        </svg>
      </div>

      <h1 className="text-base font-bold text-center mb-1.5 tracking-tight">
        Sự cố đăng nhập?
      </h1>
      <p className="text-xs text-neutral-500 text-center mb-6 leading-relaxed max-w-[300px]">
        Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
      </p>

      {isSuccess && (
        <div className="w-full mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs text-center leading-relaxed">
          Liên kết đặt lại mật khẩu đã được gửi tới email của bạn.
        </div>
      )}

      {apiError && (
        <div className="w-full mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs text-center">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-2.5">
        <div>
          <input
            type="email"
            {...register("email")}
            placeholder="Email"
            className={`w-full px-4 py-3.5 rounded-xl bg-[#f5f5f5] text-neutral-900 placeholder:text-neutral-400 text-sm border ${
              errors.email
                ? "border-rose-400 bg-rose-50/30"
                : "border-transparent"
            } focus:outline-none focus:border-neutral-300 transition-colors`}
          />
          {errors.email && (
            <p className="text-rose-500 text-xs mt-1 pl-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-1 py-3.5 bg-black text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50 text-sm cursor-pointer"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi liên kết đăng nhập"}
        </button>
      </form>

      <div className="flex items-center w-full my-6 text-neutral-300 text-xs">
        <div className="flex-1 border-t border-neutral-200"></div>
        <span className="px-3 text-neutral-400">hoặc</span>
        <div className="flex-1 border-t border-neutral-200"></div>
      </div>

      <Link
        to="/login"
        className="font-bold text-xs text-neutral-900 hover:underline"
      >
        Quay lại đăng nhập
      </Link>
    </AuthLayout>
  );
}
