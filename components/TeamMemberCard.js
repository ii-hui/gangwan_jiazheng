import Image from 'next/image'

export default function TeamMemberCard({ member, onClick }) {
  return (
    <article className="team-member-card" onClick={onClick}>
      <div className="team-member-avatar">
        {member.avatar_url ? (
          <Image
            src={member.avatar_url}
            alt={member.avatar_alt || `秦皇岛${member.category}${member.name}${member.experience_years ? `-${member.experience_years}年经验` : ''}-专业家政服务`}
            width={200}
            height={200}
            className="avatar-img"
            loading="lazy"
          />
        ) : (
          <div className="avatar-placeholder">
            <span>{member.name?.charAt(0) || '?'}</span>
          </div>
        )}
      </div>

      <div className="team-member-info">
        <h3>{member.name}</h3>

        <div className="team-member-meta">
          <span className="category-badge">{member.category}</span>
          {member.status && <span className={`status-badge ${member.status === '待岗' ? 'status-available' : ''}`}>{member.status}</span>}
          {member.age && <span className="age">·{member.age}岁</span>}
          {member.experience_years && (
            <span className="experience">·{member.experience_years}年经验</span>
          )}
        </div>

        {member.highlight && (
          <p className="highlight">{member.highlight}</p>
        )}

        {member.skills && member.skills.length > 0 && (
          <div className="skills-tags">
            {member.skills.slice(0, 4).map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
            {member.skills.length > 4 && (
              <span className="skill-tag more">+{member.skills.length - 4}</span>
            )}
          </div>
        )}

        <button className="view-detail-btn">查看详情</button>
      </div>
    </article>
  )
}
