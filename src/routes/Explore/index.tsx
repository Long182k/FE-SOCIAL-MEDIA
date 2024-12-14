import { Layout, Card, Row, Col, Typography } from "antd";
import { useEffect, useState } from "react";

interface ExploreProps {
  isDarkMode: boolean;
}

interface ExploreCard {
  id: string;
  title: string;
  description: string;
  image: string;
}

function Explore({ isDarkMode }: ExploreProps): JSX.Element {
  const [exploreCards, setExploreCards] = useState<ExploreCard[]>([]);

  useEffect(() => {
    const dummyCards = [
      {
        id: "1",
        title: "Exploring Urban Landscapes",
        description: "Discover the beauty of cityscapes around the world.",
        image:
          "https://res.cloudinary.com/dcivdqyyj/image/upload/v1733767281/wy1724uycvvhijomvxin.webp",
      },
      {
        id: "2",
        title: "Beach Escapes",
        description: "Unwind at the world's most picturesque beaches.",
        image:
          "https://res.cloudinary.com/dcivdqyyj/image/upload/v1733767304/pupsomgpzwbktbhdvxun.jpg",
      },
      {
        id: "3",
        title: "Forest Adventures",
        description: "Venture into the heart of nature's green havens.",
        image:
          "https://res.cloudinary.com/dcivdqyyj/image/upload/v1733767321/vw5mimzhhifgnshjy0vn.png",
      },
    ];
    setExploreCards(dummyCards);
  }, []);

  return (
    <Layout
      className="main-content-layout"
      style={{
        background: isDarkMode ? "#141414" : "#ffffff",
        padding: "24px",
      }}
    >
      <Row gutter={[24, 24]}>
        {exploreCards.map((card) => (
          <Col xs={24} key={card.id}>
            <Card
              hoverable
              style={{
                background: isDarkMode ? "#1f1f1f" : "#ffffff",
                borderRadius: "12px",
                overflow: "hidden",
                border: "none",
              }}
              bodyStyle={{ padding: "16px" }}
              cover={
                <div style={{ height: "300px", overflow: "hidden" }}>
                  <img
                    alt={card.title}
                    src={card.image}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "12px 12px 0 0",
                    }}
                  />
                </div>
              }
            >
              <Typography.Title
                level={4}
                style={{
                  color: isDarkMode ? "#ffffff" : "#000000",
                  margin: "0 0 4px 0",
                }}
              >
                {card.title}
              </Typography.Title>
              <Typography.Text
                style={{
                  color: isDarkMode ? "#ffffff99" : "#00000099",
                }}
              >
                {card.description}
              </Typography.Text>
            </Card>
          </Col>
        ))}
      </Row>
    </Layout>
  );
}

export default Explore;
