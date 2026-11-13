import { Link } from "react-router";

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="w-7 h-7"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function LoginPrompt() {
  return (
    <aside className="threads-login-prompt">
      <h2>
        Đăng nhập hoặc đăng ký
        <br />
        Threads
      </h2>

      <p className="threads-login-description">
        Xem mọi người đang nói về điều gì và
        <br />
        tham gia cuộc trò chuyện.
      </p>

      <Link to="/login" className="threads-instagram-button">
        <InstagramIcon />

        <span className="threads-instagram-content">
          <span>Tiếp tục bằng Instagram</span>
          <strong>phanhieu</strong>
        </span>
      </Link>

      <Link to="/login" className="threads-username-login">
        Đăng nhập bằng tên người dùng
      </Link>
    </aside>
  );
}
