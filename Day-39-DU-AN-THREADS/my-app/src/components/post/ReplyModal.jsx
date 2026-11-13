import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import api from "@/services/api";

export default function ReplyModal({
  isOpen,
  onClose,
  post,
  isQuote = false,
  onSuccess,
}) {
  const currentUser = useSelector((state) => state.auth?.user);
  const [content, setContent] = useState("");
  const [extraThreads, setExtraThreads] = useState([]);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [replyOption, setReplyOption] = useState("anyone");
  const [showReplyOptions, setShowReplyOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  if (!isOpen || !post) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
      setErrorMsg("");
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddEmoji = (emoji) => {
    setContent((prev) => prev + emoji);
  };

  const handleAddToThread = () => {
    setExtraThreads((prev) => [...prev, ""]);
  };

  const sendReply = async (text, file = null) => {
    const formData = new FormData();
    formData.append("content", text);
    formData.append("reply_option", replyOption);
    if (file) {
      formData.append("media[]", file);
    }

    try {
      await api.post(`/posts/${post.id}/reply`, formData, {
        headers: { "Content-Type": undefined },
      });
    } catch (replyErr) {
      const status = replyErr.response?.status;
      if (status === 404 || status === 405) {
        formData.append("parent_id", post.id);
        await api.post("/posts", formData, {
          headers: { "Content-Type": undefined },
        });
      } else {
        throw replyErr;
      }
    }
  };

  const handleSubmit = async () => {
    if ((!content.trim() && !mediaFile) || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      if (isQuote) {
        const formData = new FormData();
        formData.append("content", content.trim());
        formData.append("reply_option", replyOption);
        formData.append("quoted_post_id", post.id);
        if (mediaFile) {
          formData.append("media[]", mediaFile);
        }

        await api.post("/posts", formData, {
          headers: { "Content-Type": undefined },
        });
      } else {
        await sendReply(content.trim(), mediaFile);

        for (const extraText of extraThreads) {
          if (extraText.trim()) {
            await sendReply(extraText.trim());
          }
        }
      }

      setContent("");
      setExtraThreads([]);
      removeMedia();
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      const resData = err.response?.data;
      const details = resData?.errors
        ? Object.values(resData.errors).flat().join(", ")
        : "";
      setErrorMsg(
        details ||
          resData?.message ||
          "Không thể gửi phản hồi lúc này. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-[580px] bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100">
          <button
            onClick={onClose}
            className="text-sm font-medium text-neutral-500 hover:text-black cursor-pointer"
          >
            Hủy
          </button>
          <span className="font-bold text-sm text-neutral-900">
            {isQuote ? "Trích dẫn bài viết" : "Trả lời"}
          </span>
          <div className="w-8"></div>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs text-center">
              {errorMsg}
            </div>
          )}

          {!isQuote && (
            <div className="flex items-start gap-3 relative pb-4">
              <div className="flex flex-col items-center">
                <img
                  src={post.user?.avatar_url || "/img/default-avatar.jpg"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover bg-neutral-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/img/default-avatar.jpg";
                  }}
                />
                <div className="w-[2px] bg-neutral-200 flex-1 my-1"></div>
              </div>

              <div className="flex-1 min-w-0 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-neutral-900">
                    {post.user?.name || post.user?.username || "Người dùng"}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {post.created_at_human || "1d"}
                  </span>
                </div>
                <p className="text-sm text-neutral-800 mt-1 whitespace-pre-line leading-relaxed">
                  {post.content}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 mt-1">
            <img
              src={currentUser?.avatar_url || "/img/default-avatar.jpg"}
              alt="my avatar"
              className="w-10 h-10 rounded-full object-cover bg-neutral-200 flex-shrink-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/img/default-avatar.jpg";
              }}
            />

            <div className="flex-1 min-w-0">
              <span className="font-semibold text-sm text-neutral-900">
                {currentUser?.name || currentUser?.username || "Bạn"}
              </span>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  isQuote
                    ? "Trích dẫn bài viết này..."
                    : `Trả lời ${post.user?.name || post.user?.username || "người dùng"}...`
                }
                rows={3}
                className="w-full mt-1 bg-transparent border-0 focus:outline-none resize-none text-sm text-neutral-900 placeholder:text-neutral-400 leading-relaxed"
                autoFocus
              />

              {mediaPreview && (
                <div className="relative mt-2 rounded-2xl overflow-hidden border border-neutral-200 max-h-60 w-fit">
                  <img
                    src={mediaPreview}
                    alt="preview"
                    className="max-h-60 w-auto object-cover"
                  />
                  <button
                    onClick={removeMedia}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}

              {isQuote && (
                <div className="mt-3 p-3.5 border border-neutral-200 rounded-2xl bg-neutral-50/70">
                  <div className="flex items-center gap-2 mb-1.5">
                    <img
                      src={post.user?.avatar_url || "/img/default-avatar.jpg"}
                      alt="avatar"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="font-semibold text-xs text-neutral-900">
                      {post.user?.name || post.user?.username}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {post.created_at_human || "1d"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-700 line-clamp-3">
                    {post.content}
                  </p>
                </div>
              )}

              {extraThreads.map((text, idx) => (
                <div
                  key={idx}
                  className="mt-3 pt-3 border-t border-neutral-100"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-neutral-400">
                      Thread #{idx + 2}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setExtraThreads((prev) =>
                          prev.filter((_, i) => i !== idx),
                        )
                      }
                      className="text-xs text-neutral-400 hover:text-rose-500 cursor-pointer"
                    >
                      Xóa
                    </button>
                  </div>
                  <textarea
                    value={text}
                    onChange={(e) => {
                      const next = [...extraThreads];
                      next[idx] = e.target.value;
                      setExtraThreads(next);
                    }}
                    placeholder="Viết tiếp nội dung thread..."
                    rows={2}
                    className="w-full bg-transparent border-0 focus:outline-none resize-none text-sm text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>
              ))}

              {/* Toolbar 5 nút */}
              <div className="flex items-center gap-4 mt-4 text-neutral-400">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="hover:text-black transition cursor-pointer"
                  title="Đính kèm ảnh/video"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="4" ry="4" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddEmoji(" [GIF] ")}
                  className="hover:text-black font-bold text-xs tracking-wider border border-current rounded px-1.5 py-0.5 transition cursor-pointer"
                  title="Thêm GIF"
                >
                  GIF
                </button>

                <div className="flex items-center gap-1">
                  {["❤️", "🔥", "😂"].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => handleAddEmoji(em)}
                      className="hover:scale-125 transition text-sm cursor-pointer"
                    >
                      {em}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setContent((prev) => prev + " \n📊 [Bình chọn]: ")
                  }
                  className="hover:text-black transition cursor-pointer"
                  title="Thăm dò ý kiến"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setContent((prev) => prev + " 📍 TP. Hồ Chí Minh")
                  }
                  className="hover:text-black transition cursor-pointer"
                  title="Thêm vị trí"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21s-8-7.5-8-12a8 8 0 1116 0c0 4.5-8 12-8 12z"
                    />
                    <circle cx="12" cy="9" r="3" />
                  </svg>
                </button>
              </div>

              {!isQuote && (
                <button
                  type="button"
                  onClick={handleAddToThread}
                  className="mt-3 text-xs text-neutral-400 hover:text-neutral-700 font-medium cursor-pointer"
                >
                  + Thêm vào thread
                </button>
              )}

              {/* Quyền trả lời & Thêm chủ đề */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100 text-xs">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowReplyOptions(!showReplyOptions)}
                    className="text-neutral-400 hover:text-neutral-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>
                      {replyOption === "anyone"
                        ? "Bất kỳ ai cũng có thể trả lời"
                        : replyOption === "following"
                          ? "Người bạn theo dõi"
                          : "Chỉ người được nhắc đến"}
                    </span>
                    <span className="text-[10px]">▼</span>
                  </button>

                  {showReplyOptions && (
                    <div className="absolute left-0 bottom-6 w-52 bg-white border border-neutral-200 rounded-xl shadow-lg p-1 z-30 font-medium">
                      <button
                        type="button"
                        onClick={() => {
                          setReplyOption("anyone");
                          setShowReplyOptions(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 rounded-lg"
                      >
                        Bất kỳ ai
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReplyOption("following");
                          setShowReplyOptions(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 rounded-lg"
                      >
                        Người bạn theo dõi
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReplyOption("mentioned");
                          setShowReplyOptions(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 rounded-lg"
                      >
                        Chỉ người được nhắc đến
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setContent((prev) => prev + " #threads")}
                  className="text-blue-500 hover:underline cursor-pointer font-medium"
                >
                  Thêm chủ đề
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <span className="text-xs text-neutral-400">
            {content.length > 0
              ? `${content.length} ký tự`
              : "Nhập nội dung để đăng"}
          </span>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={(!content.trim() && !mediaFile) || isSubmitting}
            className="px-5 py-2 rounded-full bg-black text-white text-xs font-semibold hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isSubmitting
              ? "Đang gửi..."
              : isQuote
                ? "Đăng trích dẫn"
                : "Đăng trả lời"}
          </button>
        </div>
      </div>
    </div>
  );
}
