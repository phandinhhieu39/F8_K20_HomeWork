import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import api from "@/services/api";
import AuthLayout from "@/layouts/DefaultLayout/AuthLayout";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // 'loading' | 'error' | 'success'
  const [errorMessage, setErrorMessage] = useState("");
  const isCalledRef = useRef(false);

  useEffect(() => {
    if (isCalledRef.current) return;
    isCalledRef.current = true;

    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setErrorMessage("Liên kết đã hết hạn hoặc không hợp lệ.");
      return;
    }

    const verifyToken = async () => {
      try {
        await api.post("/auth/verify-email", { token });
        setStatus("success");
        // Thành công: chuyển về /login kèm route state { verified: true }
        navigate("/login", { state: { verified: true }, replace: true });
      } catch (err) {
        setStatus("error");
        setErrorMessage(
          err.response?.data?.message ||
            "Liên kết đã hết hạn hoặc không hợp lệ.",
        );
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <AuthLayout>
      <div className="w-full text-center py-4">
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="w-10 h-10 border-4 border-neutral-200 border-t-black rounded-full animate-spin" />
            <p className="text-neutral-500 text-sm font-medium">
              Đang xác minh...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-5 py-4">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs leading-relaxed">
              {errorMessage}
            </div>
            <Link
              to="/login"
              className="block w-full py-3.5 bg-black text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors text-sm text-center"
            >
              Đi tới trang đăng nhập
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
