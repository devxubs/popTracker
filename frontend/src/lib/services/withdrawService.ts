import api from "../api";
import { ApiResponse, Withdraw } from "@/types";

export interface WithdrawInput {
  partnerName: string;
  amount: number;
  date?: string;
}

export const withdrawService = {
  getAll: async (): Promise<Withdraw[]> => {
    const res = await api.get<ApiResponse<Withdraw[]>>("/withdraws");
    return res.data.data;
  },

  create: async (payload: WithdrawInput): Promise<Withdraw> => {
    const res = await api.post<ApiResponse<Withdraw>>("/withdraws", payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/withdraws/${id}`);
  },
};
