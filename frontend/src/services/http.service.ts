import axios from "axios";
import config from "../config";

export type ErrorType = {
  message: string;
  code: number;
};

export type ResponseType = {
  data?: Record<string, unknown>;
  error?: ErrorType;
};

export default class HttpService<T> {
  public async get(
    url: string,
    params: Record<string, unknown> = {}
  ): Promise<T> {
    try {
      const response = await axios.get<T>(`${config.apiBaseUrl}${url}`, {
        params: params,
      });

      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  public async post(url: string, data: Record<string, unknown>): Promise<T> {
    try {
      const response = await axios.post<T>(`${config.apiBaseUrl}${url}`, data);

      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  public async put(url: string, data: Record<string, unknown>): Promise<T> {
    try {
      const response = await axios.put<T>(`${config.apiBaseUrl}${url}`, data);

      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
}
