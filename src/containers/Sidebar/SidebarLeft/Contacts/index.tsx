import { Avatar, List, Typography } from "antd";
import { ContactsProps } from "./contact.interface";
const { Title, Text } = Typography;
import "./contact.css";
const contacts = [
  { name: "Julia Clarke", location: "New York, USA" },
  { name: "Mark Stefine", location: "Sydney, Australia" },
  { name: "Sara Cliene", location: "Tokyo, Japan" },
];

function Contacts({ isDarkMode }: ContactsProps): JSX.Element {
  return (
    <div className="contacts">
      <Title level={5} className={isDarkMode ? "text-dark" : "text-light"}>
        My Contacts
      </Title>
      <List
        dataSource={contacts}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src="https://example.com/avatar.jpg" />}
              title={
                <Text
                  strong
                  className={isDarkMode ? "text-dark" : "text-light"}
                >
                  {item.name}
                </Text>
              }
              description={
                <Text style={{ color: isDarkMode ? "#ffffff99" : "#00000073" }}>
                  {item.location}
                </Text>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default Contacts;
