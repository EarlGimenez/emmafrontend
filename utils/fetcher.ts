interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export const fetcher = async (url: string, options: FetchOptions = {}) => {
  const { params, ...fetchOptions } = options
  
  const finalUrl = params
    ? `${url}?${new URLSearchParams(params)}`
    : url

  const response = await fetch(finalUrl, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...fetchOptions,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Network response was not ok')
  }

  return data
}