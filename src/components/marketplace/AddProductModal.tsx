import { Modal, Form, Input, InputNumber, Select, Rate, Upload, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { createNewProduct } from '../../api/products';
import { useUser } from '../../contexts/UserContext';

const { Option } = Select;

interface AddProductModalProps {
  visible: boolean;
  onCancel: () => void;
  onAdd: (product: any) => void;
  isDarkMode: boolean;
}

const AddProductModal = ({ visible, onCancel, onAdd, isDarkMode }: AddProductModalProps) => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | null>(null); // Store selected image file
  const { userId } = useUser(); // Get current userId from User Context

  const handleAddProduct = async (values: any) => {
    if (!userId) {
      message.error("User is not logged in. Unable to add product.");
      return;
    }

    const newProduct = {
      image: imageFile ? 'file-upload-placeholder-url' : 'https://via.placeholder.com/150',
      title: values.title,
      price: parseFloat(values.price),
      location: values.location,
      rating: values.rating || 0,
      userId,
    };

    const productData = {
      ...newProduct,
      image: imageFile ? imageFile : undefined, // Attach file if it's provided
    };

    try {
      const createdProduct = await createNewProduct(productData);
      onAdd(createdProduct);
      form.resetFields();
      setImageFile(null);
      onCancel();
      message.success("Product added successfully!");
      // window.location.reload();
    } catch (error) {
      message.error("Failed to add product.");
      console.error('Failed to add product:', error);
    }
  };

  const handleImageUpload = (file: File) => {
    setImageFile(file); // Store the uploaded file
    return false; // Prevent automatic upload by Ant Design
  };

  return (
    <Modal
      title="Sell a New Product"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      style={{ backgroundColor: isDarkMode ? '#1c1c1e' : 'white' }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleAddProduct}
        style={{ color: isDarkMode ? 'white' : 'black' }}
      >
        <Form.Item label="Product Title" name="title" rules={[{ required: true, message: 'Please enter the product title' }]}>
          <Input style={{ backgroundColor: isDarkMode ? '#333' : 'white', color: isDarkMode ? 'white' : 'black' }} />
        </Form.Item>
        <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please enter the product price' }]}>
          <InputNumber
            min={0}
            formatter={(value) => `$ ${value}`}
            parser={(value) => value!.replace('$', '')}
            style={{ width: '100%', backgroundColor: isDarkMode ? '#333' : 'white', color: isDarkMode ? 'white' : 'black' }}
          />
        </Form.Item>
        <Form.Item label="Location" name="location" rules={[{ required: true, message: 'Please select a location' }]}>
          <Select placeholder="Select location" style={{ backgroundColor: isDarkMode ? '#333' : 'white', color: isDarkMode ? 'white' : 'black' }}>
            <Option value="vn">Vietnam</Option>
            <Option value="us">United States</Option>
            <Option value="uk">United Kingdom</Option>
            <Option value="fr">France</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Upload Image">
          <Upload
            beforeUpload={handleImageUpload}
            listType="picture-card"
            maxCount={1}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item label="Rating" name="rating">
          <Rate />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
