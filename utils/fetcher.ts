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

  const text = await response.text()
  let data
  try {
    data = JSON.parse(text)
  } catch (e) {
    console.error('Non-JSON response:', text)
    throw new Error('Invalid JSON response from server')
  }

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  return data
}