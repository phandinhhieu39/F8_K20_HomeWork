import React, { useState, useRef, useEffect } from "react";
import copy from "copy-to-clipboard";
import { toPng } from "html-to-image";
import InteractionBar from "./InteractionBar";
import ReplyModal from "./ReplyModal";
import EmbedModal from "./EmbedModal";
import postService from "@/services/postService";
import { useSelector } from "react-redux";

const REPORT_REASONS = [
  "Nội dung spam hoặc lừa đảo",
  "Ngôn từ thù ghét hoặc quấy rối",
  "Thông tin sai lệch",
  "Nội dung nhạy cảm hoặc bạo lực",
  "Vi phạm bản quyền",
];

const getAllMediaUrls = (post) => {
  const urls = [];
  const checkAndAdd = (val) => {
    if (!val) return;
    if (typeof val === "string") {
      const s = val.trim();
      if (
        s.match(/\.(jpeg|jpg|gif|png|webp|svg|mp4|webm|mov)($|\?)/i) ||
        s.includes("storage") ||
        s.includes("uploads") ||
        s.includes("giphy") ||
        s.includes("cloudinary") ||
        s.startsWith("http://") ||
        s.startsWith("https://")
      ) {
        let fullUrl = s;
        if (
          !fullUrl.startsWith("http://") &&
          !fullUrl.startsWith("https://") &&
          !fullUrl.startsWith("data:")
        ) {
          fullUrl = `https://threads.f8team.dev/${fullUrl.replace(/^\/+/, "")}`;
        }
        if (!urls.includes(fullUrl) && !fullUrl.includes("default-avatar")) {
          urls.push(fullUrl);
        }
      }
    } else if (Array.isArray(val)) {
      val.forEach(checkAndAdd);
    } else if (typeof val === "object") {
      Object.values(val).forEach(checkAndAdd);
    }
  };

  Object.entries(post).forEach(([key, value]) => {
    if (key !== "user" && key !== "author") checkAndAdd(value);
  });
  return urls;
};

export default function PostCard({ post, onDeleteSuccess }) {
  const mediaList = getAllMediaUrls(post);
  const currentUser = useSelector((state) => state.auth?.user);
  const cardRef = useRef(null);
  const menuRef = useRef(null);

  const [postContent, setPostContent] = useState(post.content || "");
  const [repliesCount, setRepliesCount] = useState(
    Number(post.replies_count || 0),
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(Boolean(post.is_saved));
  const [toastMsg, setToastMsg] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  // Modal Reply, Quote, Embed
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);

  // Modal Edit, Confirm (Block / Delete), Report
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const [confirmModal, setConfirmModal] = useState(null); // 'block' | 'delete' | null
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);

  const isOwner = currentUser?.id && currentUser.id === post.user?.id;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  const handleCopyAsImage = async () => {
    if (!cardRef.current) return;
    try {
      showToast("Đang tạo ảnh xem trước...");
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      setImagePreviewUrl(dataUrl);
    } catch (err) {
      showToast("Không thể xuất ảnh lúc này.");
    }
  };

  const handleSaveToggle = async () => {
    setMenuOpen(false);
    try {
      if (isSaved) {
        await postService.unsavePost(post.id);
        setIsSaved(false);
        showToast("Đã bỏ lưu bài viết");
      } else {
        await postService.savePost(post.id);
        setIsSaved(true);
        showToast("Đã lưu vào bộ sưu tập");
      }
    } catch (e) {
      showToast("Không thể cập nhật trạng thái lưu.");
    }
  };

  const handleCopyLink = () => {
    setMenuOpen(false);
    copy(
      `${window.location.origin}/${post.user?.username || "user"}/post/${post.id}`,
    );
    showToast("Đã sao chép liên kết vào clipboard!");
  };

  const handleNotInterested = async () => {
    setMenuOpen(false);
    try {
      await postService.notInterested(post.id);
      showToast("Đã ẩn bài viết này khỏi bảng tin");
      onDeleteSuccess?.(post.id);
    } catch (e) {
      showToast("Không thể thực hiện thao tác.");
    }
  };

  const handleMute = async () => {
    setMenuOpen(false);
    try {
      if (post.user?.id) await postService.muteUser(post.user.id);
      showToast(`Đã tắt tiếng ${post.user?.name || "người dùng"}`);
    } catch (e) {
      showToast("Không thể tắt tiếng người dùng.");
    }
  };

  const handleRestrict = async () => {
    setMenuOpen(false);
    try {
      if (post.user?.id) await postService.restrictUser(post.user.id);
      showToast(`Đã hạn chế ${post.user?.name || "người dùng"}`);
    } catch (e) {
      showToast("Không thể hạn chế người dùng.");
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmModal || isActionLoading) return;
    setIsActionLoading(true);
    try {
      if (confirmModal === "block") {
        if (post.user?.id) await postService.blockUser(post.user.id);
        showToast("Đã chặn tài khoản");
        setConfirmModal(null);
        onDeleteSuccess?.(post.id);
      } else if (confirmModal === "delete") {
        await postService.deletePost(post.id);
        showToast("Đã xóa bài viết");
        setConfirmModal(null);
        onDeleteSuccess?.(post.id);
      }
    } catch (e) {
      showToast("Thao tác thất bại, vui lòng thử lại.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSubmitReport = async () => {
    setIsActionLoading(true);
    try {
      await postService.reportPost(post.id, reportReason);
      setIsReportOpen(false);
      showToast("Đã gửi báo cáo bài viết!");
    } catch (e) {
      showToast("Gửi báo cáo thất bại.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!editContent.trim() || isUpdating) return;
    setIsUpdating(true);
    try {
      await postService.updatePost(post.id, { content: editContent.trim() });
      setPostContent(editContent.trim());
      setIsEditOpen(false);
      showToast("Đã cập nhật bài viết!");
    } catch (e) {
      showToast("Không thể cập nhật bài viết.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div
        ref={cardRef}
        className="w-full p-4 sm:p-5 bg-white hover:bg-neutral-50/50 transition-colors relative"
      >
        {toastMsg && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white text-xs font-medium px-4 py-2.5 rounded-2xl shadow-xl">
            {toastMsg}
          </div>
        )}

        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              className="w-10 h-10 rounded-full bg-neutral-200 object-cover"
              src={post.user?.avatar_url || "/img/default-avatar.jpg"}
              alt={post.user?.name || "avatar"}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/img/default-avatar.jpg";
              }}
            />
          </div>

          {/* Cột nội dung */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-neutral-900 text-sm hover:underline cursor-pointer">
                  {post.user?.name || post.user?.username || "Người dùng"}
                </span>

                {post.user?.is_verified && (
                  <svg
                    className="w-3.5 h-3.5 text-blue-500 fill-current flex-shrink-0"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.2 14.2l-3.5-3.5 1.4-1.4 2.1 2.1 5.6-5.6 1.4 1.4-7 7z" />
                  </svg>
                )}

                <span className="text-neutral-400 text-xs font-normal">
                  {post.created_at_human || "1d"}
                </span>
              </div>

              {/* Menu ba chấm */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full transition cursor-pointer"
                  title="Tùy chọn"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-8 w-48 bg-white border border-neutral-200 rounded-2xl shadow-xl p-1.5 z-50 text-xs font-medium">
                    <button
                      onClick={handleSaveToggle}
                      className="w-full px-3 py-2 text-left hover:bg-neutral-100 rounded-xl cursor-pointer"
                    >
                      {isSaved ? "Bỏ lưu bài viết" : "Lưu vào bộ sưu tập"}
                    </button>
                    <button
                      onClick={handleNotInterested}
                      className="w-full px-3 py-2 text-left hover:bg-neutral-100 rounded-xl cursor-pointer"
                    >
                      Không quan tâm
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="w-full px-3 py-2 text-left hover:bg-neutral-100 rounded-xl cursor-pointer"
                    >
                      Sao chép liên kết
                    </button>

                    {!isOwner && (
                      <>
                        <button
                          onClick={handleMute}
                          className="w-full px-3 py-2 text-left hover:bg-neutral-100 rounded-xl cursor-pointer"
                        >
                          Tắt tiếng người dùng
                        </button>
                        <button
                          onClick={handleRestrict}
                          className="w-full px-3 py-2 text-left hover:bg-neutral-100 rounded-xl cursor-pointer"
                        >
                          Hạn chế người dùng
                        </button>
                        <div className="h-[1px] bg-neutral-100 my-1" />
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            setIsReportOpen(true);
                          }}
                          className="w-full px-3 py-2 text-left text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer"
                        >
                          Báo cáo bài viết
                        </button>
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            setConfirmModal("block");
                          }}
                          className="w-full px-3 py-2 text-left text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer"
                        >
                          Chặn tài khoản
                        </button>
                      </>
                    )}

                    {isOwner && (
                      <>
                        <div className="h-[1px] bg-neutral-100 my-1" />
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            setEditContent(postContent);
                            setIsEditOpen(true);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-neutral-100 rounded-xl cursor-pointer"
                        >
                          Chỉnh sửa bài viết
                        </button>
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            setConfirmModal("delete");
                          }}
                          className="w-full px-3 py-2 text-left text-rose-600 font-bold hover:bg-rose-50 rounded-xl cursor-pointer"
                        >
                          Xóa bài viết
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {postContent && (
              <p className="text-neutral-900 text-[14.5px] mt-1.5 leading-relaxed break-words whitespace-pre-line">
                {postContent}
              </p>
            )}

            {mediaList.length > 0 && (
              <div className="mt-3 space-y-2">
                {mediaList.map((mediaUrl, idx) => {
                  const isVideo = mediaUrl.match(/\.(mp4|webm|mov)($|\?)/i);
                  return isVideo ? (
                    <div
                      key={idx}
                      className="rounded-2xl overflow-hidden border border-neutral-100 shadow-sm max-h-[520px] bg-black"
                    >
                      <video
                        src={mediaUrl}
                        controls
                        className="w-full h-auto max-h-[520px] object-contain mx-auto"
                      />
                    </div>
                  ) : (
                    <div
                      key={idx}
                      className="rounded-2xl overflow-hidden border border-neutral-100 shadow-sm max-h-[520px] bg-neutral-50 flex items-center justify-center"
                    >
                      <img
                        src={mediaUrl}
                        alt="media"
                        className="w-full h-auto max-h-[520px] object-cover"
                        loading="lazy"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            <InteractionBar
              post={{ ...post, replies_count: repliesCount }}
              onComment={() => setIsReplyOpen(true)}
              onOpenQuote={() => setIsQuoteOpen(true)}
              onOpenEmbed={() => setIsEmbedOpen(true)}
              onCopyAsImage={handleCopyAsImage}
              onNotify={showToast}
            />
          </div>
        </div>
      </div>

      {/* Modal Chỉnh sửa bài viết */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 p-5">
            <h3 className="font-bold text-sm text-neutral-900 mb-3">
              Chỉnh sửa bài viết
            </h3>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:border-neutral-400 resize-none"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitEdit}
                disabled={!editContent.trim() || isUpdating}
                className="px-5 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 disabled:opacity-40 cursor-pointer"
              >
                {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác nhận Block / Delete */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-neutral-200 p-5 text-center">
            <h3 className="font-bold text-base text-neutral-900 mb-2">
              {confirmModal === "block"
                ? `Chặn ${post.user?.name || "người dùng này"}?`
                : "Xóa bài viết?"}
            </h3>
            <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
              {confirmModal === "block"
                ? "Họ sẽ không thể xem hồ sơ hoặc tương tác với bài viết của bạn nữa."
                : "Bài viết sau khi xóa sẽ không thể khôi phục."}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isActionLoading}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {isActionLoading
                  ? "Đang xử lý..."
                  : confirmModal === "block"
                    ? "Chặn"
                    : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}

      {imagePreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h3 className="font-bold text-sm text-neutral-900">
                Xem trước ảnh bài viết
              </h3>
              <button
                onClick={() => setImagePreviewUrl("")}
                className="text-neutral-400 hover:text-black text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-neutral-200 max-h-[60vh] overflow-y-auto bg-neutral-50 mb-4">
              <img
                src={imagePreviewUrl}
                alt="Post preview"
                className="w-full h-auto"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setImagePreviewUrl("")}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
              >
                Đóng
              </button>
              <a
                href={imagePreviewUrl}
                download={`threads-post-${post.id}.png`}
                onClick={() => showToast("Đã tải ảnh bài viết!")}
                className="px-5 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800"
              >
                Tải ảnh xuống
              </a>
            </div>
          </div>
        </div>
      )}
      {/* Modal Báo cáo bài viết */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 p-5">
            <h3 className="font-bold text-sm text-neutral-900 mb-3">
              Báo cáo bài viết
            </h3>
            <p className="text-xs text-neutral-500 mb-3">
              Chọn lý do bạn muốn báo cáo bài viết này:
            </p>
            <div className="space-y-2 mb-4">
              {REPORT_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    reportReason === reason
                      ? "border-black bg-neutral-50 font-semibold"
                      : "border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={() => setReportReason(reason)}
                    className="accent-black"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsReportOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitReport}
                disabled={isActionLoading}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {isActionLoading ? "Đang gửi..." : "Gửi báo cáo"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ReplyModal
        isOpen={isReplyOpen}
        onClose={() => setIsReplyOpen(false)}
        post={post}
        isQuote={false}
        onSuccess={() => {
          setRepliesCount((c) => c + 1);
          showToast("Đã đăng câu trả lời!");
        }}
      />

      <ReplyModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        post={post}
        isQuote={true}
        onSuccess={() => showToast("Đã trích dẫn bài viết!")}
      />

      <EmbedModal
        isOpen={isEmbedOpen}
        onClose={() => setIsEmbedOpen(false)}
        post={post}
      />
    </>
  );
}
