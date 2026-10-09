import '../styles/admin.css';

function Admin() {
  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1 className="admin-title">Admin Panel</h1>
          <p className="admin-subtitle">
            Manage questions, topics, and content
          </p>
        </div>

        <div className="admin-placeholder">
          <div className="admin-placeholder-icon">🔐</div>
          <h2 className="admin-placeholder-title">Coming Soon</h2>
          <p className="admin-placeholder-text">
            The admin panel is under development. It will support:
          </p>
          <ul className="admin-placeholder-features">
            <li>Admin authentication with secure credentials</li>
            <li>Add, edit, and delete aptitude questions</li>
            <li>Upload question images</li>
            <li>Add options and select correct answers</li>
            <li>Add explanations and upload solution images</li>
            <li>Manage aptitude topics</li>
            <li>Content management via GitHub-based repository</li>
          </ul>
          <p className="admin-placeholder-note">
            Authentication and content management will be handled through a
            secure backend API. No credentials or secrets are stored in the
            frontend.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Admin;