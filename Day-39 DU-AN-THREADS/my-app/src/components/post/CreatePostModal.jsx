import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import postService from "@/services/postService";

const POPULAR_GIFS = [
  "https://media.giphy.com/media/unQ3IJU2RG7DO/giphy.gif", // Cat typing
  "https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif", // Dance
  "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif", // Confused
  "https://media.giphy.com/media/l0amJzVHIAfl7jMDos/giphy.gif", // Thumbs up
  "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif", // Dog smile
  "https://media.giphy.com/media/9w9Z488AqAsuk/giphy.gif", // Good job
];

export default function CreatePostModal({ isOpen, onClose, onPostSuccess }) {
  const currentUser = useSelector((state) => state.auth?.user);

  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [selectedGif, setSelectedGif] = useState("");
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [customGifUrl, setCustomGifUrl] = useState("");

  const [replyOption, setReplyOption] = useState("anyone");
  const [showReplyOptions, setShowReplyOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setSelectedGif("");
      setMediaPreview(URL.createObjectURL(file));
      setErrorMsg("");
    }
  };

  const handleSelectGif = (url) => {
    setSelectedGif(url);
    setMediaFile(null);
    setMediaPreview(url);
    setShowGifPicker(false);
    setErrorMsg("");
  };

  const removeMedia = () => {
    setMediaFile(null);
    setSelectedGif("");
    setMediaPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddEmoji = (emoji) => {
    setContent((prev) => prev + emoji);
  };

  const handleSubmit = async () => {
    if ((!content.trim() && !mediaFile && !selectedGif) || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      let res;
      let fileToUpload = mediaFile;

      // Chuyển link GIF thành File để upload qua media[]
      if (!fileToUpload && selectedGif) {
        try {
          const gifRes = await fetch(selectedGif);
          const blob = await gifRes.blob();
          fileToUpload = new File([blob], "image.gif", {
            type: blob.type || "image/gif",
          });
        } catch (e) {
          fileToUpload = null;
        }
      }

      if (fileToUpload) {
        const formData = new FormData();
        formData.append("content", content.trim());
        formData.append("reply_option", replyOption);
        formData.append("media[]", fileToUpload);

        res = await postService.createPost(formData, true);
      } else {
        const payload = {
          content: content.trim(),
          reply_option: replyOption,
        };
        if (selectedGif) {
          payload.media = [selectedGif];
        }
        res = await postService.createPost(payload, false);
      }

      const newPost = res?.data || res;

      setContent("");
      removeMedia();
      onClose();

      if (onPostSuccess) onPostSuccess(newPost);
    } catch (err) {
      console.log("Chi tiết lỗi từ server F8:", err.response?.data);
      const resData = err.response?.data;
      const details = resData?.errors
        ? Object.entries(resData.errors)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
            .join(" | ")
        : "";
      setErrorMsg(
        details ||
          resData?.message ||
          "Đăng bài không thành công. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[580px] bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100">
          <button
            onClick={onClose}
            className="text-sm font-medium text-neutral-500 hover:text-black cursor-pointer"
          >
            Hủy
          </button>
          <span className="font-bold text-sm text-neutral-900">Thread mới</span>
          <div className="w-8"></div>
        </div>

        {/* Nội dung bài viết */}
        <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
          {errorMsg && (
            <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs text-center leading-relaxed">
              {errorMsg}
            </div>
          )}

          <div className="flex items-start gap-3">
            <img
              src={currentUser?.avatar_url || "/img/default-avatar.jpg"}
              alt="avatar"
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
                placeholder="Bắt đầu một thread mới..."
                rows={4}
                className="w-full mt-1.5 bg-transparent border-0 focus:outline-none resize-none text-sm text-neutral-900 placeholder:text-neutral-400 leading-relaxed"
                autoFocus
              />

              {mediaPreview && (
                <div className="relative mt-2 rounded-2xl overflow-hidden border border-neutral-200 max-h-72 w-fit bg-neutral-50">
                  <img
                    src={mediaPreview}
                    alt="preview"
                    className="max-h-72 w-auto object-contain rounded-2xl"
                  />
                  <button
                    onClick={removeMedia}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer shadow-md"
                    title="Xóa ảnh"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Bộ chọn GIF */}
              {showGifPicker && (
                <div className="mt-3 p-3 border border-neutral-200 rounded-2xl bg-neutral-50 animate-in fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-700">
                      Chọn ảnh GIF
                    </span>
                    <button
                      onClick={() => setShowGifPicker(false)}
                      className="text-xs text-neutral-400 hover:text-black cursor-pointer"
                    >
                      Đóng ✕
                    </button>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={customGifUrl}
                      onChange={(e) => setCustomGifUrl(e.target.value)}
                      placeholder="Dán URL ảnh GIF (vd: https://media.giphy.com/...)"
                      className="flex-1 px-3 py-1.5 bg-white border border-neutral-200 rounded-xl text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customGifUrl.trim()) {
                          handleSelectGif(customGifUrl.trim());
                          setCustomGifUrl("");
                        }
                      }}
                      className="px-3 py-1.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 cursor-pointer"
                    >
                      Dùng
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {POPULAR_GIFS.map((gif, idx) => (
                      <img
                        key={idx}
                        src={gif}
                        alt="gif option"
                        onClick={() => handleSelectGif(gif)}
                        className="w-full h-20 object-cover rounded-xl cursor-pointer hover:opacity-80 transition hover:scale-105"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Toolbar 5 nút */}
              <div className="flex items-center gap-4 mt-4 text-neutral-400">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,image/gif,video/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="hover:text-black transition cursor-pointer"
                  title="Đính kèm ảnh / video / GIF từ máy tính"
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
                  onClick={() => setShowGifPicker(!showGifPicker)}
                  className={`font-bold text-xs tracking-wider border rounded px-1.5 py-0.5 transition cursor-pointer ${
                    showGifPicker
                      ? "border-black text-black bg-neutral-100"
                      : "border-current hover:text-black"
                  }`}
                  title="Chọn ảnh GIF từ thư viện"
                >
                  GIF
                </button>

                <div className="flex items-center gap-1.5">
                  {["❤️", "🔥", "😂", "👍"].map((em) => (
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
                    setContent((prev) => prev + "\n📊 [Bình chọn]: ")
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
                  title="Gắn vị trí"
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

        {/* Footer Modal */}
        <div className="px-5 py-3.5 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <span className="text-xs text-neutral-400">
            {content.length > 0
              ? `${content.length} ký tự`
              : "Nhập nội dung để đăng"}
          </span>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              (!content.trim() && !mediaFile && !selectedGif) || isSubmitting
            }
            className="px-5 py-2 rounded-full bg-black text-white text-xs font-semibold hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isSubmitting ? "Đang đăng..." : "Đăng"}
          </button>
        </div>
      </div>
    </div>
  );
}
