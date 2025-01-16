interface UserManagementProps {
  isDarkMode: boolean;
}

const UserManagement = ({ isDarkMode }: UserManagementProps) => {
  // ... existing code

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ color: isDarkMode ? "#ffffff" : "inherit" }}>
        User Management
      </Title>
      <Card style={{ background: isDarkMode ? "#141414" : "#ffffff" }}>
        {/* ... existing content with dark mode styles */}
      </Card>
    </div>
  );
}; 