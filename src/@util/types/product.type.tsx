// Type for creating a new product
export interface CreateProductParams {
    title: string;
    price: number;
    location: string;
    image: string;
    rating?: number;
  }
  
  // Type for updating an existing product
  export interface UpdateProductParams {
    title?: string;
    price?: number;
    location?: string;
    image?: string;
    rating?: number;
  }
  
  // Define a Product interface for fetching products
  export interface Product {
    id: string; // assuming each product has a unique ID
    title: string;
    price: number;
    location: string;
    image?: string;
    rating: number;
    timestamp?: string; // optional field if your backend provides a timestamp
    userName?: string,
    userId?: string
  }
  