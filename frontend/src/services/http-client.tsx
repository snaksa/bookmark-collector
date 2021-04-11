import axios from "axios";

class HttpClient {
  static async get(url: string, params: { [key: string]: string | number } = {}) {
    return await axios(url, {
        params: params
      }
    )
      .then(response => response.data)
      .catch(error => {
        return {
          status: error.response.status,
          message: error.response.data.message,
        };
      });
  }

  static async post(url: string, params: { [key: string]: string | number }, data: { [key: string]: any } = {}) {
    return await axios(url, {
        method: 'POST',
        params: params,
        data: data,
      }
    )
      .then(response => {
        return {
          status: response.status,
          data: response.data,
        }
      })
      .catch(error => {
        return {
          status: error.response.status,
          data: error.response.data.message,
        };
      });
  }
}

export default HttpClient;