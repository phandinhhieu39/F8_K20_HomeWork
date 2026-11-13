import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { logout } from "@/store/slices/authSlice";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const user = useSelector((state) => state.auth?.user);
  const token = localStorage.getItem("access_token");
  const isLoggedIn = !!user || !!token;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLanguage = () => {
    const nextLang = i18n.language?.startsWith("en") ? "vi" : "en";
    i18n.changeLanguage(nextLang);
  };

  const handleLogout = () => {
    setIsOpen(false);
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="relative w-full" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Menu"
        className="w-full h-13 grid place-items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-2xl transition-all text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 196 196"
          width="1em"
          height="1em"
          fill="currentColor"
          className="h-6 w-6 transition-colors duration-200"
        >
          <path
            fill="currentColor"
            stroke="currentColor"
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="23"
            d="M162.12 67.76H14.31M104.59 133.29H14.31"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-14 right-0 md:top-auto md:bottom-16 md:left-2 md:right-auto w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl p-1.5 z-50 text-sm">
          {/* Cài đặt giao diện & Ngôn ngữ */}
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className="w-full px-4 py-2 text-left text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl flex items-center justify-between cursor-pointer"
          >
            <span>Giao diện</span>
            <span>{isDark ? "🌙 Tối" : "☀️ Sáng"}</span>
          </button>

          <button
            type="button"
            onClick={toggleLanguage}
            className="w-full px-4 py-2 text-left text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl flex items-center justify-between cursor-pointer"
          >
            <span>Ngôn ngữ</span>
            <span className="uppercase font-bold">
              {i18n.language?.startsWith("en") ? "EN" : "VI"}
            </span>
          </button>

          <div className="h-[1px] bg-neutral-100 dark:bg-neutral-800 my-1" />

          {!isLoggedIn ? (
            <div className="flex flex-col">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-left font-medium text-xs text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl"
              >
                {t("common.login")}
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-left font-medium text-xs text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl"
              >
                {t("common.register")}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                <p className="text-[11px] text-neutral-400 uppercase font-semibold">
                  Tài khoản
                </p>
                <p className="font-semibold text-neutral-900 dark:text-white truncate text-xs mt-0.5">
                  {user?.name || user?.username || "Thành viên Threads"}
                </p>
              </div>

              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-left font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl text-xs"
              >
                {t("common.profile")}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs cursor-pointer mt-0.5"
              >
                {t("common.logout")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
