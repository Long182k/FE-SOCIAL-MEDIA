import {
  Layout,
  Tabs,
  Input,
  Card,
  Row,
  Col,
  Typography,
  Image,
  Tag,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

interface MarketplaceProps {
  isDarkMode: boolean;
}

interface Product {
  id: string;
  title: string;
  price: number;
  condition: "New" | "Used" | "Like new";
  image: string;
}

interface Collection {
  id: string;
  title: string;
  image: string;
}

interface Category {
  key: string;
  label: string;
}

function Marketplace({ isDarkMode }: MarketplaceProps): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  // Simulated data - replace with actual API calls
  useEffect(() => {
    const dummyProducts = [
      {
        id: "1",
        title: "iPhone 12 128GB",
        price: 200,
        condition: "New",
        image:
          "https://res.cloudinary.com/dcivdqyyj/image/upload/v1733767386/t5um6zgxn62knylt2oos.jpg",
      },
      {
        id: "2",
        title: "Samsung Galaxy S20",
        price: 300,
        condition: "Used",
        image:
          "https://res.cloudinary.com/dcivdqyyj/image/upload/v1733767411/s7wm1rqegq5k7b05nwgn.jpg",
      },
      // Add more products...
    ];

    const dummyCollections = [
      {
        id: "1",
        title: "Summer Style",
        image:
          "https://res.cloudinary.com/dcivdqyyj/image/upload/v1733767424/lp8a8jxhf8ttiuoutiqj.jpg",
      },
      {
        id: "2",
        title: "Gym Essentials",
        image:
          "https://res.cloudinary.com/dcivdqyyj/image/upload/v1733767478/pkwfmcsvokihe3knz6lu.jpg",
      },
      // Add more collections...
    ];

    setProducts(dummyProducts as Product[]);
    setCollections(dummyCollections);
  }, []);

  const categories: Category[] = [
    { key: "electronics", label: "Electronics" },
    { key: "fashion", label: "Fashion" },
    { key: "home", label: "Home" },
    { key: "sporting-goods", label: "Sporting goods" },
    { key: "toys", label: "Toys" },
    { key: "pet-supplies", label: "Pet supplies" },
    { key: "books", label: "Books" },
    { key: "video-games", label: "Video games" },
    { key: "music", label: "Music" },
  ];

  const tabItems = [
    { key: "buy", label: "Buy" },
    { key: "sell", label: "Sell" },
    { key: "saved-items", label: "Saved Items" },
    { key: "offers", label: "Offers" },
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
        Marketplace
      </Typography.Title>

      <Tabs
        items={tabItems}
        style={{
          color: isDarkMode ? "#ffffff" : "#000000",
          marginBottom: "16px",
        }}
      />

      <Input
        prefix={<SearchOutlined />}
        placeholder="Search in Marketplace"
        style={{
          marginBottom: "24px",
          background: isDarkMode ? "#141414" : "#f5f5f5",
          borderColor: isDarkMode ? "#303030" : "#d9d9d9",
          color: isDarkMode ? "#ffffff" : "#000000",
        }}
      />

      <Typography.Title
        level={4}
        style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
      >
        Items
      </Typography.Title>

      <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
        {products.map((product) => (
          <Col xs={12} sm={8} md={6} key={product.id}>
            <Card
              hoverable
              cover={
                <Image
                  alt={product.title}
                  src={product.image}
                  style={{ height: 200, objectFit: "cover" }}
                />
              }
              style={{
                background: isDarkMode ? "#1f1f1f" : "#ffffff",
                borderColor: isDarkMode ? "#303030" : "#d9d9d9",
              }}
            >
              <Card.Meta
                title={
                  <Typography.Text
                    style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
                  >
                    ${product.price}
                  </Typography.Text>
                }
                description={
                  <Typography.Text
                    style={{ color: isDarkMode ? "#ffffff99" : "#00000099" }}
                  >
                    {product.title}
                  </Typography.Text>
                }
              />
              <Tag
                color={product.condition === "New" ? "green" : "blue"}
                style={{ marginTop: 8 }}
              >
                {product.condition}
              </Tag>
            </Card>
          </Col>
        ))}
      </Row>

      <Typography.Title
        level={4}
        style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
      >
        Featured collections
      </Typography.Title>

      <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
        {collections.map((collection) => (
          <Col xs={12} sm={8} md={6} key={collection.id}>
            <Card
              hoverable
              cover={
                <Image
                  alt={collection.title}
                  src={collection.image}
                  style={{ height: 150, objectFit: "cover" }}
                />
              }
              style={{
                background: isDarkMode ? "#1f1f1f" : "#ffffff",
                borderColor: isDarkMode ? "#303030" : "#d9d9d9",
              }}
            >
              <Card.Meta
                title={
                  <Typography.Text
                    style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
                  >
                    {collection.title}
                  </Typography.Text>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Typography.Title
        level={4}
        style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
      >
        Shop by category
      </Typography.Title>

      <Row gutter={[8, 8]}>
        {categories.map((category) => (
          <Col key={category.key}>
            <Tag
              style={{
                cursor: "pointer",
                background: isDarkMode ? "#1f1f1f" : "#f5f5f5",
                borderColor: isDarkMode ? "#303030" : "#d9d9d9",
                color: isDarkMode ? "#ffffff" : "#000000",
              }}
            >
              {category.label}
            </Tag>
          </Col>
        ))}
      </Row>
    </Layout>
  );
}

export default Marketplace;
