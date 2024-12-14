import { Layout, Card, Row, Col, Typography, Button } from "antd";
import { useEffect, useState } from "react";

interface GroupsProps {
  isDarkMode: boolean;
}

interface Group {
  id: string;
  name: string;
  members: number;
  image: string;
}

function Groups({ isDarkMode }: GroupsProps): JSX.Element {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const dummyGroups = [
      {
        id: "1",
        name: "Photography Enthusiasts",
        members: 1200,
        image:
          "https://res.cloudinary.com/dcivdqyyj/image/upload/v1733767533/ddkjqzutaigabpdt4xtu.jpg",
      },
      {
        id: "2",
        name: "Tech Innovators Hub",
        members: 2300,
        image:
          "https://res.cloudinary.com/dcivdqyyj/image/upload/v1733767579/gccvpwp3a3ndh0t3henk.jpg",
      },
      {
        id: "3",
        name: "Foodies United",
        members: 3500,
        image:
          "https://res.cloudinary.com/dcivdqyyj/image/upload/v1733767567/pazbqvphabnigj7ifdmy.png",
      },
      {
        id: "4",
        name: "Digital Nomads",
        members: 1800,
        image:
          "https://res.cloudinary.com/dcivdqyyj/image/upload/v1733767478/pkwfmcsvokihe3knz6lu.jpg",
      },
      {
        id: "5",
        name: "Fitness & Wellness",
        members: 4200,
        image:
          "https://res.cloudinary.com/dcivdqyyj/image/upload/v1733767596/xk10zsz1iaau3dshchtu.jpg",
      },
      {
        id: "6",
        name: "Book Lovers Club",
        members: 1500,
        image:
          "https://res.cloudinary.com/dcivdqyyj/image/upload/v1733767621/p7hohfgbebozn3flv4jf.png",
      },
      // {
      //   id: "7",
      //   name: "Travel Adventures",
      //   members: 2800,
      //   image: "/images/group7.jpg",
      // },
      // {
      //   id: "8",
      //   name: "Art & Design Community",
      //   members: 1900,
      //   image: "/images/group8.jpg",
      // },
      // {
      //   id: "9",
      //   name: "Startup Founders",
      //   members: 1600,
      //   image: "/images/group9.jpg",
      // },
      // {
      //   id: "10",
      //   name: "Gaming League",
      //   members: 5200,
      //   image: "/images/group10.jpg",
      // },
      // {
      //   id: "11",
      //   name: "Music Producers",
      //   members: 2100,
      //   image: "/images/group11.jpg",
      // },
      // {
      //   id: "12",
      //   name: "Green Living",
      //   members: 1700,
      //   image: "/images/group12.jpg",
      // },
    ];
    setGroups(dummyGroups);
  }, []);

  return (
    <Layout
      className="main-content-layout"
      style={{
        background: isDarkMode ? "#141414" : "#ffffff",
        padding: "24px",
      }}
    >
      <Row gutter={[16, 16]}>
        {groups.map((group) => (
          <Col xs={24} sm={12} md={8} key={group.id}>
            <Card
              style={{
                background: isDarkMode ? "#1f1f1f" : "#ffffff",
                borderRadius: "8px",
                border: `1px solid ${isDarkMode ? "#303030" : "#f0f0f0"}`,
              }}
              bodyStyle={{ padding: 0 }}
              cover={
                <div
                  style={{
                    height: "200px",
                    overflow: "hidden",
                    borderRadius: "8px 8px 0 0",
                    background: isDarkMode ? "#141414" : "#f5f5f5",
                  }}
                >
                  <img
                    alt={group.name}
                    src={group.image}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              }
            >
              <div style={{ padding: "16px" }}>
                <Typography.Title
                  level={5}
                  style={{
                    color: isDarkMode ? "#ffffff" : "#000000",
                    margin: "0 0 4px 0",
                  }}
                >
                  {group.name}
                </Typography.Title>

                <Typography.Text
                  style={{
                    color: isDarkMode ? "#ffffff99" : "#00000099",
                    display: "block",
                    marginBottom: "16px",
                  }}
                >
                  {group.members.toLocaleString()} members
                </Typography.Text>

                <Button
                  type="primary"
                  block
                  style={{
                    background: "#000000",
                    border: "none",
                    height: "40px",
                    borderRadius: "6px",
                  }}
                >
                  Join Group
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Layout>
  );
}

export default Groups;
