// Get the IP address from environment or use default
const GIMENEZ_DESKTOP_IP = '192.168.0.224'
const GIMENEZ_DESKTOP_IP2 = '172.26.64.1'
const GIMENEZ_LAPTOP_IP = '172.30.11.254'
const GIMENEZ_LAPTOP_IP2 = '192.168.0.25'

// Define the API URLs for development and production environments
const DEV_IP = GIMENEZ_DESKTOP_IP // Your development machine IP
const DEV_PORT = '8000'
const PROD_URL = 'https://api.yourapp.com' // Future production URL

const BASE_URL = __DEV__ 
  ? `http://${DEV_IP}:${DEV_PORT}/api`
  : PROD_URL

export const API_URLS = {  family: {
    current: `${BASE_URL}/family/current`,
    get: (id: string) => `${BASE_URL}/family/${id}`,
    join: `${BASE_URL}/join-family`,
    joinByCode: `${BASE_URL}/family/join-by-code`,
    leave: `${BASE_URL}/family/leave`,
    memberLocation: (memberId: number) => `${BASE_URL}/family/member/${memberId}/location`,  
    qrcode: (familyId: number) => `${BASE_URL}/family/qr-code/${familyId}`,
    create: `${BASE_URL}/family/create`,
    uploadQR: `${BASE_URL}/family/upload-qr`,
    toggleLocation: (memberId: number) => `${BASE_URL}/family/member/${memberId}/location/toggle`,
  },
  auth: {
    login: `${BASE_URL}/login`,
    register: `${BASE_URL}/register`,
    logout: `${BASE_URL}/logout`,
  },
  users: {
    current: `${BASE_URL}/users/current`,
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
  requests: {
    submit: `${BASE_URL}/requests/submit`,
    myRequests: `${BASE_URL}/requests/my`,
  },
}

//'172.30.11.254' -- Gimenez Laptop
//'192.168.1.16'  -- Mansing Laptop
//'192.168.0.224' -- Gimenez Desktop
// '192.168.1.3'  -- Garcia Desktop
// '172.30.7.198' -- Garcia Laptop