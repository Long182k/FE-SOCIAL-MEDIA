// // UpdateProductModal.tsx
// import { Modal, Form, Input, InputNumber, Select, Rate, Upload, Button, message } from "antd";
// import { PlusOutlined } from "@ant-design/icons";
// import { useState, useEffect } from "react";
// import { updateProduct } from "../../api/products"; // Import update API function

// const { Option } = Select;

// interface UpdateProductModalProps {
//   visible: boolean;
//   onCancel: () => void;
//   onUpdate: (updatedProduct: any) => void;
//   product: any;
//   isDarkMode: boolean;
// }

// const UpdateProductModal = ({ visible, onCancel, onUpdate, product, isDarkMode }: UpdateProductModalProps) => {
//   const [form] = Form.useForm();
//   const [imageFile, setImageFile] = useState<File | null>(null);

//   useEffect(() => {
//     if (product) {
//       form.setFieldsValue({
//         title: product.title,
//         price: product.price,
//         location: product.location,
//         rating: product.rating,
//       });
//     }
//   }, [product, form]);

//   const handleUpdateProduct = async (values: any) => {
//     const updatedData = {
//       title: values.title,
//       price: parseFloat(values.price),
//       location: values.location,
//       rating: values.rating || 0,
//       image: imageFile,
//     };

//     try {
//       const updatedProduct = await updateProduct(product.id, updatedData);
//       onUpdate(updatedProduct); // Pass updated product to update state
//       form.resetFields();
//       setImageFile(null);
//       onCancel();
//       message.success("Product updated successfully!");
//     } catch (error) {
//       message.error("Failed to update product.");
//       console.error("Failed to update product:", error);
//     }
//   };

//   const handleImageUpload = (file: File) => {
//     setImageFile(file);
//     return false; // Prevent automatic upload
//   };

//   return (
//     <Modal
//       title="Update Product"
//       visible={visible}
//       onCancel={onCancel}
//       footer={null}
//       style={{ backgroundColor: isDarkMode ? "#1c1c1e" : "white" }}
//     >
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleUpdateProduct}
//         style={{ color: isDarkMode ? "white" : "black" }}
//       >
//         <Form.Item label="Product Title" name="title" rules={[{ required: true, message: "Please enter the product title" }]}>
//           <Input style={{ backgroundColor: isDarkMode ? "#333" : "white", color: isDarkMode ? "white" : "black" }} />
//         </Form.Item>
//         <Form.Item label="Price" name="price" rules={[{ required: true, message: "Please enter the product price" }]}>
//           <InputNumber
//             min={0}
//             formatter={(value) => `$ ${value}`}
//             parser={(value) => value!.replace("$", "")}
//             style={{ width: "100%", backgroundColor: isDarkMode ? "#333" : "white", color: isDarkMode ? "white" : "black" }}
//           />
//         </Form.Item>
//         <Form.Item label="Location" name="location" rules={[{ required: true, message: "Please select a location" }]}>
//           <Select placeholder="Select location" style={{ backgroundColor: isDarkMode ? "#333" : "white", color: isDarkMode ? "white" : "black" }}>
//             <Option value="vn">Vietnam</Option>
//             <Option value="us">United States</Option>
//             <Option value="uk">United Kingdom</Option>
//             <Option value="fr">France</Option>
//           </Select>
//         </Form.Item>
//         <Form.Item label="Upload Image">
//           <Upload
//             beforeUpload={handleImageUpload}
//             listType="picture-card"
//             maxCount={1}
//           >
//             <div>
//               <PlusOutlined />
//               <div style={{ marginTop: 8 }}>Upload</div>
//             </div>
//           </Upload>
//         </Form.Item>
//         <Form.Item label="Rating" name="rating">
//           <Rate />
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit" block>
//             Update Product
//           </Button>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default UpdateProductModal;
