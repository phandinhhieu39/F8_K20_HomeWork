import React, { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch } from "react-redux";
import { loginSuccess, setUserInfo } from "@/store/slices/authSlice";
import api from "@/services/api";

const panelSchema = z.object({
  login: z.string().min(1, "Vui lòng nhập tài khoản."),
  password: z.string().min(1, "Vui lòng nhập mật khẩu."),
});

export default function LoginPanel() {
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(panelSchema),
    defaultValues: { login: "", password: "" },
  });

  const onSubmit = async (data) => {
    setErrorMsg("");
    const val = data.login.trim();
    try {
      const res = await api.post("/auth/login", {
        login: val,
        email: val,
        username: val,
        password: data.password,
      });
      const tokenData = res.data?.data || res.data;
      const accessToken =
        tokenData?.access_token || tokenData?.token || res.data?.access_token;
      const refreshToken = tokenData?.refresh_token || res.data?.refresh_token;

      dispatch(
        loginSuccess({
          access_token: accessToken,
          refresh_token: refreshToken,
          user: tokenData?.user || null,
        }),
      );
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      try {
        const userRes = await api.get("/auth/me");
        const userData = userRes.data?.data || userRes.data;
        if (userData) dispatch(setUserInfo(userData));
      } catch (e) {}
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại.",
      );
    }
  };

  return (
    <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm w-[360px]">
      <h2 className="text-base font-bold text-center mb-1 tracking-tight text-neutral-900">
        Đăng nhập bằng tài khoản Instagram
      </h2>
      <p className="text-xs text-neutral-400 text-center mb-5">
        Đăng nhập để xem thêm bài viết và tương tác
      </p>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
        <div>
          <input
            type="text"
            {...register("login")}
            placeholder="Tên người dùng, số điện thoại hoặc email"
            className="w-full px-4 py-3.5 rounded-xl bg-[#f5f5f5] text-neutral-900 placeholder:text-neutral-400 text-sm border border-transparent focus:outline-none focus:border-neutral-300"
          />
          {errors.login && (
            <p className="text-rose-500 text-xs mt-1 pl-1">
              {errors.login.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            {...register("password")}
            placeholder="Mật khẩu"
            className="w-full px-4 py-3.5 rounded-xl bg-[#f5f5f5] text-neutral-900 placeholder:text-neutral-400 text-sm border border-transparent focus:outline-none focus:border-neutral-300"
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

      <div className="text-center mt-3">
        <Link
          to="/forgot-password"
          className="text-xs text-neutral-400 hover:text-neutral-600"
        >
          Quên mật khẩu?
        </Link>
      </div>

      <div className="flex items-center w-full my-4 text-neutral-300 text-xs">
        <div className="flex-1 border-t border-neutral-200" />
        <span className="px-3 text-neutral-400">hoặc</span>
        <div className="flex-1 border-t border-neutral-200" />
      </div>

      <div
        onClick={() => {
          setValue("login", "test1");
          setValue("password", "password123");
        }}
        className="w-full border border-neutral-200 rounded-2xl p-3 flex items-center justify-between hover:bg-neutral-50 cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white text-xs font-bold">
            IG
          </div>
          <div>
            <p className="text-[11px] text-neutral-500">
              Tiếp tục bằng Instagram
            </p>
            <p className="text-xs font-bold text-neutral-900">phanhieu39</p>
          </div>
        </div>
        <span className="text-neutral-400 text-xs">→</span>
      </div>

      <p className="mt-5 text-center text-xs text-neutral-500">
        Bạn chưa có tài khoản?{" "}
        <Link
          to="/register"
          className="font-bold text-neutral-900 hover:underline"
        >
          Đăng ký
        </Link>
      </p>
    </div>
  );
}
