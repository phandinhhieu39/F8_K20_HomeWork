import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "@/services/api";
import InteractionBar from "@/components/post/InteractionBar";

export default function Embed() {
  const { username, postId } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/posts/${postId}`);
        setPost(res.data?.data || res.data);
      } catch (err) {
        try {
          const feedRes = await api.get("/posts/feed");
          const found = (feedRes.data?.data || []).find(
            (p) => String(p.id) === String(postId),
          );
          if (found) setPost(found);
          else setError("Bài viết không tồn tại hoặc đã bị xóa.");
        } catch (e) {
          setError("Không thể tải bài viết này.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) fetchPost();
  }, [postId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-white border border-neutral-200 rounded-2xl min-h-[180px]">
        <div className="w-6 h-6 border-2 border-neutral-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="p-6 text-center text-xs text-neutral-500 bg-white border border-neutral-200 rounded-2xl">
        {error || "Bài viết không khả dụng."}
      </div>
    );
  }

  const mediaList = [];
  const addUrl = (val) => {
    if (!val) return;
    let u =
      typeof val === "string"
        ? val.trim()
        : val.url || val.path || val.file_url || "";
    if (!u) return;
    if (
      !u.startsWith("http://") &&
      !u.startsWith("https://") &&
      !u.startsWith("data:")
    ) {
      u = `https://threads.f8team.dev/${u.replace(/^\/+/, "")}`;
    }
    if (
      !mediaList.includes(u) &&
      !u.includes("default-avatar") &&
      (u.match(/\.(jpeg|jpg|gif|png|webp|svg|mp4|webm|mov)($|\?)/i) ||
        u.includes("storage") ||
        u.includes("uploads") ||
        u.includes("giphy"))
    ) {
      mediaList.push(u);
    }
  };

  Object.entries(post).forEach(([k, v]) => {
    if (k !== "user" && k !== "author") {
      if (Array.isArray(v)) v.forEach(addUrl);
      else if (v && typeof v === "object") Object.values(v).forEach(addUrl);
      else addUrl(v);
    }
  });

  const postUrl = `${window.location.origin}/${username || post.user?.username || "user"}/post/${post.id}`;

  return (
    <div className="w-full bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-5 shadow-sm font-sans text-neutral-900 relative">
      {toastMsg && (
        <div className="absolute top-2 right-4 z-50 bg-black text-white text-xs px-3 py-1.5 rounded-xl shadow">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 group"
        >
          <img
            src={post.user?.avatar_url || "/img/default-avatar.jpg"}
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover bg-neutral-200"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/img/default-avatar.jpg";
            }}
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-xs text-neutral-900 group-hover:underline">
                {post.user?.name || username || "Người dùng"}
              </span>
              {post.user?.is_verified && (
                <svg
                  className="w-3.5 h-3.5 text-blue-500 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.2 14.2l-3.5-3.5 1.4-1.4 2.1 2.1 5.6-5.6 1.4 1.4-7 7z" />
                </svg>
              )}
            </div>
            <span className="text-[11px] text-neutral-400">
              @{username || post.user?.username || "user"} ·{" "}
              {post.created_at_human || "1d"}
            </span>
          </div>
        </a>

        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-400 hover:text-black transition"
          title="Threads"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 192 192">
            <path d="M141.537 88.988a67 67 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.204 17.11 97.013 16.94c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.607 125.202.195 97.07 0h-.113C68.882.194 47.292 9.642 32.788 28.08 19.882 44.485 13.224 67.315 13.001 95.932L13 96v.067c.224 28.617 6.882 51.447 19.788 67.854C47.292 182.358 68.882 191.806 96.957 192h.113c24.96-.173 42.554-6.708 57.048-21.189 18.963-18.945 18.392-42.692 12.142-57.27-4.484-10.454-13.033-18.945-24.723-24.553M98.44 129.507c-10.44.588-21.286-4.098-21.82-14.135-.397-7.442 5.296-15.746 22.461-16.735q2.948-.17 5.79-.169c6.235 0 12.068.606 17.371 1.765-1.978 24.702-13.58 28.713-23.802 29.274" />
          </svg>
        </a>
      </div>

      <p className="text-xs text-neutral-900 leading-relaxed whitespace-pre-line mb-3">
        {post.content}
      </p>

      {mediaList.length > 0 && (
        <div className="mb-3 space-y-2">
          {mediaList.map((url, idx) =>
            url.match(/\.(mp4|webm|mov)($|\?)/i) ? (
              <video
                key={idx}
                src={url}
                controls
                className="w-full max-h-80 rounded-xl bg-black object-contain"
              />
            ) : (
              <img
                key={idx}
                src={url}
                alt="media"
                className="w-full max-h-80 rounded-xl object-cover border border-neutral-100"
              />
            ),
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
        <InteractionBar
          post={post}
          onNotify={(msg) => {
            setToastMsg(msg);
            setTimeout(() => setToastMsg(""), 2000);
          }}
        />
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1 mt-3"
        >
          <span>View on Threads</span>
          <span>→</span>
        </a>
      </div>
    </div>
  );
}
