import axios from 'axios';
import { Business, Category, ApiResponse, BusinessFilters } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const businessApi = {
  // Get all businesses with optional filters
  getAll: async (filters?: BusinessFilters): Promise<Business[]> => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await api.get<ApiResponse<Business[]>>(`/businesses?${params.toString()}`);
    return response.data.data;
  },

  // Get business by ID
  getById: async (id: number): Promise<Business> => {
    const response = await api.get<ApiResponse<Business>>(`/businesses/${id}`);
    return response.data.data;
  },

  // Create new business
  create: async (businessData: Partial<Business>): Promise<Business> => {
    const response = await api.post<ApiResponse<Business>>('/businesses', businessData);
    return response.data.data;
  },

  // Update business
  update: async (id: number, businessData: Partial<Business>): Promise<Business> => {
    const response = await api.put<ApiResponse<Business>>(`/businesses/${id}`, businessData);
    return response.data.data;
  },

  // Delete business
  delete: async (id: number): Promise<void> => {
    await api.delete(`/businesses/${id}`);
  },
};

export const categoryApi = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<ApiResponse<Category[]>>('/categories');
    return response.data.data;
  },

  // Get category by ID
  getById: async (id: number): Promise<Category> => {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data.data;
  },

  // Create new category
  create: async (categoryData: Partial<Category>): Promise<Category> => {
    const response = await api.post<ApiResponse<Category>>('/categories', categoryData);
    return response.data.data;
  },
};
