import React, { useState } from "react";
import copy from "copy-to-clipboard";

export default function EmbedModal({ isOpen, onClose, post }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !post) return null;

  // Tạo URL nhúng chuẩn: location.origin + "/" + username + "/post/" + postId + "/embed"
  const username = post.user?.username || post.user?.name || "user";
  const embedUrl = `${window.location.origin}/${username}/post/${post.id}/embed`;
  const embedCode = `<iframe src="${embedUrl}" width="100%" height="450" style="border:none;overflow:hidden;border-radius:16px;" allowfullscreen="true"></iframe>`;

  const handleCopy = () => {
    copy(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 p-5 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
          <h3 className="font-bold text-sm text-neutral-900">
            Mã nhúng bài viết
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-black w-7 h-7 rounded-full flex items-center justify-center hover:bg-neutral-100 cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Khung xem trước iframe */}
        <div className="mb-4">
          <p className="text-xs text-neutral-500 mb-2 font-medium">
            Xem trước mã nhúng:
          </p>
          <div className="border border-neutral-200 rounded-2xl p-4 bg-neutral-50/50">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={post.user?.avatar_url || "/img/default-avatar.jpg"}
                alt="avatar"
                className="w-7 h-7 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-xs text-neutral-900">
                  {post.user?.name || username}
                </p>
                <p className="text-[11px] text-neutral-400">@{username}</p>
              </div>
            </div>
            <p className="text-xs text-neutral-800 line-clamp-3">
              {post.content}
            </p>
          </div>
        </div>

        {/* Khung chứa mã nhúng iframe */}
        <div className="mb-4">
          <label className="block text-xs text-neutral-500 mb-1.5 font-medium">
            Mã HTML nhúng:
          </label>
          <textarea
            readOnly
            value={embedCode}
            rows={3}
            className="w-full p-3 bg-neutral-100 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-700 select-all focus:outline-none"
          />
        </div>

        {/* Nút bấm sao chép mã nhúng */}
        <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
          >
            Đóng
          </button>
          <button
            onClick={handleCopy}
            className="px-5 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            {copied ? "✓ Đã sao chép mã nhúng!" : "Sao chép mã nhúng"}
          </button>
        </div>
      </div>
    </div>
  );
}
