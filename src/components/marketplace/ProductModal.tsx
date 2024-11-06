import { Modal, Button, Typography, Rate } from "antd";
import { useUser } from "../../contexts/UserContext"; 

const { Text } = Typography;

const locationLabels: { [key: string]: string } = {
  "vn": "Viet Nam",
  "us": "United States",
  "uk": "United Kingdom",
  "fr": "France",
};

interface ProductModalProps {
  visible: boolean;
  product: any;
  onMessage: () => void;
  onBuy: () => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

const API_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

const ProductModal = ({ visible, product, onMessage, onBuy, onCancel, isDarkMode }: ProductModalProps) => {
  const { userId } = useUser(); 
  const location = product?.location ? locationLabels[product.location] || "Location not available" : "Location not available";
  const imageSrc = product?.image ? `${API_URL}${product.image}` : 'https://via.placeholder.com/150';

  // Check if the current user is the owner of the product
  const isUserProduct = product?.userId === userId;

  return (
    <Modal
      title={product?.title}
      visible={visible}
      onCancel={onCancel}
      footer={
        !isUserProduct && [
          <Button key="message" type="primary" onClick={onMessage}>Message Seller</Button>,
          <Button key="buy" type="primary" onClick={onBuy}>Buy Now</Button>,
        ]
      }
    >
      <img src={imageSrc} alt={product?.title} style={{ width: "100%", marginBottom: "1rem" }} />
      <Text>{product?.title}</Text>
      <Text style={{ display: "block", marginBottom: "1rem" }}>Price: ${product?.price}</Text>
      <Rate disabled value={product?.rating || 0} />
      <Text style={{ display: "block", marginTop: "1rem" }}>Seller: {product?.userName}</Text>
      <Text style={{ display: "block", marginTop: "1rem" }}>Location: {location}</Text>
    </Modal>
  );
};

export default ProductModal;
