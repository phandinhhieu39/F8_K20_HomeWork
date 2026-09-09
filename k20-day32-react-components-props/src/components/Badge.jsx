import './Badge.css';

function Badge({ type, text }) {
  return (
    <span className={`badge ${type === 'discount' ? 'badge-discount' : 'badge-out-of-stock'}`}>
      {text}
    </span>
  );
}

export default Badge;