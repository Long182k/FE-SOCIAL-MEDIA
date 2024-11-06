import { Layout, Row, Col, Typography, Input, Button, Select, Divider, message, Spin } from "antd";
import { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import Breadcrumbs from "../../components/Breadcrumbs";
import ProductCard from "../../components/marketplace/ProductCard";
import AddProductModal from "../../components/marketplace/AddProductModal";
import ProductModal from "../../components/marketplace/ProductModal";
import MessageModal from "../../components/marketplace/MessageModal";
import PaymentModal from "../../components/marketplace/PaymentModal";
import { getAllProducts, deleteProduct } from "../../api/products";
import { Product } from "../../@util/types/product.type";
import { useUser } from '../../contexts/UserContext';

const { Title } = Typography;
const { Option } = Select;

interface ExploreProps {
  isDarkMode: boolean;
}

function Marketplace({ isDarkMode }: ExploreProps): JSX.Element {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [isMessageModalVisible, setIsMessageModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPriceSortedAsc, setIsPriceSortedAsc] = useState(true);
  const [isPriceSortEnabled, setIsPriceSortEnabled] = useState(false);
  const [showMyProducts, setShowMyProducts] = useState(false);
  const { userId } = useUser(); // Get the current user ID from User Context

  // Fetch products from API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await getAllProducts();
        setItems(products);
      } catch (error) {
        setError("Failed to load products.");
        message.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalVisible(true);
  };

  const openMessageModal = () => {
    setIsProductModalVisible(false);
    setTimeout(() => setIsMessageModalVisible(true), 100);
  };

  const openPaymentModal = () => {
    setIsProductModalVisible(false);
    setTimeout(() => setIsPaymentModalVisible(true), 100);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleFilterChange = (value: string) => setFilterOption(value);

  const togglePriceSort = () => {
    setIsPriceSortedAsc(!isPriceSortedAsc);
    setIsPriceSortEnabled(true);
  };

  const toggleMyProducts = () => {
    setShowMyProducts(!showMyProducts);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId); 
      setItems(items.filter((item) => item.id !== productId)); 
      message.success("Product deleted successfully.");
    } catch (error) {
      message.error("Failed to delete product.");
      console.error("Failed to delete product:", error);
    }
  };

  const filteredItems = items
    .filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery);
      const matchesFilter =
        filterOption === "all" ||
        item.location === filterOption ||
        (filterOption === "4" && item.rating >= 4) ||
        (filterOption === "3" && item.rating >= 3);
      const matchesMyProducts = !showMyProducts || item.userId === userId;
      return matchesSearch && matchesFilter && matchesMyProducts;
    });

  const sortedItems = isPriceSortEnabled
    ? filteredItems.sort((a, b) => (isPriceSortedAsc ? a.price - b.price : b.price - a.price))
    : filteredItems;

  return (
    <Layout style={{ background: isDarkMode ? "black" : "white", padding: "2rem" }}>
      <Breadcrumbs />
      <Row justify="center">
        <Col span={20}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <Title level={2} style={{ color: isDarkMode ? "white" : "black" }}>
              Marketplace
            </Title>
            <Button type="primary" shape="round" onClick={showModal}>
              Sell Something
            </Button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <Input
              placeholder="Search products"
              prefix={<SearchOutlined />}
              onChange={handleSearchChange}
              style={{ width: "38%" }}
            />
            <Button type="default" onClick={togglePriceSort} style={{ width: "23%", marginLeft: "1%" }}>
              Sort Price: {isPriceSortedAsc ? "Low to High" : "High to Low"}
            </Button>
            <Select defaultValue="all" onChange={handleFilterChange} style={{ width: "15%" }}>
              <Option value="all">All</Option>
              <Option value="vn">Vietnam</Option>
              <Option value="us">United States</Option>
              <Option value="uk">United Kingdom</Option>
              <Option value="fr">France</Option>
              <Option value="4">Rating 4 & Above</Option>
              <Option value="3">Rating 3 & Above</Option>
            </Select>
            <Button type="default" onClick={toggleMyProducts} style={{ width: "20%", marginLeft: "1%" }}>
              {showMyProducts ? "Show All Products" : "Show My Products"}
            </Button>
          </div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <Spin size="large" />
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>{error}</div>
          ) : (
            <>
              <AddProductModal
                visible={isModalVisible}
                onCancel={handleCancel}
                onAdd={(product) => setItems([product, ...items])}
                isDarkMode={isDarkMode}
              />
              <ProductModal
                visible={isProductModalVisible}
                product={selectedProduct}
                onMessage={openMessageModal}
                onBuy={openPaymentModal}
                onCancel={() => setIsProductModalVisible(false)}
                isDarkMode={isDarkMode}
              />
              <MessageModal visible={isMessageModalVisible} onCancel={() => setIsMessageModalVisible(false)} />
              <PaymentModal visible={isPaymentModalVisible} product={selectedProduct} onCancel={() => setIsPaymentModalVisible(false)} />
              <Divider />
              <Row gutter={[48, 48]}>
                {sortedItems.map((item) => (
                  <Col key={item.id} xs={24} sm={12} md={8} lg={8}>
                    <ProductCard
                      item={item}
                      isDarkMode={isDarkMode}
                      userId={userId} // Pass the current user ID
                      onClick={() => handleProductClick(item)}
                      onDelete={() => handleDeleteProduct(item.id)} // Pass delete handler
                    />
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Layout>
  );
}

export default Marketplace;
