import { Avatar, List, Typography } from "antd";
import { ContactsProps } from "./contact.interface";
const { Title, Text } = Typography;
import "./contact.css";
import { formatTimeAgo, getTextColor } from "../../../../@util/helpers";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "../../../../store";
import { getFollowers } from "../../../../api/auth";

function Contacts({ isDarkMode }: ContactsProps): JSX.Element {
  const { userInfo } = useAppStore();
  const userId = userInfo?.userId || userInfo?.id;

  const { data: myFollowersData } = useQuery({
    queryKey: ["followers", userId],
    queryFn: () => getFollowers(userId, 1, 10),
  });

  return (
    <div className="contacts">
      <Title level={5} style={{ ...getTextColor(isDarkMode) }}>
        My Followers
      </Title>
      <List
        dataSource={myFollowersData?.followers || []}
        renderItem={(item: any) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.avatarUrl} />}
              title={
                <Text
                  strong
                  className={isDarkMode ? "text-dark" : "text-light"}
                >
                  {item.userName}
                </Text>
              }
              description={
                <Text style={{ color: isDarkMode ? "#ffffff99" : "#00000073" }}>
                  {formatTimeAgo(new Date(item.lastLoginAt))}
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
