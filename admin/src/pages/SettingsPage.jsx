export default function SettingsPage() {
  const settings = [
    { label: "Conference branding", value: "Theme, logo, and domain" },
    { label: "User roles", value: "Permissions and access" },
    { label: "Integrations", value: "Live stream, analytics, and email" },
  ];

  return (
    <div className="page-card">
      <div className="page-header">
        <h1>Settings</h1>
      </div>
      <div className="grid-cards">
        {settings.map((item) => (
          <div className="card-block" key={item.label}>
            <h3>{item.label}</h3>
            <p>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
