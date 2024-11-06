import { Card, Typography, Rate, Button } from "antd";

const { Title, Text } = Typography;

const locationLabels: { [key: string]: string } = {
  "vn": "VN",
  "us": "US",
  "uk": "UK",
  "fr": "France",
};

// Use Vite environment variable
const API_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

interface ProductCardProps {
  item: any;
  isDarkMode: boolean;
  onClick: () => void;
  onDelete: () => void; // New prop for delete function
  userId: string; // Current user's ID to check ownership
}

const ProductCard = ({ item, isDarkMode, onClick, onDelete, userId }: ProductCardProps) => {
  const price = item.price ? Number(item.price).toFixed(2) : "N/A";
  const location = item.location ? locationLabels[item.location] || "Location not available" : "Location not available";

  // Check if the current user is the owner of the product
  const isUserProduct = item.userId === userId;

  // Construct the image source URL
  const imageSrc = item.image ? `${API_URL}${item.image}` : 'https://via.placeholder.com/150';

  return (
<Card
  hoverable
  cover={
    <img
      alt={item.title}
      src={imageSrc}
      style={{
        width: "100%",
        height: "150px",
        objectFit: "cover",
        display: "block",
      }}
    />
  }
  onClick={onClick}
  style={{
    backgroundColor: isDarkMode ? "#1c1c1e" : "white",
    color: isDarkMode ? "white" : "black",
    width: "230px",
    padding: "5px",
    margin: "10px", 
  }}
>
    <Title level={5} style={{ color: isDarkMode ? "white" : "black", marginBottom: "8px" }}>
      {item.title}
    </Title>
    <Rate disabled defaultValue={item.rating || 0} style={{ marginBottom: "8px" }} />
    <Text strong style={{ color: isDarkMode ? "white" : "black", display: "block", marginTop: "8px" }}>
      Price: ${price}
    </Text>
    <Text strong style={{ color: isDarkMode ? "white" : "black", display: "block", marginTop: "8px" }}>
      Seller: {item.userName || "Unknown"}
    </Text>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
      <Text strong style={{ color: isDarkMode ? "white" : "black" }}>
        Location: {location}
      </Text>
      <Text>{item.timestamp}</Text>
    </div>
    {isUserProduct && (
      <Button
        type="primary"
        danger
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering onClick for the card
          onDelete(); // Call the delete handler
        }}
        style={{ marginTop: "10px", width: "100%" }}
      >
        Delete
      </Button>
    )}
  </Card>
  
  
  );
};

export default ProductCard;
