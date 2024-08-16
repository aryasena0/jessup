/** Common types */
type BaseQueryParams = {
  [key: string]: string | undefined;
  page?: string;
  limit?: string;
  search?: string;
  populate?: string;
  order?: string;
};

type RequestConfig = {
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  query?: BaseQueryParams;
};

type BaseResponse<T> = {
  message: string;
  data?: T;
};

/** Will be extended by other services */
class BaseApiService {
  public static async get<T>(rcfg: RequestConfig): Promise<BaseResponse<T>> {
    const url = new URL(
      rcfg.endpoint,
      process.env.API_URL || "http://localhost:3001"
    );
    if (rcfg.query) {
      Object.keys(rcfg.query).forEach((key) => {
        if (rcfg.query && typeof rcfg.query[key] !== "undefined") {
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

  public static async post<T>(rcfg: RequestConfig): Promise<BaseResponse<T>> {
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

  public static async put<T>(rcfg: RequestConfig): Promise<BaseResponse<T>> {
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

  public static async patch<T>(rcfg: RequestConfig): Promise<BaseResponse<T>> {
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

  public static async delete<T>(rcfg: RequestConfig): Promise<BaseResponse<T>> {
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

  public static async upload<T>(rcfg: RequestConfig): Promise<BaseResponse<T>> {
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

  public static withCredentials() {
    const headers = {
      "Content-Type": "application/json",
      credentials: "include",
    };

    const baseFn = <T>(
      method: "get" | "post" | "put" | "patch" | "delete",
      rcfg: RequestConfig
    ) =>
      this[method]<T>({
        ...rcfg,
        headers: {
          ...rcfg.headers,
          ...headers,
        },
      });

    return {
      get: <T>(rcfg: RequestConfig) => baseFn<T>("get", rcfg),
      post: <T>(rcfg: RequestConfig) => baseFn<T>("post", rcfg),
      put: <T>(rcfg: RequestConfig) => baseFn<T>("put", rcfg),
      patch: <T>(rcfg: RequestConfig) => baseFn<T>("patch", rcfg),
      delete: <T>(rcfg: RequestConfig) => baseFn<T>("delete", rcfg),
    };
  }

  public static async handleResponse(response: Response) {
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

  public static getHeaders(headers?: HeadersInit) {
    return {
      "Content-Type": "application/json",
      ...headers,
    };
  }
}

export default BaseApiService;
