import axios from 'axios';
import { CreateProductParams, UpdateProductParams, Product } from '../@util/types/product.type';

const API_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

const axiosClient = axios.create({ baseURL: API_URL });

// Interceptor to add Authorization header
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle 401 errors and refresh token
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh-token`, { token: refreshToken });
          const newAccessToken = response.data.access_token;

          localStorage.setItem('access_token', newAccessToken);
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest); // Retry original request
        } catch (refreshError) {
          handleLogout();
          console.error("Refresh token failed. Redirecting to login:", refreshError);
          throw refreshError;
        }
      } else {
        handleLogout();
      }
    }
    return Promise.reject(error);
  }
);

function handleLogout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
}

// Helper function to handle form data for image upload
const createFormData = (data: any) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });
  return formData;
};

// Create a new product with an image upload
export const createNewProduct = async (data: CreateProductParams & { image?: File }): Promise<Product> => {
  try {
    const formData = createFormData(data);
    const response = await axiosClient.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to create product:', error.response?.data || error.message);
    throw new Error("Failed to create product");
  }
};

// Get all products with optional filters
export const getAllProducts = async (params?: { skip?: number; take?: number; title?: string; location?: string; price?: number }) => {
  try {
    const response = await axiosClient.get('/products', { params });
    return response.data.map((product: any) => ({
      ...product,
      userName: product.user.userName,  // Extracting userName from product data
    }));
  } catch (error: any) {
    console.error('Error fetching products:', error.response?.data || error.message);
    throw new Error("Failed to fetch products");
  }
};

// Get a single product by ID
export const getProductById = async (id: string) => {
  try {
    const response = await axiosClient.get(`/products/${id}`);
    return {
      ...response.data,
      userName: response.data.user?.userName,  // Extracting userName from product data
    };
  } catch (error: any) {
    console.error(`Error fetching product with ID ${id}:`, error.response?.data || error.message);
    throw new Error(`Failed to fetch product with ID ${id}`);
  }
};

// Update a product by ID with an image upload
export const updateProduct = async (id: string, data: UpdateProductParams & { image?: File }) => {
  try {
    const formData = createFormData(data);
    const response = await axiosClient.patch(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error updating product with ID ${id}:`, error.response?.data || error.message);
    throw new Error(`Failed to update product with ID ${id}`);
  }
};

// Delete a product by ID
export const deleteProduct = async (id: string) => {
  try {
    const response = await axiosClient.delete(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error deleting product with ID ${id}:`, error.response?.data || error.message);
    throw new Error(`Failed to delete product with ID ${id}`);
  }
};
