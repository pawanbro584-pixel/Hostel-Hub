import { Platform } from 'react-native';

const RENDER_API_URL = 'https://hostelhub-backend.onrender.com/api';
const LOCAL_IP = '192.168.1.100';

export const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:5000/api' 
  : `http://${LOCAL_IP}:5000/api`;
export const STORAGE_KEYS = {
  TOKEN: '@hostelhub_token',
  USER: '@hostelhub_user'
};
