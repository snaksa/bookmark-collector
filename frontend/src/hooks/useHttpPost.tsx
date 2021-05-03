import { useState } from "react";
import axios from "axios";
import config from "../config";

export default function useHttpPost(url: string) {
  const [response, setResponse] = useState([]);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const execute = async (data: { [key: string]: any } = {}) => {
    setIsLoading(true);
    try {
      const response = await axios(`${config.apiBaseUrl}${url}`, {
        method: "POST",
        data: data,
      });

      const responseData = response.data;
      setResponse(responseData);
      setIsLoading(false);

      return responseData;
    } catch (error) {
      setIsLoading(false);
      setError({
        status: error.response.status,
        message: error.response.data.message,
      });
    }
  };

  return { response, error, isLoading, execute };
}
