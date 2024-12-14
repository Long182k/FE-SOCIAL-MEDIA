import { Layout, Tabs, List, Image, Typography, Space } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

interface BookmarksProps {
  isDarkMode: boolean;
}

interface Bookmark {
  id: string;
  title: string;
  description: string;
  image?: string;
  timestamp: string;
}

function Bookmarks({ isDarkMode }: BookmarksProps): JSX.Element {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Simulated bookmarks data - replace with actual API call
  useEffect(() => {
    const dummyBookmarks = [
      {
        id: "1",
        title: "Chocolate Cake Recipe",
        description:
          "This is the best chocolate cake recipe you will ever try. It's rich, moist and full of chocolate flavor. Topped with a silky smooth ganache, this homemade cake is perfect for special occasions or everyday indulgence.",
        image:
          "https://res.cloudinary.com/dcivdqyyj/image/upload/v1733767633/ojyffxp2iqjybw8joloi.jpg",
        timestamp: "6w",
      },
      {
        id: "2",
        title: "Chicken Curry Recipe",
        description:
          "The world's most popular and easy to make chicken curry recipe",
        image:
          "https://res.cloudinary.com/dcivdqyyj/image/upload/v1733767643/rebors1wpnodu8mvlokl.jpg",
        timestamp: "3d",
      },
      {
        id: "3",
        title: "Pizza Dough Recipe",
        description:
          "Learn how to make the best homemade pizza from scratch! This easy pizza dough recipe makes the perfect crispy and chewy crust that's not too thick and not too thin.",
        image:
          "https://res.cloudinary.com/dcivdqyyj/image/upload/v1733767699/dbghp2svorsnl2i4wvjn.jpg",
        timestamp: "1d",
      },
    ];
    setBookmarks(dummyBookmarks);
  }, []);

  const items = [
    {
      key: "all",
      label: "All",
      children: (
        <List
          itemLayout="horizontal"
          dataSource={bookmarks}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <EllipsisOutlined
                  key="ellipsis"
                  style={{
                    fontSize: "20px",
                    color: isDarkMode ? "#ffffff80" : "#00000080",
                  }}
                />,
              ]}
              style={{
                padding: "16px 0",
                borderBottom: `1px solid ${
                  isDarkMode ? "#ffffff1a" : "#0000000a"
                }`,
              }}
            >
              <List.Item.Meta
                avatar={
                  item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={100}
                      height={100}
                      style={{ objectFit: "cover", borderRadius: "8px" }}
                    />
                  )
                }
                title={
                  <Space direction="vertical" size={2}>
                    <Typography.Text
                      strong
                      style={{
                        color: isDarkMode ? "#ffffff" : "#000000",
                        fontSize: "16px",
                      }}
                    >
                      {item.title}
                    </Typography.Text>
                    <Typography.Text
                      style={{
                        color: isDarkMode ? "#ffffff99" : "#00000099",
                        fontSize: "14px",
                      }}
                    >
                      {item.description}
                    </Typography.Text>
                    <Typography.Text
                      style={{
                        color: isDarkMode ? "#ffffff60" : "#00000060",
                        fontSize: "12px",
                      }}
                    >
                      {item.timestamp}
                    </Typography.Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      ),
    },
    {
      key: "post",
      label: "Post",
      children: <div>Post content</div>,
    },
  ];

  return (
    <Layout
      className="main-content-layout"
      style={{
        background: isDarkMode ? "#141414" : "#ffffff",
        padding: "0 24px",
      }}
    >
      <Typography.Title
        level={1}
        style={{
          color: isDarkMode ? "#ffffff" : "#000000",
          padding: "16px 0",
          margin: 0,
          fontSize: "24px",
        }}
      >
        Bookmarks
      </Typography.Title>

      <Tabs
        items={items}
        style={{
          color: isDarkMode ? "#ffffff" : "#000000",
        }}
      />
    </Layout>
  );
}

export default Bookmarks;
