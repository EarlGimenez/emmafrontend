// Get the IP address from environment or use default
const DEV_IP = '172.30.11.254' // Your development machine IP
const DEV_PORT = '8000'
const PROD_URL = 'https://api.yourapp.com' // Future production URL

const BASE_URL = __DEV__ 
  ? `http://${DEV_IP}:${DEV_PORT}/api`
  : PROD_URL

export const API_URLS = {
  family: {
    get: (id: string) => `${BASE_URL}/family/${id}`,
    join: `${BASE_URL}/join-family`,
  },
  users: {
    temp: `${BASE_URL}/users/temp`,
    complete: (userId: number) => `${BASE_URL}/users/${userId}/complete`,
  }
}