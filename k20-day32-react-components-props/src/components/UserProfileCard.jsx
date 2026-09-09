import './UserProfileCard.css';

function UserProfileCard({ avatar, fullName, jobTitle, isOnline, skills }) {
  const handleContact = () => {
    alert(`Đang kết nối với ${fullName}...`);
  };

  return (
    <div className="card">
      <div className="avatar-wrapper">
        <img src={avatar} alt={fullName} className="avatar" />
      </div>

      <div className={`status-badge ${isOnline ? 'status-online' : 'status-offline'}`}>
        <span className="status-dot"></span>
        <span>{isOnline ? 'Online' : 'Offline'}</span>
      </div>

      <h3 className="full-name">{fullName}</h3>
      <p className="job-title">{jobTitle}</p>

      <span className="skills-title">Kỹ năng</span>
      <div className="skills-container">
        {skills.map((skill, index) => (
          <span key={`${skill}-${index}`} className="skill-badge">
            {skill}
          </span>
        ))}
      </div>

      <button className="contact-btn" onClick={handleContact}>
        Liên hệ
      </button>
    </div>
  );
}

export default UserProfileCard;
