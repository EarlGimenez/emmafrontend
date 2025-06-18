// Get the IP address from environment or use default
const DEV_IP = '192.168.1.3' // Your development machine IP
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
  auth: {
    login: `${BASE_URL}/login`,
    register: `${BASE_URL}/register`,
    logout: `${BASE_URL}/logout`,
  },
  users: {
    temp: `${BASE_URL}/users/temp`, // If still using this flow
    complete: (userId: string | number) => `${BASE_URL}/users/${userId}/complete`,
    profile: `${BASE_URL}/profile`, // For fetching authenticated user profile
  },
  mapGeoCode: {
    geocode: `${BASE_URL}/geocode`,
    reverse_geocode: `${BASE_URL}/reverse-geocode`,
    nearest: `${BASE_URL}/evacuation-centers/nearest`,
  },
  trainings: {
    index: `${BASE_URL}/trainings`, // For listing all trainings
    join: `${BASE_URL}/trainings/join`, // For joining a specific training
  },
  donations: {
    process: `${BASE_URL}/donations/process`,
    recent: `${BASE_URL}/donations/recent`,
  },
}

//'172.30.11.254' -- Gimenez Laptop
//'192.168.1.16'  -- Mansing Laptop
//'192.168.0.224' -- Gimenez Desktop
// '192.168.1.3'  -- Garcia Desktop
// '172.30.7.198' -- Garcia Laptop