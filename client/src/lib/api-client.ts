const API_BASE_URL = 'http://localhost:8000/api/v1';

export class ApiError extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

interface RequestOptions extends RequestInit {
  data?: any;
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem('token');
  
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  // Do not set Content-Type header if body is FormData (for OAuth Password Form / uploads)
  if (!(options.body instanceof FormData) && !options.headers) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  if (options.data) {
    config.body = JSON.stringify(options.data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    localStorage.removeItem('token');
    // If not on login page, redirect to login
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  let responseData;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }

  if (!response.ok) {
    const errorMessage = responseData && typeof responseData === 'object' && responseData.message 
      ? responseData.message 
      : responseData && typeof responseData === 'object' && responseData.detail
        ? (typeof responseData.detail === 'string' ? responseData.detail : JSON.stringify(responseData.detail))
        : response.statusText || 'An error occurred';
    throw new ApiError(response.status, errorMessage);
  }

  return responseData as T;
}
