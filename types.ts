import { Request } from 'express';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'customer';
}

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  category: string;
  image_url: string;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}