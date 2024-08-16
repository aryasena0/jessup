/**
 * @typedef {Object} BaseQueryParams
 * @property {string} [page]
 * @property {string} [limit]
 * @property {string} [search]
 * @property {string} [populate]
 * @property {string} [order]
 */

/**
 * @typedef {Object} RequestConfig
 * @property {string} endpoint - The API endpoint URL.
 * @property {any} [data] - The data to be sent with the request (for POST, PUT, PATCH).
 * @property {Object<string, string>} [headers] - Custom headers to be sent with the request.
 * @property {BaseQueryParams} [query] - Query parameters to be appended to the URL.
 */

/**
 * @typedef {Object} BaseResponse
 * @template T
 * @property {string} message - The response message.
 * @property {T} [data] - The response data.
 */

/**
 * BaseApiService class for making HTTP requests.
 */
class BaseApiService {
  /**
   * Performs a GET request.
   * @template T
   * @param {RequestConfig} rcfg - The request configuration.
   * @returns {Promise<BaseResponse<T>>} - A promise that resolves to the response.
   */
  static async get(rcfg) {
    const url = new URL(
      rcfg.endpoint,
      process.env.API_URL || "http://localhost:3001"
    );
    if (rcfg.query) {
      Object.keys(rcfg.query).forEach((key) => {
        if (rcfg.query[key] !== undefined) {
          url.searchParams.append(key, rcfg.query[key]);
        }
      });
    }

    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(rcfg.headers),
    });

    return await this.handleResponse(response);
  }

  /**
   * Performs a POST request.
   * @template T
   * @param {RequestConfig} rcfg - The request configuration.
   * @returns {Promise<BaseResponse<T>>} - A promise that resolves to the response.
   */
  static async post(rcfg) {
    const url = new URL(
      rcfg.endpoint,
      process.env.API_URL || "http://localhost:3001"
    );

    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(rcfg.headers),
      body: JSON.stringify(rcfg.data),
    });
    return await this.handleResponse(response);
  }

  /**
   * Performs a PUT request.
   * @template T
   * @param {RequestConfig} rcfg - The request configuration.
   * @returns {Promise<BaseResponse<T>>} - A promise that resolves to the response.
   */
  static async put(rcfg) {
    const url = new URL(
      rcfg.endpoint,
      process.env.API_URL || "http://localhost:3001"
    );
    const response = await fetch(url, {
      method: "PUT",
      headers: this.getHeaders(rcfg.headers),
      body: JSON.stringify(rcfg.data),
    });
    return await this.handleResponse(response);
  }

  /**
   * Performs a PATCH request.
   * @template T
   * @param {RequestConfig} rcfg - The request configuration.
   * @returns {Promise<BaseResponse<T>>} - A promise that resolves to the response.
   */
  static async patch(rcfg) {
    const url = new URL(
      rcfg.endpoint,
      process.env.API_URL || "http://localhost:3001"
    );
    const response = await fetch(url, {
      method: "PATCH",
      headers: this.getHeaders(rcfg.headers),
      body: JSON.stringify(rcfg.data),
    });
    return await this.handleResponse(response);
  }

  /**
   * Performs a DELETE request.
   * @template T
   * @param {RequestConfig} rcfg - The request configuration.
   * @returns {Promise<BaseResponse<T>>} - A promise that resolves to the response.
   */
  static async delete(rcfg) {
    const url = new URL(
      rcfg.endpoint,
      process.env.API_URL || "http://localhost:3001"
    );
    const response = await fetch(url, {
      method: "DELETE",
      headers: this.getHeaders(rcfg.headers),
    });
    return await this.handleResponse(response);
  }

  /**
   * Performs an upload request with FormData.
   * @template T
   * @param {RequestConfig} rcfg - The request configuration.
   * @returns {Promise<BaseResponse<T>>} - A promise that resolves to the response.
   */
  static async upload(rcfg) {
    const url = new URL(
      rcfg.endpoint,
      process.env.API_URL || "http://localhost:3001"
    );
    const formData = new FormData();
    Object.keys(rcfg.data).forEach((key) => {
      formData.append(key, rcfg.data[key]);
    });

    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(rcfg.headers),
      body: formData,
    });

    return await this.handleResponse(response);
  }

  /**
   * Returns a configuration with credentials included.
   * @returns {Object} - An object containing methods for GET, POST, PUT, PATCH, and DELETE with credentials.
   */
  static withCredentials() {
    const headers = {
      "Content-Type": "application/json",
      credentials: "include",
    };

    const baseFn = (method, rcfg) =>
      this[method]({
        ...rcfg,
        headers: {
          ...rcfg.headers,
          ...headers,
        },
      });

    return {
      get: (rcfg) => baseFn("get", rcfg),
      post: (rcfg) => baseFn("post", rcfg),
      put: (rcfg) => baseFn("put", rcfg),
      patch: (rcfg) => baseFn("patch", rcfg),
      delete: (rcfg) => baseFn("delete", rcfg),
    };
  }

  /**
   * Handles the response from the fetch request.
   * @param {Response} response - The response object from fetch.
   * @returns {Promise<BaseResponse>} - A promise that resolves to the parsed JSON response.
   * @throws {Error} - Throws an error if the response is not ok.
   */
  static async handleResponse(response) {
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message, {
        cause: {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          errors: json.errors,
        },
      });
    }

    return json;
  }

  /**
   * Returns the headers for the request.
   * @param {HeadersInit} [headers] - Custom headers to merge with default headers.
   * @returns {Object} - The headers for the request.
   */
  static getHeaders(headers) {
    return {
      "Content-Type": "application/json",
      ...headers,
    };
  }
}

export default BaseApiService;
