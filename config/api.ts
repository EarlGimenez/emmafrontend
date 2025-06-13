// Get the IP address from environment or use default
const GIMENEZ_DESKTOP_IP = '192.168.0.224'
const GIMENEZ_DESKTOP_IP2 = '172.26.64.1'
const GIMENEZ_LAPTOP_IP = '172.30.11.254'


// Define the API URLs for development and production environments
const DEV_IP = GIMENEZ_DESKTOP_IP // Your development machine IP
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