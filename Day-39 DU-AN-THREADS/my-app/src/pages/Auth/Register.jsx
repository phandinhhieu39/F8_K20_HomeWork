import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/services/api";
import AuthLayout from "@/layouts/DefaultLayout/AuthLayout";

// Định nghĩa validation chuẩn với Zod
const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, "Tên hiển thị là bắt buộc.")
      .min(3, "Tên hiển thị tối thiểu 3 ký tự."),
    email: z
      .string()
      .min(1, "Email là bắt buộc.")
      .email("Email không đúng định dạng."),
    password: z.string().min(8, "Mật khẩu phải có tối thiểu 8 ký tự."),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"],
  });

export default function Register() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [usernameDebounceErr, setUsernameDebounceErr] = useState("");
  const [emailDebounceErr, setEmailDebounceErr] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const watchUsername = watch("username");
  const watchEmail = watch("email");

  // Debounce 700ms kiểm tra Username
  useEffect(() => {
    if (!watchUsername || watchUsername.length < 3) {
      setUsernameDebounceErr("");
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(
          `/auth/check-username?username=${encodeURIComponent(watchUsername.trim())}`,
        );
        if (res.data?.exists) {
          setUsernameDebounceErr(
            res.data?.message || "Tên hiển thị này đã được sử dụng.",
          );
        } else {
          setUsernameDebounceErr("");
        }
      } catch (err) {
        // Bỏ qua lỗi 404 nếu backend không có endpoint này
        if (err.response?.status === 409 || err.response?.data?.exists) {
          setUsernameDebounceErr(
            err.response?.data?.message || "Tên hiển thị đã tồn tại.",
          );
        }
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [watchUsername]);

  // Debounce 700ms kiểm tra Email
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!watchEmail || !emailRegex.test(watchEmail)) {
      setEmailDebounceErr("");
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(
          `/auth/check-email?email=${encodeURIComponent(watchEmail.trim())}`,
        );
        if (res.data?.exists) {
          setEmailDebounceErr(
            res.data?.message || "Email này đã được đăng ký.",
          );
        } else {
          setEmailDebounceErr("");
        }
      } catch (err) {
        if (err.response?.status === 409 || err.response?.data?.exists) {
          setEmailDebounceErr(
            err.response?.data?.message || "Email đã tồn tại.",
          );
        }
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [watchEmail]);

  const onSubmit = async (data) => {
    if (usernameDebounceErr || emailDebounceErr) return;
    setApiError("");
    setIsSuccess(false);

    const payload = {
      username: data.username.trim(),
      name: data.username.trim(),
      email: data.email.trim(),
      password: data.password,
      password_confirmation: data.confirmPassword,
    };

    try {
      await api.post("/auth/register", payload);
      setIsSuccess(true);
      reset();
    } catch (err) {
      const resData = err.response?.data;
      if (resData?.errors && typeof resData.errors === "object") {
        const details = Object.entries(resData.errors)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join(" | ");
        setApiError(details);
      } else {
        setApiError(
          resData?.message ||
            "Đăng ký không thành công. Vui lòng kiểm tra lại thông tin.",
        );
      }
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-base font-bold text-center mb-4 tracking-tight">
        Đăng ký tài khoản
      </h1>

      {/* Thông báo thành công nằm giữa tiêu đề và ô input Tên hiển thị */}
      {isSuccess && (
        <div className="w-full mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs text-center leading-relaxed">
          Chúng tôi đã gửi một liên kết xác thực tới email của bạn. Vui lòng
          kiểm tra email để xác thực tài khoản.
        </div>
      )}

      {apiError && (
        <div className="w-full mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs text-center leading-relaxed">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-2.5">
        <div>
          <input
            type="text"
            {...register("username")}
            placeholder="Tên hiển thị"
            className={`w-full px-4 py-3.5 rounded-xl bg-[#f5f5f5] text-neutral-900 placeholder:text-neutral-400 text-sm border ${
              errors.username || usernameDebounceErr
                ? "border-rose-400 bg-rose-50/30"
                : "border-transparent"
            } focus:outline-none focus:border-neutral-300 transition-colors`}
          />
          {(errors.username || usernameDebounceErr) && (
            <p className="text-rose-500 text-xs mt-1 pl-1">
              {errors.username?.message || usernameDebounceErr}
            </p>
          )}
        </div>

        <div>
          <input
            type="email"
            {...register("email")}
            placeholder="Email"
            className={`w-full px-4 py-3.5 rounded-xl bg-[#f5f5f5] text-neutral-900 placeholder:text-neutral-400 text-sm border ${
              errors.email || emailDebounceErr
                ? "border-rose-400 bg-rose-50/30"
                : "border-transparent"
            } focus:outline-none focus:border-neutral-300 transition-colors`}
          />
          {(errors.email || emailDebounceErr) && (
            <p className="text-rose-500 text-xs mt-1 pl-1">
              {errors.email?.message || emailDebounceErr}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            {...register("password")}
            placeholder="Mật khẩu (tối thiểu 8 ký tự)"
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
            placeholder="Xác nhận mật khẩu"
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
          {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-neutral-500">
        Đã có tài khoản?{" "}
        <Link
          to="/login"
          className="font-bold text-neutral-900 hover:underline"
        >
          Đăng nhập
        </Link>
      </p>
    </AuthLayout>
  );
}
