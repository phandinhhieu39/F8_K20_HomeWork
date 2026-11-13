import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/services/api";
import AuthLayout from "@/layouts/DefaultLayout/AuthLayout";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Mật khẩu phải có tối thiểu 8 ký tự."),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Kiểm tra tính hợp lệ của token khi mở trang
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      setIsCheckingToken(false);
      setApiError("Liên kết đã hết hạn hoặc không hợp lệ.");
      return;
    }

    const verifyResetToken = async () => {
      try {
        // Điều chỉnh endpoint nếu Postman collection dùng đường dẫn khác
        await api.post("/auth/verify-reset-token", { token });
        setIsTokenValid(true);
      } catch (err) {
        if (err.response?.status === 404) {
          // Fallback nếu backend không có endpoint pre-check riêng
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
          setApiError(
            err.response?.data?.message ||
              "Liên kết đã hết hạn hoặc không hợp lệ.",
          );
        }
      } finally {
        setIsCheckingToken(false);
      }
    };

    verifyResetToken();
  }, [token]);

  const onSubmit = async (data) => {
    setApiError("");
    try {
      await api.post("/auth/reset-password", {
        token,
        email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });

      navigate("/login", {
        state: {
          message: "Tạo mật khẩu mới thành công, vui lòng đăng nhập.",
        },
      });
    } catch (err) {
      setApiError(
        err.response?.data?.message || "Liên kết đã hết hạn hoặc không hợp lệ.",
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
          />
        </svg>
      </div>

      <h1 className="text-base font-bold text-center mb-1.5 tracking-tight">
        Tạo mật khẩu mới
      </h1>
      <p className="text-xs text-neutral-500 text-center mb-6 leading-relaxed max-w-[300px]">
        Nhập mật khẩu mới của bạn bên dưới.
      </p>

      {apiError && (
        <div className="w-full mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs text-center leading-relaxed">
          {apiError}
        </div>
      )}

      {isCheckingToken ? (
        <div className="flex flex-col items-center justify-center space-y-3 py-6">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-black rounded-full animate-spin" />
          <p className="text-neutral-500 text-xs">Đang kiểm tra liên kết...</p>
        </div>
      ) : isTokenValid ? (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-2.5">
          <div>
            <input
              type="password"
              {...register("password")}
              placeholder="Mật khẩu mới (tối thiểu 8 ký tự)"
              className={`w-full px-4 py-3.5 rounded-xl bg-[#f5f5f5] text-neutral-900 placeholder:text-neutral-400 text-sm border ${
                errors.password
                  ? "border-rose-400 bg-rose-50/30"
                  : "border-transparent"
              } focus:outline-none focus:border-neutral-300 transition-colors`}
            />
            {errors.password && (
              <p className="text-rose-500 text-xs mt-1 pl-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Xác nhận mật khẩu mới"
              className={`w-full px-4 py-3.5 rounded-xl bg-[#f5f5f5] text-neutral-900 placeholder:text-neutral-400 text-sm border ${
                errors.confirmPassword
                  ? "border-rose-400 bg-rose-50/30"
                  : "border-transparent"
              } focus:outline-none focus:border-neutral-300 transition-colors`}
            />
            {errors.confirmPassword && (
              <p className="text-rose-500 text-xs mt-1 pl-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-1 py-3.5 bg-black text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50 text-sm cursor-pointer"
          >
            {isSubmitting ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
          </button>
        </form>
      ) : (
        <Link
          to="/login"
          className="block w-full py-3.5 bg-black text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors text-sm text-center"
        >
          Đi tới trang đăng nhập
        </Link>
      )}

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
