import React from "react";

// Hàm quét tự động tìm toàn bộ link ảnh / GIF / video trong bài viết
const getAllMediaUrls = (post) => {
  const urls = [];

  const checkAndAdd = (val) => {
    if (!val) return;

    if (typeof val === "string") {
      const s = val.trim();
      // Nhận diện nếu chuỗi là đường dẫn ảnh / video / media
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
        // Nếu là đường dẫn tương đối, gắn thêm domain của F8
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

  // Quét qua tất cả thuộc tính của post (trừ thông tin tác giả user)
  Object.entries(post).forEach(([key, value]) => {
    if (key !== "user" && key !== "author") {
      checkAndAdd(value);
    }
  });

  return urls;
};

export default function PostItem({ post }) {
  const mediaList = getAllMediaUrls(post);

  return (
    <div className="w-full p-4 sm:p-5 bg-white hover:bg-neutral-50/50 transition-colors">
      <div className="flex items-start gap-3">
        {/* AVATAR TÁC GIẢ */}
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
          {/* Nút cộng nhỏ ở avatar */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white cursor-pointer hover:scale-110 transition-transform">
            +
          </div>
        </div>

        {/* CỘT NỘI DUNG CHÍNH */}
        <div className="flex-1 min-w-0">
          {/* Header bài viết */}
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

            <button
              className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full transition"
              title="Tùy chọn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>
          </div>

          {/* Tag chủ đề nếu có */}
          {post.tag && (
            <div className="mt-1">
              <span className="inline-block text-xs text-neutral-700 font-medium px-2 py-0.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer">
                + {post.tag}
              </span>
            </div>
          )}

          {/* Nội dung bài viết */}
          {post.content && (
            <p className="text-neutral-900 text-[14.5px] mt-1.5 leading-relaxed break-words whitespace-pre-line">
              {post.content}
            </p>
          )}

          {/* DANH SÁCH ẢNH / VIDEO ĐÍNH KÈM CỦA BÀI VIẾT */}
          {mediaList.length > 0 && (
            <div className="mt-3 space-y-2">
              {mediaList.map((mediaUrl, idx) => {
                const isVideo = mediaUrl.match(/\.(mp4|webm|mov)($|\?)/i);

                return isVideo ? (
                  <div
                    key={idx}
                    className="rounded-2xl overflow-hidden border border-neutral-100 shadow-sm max-h-[550px] bg-black"
                  >
                    <video
                      src={mediaUrl}
                      controls
                      className="w-full h-auto max-h-[550px] object-contain mx-auto"
                    />
                  </div>
                ) : (
                  <div
                    key={idx}
                    className="rounded-2xl overflow-hidden border border-neutral-100 shadow-sm max-h-[550px] bg-neutral-50 flex items-center justify-center"
                  >
                    <img
                      src={mediaUrl}
                      alt="post media"
                      className="w-full h-auto max-h-[550px] object-cover"
                      loading="lazy"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* CỤM NÚT TƯƠNG TÁC (Like, Reply, Repost, Share) */}
          <div className="flex items-center gap-5 mt-3.5 text-neutral-600">
            {/* Like */}
            <button className="flex items-center gap-1.5 hover:text-rose-500 transition group cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 fill-none stroke-current stroke-2 group-hover:stroke-rose-500"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {post.likes_count > 0 && (
                <span className="text-xs font-medium">{post.likes_count}</span>
              )}
            </button>

            {/* Reply */}
            <button className="flex items-center gap-1.5 hover:text-blue-500 transition cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 fill-none stroke-current stroke-2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {post.replies_count > 0 && (
                <span className="text-xs font-medium">
                  {post.replies_count}
                </span>
              )}
            </button>

            {/* Repost */}
            <button className="flex items-center gap-1.5 hover:text-emerald-500 transition cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 fill-none stroke-current stroke-2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {post.reposts_and_quotes_count > 0 && (
                <span className="text-xs font-medium">
                  {post.reposts_and_quotes_count}
                </span>
              )}
            </button>

            {/* Share */}
            <button
              className="hover:text-blue-500 transition cursor-pointer"
              title="Chia sẻ"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M7.247 1.499C4.183-.187.6 2.643 1.53 6.014L3.182 12 1.53 17.986c-.93 3.37 2.653 6.201 5.717 4.515l13.578-7.468c2.39-1.315 2.39-4.75 0-6.066zM3.458 5.482c-.46-1.666 1.311-3.064 2.825-2.231L19.86 10.72q.213.117.365.28H4.98zM4.981 13l-1.523 5.518c-.46 1.665 1.311 3.064 2.825 2.231l13.577-7.468q.213-.118.365-.281z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
