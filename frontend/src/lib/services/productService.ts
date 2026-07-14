import api from "../api";
import { ApiResponse, Product } from "@/types";

// Payload shape for creating/updating a product (no id / timestamps)
export type ProductInput = Pick<Product, "name" | "buyPrice" | "sellPrice" | "stock">;

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const res = await api.get<ApiResponse<Product[]>>("/products");
    return res.data.data;
  },

  create: async (payload: ProductInput): Promise<Product> => {
    const res = await api.post<ApiResponse<Product>>("/products", payload);
    return res.data.data;
  },

  update: async (id: number, payload: ProductInput): Promise<Product> => {
    const res = await api.put<ApiResponse<Product>>(`/products/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
