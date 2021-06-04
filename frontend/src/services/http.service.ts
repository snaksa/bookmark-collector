import axios from "axios";
import config from "../config";

export type ResponseType = {
  data?: Record<string, unknown>;
  error?: {
    message: string;
    code: number;
  };
};

export default class HttpService<T> {
  public async post(url: string, data: Record<string, unknown>): Promise<T> {
    try {
      const response = await axios.post<T>(`${config.apiBaseUrl}${url}`, data);

      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
}
