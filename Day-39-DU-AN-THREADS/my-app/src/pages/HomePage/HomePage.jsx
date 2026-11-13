import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import PostCard from "@/components/post/PostCard";
import LoginPanel from "@/components/auth/LoginPanel";
import CreatePostModal from "@/components/post/CreatePostModal";
import postService from "@/services/postService";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("forYou");
  const currentUser = useSelector((state) => state.auth?.user);
  const token = localStorage.getItem("access_token");
  const isLoggedIn = !!currentUser || !!token;

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Quản lý Modal Đăng bài viết mới
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  // Tải danh sách bài viết theo tab và phân trang
  const fetchFeed = useCallback(async (tabName, pageNum, isInitial = false) => {
    if (isInitial) setIsLoading(true);
    else setIsFetchingMore(true);

    try {
      const data = await postService.getFeed(tabName, pageNum);
      const newPosts = data?.data || [];

      if (isInitial) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      setHasMore(newPosts.length >= 10);
    } catch (err) {
      console.log("Lỗi tải feed:", err);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchFeed(activeTab, 1, true);
  }, [activeTab, fetchFeed]);

  // Lắng nghe sự kiện mở modal từ Sidebar nếu có
  useEffect(() => {
    const handleOpenModal = () => setIsCreateOpen(true);
    window.addEventListener("open-create-thread", handleOpenModal);
    return () =>
      window.removeEventListener("open-create-thread", handleOpenModal);
  }, []);

  const handleLoadMore = () => {
    if (!isLoading && !isFetchingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchFeed(activeTab, nextPage, false);
    }
  };

  const infiniteRef = useInfiniteScroll({
    callback: handleLoadMore,
    hasMore,
    isLoading: isLoading || isFetchingMore,
  });

  const handleDeleteSuccess = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // Xử lý khi đăng bài mới thành công: Đưa bài mới lên đầu bảng tin ngay lập tức!
  const handlePostCreated = (newPost) => {
    if (newPost) {
      const postData = newPost.data || newPost;
      setPosts((prev) => [postData, ...prev]);
    }
    showToast("Đã đăng bài viết mới thành công!");
    // Tải lại dữ liệu mới nhất từ server F8
    setTimeout(() => {
      fetchFeed(activeTab, 1, false);
    }, 500);
  };

  return (
    <div className="w-full min-h-screen bg-[#fafafa] relative">
      {/* Toast thông báo */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl animate-in fade-in">
          {toastMsg}
        </div>
      )}

      {/* Container chính */}
      <div
        className={`mx-auto px-2 sm:px-4 pt-4 pb-20 flex justify-center items-start gap-8 transition-all duration-300 ${
          isLoggedIn ? "max-w-[640px]" : "max-w-[1050px]"
        }`}
      >
        {/* ================= CỘT CHÍNH: BẢNG TIN ================= */}
        <div className="w-full max-w-[620px] flex-1">
          {/* Thanh Tab trên cùng */}
          <div className="flex items-center justify-center gap-6 text-sm font-semibold text-neutral-400 border-b border-neutral-200/80 mb-3 px-2">
            <button
              onClick={() => setActiveTab("forYou")}
              className={`pb-3 transition-colors cursor-pointer ${
                activeTab === "forYou"
                  ? "text-black font-bold border-b-2 border-black"
                  : "hover:text-neutral-700"
              }`}
            >
              {t("common.for_you")}
            </button>

            <button
              onClick={() => setActiveTab("following")}
              className={`pb-3 transition-colors cursor-pointer ${
                activeTab === "following"
                  ? "text-black font-bold border-b-2 border-black"
                  : "hover:text-neutral-700"
              }`}
            >
              {t("common.following")}
            </button>

            <button
              onClick={() => setActiveTab("ghost")}
              className={`pb-3 transition-colors cursor-pointer ${
                activeTab === "ghost"
                  ? "text-black font-bold border-b-2 border-black"
                  : "hover:text-neutral-700"
              }`}
            >
              {t("common.ghost_posts")}
            </button>

            <button className="pb-3 text-neutral-400 hover:text-black">
              <div className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center text-xs">
                •••
              </div>
            </button>
          </div>

          {/* Khung bài viết */}
          <div className="border border-neutral-200/80 rounded-2xl bg-white shadow-sm overflow-hidden">
            {/* KHUNG "CÓ GÌ MỚI?" (Click vào là mở Modal tạo bài mới) */}
            {isLoggedIn && (
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between gap-3">
                <div
                  onClick={() => setIsCreateOpen(true)}
                  className="flex items-center gap-3 flex-1 cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-neutral-200 overflow-hidden flex-shrink-0">
                    <img
                      src={currentUser?.avatar_url || "/img/default-avatar.jpg"}
                      alt="avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/img/default-avatar.jpg";
                      }}
                    />
                  </div>
                  <span className="text-neutral-400 text-sm group-hover:text-neutral-600 transition-colors">
                    {t("common.whats_new")}
                  </span>
                </div>

                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="px-4 py-1.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  {t("common.post")}
                </button>
              </div>
            )}

            {/* DANH SÁCH BÀI VIẾT */}
            {isLoading ? (
              <div className="p-12 text-center text-neutral-400 flex flex-col items-center justify-center">
                <div className="w-6 h-6 border-2 border-neutral-300 border-t-black rounded-full animate-spin mb-3"></div>
                <span className="text-sm">Đang tải bài viết...</span>
              </div>
            ) : posts.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onDeleteSuccess={handleDeleteSuccess}
                  />
                ))}

                <div
                  ref={infiniteRef}
                  className="py-4 text-center text-xs text-neutral-400"
                >
                  {isFetchingMore ? (
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-4 h-4 border-2 border-neutral-300 border-t-black rounded-full animate-spin" />
                      <span>Đang tải thêm...</span>
                    </div>
                  ) : hasMore ? (
                    <span>Cuộn để xem thêm</span>
                  ) : (
                    <span>Bạn đã xem hết bài viết.</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-neutral-400 text-sm">
                Không có bài viết nào trong tab này.
              </div>
            )}
          </div>
        </div>

        {/* ================= CỘT PHẢI: LOGIN PANEL (Khi chưa đăng nhập) ================= */}
        {!isLoggedIn && (
          <aside className="hidden lg:block sticky top-6 flex-shrink-0">
            <LoginPanel />
          </aside>
        )}
      </div>

      {/* NÚT NỔI (+) GÓC DƯỚI BÊN PHẢI (Click vào là mở Modal tạo bài) */}
      {isLoggedIn && (
        <button
          onClick={() => setIsCreateOpen(true)}
          className="fixed right-6 bottom-6 md:right-8 md:bottom-8 w-14 h-14 bg-white rounded-2xl border border-neutral-200/80 shadow-lg hover:shadow-xl flex items-center justify-center text-neutral-900 transition-all hover:scale-105 cursor-pointer z-40"
          title="Tạo thread mới"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      )}

      {/* MODAL TẠO BÀI VIẾT MỚI */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPostSuccess={handlePostCreated}
      />
    </div>
  );
}
