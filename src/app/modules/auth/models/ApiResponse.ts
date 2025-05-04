import { User } from "./User";

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  total?: number;
} 