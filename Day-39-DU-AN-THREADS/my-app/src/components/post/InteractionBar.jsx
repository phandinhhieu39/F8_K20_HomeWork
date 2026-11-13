import React, { useState, useRef, useEffect } from "react";
import copy from "copy-to-clipboard";
import postService from "@/services/postService";

export default function InteractionBar({
  post,
  onComment,
  onOpenQuote,
  onOpenEmbed,
  onCopyAsImage,
  onNotify,
}) {
  const [isLiked, setIsLiked] = useState(Boolean(post.is_liked || post.liked));
  const [likesCount, setLikesCount] = useState(Number(post.likes_count || 0));
  const [isLiking, setIsLiking] = useState(false);

  const [isReposted, setIsReposted] = useState(Boolean(post.is_reposted));
  const [repostsCount, setRepostsCount] = useState(
    Number(post.reposts_and_quotes_count || 0),
  );

  const [showRepostMenu, setShowRepostMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const repostRef = useRef(null);
  const shareRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (repostRef.current && !repostRef.current.contains(e.target)) {
        setShowRepostMenu(false);
      }
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLikeToggle = async () => {
    if (isLiking) return;
    const prevLiked = isLiked;
    const prevCount = likesCount;

    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);
    setIsLiking(true);

    try {
      if (prevLiked) await postService.unlikePost(post.id);
      else await postService.likePost(post.id);
    } catch (err) {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      onNotify?.(
        err.response?.data?.message || "Không thể thực hiện thao tác thích.",
      );
    } finally {
      setIsLiking(false);
    }
  };

  const handleDirectRepost = async () => {
    setShowRepostMenu(false);
    const prev = isReposted;
    const prevCount = repostsCount;
    setIsReposted(!prev);
    setRepostsCount(prev ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      await postService.repost(post.id);
    } catch (err) {
      setIsReposted(prev);
      setRepostsCount(prevCount);
      onNotify?.(err.response?.data?.message || "Không thể đăng lại bài viết.");
    }
  };

  const handleCopyLink = () => {
    setShowShareMenu(false);
    const link = `${window.location.origin}/${post.user?.username || "user"}/post/${post.id}`;
    copy(link);
    onNotify?.("Đã sao chép liên kết bài viết!");
  };

  return (
    <div className="flex items-center gap-5 mt-3.5 text-neutral-600">
      {/* 1. Like */}
      <button
        onClick={handleLikeToggle}
        className={`flex items-center gap-1.5 transition-colors cursor-pointer group ${
          isLiked ? "text-rose-500" : "hover:text-rose-500"
        }`}
        title={isLiked ? "Bỏ thích" : "Thích"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 ${isLiked ? "fill-current" : "fill-none stroke-current stroke-2"}`}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        {likesCount > 0 && (
          <span className="text-xs font-medium">{likesCount}</span>
        )}
      </button>

      {/* 2. Comment */}
      <button
        onClick={() => onComment && onComment(post)}
        className="flex items-center gap-1.5 hover:text-blue-500 transition-colors cursor-pointer"
        title="Bình luận"
      >
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
          <span className="text-xs font-medium">{post.replies_count}</span>
        )}
      </button>

      {/* 3. Repost */}
      <div className="relative" ref={repostRef}>
        <button
          onClick={() => setShowRepostMenu(!showRepostMenu)}
          className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
            isReposted ? "text-emerald-500" : "hover:text-emerald-500"
          }`}
          title="Đăng lại hoặc trích dẫn"
        >
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
          {repostsCount > 0 && (
            <span className="text-xs font-medium">{repostsCount}</span>
          )}
        </button>

        {showRepostMenu && (
          <div className="absolute left-0 bottom-8 w-40 bg-white border border-neutral-200 rounded-2xl shadow-xl p-1 z-40 text-xs font-semibold animate-in fade-in">
            <button
              onClick={handleDirectRepost}
              className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded-xl transition flex items-center justify-between cursor-pointer"
            >
              <span>{isReposted ? "Bỏ đăng lại" : "Đăng lại"}</span>
              <span className="text-neutral-400">🔁</span>
            </button>
            <button
              onClick={() => {
                setShowRepostMenu(false);
                onOpenQuote && onOpenQuote(post);
              }}
              className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded-xl transition flex items-center justify-between cursor-pointer"
            >
              <span>Trích dẫn</span>
              <span className="text-neutral-400">✍️</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Share */}
      <div className="relative" ref={shareRef}>
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="hover:text-blue-500 transition-colors cursor-pointer"
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

        {showShareMenu && (
          <div className="absolute left-0 bottom-8 w-48 bg-white border border-neutral-200 rounded-2xl shadow-xl p-1 z-40 text-xs font-semibold animate-in fade-in">
            <button
              onClick={handleCopyLink}
              className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded-xl transition cursor-pointer"
            >
              Sao chép liên kết
            </button>
            <button
              onClick={() => {
                setShowShareMenu(false);
                onCopyAsImage && onCopyAsImage(post);
              }}
              className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded-xl transition text-neutral-800 cursor-pointer"
            >
              Lưu dưới dạng ảnh
            </button>
            <button
              onClick={() => {
                setShowShareMenu(false);
                onOpenEmbed && onOpenEmbed(post);
              }}
              className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded-xl transition text-neutral-800 cursor-pointer"
            >
              Lấy mã nhúng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
