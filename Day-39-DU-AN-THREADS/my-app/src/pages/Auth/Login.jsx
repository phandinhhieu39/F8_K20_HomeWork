import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch } from "react-redux";
import { loginSuccess, setUserInfo } from "@/store/slices/authSlice";
import api from "@/services/api";
import AuthLayout from "@/layouts/DefaultLayout/AuthLayout";

// Định nghĩa validation bằng Zod
const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, "Vui lòng nhập Email hoặc tên người dùng."),
  password: z.string().min(1, "Vui lòng nhập mật khẩu."),
});

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [apiError, setApiError] = useState("");
  const stateMessage = location.state?.message;
  const isVerified = location.state?.verified;
  const isRegistered = location.state?.registered;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { emailOrUsername: "", password: "" },
  });

  const onSubmit = async (data) => {
    setApiError("");
    const inputValue = data.emailOrUsername.trim();

    const payload = {
      login: inputValue,
      email: inputValue,
      username: inputValue,
      password: data.password,
    };

    try {
      const res = await api.post("/auth/login", payload);
      const tokenData = res.data?.data || res.data;
      const accessToken =
        tokenData?.access_token || tokenData?.token || res.data?.access_token;
      const refreshToken = tokenData?.refresh_token || res.data?.refresh_token;

      // 1. Lưu token vào Redux & LocalStorage
      dispatch(
        loginSuccess({
          access_token: accessToken,
          refresh_token: refreshToken,
          user: tokenData?.user || null,
        }),
      );

      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      // 2. Lấy thông tin user hiện tại và lưu vào Redux
      try {
        const userRes = await api.get("/auth/me");
        const userData = userRes.data?.data || userRes.data;
        if (userData) {
          dispatch(setUserInfo(userData));
        }
      } catch (e) {
        console.log("Lấy thông tin me:", e);
      }

      // 3. Chuyển vào Trang chủ
      navigate("/");
    } catch (err) {
      const resData = err.response?.data;
      setApiError(
        resData?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
      );
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-base font-bold text-center mb-5 tracking-tight">
        Đăng nhập bằng tài khoản Instagram
      </h1>

      {/* Thông báo xác minh thành công từ VerifyEmail */}
      {(stateMessage || isVerified || isRegistered) && (
        <div className="w-full mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs text-center">
          {stateMessage ||
            (isVerified
              ? "Đã xác minh tài khoản thành công. Vui lòng đăng nhập."
              : "Đăng ký tài khoản thành công! Vui lòng đăng nhập.")}
        </div>
      )}

      {/* Thông báo đăng ký thành công */}
      {isRegistered && (
        <div className="w-full mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs text-center">
          Đăng ký tài khoản thành công! Vui lòng đăng nhập.
        </div>
      )}

      {/* Thông báo lỗi API */}
      {apiError && (
        <div className="w-full mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs text-center">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-2.5">
        <div>
          <input
            type="text"
            {...register("emailOrUsername")}
            placeholder="Tên người dùng, số điện thoại hoặc email"
            className={`w-full px-4 py-3.5 rounded-xl bg-[#f5f5f5] text-neutral-900 placeholder:text-neutral-400 text-sm border ${
              errors.emailOrUsername
                ? "border-rose-400 bg-rose-50/30"
                : "border-transparent"
            } focus:outline-none focus:border-neutral-300 transition-colors`}
          />
          {errors.emailOrUsername && (
            <p className="text-rose-500 text-xs mt-1 pl-1">
              {errors.emailOrUsername.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            {...register("password")}
            placeholder="Mật khẩu"
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-1 py-3.5 bg-black text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50 text-sm cursor-pointer"
        >
          {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>

      {/* Link Quên mật khẩu? */}
      <Link
        to="/forgot-password"
        className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors mt-4"
      >
        Quên mật khẩu?
      </Link>

      <div className="flex items-center w-full my-5 text-neutral-300 text-xs">
        <div className="flex-1 border-t border-neutral-200"></div>
        <span className="px-3 text-neutral-400">hoặc</span>
        <div className="flex-1 border-t border-neutral-200"></div>
      </div>

      {/* Thẻ tiếp tục bằng Instagram */}
      <div
        onClick={() => {
          setValue("emailOrUsername", "test1");
          setValue("password", "password123");
        }}
        className="w-full border border-neutral-200 rounded-2xl p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <svg
              className="w-6 h-6 fill-none stroke-white stroke-[2]"
              viewBox="0 0 24 24"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Tiếp tục bằng Instagram</p>
            <p className="text-sm font-bold text-neutral-900 leading-tight">
              phanhieu39
            </p>
          </div>
        </div>
        <svg
          className="w-4 h-4 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      <p className="mt-8 text-center text-xs text-neutral-500">
        Bạn chưa có tài khoản?{" "}
        <Link
          to="/register"
          className="font-bold text-neutral-900 hover:underline"
        >
          Đăng ký
        </Link>
      </p>
    </AuthLayout>
  );
}
