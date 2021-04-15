import axios from "axios";

class HttpClient {
  static baseUrl = 'https://s6yse3f9o6.execute-api.us-east-1.amazonaws.com/prod/';

  static async get(url: string, params: { [key: string]: string | number } = {}, headers: { [key: string]: string | number } = {}) {
    return await axios(`${this.baseUrl}${url}`, {
      method: 'GET',
      params: params,
      headers: headers
    })
      .then(response => response.data)
      .catch(error => {
        return {
          status: error.response.status,
          message: error.response.data.message,
        };
      });
  }

  static async post(url: string, params: { [key: string]: string | number }, data: { [key: string]: any } = {}) {
    return await axios(`${this.baseUrl}${url}`, {
      method: 'POST',
      params: params,
      data: data,
    })
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