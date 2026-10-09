function StatsCard({ label, value, subtitle, variant }) {
  let className = 'stats-card';
  if (variant) className += ` stats-card-${variant}`;

  return (
    <div className={className}>
      <span className="stats-card-value">{value}</span>
      <span className="stats-card-label">{label}</span>
      {subtitle && <span className="stats-card-subtitle">{subtitle}</span>}
    </div>
  );
}

export default StatsCard;