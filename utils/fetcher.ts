interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export const fetcher = async (url: string, options: FetchOptions = {}) => {
  const { params, ...fetchOptions } = options;

  const finalUrl = params
    ? `${url}?${new URLSearchParams(params)}`
    : url;

  try {
    const response = await fetch(finalUrl, {
      headers: {
        ...(fetchOptions.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
      ...fetchOptions,
    });

    const jsonResponse = await response.json();

    // Return the raw response data without wrapping it
    return jsonResponse;

  } catch (error: any) {
    // Return a consistent error format
    return {
      error: true,
      message: error.message || 'Network error'
    };
  }
};