import { Routes, Route } from "react-router";
import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import EmbedLayout from "../layouts/EmbedLayout";

import HomePage from "../pages/HomePage/HomePage";
import SearchPage from "../pages/SearchPage";
import NotFoundPage from "../pages/NotFoundPage";

import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import VerifyEmail from "../pages/Auth/VerifyEmail";
import Embed from "../pages/Embed";

function ComingSoonPage({ title }) {
  return (
    <div className="max-w-[620px] mx-auto pt-8 px-4">
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-8 text-center shadow-sm">
        <h1 className="text-base font-bold text-neutral-900 mb-1">{title}</h1>
        <p className="text-xs text-neutral-400">
          Tính năng đang được phát triển.
        </p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="activity" element={<ComingSoonPage title="Hoạt động" />} />
        <Route
          path="profile"
          element={<ComingSoonPage title="Trang cá nhân" />}
        />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route element={<EmbedLayout />}>
        <Route path="/:username/post/:postId/embed" element={<Embed />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
